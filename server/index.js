const AWS = require('aws-sdk');
const db = require('./dbQueries.js');
const formatMetric = require('./helpers.js').formatMetric;
const formatTweet = require('./helpers.js').formatTweet;
const bulkStorage = require('./bulkStorage.js');

AWS.config.loadFromPath('./config.json');

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const queueUrl = 'https://sqs.us-west-1.amazonaws.com/748557891852/Testing';

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

                if (bulkStorage[type].length === 500) {
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

setInterval(pollQueue, 10);