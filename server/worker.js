const AWS = require('aws-sdk');
const Cron = require('cron').CronJob;
const db = require('./dbQueries.js');

AWS.config.loadFromPath('./config.json');
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const sendUrl = require('../config.js').sendUrl;

const sendTweets = new Cron('0 0 * * *', () => {
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

module.exports = sendTweets;