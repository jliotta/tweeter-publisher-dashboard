const Sequelize = require('sequelize');
const sequelize = require('../sequelize.js');

const View = sequelize.define('view', {
  userId: {
    type: Sequelize.INTEGER
  },
  tweetId: {
    type: Sequelize.STRING
  }
});

module.exports = View;