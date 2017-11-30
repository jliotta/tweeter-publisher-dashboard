const Sequelize = require('sequelize');
const sequelize = require('../sequelize.js');

const View = sequelize.define('view', {
  user_id: {
    type: Sequelize.INTEGER
  },
  tweet_id: {
    type: Sequelize.STRING
  }
});

module.exports = View;