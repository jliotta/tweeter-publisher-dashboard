const AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const queueUrl = 'https://sqs.us-west-1.amazonaws.com/748557891852/Testing';

var tweet = { 
  tweetId: 1,
  userId: 151754,
  message: 'desperately demolished a dreamy dinosaur #bravenewworld',
  createdAt: 'Sat Sep 16 2017 16:02:45 GMT-0700 (PDT)',
  impressions: 33916002,
  views: 32668,
  likes: 290600,
  replies: 2176,
  retweets: 43439 
};

const params = {
  MessageBody: JSON.stringify(tweet),
  QueueUrl: queueUrl
};

sqs.sendMessage(params, (err, data) => {
  if (err) {
    console.log('Sending Error:', err);
  } else {
    console.log('Sending Successful:', data);
  }
});