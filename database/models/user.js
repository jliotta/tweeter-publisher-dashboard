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
  impressionProb: {
    type: Sequelize.STRING
  },
  impressionProbInactive: {
    type: Sequelize.STRING
  },
  viewProb: {
    type: Sequelize.STRING
  },
  likeProb: {
    type: Sequelize.STRING
  },
  replyProb: {
    type: Sequelize.STRING
  },
  retweetProb: {
    type: Sequelize.STRING
  }
});

// User.sync({force: true});

module.exports = User;