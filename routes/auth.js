const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { Routes, Messages } = require("../constants");

//signup page
router.get('/signup', (req, res, next) => {
  res.render('signup', { route: 'signup', message: req.flash("message") });
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
            const user = await newUser.save();
            res.redirect(Routes.login);
          } catch(err) {
            console.log(err);
            if(err.code === 11000) {
              if(err.keyPattern.email) {
                req.flash("message", { type: Messages.emailAlreadyExists.type, message: Messages.emailAlreadyExists.message });
              } else if(err.keyPattern.username) {
                req.flash("message", { type: Messages.usernameAlreadyExists.type, message: Messages.usernameAlreadyExists.message });
              }
            } else {
              req.flash("message", { type: Messages.error.type, message: Messages.error.message });
            }
            return res.redirect(Routes.signup);
          }
      });
  });
});

//login page
router.get('/login', (req, res) => {
  res.render('login', { route: 'login', message: req.flash("message") });
})

//to login user.
router.post("/login", (req, res, next) => {
  console.log(req.body);
  //use authenticate method from passport to check whether user details are valid  
  passport.authenticate("local", function(err, user, info) {
        //if there was some error while verifying user
        if (err) {
            console.log(err);
            req.flash("message", { type: Messages.error.type, message: Messages.error.message });
            return res.redirect(Routes.login);
        }
        //if the user provided incorrect username or password
        if (!user) {
            req.flash("message", { type: Messages.incorrectEmailOrPassword.type, message: Messages.incorrectEmailOrPassword.message });
            return res.redirect(Routes.login);
        }
        //if correct user exists in database then use login method
        req.logIn(user, function(err) {
            if (err) {
                req.flash("message", { type: Messages.error.type, message: Messages.error.message })
                return res.redirect(Routes.login);
            }
            req.flash('message', { type: Messages.loginSuccess.type, message: Messages.loginSuccess.message });
            return res.redirect('/');
        });
    })(req, res, next);
});

router.post('/logout', function(req, res) {
  req.logout();
  req.flash("message", { type: Messages.logout.type, message: Messages.logout.message })
  res.redirect(Routes.login);
});

module.exports = router;