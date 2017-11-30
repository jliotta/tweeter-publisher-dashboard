const Sequelize = require('sequelize');
const sequelize = require('../sequelize.js');

const Impression = sequelize.define('impression', {
  user_id: {
    type: Sequelize.INTEGER
  },
  tweet_id: {
    type: Sequelize.STRING
  }
});

module.exports = Impression;