const sequelize = require('../database/sequelize.js');
const User = require('../database/models/user.js');
const Tweet = require('../database/models/tweet.js');
const Retweet = require('../database/models/retweet.js');
const Reply = require('../database/models/reply.js');
const Impression = require('../database/models/impression.js');
const View = require('../database/models/view.js');
const Like = require('../database/models/like.js');

const queries = {
  impression: (tweet_id) => {
    sequelize.query('UPDATE "tweets" SET "impressions"="impressions"+ 1, "updated_at" = ? WHERE "tweet_id" = ?', {replacements: [new Date().valueOf() / 10000000, tweet_id]})
  },
  view: (tweet_id) => {
    sequelize.query('UPDATE "tweets" SET "views"="views"+ 1, "updated_at" = ? WHERE "tweet_id" = ?', {replacements: [new Date().valueOf() / 10000000, tweet_id]})
  },
  like: (tweet_id) => {
    sequelize.query('UPDATE "tweets" SET "likes"="likes"+ 1, "updated_at" = ? WHERE "tweet_id" = ?', {replacements: [new Date().valueOf() / 10000000, tweet_id]})
  },
  reply: (tweet_id) => {
    sequelize.query('UPDATE "tweets" SET "replies"="replies"+ 1, "updated_at" = ? WHERE "tweet_id" = ?', {replacements: [new Date().valueOf() / 10000000, tweet_id]})
  },
  retweet: (tweet_id) => {
    sequelize.query('UPDATE "tweets" SET "retweets"="retweets"+ 1, "updated_at" = ? WHERE "tweet_id" = ?', {replacements: [new Date().valueOf() / 10000000, tweet_id]})
  },
  bulkCreate: (type, tweets, items) => {
    if (type === 'impression') {
      Tweet.bulkCreate(tweets)
      .then(() => Impression.bulkCreate(items))
      .catch(err => console.log('Impression Error:', err));
    } else if (type === 'view') {
      Tweet.bulkCreate(tweets)
      .then(() => View.bulkCreate(items))
      .catch(err => console.log('View Error:', err));
    } else if (type === 'like') {
      Tweet.bulkCreate(tweets)
      .then(() => Like.bulkCreate(items))
      .catch(err => console.log('Like Error:', err));
    } else if (type === 'reply') {
      Tweet.bulkCreate(tweets)
      .then(() => Reply.bulkCreate(items))
      .catch(err => console.log('Reply Error:', err));
    } else if (type === 'retweet') {
      Tweet.bulkCreate(tweets)
      .then(() => Retweet.bulkCreate(items))
      .catch(err => console.log('Retweet Error:', err));
    } 
  },
  getTodaysTweets: async (day) => {
    return new Promise((resolve, reject) => {
      sequelize.query('SELECT * from tweets WHERE "updated_at" > ?', {replacements: [day / 10000000]})
        .then(result => {
          resolve(result);
        });
    });
  }
}

module.exports = queries;