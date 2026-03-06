require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const passport = require("./config/passport");
const connectDB = require("./config/db");
const createSessionConfig = require("./config/session");
const swaggerSpec = require("./config/swagger");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const { version } = require("../package.json");

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

// ─── Swagger Documentation ──────────────────────────────

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "OAuth Login Backend - API Docs",
    customCss: ".swagger-ui .topbar { display: none }",
  })
);

app.get("/api-docs.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// ─── Routes ────────────────────────────────────────────

/**
 * @swagger
 * /:
 *   get:
 *     summary: API root information
 *     description: Returns an HTML welcome page with API overview and navigation.
 *     tags: [Root]
 *     responses:
 *       200:
 *         description: HTML welcome page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
app.get("/", (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>OAuth Login Backend</title>
      <style>
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
          background: #0a0e1a;
          color: #e0e6f0;
          overflow: hidden;
        }

        body::before {
          content: "";
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(56, 189, 248, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 100%, rgba(139, 92, 246, 0.06) 0%, transparent 50%),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 40px,
              rgba(56, 189, 248, 0.015) 40px,
              rgba(56, 189, 248, 0.015) 41px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 40px,
              rgba(56, 189, 248, 0.015) 40px,
              rgba(56, 189, 248, 0.015) 41px
            );
          z-index: 0;
        }

        .container {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 3rem 2.5rem;
          max-width: 520px;
          width: 90%;
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(56, 189, 248, 0.12);
          border-radius: 20px;
          backdrop-filter: blur(16px);
          box-shadow:
            0 0 80px rgba(56, 189, 248, 0.06),
            0 25px 50px rgba(0, 0, 0, 0.4);
        }

        .shield {
          width: 64px;
          height: 72px;
          margin: 0 auto 1.5rem;
          position: relative;
        }

        .shield::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #38bdf8 0%, #8b5cf6 100%);
          clip-path: polygon(50% 0%, 100% 20%, 100% 65%, 50% 100%, 0% 65%, 0% 20%);
          opacity: 0.9;
        }

        .shield::after {
          content: "";
          position: absolute;
          top: 30%;
          left: 50%;
          transform: translateX(-50%);
          width: 18px;
          height: 22px;
          border: 3px solid #0a0e1a;
          border-radius: 4px 4px 10px 10px;
          box-shadow: inset 0 -8px 0 #0a0e1a;
        }

        h1 {
          font-size: 1.75rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          background: linear-gradient(135deg, #38bdf8 0%, #a78bfa 50%, #38bdf8 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 200% center; }
        }

        .version {
          display: inline-block;
          margin-top: 0.5rem;
          padding: 0.2rem 0.75rem;
          font-size: 0.8rem;
          font-family: "Cascadia Code", "Fira Code", monospace;
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.25);
          border-radius: 9999px;
          background: rgba(56, 189, 248, 0.06);
        }

        .links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 2rem;
        }

        .links a {
          display: block;
          padding: 0.8rem 1.5rem;
          font-size: 0.95rem;
          font-weight: 600;
          text-decoration: none;
          border-radius: 12px;
          transition: all 0.25s ease;
        }

        .btn-primary {
          background: linear-gradient(135deg, #38bdf8, #818cf8);
          color: #0a0e1a;
          box-shadow: 0 4px 20px rgba(56, 189, 248, 0.25);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 28px rgba(56, 189, 248, 0.4);
        }

        .btn-secondary {
          background: rgba(56, 189, 248, 0.08);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.2);
        }

        .btn-secondary:hover {
          background: rgba(56, 189, 248, 0.15);
          border-color: rgba(56, 189, 248, 0.4);
          transform: translateY(-2px);
        }

        .btn-auth {
          background: rgba(139, 92, 246, 0.08);
          color: #a78bfa;
          border: 1px solid rgba(139, 92, 246, 0.2);
        }

        .btn-auth:hover {
          background: rgba(139, 92, 246, 0.15);
          border-color: rgba(139, 92, 246, 0.4);
          transform: translateY(-2px);
        }

        .sign {
          margin-top: 2.5rem;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(56, 189, 248, 0.08);
          font-size: 0.8rem;
          color: #475569;
        }

        .sign a {
          color: #64748b;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .sign a:hover { color: #38bdf8; }

        @media (max-width: 480px) {
          .container { padding: 2rem 1.5rem; }
          h1 { font-size: 1.4rem; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="shield"></div>
        <h1>OAuth Login Backend</h1>
        <p class="version">v${version}</p>

        <div class="links">
          <a href="/api-docs" class="btn-primary">API Documentation</a>
          <a href="/api/auth/status" class="btn-secondary">Auth Status</a>
          <a href="/api/auth/google" class="btn-auth">Login with Google</a>
          <a href="/api/auth/github" class="btn-auth">Login with GitHub</a>
        </div>

        <footer class="sign">
          Created by
          <a href="https://serkanbayraktar.com/" target="_blank" rel="noopener noreferrer">Serkanby</a>
          |
          <a href="https://github.com/Serkanbyx" target="_blank" rel="noopener noreferrer">Github</a>
        </footer>
      </div>
    </body>
    </html>
  `);
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
    console.log(`Swagger docs on http://localhost:${PORT}/api-docs`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  });
};

startServer();
