const router = require("express").Router();
const passport = require("passport");
const CLIENT_URL = "http://localhost:8000";
const {
  logoutUser,
  loginSuccess,
  loginFailure,
} = require("../controllers/AuthController");

router.get("/success", loginSuccess);

router.get("/failure", loginFailure);

//set up to passport interact with google and show screen indetify
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"], //passport say with googleStrategy relate with it => google => interact googleStategy
  })
);

//slove for callbackurl when enter credential
router.get(
  "/google/redirect",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/failure",
  })
);

router.get("/facebook", passport.authenticate("facebook", {}));

router.get(
  "/facebook/redirect",
  passport.authenticate("facebook", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/failure",
  })
);

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["profile"],
  })
);

router.get(
  "/github/redirect",
  passport.authenticate("github", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/failure",
  })
);

router.get("/logout", logoutUser);

module.exports = router;
