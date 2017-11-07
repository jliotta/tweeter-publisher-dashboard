const AWS = require('aws-sdk');
const cluster = require('cluster');
const Cron = require('cron').CronJob;
const db = require('./dbQueries.js');
const formatMetric = require('./helpers.js').formatMetric;
const formatTweet = require('./helpers.js').formatTweet;
const bulkStorage = require('./bulkStorage.js');

AWS.config.loadFromPath('./config.json');

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const queueUrl = require('../config.js').url;
const sendUrl = require('../config.js').sendUrl;

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
                bulkStorage['tweet'].push(formatTweet(message));
              };
    
              if (type !== 'original') {
                bulkStorage[type].push(formatMetric(message));
                db[type](message.MessageAttributes.tweet_id.StringValue);

                if (bulkStorage[type].length === 1500) {
                  var tweets = bulkStorage['tweet'];
                  var items = bulkStorage[type];
                  bulkStorage['tweets'] = [];
                  bulkStorage[type] = [];
                  db.bulkCreate(type, tweets, items);
                }
              };
            }
          })
        })
      }
    };
  }) 
};

var sendTweets = new Cron('0 0 * * *', () => {
  var today = new Date().valueOf();
  var pastDay = today - 86400000;

  db['getTodaysTweets'](pastDay)
  .then(results => {
    results[0].forEach(tweet => {
      sqs.sendMessage({MessageBody: JSON.stringify(tweet), QueueUrl: sendUrl}, (err, data) => {
        if (err) {
          console.log('Sending Error:', err);
        } else {
          console.log('Sent Message:', data);
        }
      });
    });
  });
});

if (cluster.isMaster) {
  var numWorkers = require('os').cpus().length;
  for (var i = 0; i < numWorkers; i++) {
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
  sendTweets.start();
} else {
  setInterval(pollQueue, 10);
}