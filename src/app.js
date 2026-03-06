require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const passport = require("./config/passport");
const connectDB = require("./config/db");
const createSessionConfig = require("./config/session");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Security & Parsing ────────────────────────────────

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// ─── Session & Passport ────────────────────────────────

app.use(createSessionConfig());
app.use(passport.initialize());
app.use(passport.session());

// ─── Routes ────────────────────────────────────────────

app.get("/", (_req, res) => {
  res.json({
    message: "OAuth Login Backend API",
    endpoints: {
      auth: {
        googleLogin: "GET /api/auth/google",
        githubLogin: "GET /api/auth/github",
        status: "GET /api/auth/status",
        logout: "GET /api/auth/logout",
      },
      user: {
        profile: "GET /api/user/profile (protected)",
        allUsers: "GET /api/user/all",
      },
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// ─── 404 Handler ───────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// ─── Global Error Handler ──────────────────────────────

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err.message);

  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error."
        : err.message,
  });
});

// ─── Start Server ──────────────────────────────────────

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  });
};

startServer();
