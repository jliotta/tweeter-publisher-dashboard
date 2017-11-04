const helpers = {
  formatMetric: (message) => {
    var type = message.MessageAttributes.type.StringValue;
    var user_id = message.MessageAttributes.user_id.StringValue;
    var tweet_id = message.MessageAttributes.tweet_id.StringValue;
    var content = message.Body;
    var id = message.MessageAttributes.id && message.MessageAttributes.id.StringValue;
  
    if (type === 'impression' || type === 'view' || type === 'like') {
      return {user_id: user_id, tweet_id: tweet_id};
    } else if (type === 'reply' || type === 'retweet') {
      return {tweet_id: id, parentId: tweet_id};
    }  
  },
  formatTweet: (message) => {
    return {
      tweet_id: message.MessageAttributes.id.StringValue,
      user_id: message.MessageAttributes.user_id.StringValue,
      message: '',
      created_at: new Date().valueOf().toString(),
      updated_at: new Date().valueOf() / 10000000,
      impressions: 0,
      views: 0,
      likes: 0,
      replies: 0,
      retweets: 0,
      type: message.MessageAttributes.type.StringValue
    }
  }
}

module.exports = helpers;