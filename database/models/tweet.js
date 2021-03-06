const Sequelize = require('sequelize');
const sequelize = require('../sequelize.js');

const Tweet = sequelize.define('tweet', {
  tweet_id: {
  type: Sequelize.STRING,
  unique: true,
  primaryKey: true
  },
	user_id: {
		type: Sequelize.INTEGER
	},
	message: {
		type: Sequelize.STRING
	},
	created_at: {
		type: Sequelize.STRING
  },
  updated_at: {
    type: Sequelize.DECIMAL
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
  },
  parent_id: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: null
  }
});

// Tweet.sync({force: true});

module.exports = Tweet;