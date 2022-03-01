const { Routes } = require("../constants");

const redirectIfNotLoggedIn = (req, res, next) => {
  const user = req.user;
  if(!user) {
    res.redirect(Routes.login);
  }
  next();
}

module.exports = redirectIfNotLoggedIn;