const sequelize = require('./sequelize.js');
const User = require('./models/user.js');
const Tweet = require('./models/tweet.js');
const Retweet = require('./models/retweet.js');
const Reply = require('./models/reply.js');
const Impression = require('./models/impression.js');
const View = require('./models/view.js');
const Like = require('./models/like.js');

Tweet.belongsTo(User, {foreignKey: 'userId', constraints: false});

Retweet.belongsTo(Tweet, {foreignKey: 'tweetId', constraints: false});
Retweet.belongsTo(Tweet, {foreignKey: 'parentId', constraints: false});

Reply.belongsTo(Tweet, {foreignKey: 'tweetId', constraints: false});
Reply.belongsTo(Tweet, {foreignKey: 'parentId', constraints: false});

Impression.belongsTo(User, {foreignKey: 'userId', constraints: false});
Impression.belongsTo(Tweet, {foreignKey: 'tweetId', constraints: false});

View.belongsTo(User, {foreignKey: 'userId', constraints: false});
View.belongsTo(Tweet, {foreignKey: 'tweetId', constraints: false});

Like.belongsTo(User, {foreignKey: 'userId', constraints: false});
Like.belongsTo(Tweet, {foreignKey: 'tweetId', constraints: false});

sequelize.sync();