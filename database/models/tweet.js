const Sequelize = require('sequelize');
const sequelize = require('../sequelize.js');

const Tweet = sequelize.define('tweet', {
	user_id: {
		type: Sequelize.INTEGER
	},
	message: {
		type: Sequelize.STRING
	},
	created_at: {
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
	}
});

// Tweet.sync({force: true});

module.exports = Tweet;