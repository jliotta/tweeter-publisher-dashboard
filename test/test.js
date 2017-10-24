const assert = require('assert');
const expect = require('chai').expect;
const request = require('request');
const AWS = require('aws-sdk');
const users = require('../data/sampleUserData.js');

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
		const publishers = users.filter(user => user.publisher === true).length;

		it('should return users in object form', () => {
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
			expect(publishers).to.be.above(0);
		});
		it('should have more non-publishers than publishers', () => {
			expect(users.length - publishers).to.be.above(publishers);
		});
	});
});

