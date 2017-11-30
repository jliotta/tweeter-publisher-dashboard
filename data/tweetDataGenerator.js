const faker = require('faker');
const grammar = require('./grammar.js');
const uuidv4 = require('uuid/v4');
const csv = require('fast-csv');
const fs = require('file-system');
const ws = fs.createWriteStream('tweets.csv');

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
  return Math.floor(Math.random() * (1509519599001 - 1501570800000) + 1501570800000).toString();
};

var userGenerator = function() {
	// This function ensures that publishers are much more likely to tweet than regular users
	// var user;
	// var randomNumber = numberGenerator(100);

	// if (randomNumber <= 70) {
  //   user = numberGenerator(2000) + 1;
	// } else {
	// 	user = numberGenerator(700000);
	// 	while (user === 0) {
	// 		user = numberGenerator(700000);
	// 	}
  // }
  
  user = numberGenerator(2001);
  while (user === 0) {
    user = numberGenerator(2001);
  }
	return user;
};

var tweetGenerator = function() {
  // var impressions = numberGenerator(1000000);
  // var views = Math.floor((impressions / 10) * Math.random());
  // var likes = Math.floor((impressions / 8) * Math.random());
  // var replies = Math.floor((impressions / 500) * Math.random());
  // var retweets = Math.floor((impressions / 250) * Math.random());

  var tweet = {
    tweet_id: uuidv4().toString(),
    user_id: (1).toString(),
    message: messageGenerator(),
    created_at: dateGenerator(),
    updated_at: new Date().valueOf() / 10000000,
    impressions: 0,
    views: 0,
    likes: 0,
    replies: 0,
    retweets: 0,
    type: 'original',
    parent_id: null
  };
  tweets.push(tweet);
}

var count = 0;

while (count < 500) {
  tweetGenerator();
  count++;
}

csv.write(tweets, {headers:false}).pipe(ws);