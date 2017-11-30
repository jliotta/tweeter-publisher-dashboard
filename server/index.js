const AWS = require('aws-sdk');
const cluster = require('cluster');
const db = require('./dbQueries.js');
const {formatMetric, formatTweet} = require('./helpers.js');
const sendTweets = require('./worker.js');
const {tableEntries, metrics} = require('./bulkStorage.js');

AWS.config.loadFromPath('./config.json');
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const queueUrl = require('../config.js').url;
const params = {
  QueueUrl: queueUrl,
  MaxNumberOfMessages: 10,
  MessageAttributeNames: ['All']
};

var pollQueue = () => {
  sqs.receiveMessage(params, (err, data) => {
    if (err) {
      console.log('Receive Error:', err);
    } else {
      if (data.Messages) {
        data.Messages.forEach(message => {
          const deleteParams = {
            QueueUrl: queueUrl, 
            ReceiptHandle: message.ReceiptHandle
          };
          sqs.deleteMessage(deleteParams, (err, data) => {
            if (err) {
              console.log('Delete Error:', err);
            } else {
              var type = message.MessageAttributes.type.StringValue;

              if (type === 'original' || type === 'retweet' || type === 'reply') {
                tableEntries['tweet'].push(formatTweet(message));
              };
    
              if (type !== 'original' && type !== 'reply' && type !== 'retweet') {
                tableEntries[type].push(formatMetric(message));
                metrics[type].push(message.MessageAttributes.tweet_id.StringValue);

                if (tableEntries[type].length === 5000) {
                  var tweets = tableEntries['tweet'];
                  var items = tableEntries[type];
                  tableEntries['tweets'] = [];
                  tableEntries[type] = [];
                  db.bulkCreate(type, tweets, items);
                }

                if (metrics[type].length === 2500) {
                  var ids = metrics[type];
                  metrics[type] = [];
                  db[type](ids);
                } 
              };
            }
          })
        })
      } 
    };
  })    
};

// Spin up a cluster of three node servers
if (cluster.isMaster) {
  for (var i = 0; i < 3; i++) {
    cluster.fork();
  }
  cluster.on('online', (worker) => {
    console.log('Worker ' + worker.process.pid + ' is online');
  });
  cluster.on('exit', (worker, code, signal) => {
    console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ' and signal: ' + signal);
    console.log('Starting a new worker');
    cluster.fork();
  });
  // Start the cron worker which sends updated tweets to queue every day
  sendTweets.start();
} else {
  // Have the workers poll the queue and process messages
  setInterval(pollQueue, 10);
}