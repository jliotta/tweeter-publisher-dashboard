const sequelize = require('./sequelize');
const User = require('./models/user.js');

sequelize.sync();