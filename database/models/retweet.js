const Sequelize = require('sequelize');
const sequelize = require('../sequelize.js');

const Retweet = sequelize.define('retweet', {
  tweet_id: {
    type: Sequelize.STRING
  },
  parent_id: {
    type: Sequelize.STRING
  }
});

module.exports = Retweet;