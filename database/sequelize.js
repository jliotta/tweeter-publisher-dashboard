const Sequelize = require('sequelize');

var config = {
	"define": {
    "createdAt": "createdat",
    "timestamps": false,
    "userId": "userid"
  },
  "host": "localhost",
	"dialect": "postgres"
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