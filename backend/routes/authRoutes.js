const express = require("express");
const passport = require("passport");

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  googleAuthCallback,
  microsoftAuthCallback
} = require("../controllers/authController");
const { verifyEmail } = require("../controllers/authVerificationController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify-email/:token", verifyEmail);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleAuthCallback
);

// Microsoft OAuth
router.get(
  "/microsoft",
  passport.authenticate("microsoft", { scope: ["user.read"] })
);

router.get(
  "/microsoft/callback",
  passport.authenticate("microsoft", { failureRedirect: "/login" }),
  microsoftAuthCallback
);

module.exports = router;
