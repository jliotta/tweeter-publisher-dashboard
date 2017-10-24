const assert = require('assert');
const expect = require('chai').expect;
const request = require('request');

describe('Server', () => {
	it('should be running', (done) => {
		request('http://localhost:3000/', (err, response) => {
			expect(response).to.exist;
			done();
		});
	});
});

