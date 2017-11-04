const Sequelize = require('sequelize');
const sequelize = require('../sequelize.js');

const Reply = sequelize.define('reply', {
  tweet_id: {
    type: Sequelize.STRING
  },
  parent_id: {
    type: Sequelize.STRING
  }
});

module.exports = Reply;