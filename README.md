# 🔐 OAuth Login Backend (Google / GitHub)

A production-ready Node.js/Express backend demonstrating **OAuth2 authentication** with Google and GitHub using Passport.js. Features session-based auth with MongoDB persistent storage, Swagger API documentation, and a modern landing page.

> **Security Notice:** This is a public demo project. No real API keys, secrets, or credentials are stored in the codebase. All sensitive values are loaded from environment variables via a `.env` file that is excluded from version control.

[![Created by Serkanby](https://img.shields.io/badge/Created%20by-Serkanby-blue?style=flat-square)](https://serkanbayraktar.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Serkanbyx-181717?style=flat-square&logo=github)](https://github.com/Serkanbyx)

---

## Features

- **Google & GitHub OAuth2**: Authenticate users via Google or GitHub with a single click using Passport.js strategies
- **Session-Based Authentication**: Secure session management with `express-session` and persistent MongoDB store via `connect-mongo`
- **Multi-Provider User Model**: Unified user schema supporting multiple OAuth providers with unique compound indexing
- **Swagger API Documentation**: Interactive OpenAPI 3.0 documentation with Swagger UI for all endpoints
- **Security Hardened**: HTTP security headers via Helmet, CORS configuration, and httpOnly session cookies
- **Database Seeding**: Pre-built seed script to populate the database with demo users for quick testing
- **Modern Landing Page**: Responsive, dark-themed HTML landing page served at the root endpoint
- **Global Error Handling**: Centralized 404 and 500 error handlers with environment-aware error messages

---

## Live Demo

[🔗 View Live Demo](https://oauth-login-backend-fxh8.onrender.com/)

---

## Technologies

- **Node.js + Express 5**: Server framework and routing
- **Passport.js**: Authentication middleware with Google and GitHub OAuth2 strategies
- **MongoDB + Mongoose 9**: NoSQL database with ODM for user and session storage
- **express-session + connect-mongo**: Session management with persistent MongoDB store
- **Swagger (swagger-jsdoc + swagger-ui-express)**: Auto-generated OpenAPI 3.0 documentation
- **Helmet**: HTTP security headers middleware
- **CORS**: Cross-origin resource sharing configuration
- **dotenv**: Environment variable management
- **Nodemon**: Development auto-reload

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

### 1. Clone the Repository

```bash
git clone https://github.com/Serkanbyx/s3.16_OAuth-Login-Backend.git
cd s3.16_OAuth-Login-Backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example file and fill in your own values:

```bash
cp .env.example .env
```

Edit `.env` with your credentials (see sections below for how to obtain them).

### 4. Register OAuth Applications

#### Google OAuth2

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Create a new project (or select existing).
3. Navigate to **APIs & Services > Credentials**.
4. Click **Create Credentials > OAuth client ID**.
5. Set **Application type** to **Web application**.
6. Add `http://localhost:3000/api/auth/google/callback` as an **Authorized redirect URI**.
7. Copy the **Client ID** and **Client Secret** into your `.env` file.

#### GitHub OAuth2

1. Go to [GitHub Developer Settings](https://github.com/settings/developers).
2. Click **New OAuth App**.
3. Set **Homepage URL** to `http://localhost:3000`.
4. Set **Authorization callback URL** to `http://localhost:3000/api/auth/github/callback`.
5. Copy the **Client ID** and **Client Secret** into your `.env` file.

### 5. Seed the Database (Optional)

Populate the database with fake demo users:

```bash
npm run seed
```

This creates 6 fake users (3 Google, 3 GitHub) for testing the user endpoints without going through the OAuth flow.

### 6. Run the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server starts at `http://localhost:3000`.

---

## Usage

1. Start the server and navigate to `http://localhost:3000`
2. Click **Login with Google** or **Login with GitHub** to authenticate
3. After successful login, you are redirected back to the app with an active session
4. Visit `/api/auth/status` to check your authentication status
5. Access `/api/user/profile` to view your profile data
6. Browse `/api-docs` for interactive Swagger API documentation
7. Visit `/api/auth/logout` to destroy your session and log out

---

## How It Works?

### OAuth2 Authentication Flow

```
User                    Backend                  Google/GitHub
 │                         │                         │
 │── GET /api/auth/google ─►                         │
 │                         │── Redirect to provider ─►
 │                         │                         │
 │◄─── Consent Screen ────────────────────────────────
 │                         │                         │
 │── Grant Permission ──────────────────────────────►│
 │                         │                         │
 │                         │◄── Callback + code ──────
 │                         │── Exchange for token ───►
 │                         │◄── Profile data ─────────
 │                         │                         │
 │                         │── Find/Create User (DB) │
 │                         │── Create Session         │
 │◄── Redirect + Cookie ───                          │
```

### Session Management

Sessions are stored in MongoDB via `connect-mongo` with a 24-hour TTL. Cookies are configured with `httpOnly`, `sameSite: lax`, and `secure` flag enabled in production.

### Multi-Provider User Model

Users are uniquely identified by the compound index `{ provider, providerId }`, allowing the same person to have separate accounts for Google and GitHub providers.

---

## Project Structure

```
src/
├── config/
│   ├── db.js              # MongoDB connection
│   ├── passport.js        # Passport strategies & serialization
│   ├── session.js         # Session configuration
│   └── swagger.js         # Swagger/OpenAPI configuration
├── models/
│   └── User.js            # User schema (multi-provider support)
├── seeds/
│   └── seedUsers.js       # Fake user data for demo/testing
├── routes/
│   ├── authRoutes.js      # OAuth endpoints (login, callback, logout, status)
│   └── userRoutes.js      # User endpoints (profile, list all)
├── middlewares/
│   └── authMiddleware.js  # Authentication guard
└── app.js                 # Application entry point
```

---

## API Endpoints

### Root

| Method | Path | Description |
|---|---|---|
| GET | `/` | Landing page with API overview and navigation |
| GET | `/api-docs` | Interactive Swagger UI documentation |
| GET | `/api-docs.json` | Raw OpenAPI 3.0 specification (JSON) |

### Auth Routes (`/api/auth`)

| Method | Path | Description |
|---|---|---|
| GET | `/google` | Initiate Google OAuth2 login |
| GET | `/google/callback` | Google OAuth2 callback (handled by Passport) |
| GET | `/github` | Initiate GitHub OAuth2 login |
| GET | `/github/callback` | GitHub OAuth2 callback (handled by Passport) |
| GET | `/status` | Check current authentication status |
| GET | `/logout` | Destroy session and log out |
| GET | `/failure` | Auth failure response |

### User Routes (`/api/user`)

| Method | Path | Auth Required | Description |
|---|---|---|---|
| GET | `/profile` | Yes | Get authenticated user's profile |
| GET | `/all` | No | List all users in the database |

### Example Responses

**GET `/api/auth/status`** (authenticated):

```json
{
  "success": true,
  "message": "User is authenticated.",
  "user": {
    "_id": "...",
    "provider": "google",
    "providerId": "...",
    "displayName": "Jane Doe",
    "email": "jane.doe@example.com",
    "avatar": "https://...",
    "createdAt": "2026-03-06T..."
  }
}
```

**GET `/api/user/profile`** (protected):

```json
{
  "success": true,
  "user": {
    "id": "...",
    "provider": "github",
    "displayName": "bob-dev",
    "email": "bob.dev@example.com",
    "avatar": "https://...",
    "createdAt": "2026-03-06T..."
  }
}
```

**GET `/api/user/all`**:

```json
{
  "success": true,
  "count": 6,
  "users": [
    {
      "_id": "...",
      "provider": "google",
      "providerId": "google-001",
      "displayName": "Jane Doe",
      "email": "jane.doe@example.com",
      "avatar": "https://i.pravatar.cc/150?u=jane-google",
      "createdAt": "..."
    }
  ]
}
```

---

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start the server |
| `npm run dev` | Start with nodemon (auto-reload) |
| `npm run seed` | Seed database with fake users |

---

## Features in Detail

### Completed Features

- ✅ Google OAuth2 authentication
- ✅ GitHub OAuth2 authentication
- ✅ Session-based auth with MongoDB persistent store
- ✅ Swagger/OpenAPI 3.0 interactive documentation
- ✅ User profile and listing endpoints
- ✅ Database seeding with demo users
- ✅ Security hardening (Helmet, CORS, httpOnly cookies)
- ✅ Global error handling (404 + 500)
- ✅ Modern responsive landing page
- ✅ Environment-aware configuration

### Future Features

- 🔮 [ ] Add Twitter/X OAuth2 provider
- 🔮 [ ] Implement role-based access control (RBAC)
- 🔮 [ ] Add rate limiting middleware
- 🔮 [ ] JWT token-based auth as an alternative
- 🔮 [ ] Account linking (merge multiple providers into one user)

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes using semantic format:
   - `feat:` — New feature
   - `fix:` — Bug fix
   - `refactor:` — Code refactoring
   - `docs:` — Documentation changes
   - `style:` — Formatting, styling
   - `chore:` — Maintenance tasks
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## Developer

**Serkanby**

- Website: [serkanbayraktar.com](https://serkanbayraktar.com/)
- GitHub: [@Serkanbyx](https://github.com/Serkanbyx)
- Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)

---

## Contact

- [Open an Issue](https://github.com/Serkanbyx/s3.16_OAuth-Login-Backend/issues)
- Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)
- Website: [serkanbayraktar.com](https://serkanbayraktar.com/)

---

⭐ If you like this project, don't forget to give it a star!
