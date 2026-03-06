const router = require("express").Router();
const passport = require("passport");

// ─── Google OAuth ───────────────────────────────────────

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/failure",
  }),
  (_req, res) => {
    res.redirect(process.env.CLIENT_URL || "/");
  }
);

// ─── GitHub OAuth ───────────────────────────────────────

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api/auth/failure",
  }),
  (_req, res) => {
    res.redirect(process.env.CLIENT_URL || "/");
  }
);

// ─── Auth Status ────────────────────────────────────────

router.get("/status", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      success: true,
      message: "User is authenticated.",
      user: req.user,
    });
  }

  return res.json({
    success: false,
    message: "User is not authenticated.",
    user: null,
  });
});

// ─── Logout ─────────────────────────────────────────────

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        return next(sessionErr);
      }

      res.clearCookie("connect.sid");
      return res.json({
        success: true,
        message: "Logged out successfully.",
      });
    });
  });
});

// ─── Auth Failure ───────────────────────────────────────

router.get("/failure", (_req, res) => {
  res.status(401).json({
    success: false,
    message: "Authentication failed. Please try again.",
  });
});

module.exports = router;
