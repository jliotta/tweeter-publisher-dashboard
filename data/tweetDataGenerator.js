const faker = require('faker');
const publishers = require('./publishers.js');
const elasticsearch = require('elasticsearch');
const grammar = require('./grammar.js');

const client = new elasticsearch.Client({
  host: 'localhost:9200'
});

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
	var day = numberGenerator(32);
	while (day === 0) {
		day = numberGenerator(32);
	}

	var months = [9, 8, 7];
	var randomMonth = months[numberGenerator(months.length)];
	var randomDay = day;
	var randomHour = numberGenerator(24);
	var randomMinute = numberGenerator(60);
	var randomSecond = numberGenerator(60);

	return new Date(2017, randomMonth, randomDay, randomHour, randomMinute, randomSecond).toISOString();
};

var userGenerator = function() {
	// This function ensures that publishers are much more likely to tweet than regular users
	var user;
	var randomNumber = numberGenerator(100);

	if (randomNumber <= 7) {
    user = randomElement(publishers);
	} else {
		user = numberGenerator(500000);
		while (user === 0) {
			user = numberGenerator(500000);
		}
	}
	return user;
};

var tweetGenerator = function(id) {
  var counter = 0;
  var tweets = [];

  while (counter < 250000) {
    var impressions = numberGenerator(1000000);
    var views = Math.floor((impressions / 10) * Math.random());
    var likes = Math.floor((impressions / 8) * Math.random());
    var replies = Math.floor((impressions / 500) * Math.random());
    var retweets = Math.floor((impressions / 250) * Math.random());
  
    var tweet = {
      tweetId: id,
      userId: userGenerator(),
      message: messageGenerator(),
      createdAt: dateGenerator(),
      impressions: impressions,
      views: views,
      likes: likes,
      replies: replies,
      retweets: retweets
    }
    tweets.push({ 
      index:  { _index: 'tweet', _type: 'all', _id: id } 
    });
    tweets.push(tweet);
    id++;
    counter++;
  }
	
  return client.bulk({
    body: tweets
  }).catch(err => {
    console.log('Bulk Insertion Error:', err);
  });
};

// Generate 10 million tweets and bulk insert into Elasticsearch
var batchTweets = async function() {
  for (var i = 1; i < 10000000; i = i + 250000) {
    await tweetGenerator(i);
  }
}

batchTweets();