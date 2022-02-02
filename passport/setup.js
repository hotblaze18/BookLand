const bcrypt = require("bcryptjs");
const User = require("../models/User");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

//to store user data in session
passport.serializeUser((user, next) => {
    next(null, user.id);
});

//to get user from data stored in session
passport.deserializeUser((id, next) => {
    User.findById(id, (err, user) => {
        next(err, user);
    });
});

//use passports local strategy that is username, password but use email instead of username.
passport.use(new LocalStrategy({ usernameField: "email" }, async function verify(email, password, cb) {
  console.log(email, password);
  //find user by email
  try {
    const user = await User.findOne({ email });
    console.log(user);
    //check if users password is valid or not.
    const validPassword = await bcrypt.compare(password ,user.password);
    //if password is valid pass user to callback
    if(validPassword) {
      cb(null, user);
    } else {
      //else pass appropriate message
      cb(null, false, { message: "Invalid Username or Password" });
    }
  } catch(err) {
    //if there was some other error pass that in error
    cb(err, null, { message: err });
  }
}))

module.exports = passport;