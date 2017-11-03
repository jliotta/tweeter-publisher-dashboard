const Sequelize = require('sequelize');
const sequelize = require('../sequelize.js');

const Impression = sequelize.define('impression', {
  userId: {
    type: Sequelize.INTEGER
  },
  tweetId: {
    type: Sequelize.STRING
  }
});

module.exports = Impression;