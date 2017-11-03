const AWS = require('aws-sdk');
const faker = require('faker');
const grammar = require('./grammar.js');
const uuidv4 = require('uuid/v4');
const csv = require('fast-csv');
const fs = require('file-system');
const ws = fs.createWriteStream('tweets.csv');

const tweetIds = require('./tweets.js');

AWS.config.loadFromPath('./config.json');

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const queueUrl = 'https://sqs.us-west-1.amazonaws.com/748557891852/Testing';

var tweets = [];

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
	// This function ensures that publishers are much more likely to tweet than regular users
	var user;
	var randomNumber = numberGenerator(100);

	if (randomNumber <= 7) {
    user = numberGenerator(200000) + 1;
	} else {
		user = numberGenerator(700000);
		while (user === 0) {
			user = numberGenerator(700000);
		}
	}
	return user;
};

var tweetGenerator = function() {
  var impressions = numberGenerator(1000000);
  var views = Math.floor((impressions / 10) * Math.random());
  var likes = Math.floor((impressions / 8) * Math.random());
  var replies = Math.floor((impressions / 500) * Math.random());
  var retweets = Math.floor((impressions / 250) * Math.random());

  var tweet = {
    tweetId: uuidv4().toString(),
    userId: userGenerator().toString(),
    message: messageGenerator(),
    createdAt: dateGenerator(),
    impressions: impressions,
    views: views,
    likes: likes,
    replies: replies,
    retweets: retweets,
    type: 'original'
  };
  tweets.push(tweet);
}

var count = 0;

while (count < 50000) {
  tweetGenerator();
  count++;
}

csv.write(tweets, {headers:false}).pipe(ws);