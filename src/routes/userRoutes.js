const router = require("express").Router();
const User = require("../models/User");
const { isAuthenticated } = require("../middlewares/authMiddleware");

// ─── Get Current User Profile (Protected) ──────────────

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
