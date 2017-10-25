const Sequelize = require('sequelize');

const sequelize = new Sequelize('publisher_dashboard', 'tweeter', 'YGhhbv6', {
	host: 'localhost',
	dialect: 'postgres'
});

sequelize
	.authenticate()
	.then(() => {
		console.log('Connection has been successfully established');
	})
	.catch((err) => {
		console.error('Unable to connect to the database:', err);
	});

module.exports = sequelize;