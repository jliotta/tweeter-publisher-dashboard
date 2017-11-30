const Sequelize = require('sequelize');

var config = {
	"define": {
    "timestamps": false
  },
  "host": "localhost",
  "dialect": "postgres",
  "pool": {
    max: 30,
    min: 0,
    idle: 600000,
    acquire: 600000
  }
}

const sequelize = new Sequelize('publisher_dashboard', 'tweeter', 'YGhhbv6', config);

sequelize
	.authenticate()
	.then(() => {
		console.log('Connection has been successfully established');
	})
	.catch((err) => {
		console.error('Unable to connect to the database:', err);
	});

module.exports = sequelize;