const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/route.guard");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
router.get("/profile", isLoggedIn, (req, res) => {
  const loggedInUser = req.session.currentUser;
  res.render("profile.hbs", { loggedInUser });
});

module.exports = router;
