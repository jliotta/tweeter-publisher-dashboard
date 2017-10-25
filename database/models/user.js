const Sequelize = require('sequelize');
const sequelize = require('../sequelize.js');

const User = sequelize.define('user', {
	name: {
		type: Sequelize.STRING
	},
	handle: {
		type: Sequelize.STRING
	},
	timezone: {
		type: Sequelize.STRING
	},
	publisher: {
		type: Sequelize.BOOLEAN
	}
});

User.sync({force: true});

module.exports = User;