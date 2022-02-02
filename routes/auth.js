const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require('../models/User');
const bcrypt = require('bcryptjs');

//signup page
router.get('/signup', (req, res, next) => {
  res.render('signup');
});

//signup post request
router.post('/signup', function(req, res, next) {
  
  //get user details from request body
  const { username, email, password, role } = req.body;
  console.log(req.body);
  //create a new user, store the hashed password, save the user in database.
  const newUser = new User({ username, email, password, role });

  // Hash password before saving in database
  bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, async (err, hash) => {
          if (err) {
            return next(err);
          }
          newUser.password = hash;
          try {
            req.session.message = "Succesfully signed up! Please login to continue."
            const user = await newUser.save();
            res.redirect('/login');
          } catch(err) {
            console.log(err);
            return res.render('/signup', { error: 'Problem signing up, please try again' })
          }
      });
  });
});

//to login user.
router.post("/login", (req, res, next) => {
  console.log(req.body);
  //use authenticate method from passport to check whether user details are valid  
  passport.authenticate("local", function(err, user, info) {
        //if there was some error while verifying user
        if (err) {
            console.log(err);
            return res.render('login', { message: "Failed to login. please try again." });
        }
        //if the user provided incorrect username or password
        if (!user) {
            console.log('user not there!');
            return res.render('login', { message: "Incorrect username or password" });
        }
        console.log('here');
        //if correct user exists in database then use login method
        req.logIn(user, function(err) {
            if (err) {
                return res.render('login', { errors: err });
            }
            req.session.message = "Successfully logged in " + user.username
            return res.redirect('/');
        });
    })(req, res, next);
});

router.post('/logout', function(req, res) {
  req.logout();
  req.session.message = "Successfully signed out!";
  res.redirect('/login');
});

module.exports = router;