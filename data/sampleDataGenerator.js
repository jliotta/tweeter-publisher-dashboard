const faker = require('faker');
const csv = require('fast-csv');
const fs = require('file-system');
const ws = fs.createWriteStream('userData.csv');

var users = new Set();
var existingNames = {};

while (users.size < 1000) {
	var name = faker.name.findName();
	if (!existingNames[name]) {
		existingNames[name] = true;
		var handle = name.split(' ').join('') + Math.floor(Math.random() * 10);
		var timezone = 'PST';

		var probability = Math.random();
		var publisher = probability < 0.05 ? true : false;
		
		var user = {
			name: name,
			handle: handle,
			timezone: timezone,
			publisher: publisher
		};

		users.add(user);
	}
}

var userData = [];

for (var item of users) {
	userData.push([item.name, item.handle, item.timezone, item.publisher]);
}

csv.write(userData, {headers:true}).pipe(ws);

module.exports = userData;
