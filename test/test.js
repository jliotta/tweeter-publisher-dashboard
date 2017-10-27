const assert = require('assert');
const expect = require('chai').expect;
const request = require('request');
const AWS = require('aws-sdk');
const users = require('../data/sampleUserData.js');
const tweets = require('../data/sampleTweetData.js');
const publishers = require('../data/publishers.js');

AWS.config.loadFromPath('./config.json');

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const queueUrl = 'https://sqs.us-west-1.amazonaws.com/748557891852/Testing';
const params = {
	QueueUrl: queueUrl
};

describe('Server', () => {
	it('should be running', (done) => {
		request('http://localhost:3000/', (err, response) => {
			expect(response).to.exist;
			done();
		});
	});
	it('should return a JSON object as a response', (done) => {
		request('http://localhost:3000/', (err, response) => {
			expect(response).to.be.an('object');
			done();
		});
	});
	it('should add a message to the queue', (done) => {
		params.MessageBody = 'Hello';
		sqs.sendMessage(params, (err, data) => {
			expect(data).to.exist;
			done();
		});
	});
});

describe('Sample Data Generator', () => {
	describe('User Data', () => {
		const pubs = users.filter(user => user.publisher === true).length;

		it('should return users as objects', () => {
			var allObjects = users.every(user => typeof user === 'object');
			expect(allObjects).to.be.true;
		});
		it('should give each user a unique name', () => {
			var uniques = new Set();
			for (var user of users) {
				uniques.add(user.name);
			}
			expect(uniques.size).to.equal(users.length);
		});
		it('should give each user a unique handle', () => {
			var uniques = new Set();
			for (var user of users) {
				uniques.add(user.handle);
			}
			expect(uniques.size).to.equal(users.length);
		});
		it('should make some users publishers', () => {
			expect(pubs).to.be.above(0);
		});
		it('should have more non-pubslishers than publishers', () => {
			expect(users.length - pubs).to.be.above(pubs);
		});
	});
	describe('Tweet Data', () => {
		it('should return tweets as objects', () => {
			var allObjects = tweets.every(tweet => typeof tweet === 'object');
			expect(allObjects).to.be.true;
		});
		it('should only produce tweets from August - October 2017', () => {
			var validMonths = tweets.some(tweet => tweet.createdAt.includes('Jan') 
				|| tweet.createdAt.includes('Feb') 
				|| tweet.createdAt.includes('Mar')
				|| tweet.createdAt.includes('Apr')
				|| tweet.createdAt.includes('May')
				|| tweet.createdAt.includes('Jun')
				|| tweet.createdAt.includes('Jul')
				|| tweet.createdAt.includes('Nov')
				|| tweet.createdAt.includes('Dec'));
			expect(validMonths).to.be.false;
		});
		it('should have publisher accounts tweet more than non-publisher accounts', () => {
			var publisherTweets = tweets.filter(tweet => publishers.indexOf(tweet.userId) >= 0).length;
			var userTweets = tweets.length - publisherTweets;
			expect(publisherTweets / publishers.length).to.be.above(userTweets / users.length - publishers.length);
		});
	});
});

