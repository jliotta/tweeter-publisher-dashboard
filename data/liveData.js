const AWS = require('aws-sdk');
const grammar = require('./grammar.js');
const uuidv4 = require('uuid/v4');

const tweet_ids = require('./tweets.js')

AWS.config.loadFromPath('./config.json');

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const queueUrl = 'https://sqs.us-west-1.amazonaws.com/748557891852/Testing';

var randomElement = function(array){
  var randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

var messageGenerator = function() {
  var message = 
    [randomElement(grammar.opening), randomElement(grammar.verbs), randomElement(grammar.objects), 
    randomElement(grammar.nouns), randomElement(grammar.tags)];
	
	if (grammar.properNouns.includes(message[3]) && message[2][0] !== 'a') {
		message.splice(2, 1);
	}

	return message.join(' ').trim();
};

var numberGenerator = function(n) {
	return Math.floor(Math.random() * n);
};

var dateGenerator = function() {
  // Only produce dates from August - October 2017
  return Math.floor(Math.random() * (1509519599000 - 1501570800000) + 1501570800000).toString();
};

var userGenerator = function() {
	return Math.floor(Math.random() * 699999 + 1);
};

var metricsGenerator = function() {
  const params = {
    MessageAttributes: {
      user_id: {
        DataType: 'String',
        StringValue: userGenerator().toString()
      },
      tweet_id: {
        DataType: 'String',
        StringValue: randomElement(['002ec921-9672-4627-91e5-626740d5d1dd', '00f935f0-c7ea-4e64-9103-e6cbd6759ddf', '01a34e8c-1c4c-47f4-87ec-c4744230158a'])
      },
      type: {
        DataType: 'String',
        StringValue: randomElement(['impression'])
      }
    },
    MessageBody: 'Metric',
    QueueUrl: queueUrl
  };

  if (params.MessageAttributes.type.StringValue === 'reply') {
    params.MessageAttributes.id = {
      DataType: 'String',
      StringValue: uuidv4()
    };

    params.MessageBody = messageGenerator();

  } else if (params.MessageAttributes.type.StringValue === 'retweet') {
    params.MessageAttributes.id = {
      DataType: 'String',
      StringValue: uuidv4()
    };
  } else if (params.MessageAttributes.type.StringValue === 'original') {
    params.MessageBody = messageGenerator();
    params.MessageAttributes.id = {
      DataType: 'String',
      StringValue: uuidv4()
    };
  } 

  sqs.sendMessage(params, (err, data) => {
    if (err) {
      console.log('Sending Error:', err);
    } else {
      console.log('Sending Successful:', data);
    }
  });
}

setInterval(metricsGenerator, 50);


