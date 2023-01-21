require("dotenv").config();
// const request = require("request");
const express = require("express");
const bodyParser = require("body-parser");
// const fs = require("fs");
// const axios = require("axios");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

const app = express();
const port = 3000;
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


app.use(
    session({
      secret: "Our little secret.",
      resave: false,
      saveUninitialized: false,
    })
  );
  
app.use(passport.initialize());
 app.use(passport.session());
  
  mongoose.connect(
    "mongodb+srv://Smarthon:08052002yash@cluster0.7drrl5m.mongodb.net/Smrtuserdb",
    { useNewUrlParser: true }
  );
  // mongoose.set("useCreateIndex", true);
  
  const userSchema = new mongoose.Schema({
    email: String,
    password: String
    
  });

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  app.post("/register", function (req, res) {
    User.register(
      { username: req.body.username },
      req.body.password,
      function (err, user) {
        if (err) {
          console.log(err);
          res.redirect("/register");
        } else {
          passport.authenticate("local")(req, res, function () {
            res.redirect("/search");
          });
        }
      }
    );
  });

  app.post("/login", function (req, res) {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });
  
    req.login(user, function (err) {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/search");
        });
      }
    });
  });

app.listen(process.env.PORT || port, function () {
    console.log("Server started on port 3000");
  });