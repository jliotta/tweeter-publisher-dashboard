const Sequelize = require('sequelize');
const sequelize = require('../sequelize.js');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
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
  },
  activeTime: {
    type: Sequelize.STRING
  },
  impression_prob: {
    type: Sequelize.STRING
  },
  impression_prob_inactive: {
    type: Sequelize.STRING
  },
  view_prob: {
    type: Sequelize.STRING
  },
  like_prob: {
    type: Sequelize.STRING
  },
  reply_prob: {
    type: Sequelize.STRING
  },
  retweet_prob: {
    type: Sequelize.STRING
  }
});

// User.sync({force: true});

module.exports = User;