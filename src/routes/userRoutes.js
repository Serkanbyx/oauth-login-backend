const router = require("express").Router();
const User = require("../models/User");
const { isAuthenticated } = require("../middlewares/authMiddleware");

// ─── Get Current User Profile (Protected) ──────────────

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get current user profile
 *     description: Returns the authenticated user's profile information. Requires an active session.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "66a1b2c3d4e5f67890abcdef"
 *                     provider:
 *                       type: string
 *                       enum: [google, github]
 *                       example: "google"
 *                     displayName:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       nullable: true
 *                       example: "john@example.com"
 *                     avatar:
 *                       type: string
 *                       nullable: true
 *                       example: "https://lh3.googleusercontent.com/a/photo.jpg"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-03-06T12:00:00.000Z"
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Unauthorized. Please log in first."
 */
router.get("/profile", isAuthenticated, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      provider: req.user.provider,
      displayName: req.user.displayName,
      email: req.user.email,
      avatar: req.user.avatar,
      createdAt: req.user.createdAt,
    },
  });
});

// ─── List All Users (Demo Endpoint) ─────────────────────

/**
 * @swagger
 * /api/user/all:
 *   get:
 *     summary: List all users
 *     description: Returns all registered users sorted by creation date (newest first). This is a demo endpoint with no authentication required.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Failed to fetch users."
 */
router.get("/all", async (_req, res) => {
  try {
    const users = await User.find().select("-__v").sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
    });
  }
});

module.exports = router;
