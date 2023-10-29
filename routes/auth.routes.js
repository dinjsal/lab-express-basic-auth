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
      //hash a pwd, takes 2 arguments: password & salt
      const hashedPassword = bcryptjs.hashSync(req.body.password, salt);
      //actual creation of a new user
      const newUser = await User.create({
        // copy of req.body. changing the password to the hashedPassword
        ...req.body,
        password: hashedPassword,
      });
      //redirect to this page
      res.redirect("/auth/login");
    } else {
      //show auth folder signup.hbs file
      res.render("auth/signup", { errorMessage: "Username already taken" });
    }
  } catch (error) {
    if (error.code === 11000) {
      // console.log(
      //   " Username and email need to be unique. Either username or email is already used. "
      // );

      res.status(500).render("auth/signup", {
        errorMessage: "Either username or email is already used",
      });
    } else {
      next(error);
    }
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email: req.body.email });
    //is there an existing user with that email?
    //if no, show login page with error message
    if (!userExists) {
      res.render("auth/login", {
        errorMessage:
          "Please try again. Login credentials not found/did not match",
      });
      // if it exists, check the pwd
    } else {
      // always returns a boolean
      const passwordMatches = bcryptjs.compareSync(
        req.body.password,
        userExists.password
      );
      // if the pwd matches
      if (passwordMatches) {
        //take user to his/her profile page
        res.redirect("/profile");
        //if not, login page aga, { users: userExists }in with error message
      } else {
        res.render("auth/login", {
          errorMessage:
            "Please try again. Login credentials not found/did not match",
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
