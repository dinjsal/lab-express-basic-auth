const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");

/* GET */

router.get("/signup", (req, res, next) => {
  res.render("auth/signup"); // auth folder, signup.hbs
});

router.get("/login", (req, res, next) => {
  res.render("auth/login"); // auth folder, login.hbs
});

/* POST */

router.post("/signup", async (req, res) => {
  //is there an existing user?
  try {
    let response = await User.findOne({ username: req.body.username });
    //no user, so create one
    if (!response) {
      // generate salt with 12 chars
      const salt = bcryptjs.genSaltSync(12);
      //hash a pwd
      const hashedPassword = bcryptjs.hashSync(req.body.password, salt);
      //actual creation of a new user
      const newUser = await User.create({
        // copy of req.body
        ...req.body,
        password: hashedPassword,
      });
      //redirect to this page
      res.redirect("/auth/login");
    } else {
      //show auth folder signup.hbs file
      res.render("auth/signup", { errorMessage: "Username already taken" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("login", async (req, res) => {
  const { email, password } = req.body;
  const userExists = await Model.findOne({ email: req.body.email });
  //is there an existing user with email?
  if (!userExists) {
    res.render("auth/login"), { errorMessage: "Please try again" };
    // if it exists, check the pwd
  } else {
    const passwordMatches = bcryptjs.compareSync(
      req.body.password,
      userExists.password
    );
    if (passwordMatches) {
      res.render("profile", { user: userExists });
    } else {
      res.render("auth/login", {
        errorMessage: "Login credentials not found/did not match",
      });
    }
  }
});

module.exports = router;
