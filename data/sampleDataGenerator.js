const faker = require('faker');

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