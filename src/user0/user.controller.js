const User = require('./user.model');
const Post = require('../post/post.model');
const Gif = require('../gif/gif.model');
const bcrypt = require('bcryptjs');
var request = require("request");
var giphy = require('giphy-api')('sAsir8WZl2T14qlYlPKWQ74T4KRWgNP2');
// var underscore = require(["underscore"]);

module.exports = {
  signup,
  login,
  logout,
  add,
  authenticate,
  update,
  del,
  show,
  showAll,
  showDashboard,
  showGifs
}

function signup(req, res, next) {
  res.render('signup');
}

function login(req, res, next) {
  res.render('login');
};

function logout(req, res, next) {
  //clear the session
  req.session.destroy();
  res.redirect('/');
};

function add(req, res, next) {
  if(!req.body.username || !req.body.email || !req.body.password) {
    return res.render('signup', {err: 'Enter name, email, and password'});
  }

  User.findOne({username: req.body.username}, function (err, usrData) {
    if (usrData === null) {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
          var user = new User();
          user.username = req.body.username;
          user.email = req.body.email;
          user.password = hash;
          user.save(function (err, user) {
            if (err) return res.send('signup', {error: err});
            req.session.user = user;
            req.session.admin = user.admin
            res.redirect('/dashboard');
          });
        });
      });
    } else {
      res.render('signup', {error: 'User already exists'});
    }
  });

}

function authenticate(req, res, next) {
  if (!req.body.email || !req.body.password) {
    return res.render('login', {error: 'Please enter your email and password.'});
  }
  User.findOne({email:req.body.email}, function (err, user) {
    if (err) return next(err);
    if (!user) return res.render('login', {error: 'Incorrect email and password combination'});
    bcrypt.compare(req.body.password, user.password, function (err, authorized) {
      if (!authorized) {
        return res.render('login', {error: 'Incorrect email and password combination'});
      } else {
        req.session.user = user;
        req.session.admin = user.admin
        res.redirect('/gifs');
      }
    });

  });
};

function update(req, res, next) {
  //console.log('req.body.email', req.body.email);
  User.findOne({username: req.session.user.username}, function (err, user) {
    if (err) return res.render('error', {error: 'oops! something went wrong'});
    if (req.body.username) {
      user.username = req.body.username;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }

    user.save(function(err) {
      if (err) return res.send(err);
      req.session.user = user;
      res.redirect('/dashboard');
    });
  });
}

function del(req, res, next) {
  if (!req.params.user) return next(new Error('No user ID.'));
  User.remove({username: req.params.user}, function (err, user) {
    if(!user) return next(new Error('user not found'));
    if (err) return next(err);
    req.session.destroy();
    res.redirect('/');
  });
}

function show(req, res, next) {
  if (!req.params.user) return res.send(404);

  User.findOne({username: req.params.user}, function (err, profile) {
    if (err) return next(err);
    if(!profile) return res.sendStatus(404);

    Post.find({'author.username': profile.username}, null, {sort: {created_at: -1}}, function (err, posts) {
      if (err) return next(err);

      User.find({}, function(err, users) {
          console.log(users)
          var max = 0;
          var match;
          for ( var i = 0; i < users.length; i++  ){
            console.log(users[i]['username'])
            if(users[i]['username'] == profile.username){
              continue;
            }
            if(users[i]['likes'] == undefined){
              continue;
            }
            // const intersection = users[i]['likes'].filter(element => profile.likes.includes(element));
            // var intersection = _.intersection(users[i]['likes'], profile['likes'])
            // console.log(intersection)
            // if(intersection.length > max){
            //   max = intersection.length
            //   match = users[i];
            // }
            var results = 0;
            for(var j = 0; j < profile['likes'].length; j++ ){
              for (var k = 0; k < users[i]['likes'].length; k++){
                if (users[i]['likes'][k].substring(14) === profile['likes'][j].substring(14)){
                  results++;
                }
              }
              // if (users[i]['likes'][k].substring(14).indexOf(profile['likes'][j].substring(14)) !== -1) {
              //      results.push(profile['likes'][j]);
              //  }
            }
            console.log(results)
            if(results > max){
              max = results
              match = users[i];
            }
          }

          res.render('profile', {user: req.session.user, profile: profile, posts: posts, match: match});

    });
  });
});
}

function showAll(req, res, next) {
  User.find({}, function (err, users) {
    if (err) return next(err);
    res.render('userlist', {user: req.session.user, users: users})
  });
}

function showDashboard(req, res, next) {
	User.findOne({email:req.session.user.email}, function(err, user) {
    	if (err) return next(err);
    	res.render('dashboard', {user: user});
    	//res.send({user:req.session.user.name});
  });
}


function showGifs(req, res, next) {
  User.findOne({email:req.session.user.email}, function(err, user) {
    	if (err) return next(err);
      giphy.random({
            tag: 'cute',
            rating: 'g',
            fmt: 'json'
      }, function (err, res2) {
        randomGif = res2;
        // console.log(randomGif);
        res.render('gifs', {user: req.session.user, data: randomGif});
      });
    	//res.send({user:req.session.user.name});
  });
}

// function getMatch(req, res, next){
//
//       if (err) return next(err);
//       res.render('dashboard', {user: user});
//       //res.send({user:req.session.user.name});
//   };
