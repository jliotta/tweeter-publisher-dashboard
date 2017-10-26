const faker = require('faker');
const csv = require('fast-csv');
const fs = require('file-system');
const ws = fs.createWriteStream('userData.csv');

var users = [];
var existingNames = {};

while (users.length < 500000) {
	var name = faker.name.findName();
	if (!existingNames[name]) {
		existingNames[name] = true;
		var handle = name.split(' ').join('') + Math.floor(Math.random() * 10);
		var timezone = 'PST';

		var probability = Math.random();
		var publisher = probability < 0.001 ? true : false;
		
		var user = {
			name: name,
			handle: handle,
			timezone: timezone,
			publisher: publisher
		};

		users.push(user);
	}
}

// module.exports = users;

csv.write(users, {headers:false}).pipe(ws);