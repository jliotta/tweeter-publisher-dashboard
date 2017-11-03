const Sequelize = require('sequelize');
const sequelize = require('../sequelize.js');

const Retweet = sequelize.define('retweet', {
  tweetId: {
    type: Sequelize.STRING
  },
  parentId: {
    type: Sequelize.STRING
  }
});

module.exports = Retweet;