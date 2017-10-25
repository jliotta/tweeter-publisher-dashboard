const sequelize = require('./sequelize');
const User = require('./models/user.js');
const userData = require('../data/sampleDataGenerator.js');

sequelize.sync()
	.then(() => {
		userData.forEach(user => {
			User.create({
				name: user[0],
				handle: user[1],
				timezone: user[2],
				publisher: user[3]
			});
		});
	});