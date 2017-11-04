const Sequelize = require('sequelize');
const sequelize = require('../sequelize.js');

const Like = sequelize.define('like', {
  user_id: {
    type: Sequelize.INTEGER
  },
  tweet_id: {
    type: Sequelize.STRING
  }
});

module.exports = Like;