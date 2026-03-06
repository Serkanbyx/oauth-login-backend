[![Created by Serkanby](https://img.shields.io/badge/Created%20by-Serkanby-blue?style=flat-square)](https://serkanbayraktar.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Serkanbyx-181717?style=flat-square&logo=github)](https://github.com/Serkanbyx)

# OAuth Login Backend (Google / GitHub)

A Node.js/Express backend demonstrating **OAuth2 authentication** with Google and GitHub using **Passport.js**, MongoDB for user storage, and session-based auth management.

> **Security Notice:** This is a public demo project. No real API keys, secrets, or credentials are stored in the codebase. All sensitive values are loaded from environment variables via a `.env` file that is excluded from version control.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js + Express** | Server & routing |
| **Passport.js** | Authentication middleware |
| **passport-google-oauth20** | Google OAuth2 strategy |
| **passport-github2** | GitHub OAuth2 strategy |
| **MongoDB + Mongoose** | Database & ODM |
| **express-session + connect-mongo** | Session management with persistent store |
| **Helmet** | HTTP security headers |
| **CORS** | Cross-origin resource sharing |

---

## Project Structure

```
src/
├── config/
│   ├── db.js              # MongoDB connection
│   ├── passport.js        # Passport strategies & serialization
│   └── session.js         # Session configuration
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

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/s3.16_OAuth-Login-Backend.git
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

## API Endpoints

### Root

| Method | Path | Description |
|---|---|---|
| GET | `/` | API overview with all available endpoints |

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

## OAuth2 Flow

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

---

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start the server |
| `npm run dev` | Start with nodemon (auto-reload) |
| `npm run seed` | Seed database with fake users |

---

## License

MIT

---

## Developer

**Serkanby**

- Website: [serkanbayraktar.com](https://serkanbayraktar.com/)
- GitHub: [@Serkanbyx](https://github.com/Serkanbyx)
- Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)

## Contact

- [Open an Issue](https://github.com/Serkanbyx/s3.16_OAuth-Login-Backend/issues)
- Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)
- Website: [serkanbayraktar.com](https://serkanbayraktar.com/)
