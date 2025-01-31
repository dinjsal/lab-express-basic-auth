const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const { isLoggedOut } = require("../middleware/route.guard");

/* GET */

router.get("/signup", (req, res, next) => {
  res.render("auth/signup"); // auth folder, signup.hbs
});

// isLoggedOut: auth user shouldn't see the profile page anymore
// and is redirected to login page

router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login"); // auth folder, login.hbs
});

/* POST */

router.post("/signup", async (req, res, next) => {
  // mandatory fields test, Bonus | The validation #1
  if (req.body.email === "" || req.body.password === "") {
    res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });
    return;
  }

  // regex test for passwords

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(req.body.password)) {
    res.status(500).render("auth/signup", {
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  try {
    let response = await User.findOne({ username: req.body.username });
    //is there an existing user?
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
      // Bonus | The validation #2
      res.render("auth/signup", { errorMessage: "Username already taken" });
    }
  } catch (error) {
    //Bonus | Validation during the login process
    if (error.code === 11000) {
      // console.log(
      //   " Username and email need to be unique. Either username or email is already used. "
      // );

      res.status(500).render("auth/signup", {
        errorMessage: "Either username or email is already used",
      });
    } else if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render("auth/signup", { errorMessage: error.message });
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
        // currentUser - you can name it anything you want
        // will only be created if the password is a match
        // ***** SAVE THE USER IN THE SESSION *****
        req.session.currentUser = userExists;
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

// logout route
router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    } else {
      res.redirect("/auth/login");
    }
  });
});
module.exports = router;
