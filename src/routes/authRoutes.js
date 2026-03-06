const router = require("express").Router();
const passport = require("passport");

// ─── Google OAuth ───────────────────────────────────────

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Start Google OAuth2 login
 *     description: Redirects the user to Google's consent screen for authentication.
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to Google OAuth consent page
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth2 callback
 *     description: Handles the callback from Google after user authentication. On success, redirects to CLIENT_URL. On failure, redirects to /api/auth/failure.
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to CLIENT_URL on success or /api/auth/failure on error
 */
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

/**
 * @swagger
 * /api/auth/github:
 *   get:
 *     summary: Start GitHub OAuth2 login
 *     description: Redirects the user to GitHub's authorization page for authentication.
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to GitHub OAuth authorization page
 */
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

/**
 * @swagger
 * /api/auth/github/callback:
 *   get:
 *     summary: GitHub OAuth2 callback
 *     description: Handles the callback from GitHub after user authentication. On success, redirects to CLIENT_URL. On failure, redirects to /api/auth/failure.
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to CLIENT_URL on success or /api/auth/failure on error
 */
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

/**
 * @swagger
 * /api/auth/status:
 *   get:
 *     summary: Check authentication status
 *     description: Returns the current user's authentication status and user data if logged in.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Authentication status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/User'
 *                     - type: "null"
 *             examples:
 *               authenticated:
 *                 summary: User is logged in
 *                 value:
 *                   success: true
 *                   message: "User is authenticated."
 *                   user: { _id: "66a1b2c3d4e5f67890abcdef", provider: "google", displayName: "John Doe", email: "john@example.com", avatar: "https://lh3.googleusercontent.com/a/photo.jpg" }
 *               notAuthenticated:
 *                 summary: User is not logged in
 *                 value:
 *                   success: false
 *                   message: "User is not authenticated."
 *                   user: null
 */
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

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Logout current user
 *     description: Destroys the session, clears the session cookie, and logs the user out.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Logged out successfully."
 *       500:
 *         description: Internal server error during logout
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @swagger
 * /api/auth/failure:
 *   get:
 *     summary: OAuth authentication failure
 *     description: Returns a 401 error when OAuth authentication fails.
 *     tags: [Auth]
 *     responses:
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Authentication failed. Please try again."
 */
router.get("/failure", (_req, res) => {
  res.status(401).json({
    success: false,
    message: "Authentication failed. Please try again.",
  });
});

module.exports = router;
