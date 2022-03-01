const { Routes } = require("../constants");

const checkIfAdmin = (req, res, next) => {
  const user = req.user;
  if(user && user.role !== 'admin') {
    res.redirect(Routes.home);
  }
  next();
}

module.exports = checkIfAdmin;