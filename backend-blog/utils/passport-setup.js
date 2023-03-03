const passport = require("passport");
const UserModel = require("../models/UserModel");
const googleStrategy = require("passport-google-oauth20").Strategy;
const facbookStrategy = require("passport-facebook").Strategy;
const githubStrategy = require("passport-github2").Strategy;

passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await UserModel.findOne({ idSocial: profile.id });

        if (user) {
          console.log(`This is current user, name is: ${user.name}`);
          return done(null, user); //if done when callback run in redirect url
        } else {
          const newUser = new UserModel({
            name: profile?.displayName,
            avatar: profile?.photos[0].value,
            idSocial: profile?.id,
          });

          await newUser.save();
          console.log(`This is new user, name is: ${newUser.name}`);
          return done(null, newUser); //if done when callback run in redirect url
        }
      } catch (err) {
        console.log(err);
      }
    }
  )
);

passport.use(
  new facbookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/auth/facebook/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await UserModel.findOne({ idSocial: profile.id });

        if (user) {
          console.log(`This is current user, name is: ${user.name}`);
          return done(null, user); //if done when callback run in redirect url
        } else {
          const newUser = new UserModel({
            name: profile?.displayName,
            avatar:
              profile.photos ||
              "https://tse3.mm.bing.net/th?id=OIP.BbGuJbF9C-Dzu5uJOJSKhAHaHa&pid=Api&P=0&w=178&h=178",
            idSocial: profile?.id,
          });

          await newUser.save();
          console.log(`This is new user, name is: ${newUser.name}`);
          return done(null, newUser); //if done when callback run in redirect url
        }
      } catch (err) {
        console.log(err);
      }
    }
  )
);

passport.use(
  new githubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/auth/github/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await UserModel.findOne({ idSocial: profile.id });

        if (user) {
          console.log(`This is current user, name is: ${user.name}`);
          return done(null, user); //if done when callback run in redirect url
        } else {
          const newUser = new UserModel({
            name: profile?.username,
            avatar: profile?.photos[0].value,
            idSocial: profile?.id,
          });

          await newUser.save();
          console.log(`This is new user, name is: ${newUser.name}`);
          return done(null, newUser); //if done when callback run in redirect url
        }
      } catch (err) {
        console.log(err);
      }
    }
  )
);

//call when callback passport done
passport.serializeUser((user, done) => {
  done(null, user); //return cookie to broswer when is hased
});

//call when broswer send request to server
passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
