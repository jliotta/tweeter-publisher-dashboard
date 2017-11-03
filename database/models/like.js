const Sequelize = require('sequelize');
const sequelize = require('../sequelize.js');

const Like = sequelize.define('like', {
  userId: {
    type: Sequelize.INTEGER
  },
  tweetId: {
    type: Sequelize.STRING
  }
});

module.exports = Like;