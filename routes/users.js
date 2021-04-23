const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost/twitter');

let userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    tweets : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tweet'
    }]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', userSchema);