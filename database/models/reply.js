const Sequelize = require('sequelize');
const sequelize = require('../sequelize.js');

const Reply = sequelize.define('reply', {
  tweetId: {
    type: Sequelize.STRING
  },
  parentId: {
    type: Sequelize.STRING
  }
});

module.exports = Reply;