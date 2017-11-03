const Sequelize = require('sequelize');
const sequelize = require('../sequelize.js');

const Tweet = sequelize.define('tweet', {
  tweetId: {
  type: Sequelize.STRING,
  unique: true,
  primaryKey: true
  },
	userId: {
		type: Sequelize.INTEGER
	},
	message: {
		type: Sequelize.STRING
	},
	createdAt: {
		type: Sequelize.STRING
	},
	impressions: {
		type: Sequelize.INTEGER
	},
	views: {
		type: Sequelize.INTEGER
	},
	likes: {
		type: Sequelize.INTEGER
	},
	replies: {
		type: Sequelize.INTEGER
	},
	retweets: {
		type: Sequelize.INTEGER
  },
  type: {
    type: Sequelize.STRING
  }
});

// Tweet.sync({force: true});

module.exports = Tweet;