const assert = require('assert');
const expect = require('chai').expect;

const AWS = require('aws-sdk');
const tweets = require('../data/sampleTweetData.js');
const db = require('../server/dbQueries.js');
const sequelize = require('../database/sequelize.js');
const uuidv4 = require('uuid/v4');

AWS.config.loadFromPath('./config.json');

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const queueUrl = require('../config.js').url;
const params = {
  MessageAttributes: {
    user_id: {
      DataType: 'String',
      StringValue: (2000).toString()
    },
    tweet_id: {
      DataType: 'String',
      StringValue: '002ec921-9672-4627-91e5-626740d5d1dd'
    },
    type: {
      DataType: 'String',
      StringValue: 'view'
    }
  },
  MessageBody: 'Metric',
  QueueUrl: queueUrl
}

describe('Server', () => {
  it('should take and delete messages off the queue', (done) => {
    sqs.sendMessage(params, (err, data) => {
      if (err) {
        console.log('Sending Error:', err);
      } else {
        setTimeout(() => {
          sqs.receiveMessage({QueueUrl: queueUrl}, (err, data) => {
            if (err) {
              console.log('Receiving Error:', err);
            } else {
              expect(data.Messages).to.be.undefined;
              done();
            }
          })
        }, 250);
      }
    })
  }).timeout(5000);
	it('should update the database', (done) => {
    var views;
    var query = `SELECT views from tweets WHERE tweet_id = '002ec921-9672-4627-91e5-626740d5d1dd'`;
    sequelize.query(query)
    .then(count => views = count[0][0].views)
    .then(() => {
      sqs.sendMessage(params, (err, data) => {
        if (err) {
          console.log('Sending Error:', err);
        } else {
          setTimeout(() => {
            sequelize.query(query)
            .then(result => {
              expect(result[0][0].views).to.equal(views + 1);
              done();
            }) 
          }, 1000);
        }
      })
    })
  }).timeout(5000);
});

describe('Sample Tweet Data', () => {
  it('should return tweets as objects', () => {
    var allObjects = tweets.every(tweet => typeof tweet === 'object');
    expect(allObjects).to.be.true;
  });
  it('should give each tweet a unique id', () => {
    var uniqueIds = new Set();
    tweets.forEach(tweet => uniqueIds.add(tweet.tweet_id));
    expect(uniqueIds.size).to.equal(tweets.length);
  });
  it('should only produce tweets from August - October 2017', () => {
    var earliest = 1509915009130;
    var latest = 0;
    tweets.forEach(tweet => {
      if (Number(tweet.created_at) > latest) {
        latest = Number(tweet.created_at);
      }
      if (Number(tweet.created_at < earliest)) {
        earliest = Number(tweet.created_at);
      }
    });
    expect(earliest).to.be.above(1501570800000);
    expect(latest).to.be.below(1509519600000);
  });
  it('should have publisher accounts tweet more than non-publisher accounts', () => {
    var publisherTweets = tweets.filter(tweet => Number(tweet.user_id) <= 2000).length;
    var userTweets = tweets.length - publisherTweets;
    expect(publisherTweets / 2000).to.be.above(userTweets / 700000 - 2000);
  });
});

describe('Database Queries', () => {
  it('should update a tweet\'s impression count', (done) => {
    var query = `SELECT impressions from tweets WHERE tweet_id = '002ec921-9672-4627-91e5-626740d5d1dd'`;
    var before;
    sequelize.query(query)
    .then(result => {
      before = result[0][0].impressions;
    })
    .then(() => {
      db['impression']('002ec921-9672-4627-91e5-626740d5d1dd');
    })
    .then(() => {
      sequelize.query(query)
      .then(after => {
        after = after[0][0].impressions;
        expect(after - before).to.equal(1);
        done();
      })
    })
  }).timeout(5000);
  it('should update a tweet\'s view count', (done) => {
    var query = `SELECT views from tweets WHERE tweet_id = '00f935f0-c7ea-4e64-9103-e6cbd6759ddf'`;
    var before;
    sequelize.query(query)
    .then(result => {
      before = result[0][0].views;
    })
    .then(() => {
      db['view']('00f935f0-c7ea-4e64-9103-e6cbd6759ddf');
    })
    .then(() => {
      setTimeout(() => {
        sequelize.query(query)
        .then(after => {
          after = after[0][0].views;
          expect(after - before).to.equal(1);
          done();
        })  
      }, 250);
    })
  }).timeout(5000);
  it('should update a tweet\'s like count', (done) => {
    var query = `SELECT likes from tweets WHERE tweet_id = '01a34e8c-1c4c-47f4-87ec-c4744230158a'`;
    var before;
    sequelize.query(query)
    .then(result => {
      before = result[0][0].likes;
    })
    .then(() => {
      db['like']('01a34e8c-1c4c-47f4-87ec-c4744230158a');
    })
    .then(() => {
      setTimeout(() => {
        sequelize.query(query)
        .then(after => {
          after = after[0][0].likes;
          expect(after - before).to.equal(1);
          done();
        });  
      }, 250)
    })
  }).timeout(5000);
  it('should update a tweet\'s reply count', (done) => {
    var query = `SELECT replies from tweets WHERE tweet_id = '01a34e8c-1c4c-47f4-87ec-c4744230158a'`;
    var before;
    sequelize.query(query)
    .then(result => {
      before = result[0][0].replies;
    })
    .then(() => {
      db['reply']('01a34e8c-1c4c-47f4-87ec-c4744230158a');
    })
    .then(() => {
      setTimeout(() => {
        sequelize.query(query)
        .then(after => {
          after = after[0][0].replies;
          expect(after - before).to.equal(1);
          done();
        });  
      }, 250)
    })
  }).timeout(5000);
  it('should update a tweet\'s retweet count', (done) => {
    var query = `SELECT retweets from tweets WHERE tweet_id = '01a34e8c-1c4c-47f4-87ec-c4744230158a'`;
    var before;
    sequelize.query(query)
    .then(result => {
      before = result[0][0].retweets;
    })
    .then(() => {
      db['retweet']('01a34e8c-1c4c-47f4-87ec-c4744230158a');
    })
    .then(() => {
      setTimeout(() => {
        sequelize.query(query)
        .then(after => {
          after = after[0][0].retweets;
          expect(after - before).to.equal(1);
          done();
        });  
      }, 250)
    })
  }).timeout(5000);
});

