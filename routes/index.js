const express = require('express');
const userModel = require('./users');
const tweetModel = require('./tweet');
const passport = require('passport');
const localStrategy = require('passport-local');
const router = express.Router();

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/reg', function(req, res){
  let newUser = new userModel({
    username: req.body.username,
    email: req.body.email,
  });
  userModel.register(newUser, req.body.password)
  .then(function(registered){
    passport.authenticate("local")(req, res, function(){
      res.redirect("/profile");
    });
  })
  .catch(function(err){
    console.log(err);
  })
});

router.get('/profile', isLoggedIn, function(req, res){
  res.render('profile')
});

router.get("/login", function(req, res){
  res.render("login");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: '/profile',
  failureRedirect: '/login',
}), function(req, res){

});

router.get("/logout" , function(req, res){
  req.logout();
  res.redirect("/");
}); 

router.post("/posttweet", function(req, res){
    userModel
       .findOne({ username: req.session.passport.user })
       .then(function(foundUser){
         tweetModel
            .create({
              caption: req.body.caption,
              userId: foundUser._id,
            })
            .then(function (createdTweet) {
              foundUser.tweets.push(createdTweet);
              foundUser.save().then(function(savedTweet){
                res.send(savedTweet);
              });
            });
       });
});

router.get("/showtweet", isLoggedIn, function(req, res){
  userModel
    .findOne({ username: req.session.passport.user })
    .populate("tweets")
    .then(function(foundUser){
      res.send(foundUser)
    })
});

router.get("/like/:tweetid", isLoggedIn, function(req, res){
  userModel
    .findOne({ username: req.session.passport.user })
    .then(function(foundUser){
      tweetModel
        .findById(req.params.tweetid)
        .then(function(foundTweet){
          if(foundTweet.likes.indexOf(foundUser._id) === -1){
            foundTweet.likes.push(foundUser._id)
          }
          else{
            foundTweet.likes.splice(foundUser_.id)
          }
          foundTweet.save().then(function(savedTweet){
            res.send(savedTweet);
          })
          .catch(function (err) {
            res.send(err);
          })
        })
    })
    .catch(function (err) {
      res.send(err);
    })
});

router.get("/edit/:tweetid", isLoggedIn,function(req, res) {
  userModel
    .findOne({ username: req.session.passport.user })
    .then(function(foundUser) {
      tweetModel
        .findById(req.params.tweetid)
        .then(function(foundTweet) {
          if(foundTweet.userId.equals(foundUser._id)){
            res.send("show edit page");
          }
          else{
            res.send("sorry! it's not your account");
          }
        })
    })
});

router.post("/edit/:tweetid", isLoggedIn,function(req, res){
  userModel
    .findOne({ username: req.session.passport.user })
    .then(function(foundUser) {
      tweetModel
        .findById(req.params.tweetid)
        .then(function (foundTweet) {
          if(foundTweet.userId.equals(foundUser._id)){
            tweetModel
                .findOneAndUpdate({ _id: req.params.tweetid}, { caption: req.body.caption })
                .then(function(updatedTweet){
                  res.send("updated Tweet");
                })
          }
          else{
            res.send("sorry! it's not your tweet");
          }
        })
    })
});

router.post("/delete/:tweetid", isLoggedIn,function(req, res){
  userModel
    .findOne({ username: req.session.passport.user })
    .then(function(foundUser) {
      tweetModel
        .findById(req.params.tweetid)
        .then(function (foundTweet) {
          if(foundTweet.likes.indexOf(foundUser._id) !== -1){
            foundTweet.likes.splice(foundTweet.likes.indexOf(foundUser._id, 1));
            tweetModel
                .findOneAndDelete({ _id: req.params.tweetid})
                .then(function(deletedTweet){
                  res.send("Deleted Tweet");
                })
          }
          else{
            res.send("sorry! it's not your tweet");
          }
        })
    })
});



function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

module.exports = router;
