const sequelize = require('./sequelize.js');
const User = require('./models/user.js');
const Tweet = require('./models/tweet.js');
const Impression = require('./models/impression.js');
const View = require('./models/view.js');
const Like = require('./models/like.js');

Tweet.belongsTo(User, {foreignKey: 'user_id'});

Impression.belongsTo(User, {foreignKey: 'user_id'});
Impression.belongsTo(Tweet, {foreignKey: 'tweet_id'});

View.belongsTo(User, {foreignKey: 'user_id'});
View.belongsTo(Tweet, {foreignKey: 'tweet_id'});

Like.belongsTo(User, {foreignKey: 'user_id'});
Like.belongsTo(Tweet, {foreignKey: 'tweet_id'});

sequelize.sync({force: true});