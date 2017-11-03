const helpers = {
  formatMetric: (message) => {
    var type = message.MessageAttributes.type.StringValue;
    var userId = message.MessageAttributes.userId.StringValue;
    var tweetId = message.MessageAttributes.tweetId.StringValue;
    var content = message.Body;
    var id = message.MessageAttributes.id && message.MessageAttributes.id.StringValue;
  
    if (type === 'impression' || type === 'view' || type === 'like') {
      return {userId: userId, tweetId: tweetId};
    } else if (type === 'reply' || type === 'retweet') {
      return {tweetId: id, parentId: tweetId};
    }  
  },
  formatTweet: (message) => {
    return {
      tweetId: message.MessageAttributes.id.StringValue,
      userId: message.MessageAttributes.userId.StringValue,
      message: '',
      createdAt: new Date().valueOf().toString(),
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