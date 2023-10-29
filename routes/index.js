const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/route.guard");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// authenticated user already logged in, seeing the profile page
// no need/can't access /auth/login

router.get("/profile", isLoggedIn, (req, res) => {
  const loggedInUser = req.session.currentUser;
  res.render("profile", { loggedInUser });
});

// Iteration 3 Part 2
router.get("/main", isLoggedIn, (req, res, next) => {
  res.render("funny-cat");
});

// Iteration 3 Part 2
router.get("/private", isLoggedIn, (req, res, next) => {
  res.render("favorite-gif");
});

module.exports = router;
