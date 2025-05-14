const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const { isLoggedIn } = require("../middleware.js");
const {saveRedirectUrl} = require("../middleware.js");
const userControllers = require("../controllers/user.js");

router.route("/signup")
.get(userControllers.renderSignupForm)
.post(wrapAsync(userControllers.signup));

router.route("/login")
.get(userControllers.renderLoginForm)
.post(saveRedirectUrl,
    passport.authenticate("local",{failureRedirect: "/login",failureFlash:true,})
    ,wrapAsync(userControllers.login));


router.get("/logout",userControllers.logout);



module.exports = router;