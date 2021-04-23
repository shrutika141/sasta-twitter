const mongoose = require('mongoose');

let tweetSchema = mongoose.Schema({
    caption: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    retweets: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    time: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('tweet', tweetSchema);