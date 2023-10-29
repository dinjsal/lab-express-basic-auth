const User = require("../models/User.model");

// checks if the user is logged in when trying to access a specific page
const isLoggedIn = (req, res, next) => {
  if (req.session.currentUser) {
    next();

    //   } else if (req.session.currentUser.premium) {
    //     next();
  } else {
    return res.redirect("/auth/login");
  }
};

// if an already logged in user tries to access the login page it
// redirects the user to the home page
const isLoggedOut = (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect("/");
  }
  next();
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
};
