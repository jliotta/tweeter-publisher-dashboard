const express = require('express');
const app = express();
const AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const queueUrl = 'https://sqs.us-west-1.amazonaws.com/748557891852/Testing';

const params = {
	QueueUrl: queueUrl
};

sqs.receiveMessage(params, function(err, data) {
	if (err) {
		console.log('Receive Error:', err);
	} else {
		console.log('Receive Success:', data.Messages[0]);
		var deleteParams = {
			QueueUrl: queueUrl,
			ReceiptHandle: data.Messages[0].ReceiptHandle
		};
		sqs.deleteMessage(deleteParams, function(err, data) {
			if (err) {
				console.log('Delete Error:', err);
			} else {
				console.log('Message Deleted:', data);
			}
		});
	}
});


app.listen(3000, () => {
	console.log('server is listening on port 3000');
});
