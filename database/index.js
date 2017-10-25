const sequelize = require('./sequelize');
const User = require('./models/user.js');
const userData = require('../data/sampleDataGenerator.js');

sequelize.sync()
	.then(() => {
		User.bulkCreate(userData);
	});