const router = require("express").Router();

/* GET home page */
router.get("/login", (req, res, next) => {
  res.render("auth/login"); // auth folder, login.hbs
});

router.get("/signup", (req, res, next) => {
  res.render("auth/signup"); // auth folder, login.hbs
});

module.exports = router;
