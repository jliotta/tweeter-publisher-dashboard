const sequelize = require('./sequelize.js');
const User = require('./models/user.js');
const Tweet = require('./models/tweet.js');

sequelize.sync();

User.belongsTo(Tweet, {foreignKey: 'user_id'});