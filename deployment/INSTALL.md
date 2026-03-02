# Heno – Compilation, Installation & Deployment

This document covers installing Heno locally, listing dependencies with versions, environment setup, and deployment. The application consists of a **Node.js/Express backend** and a **Vite/React frontend**, with **PostgreSQL** as the database.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Compilation / Installation Instructions](#2-compilation--installation-instructions)
3. [Dependencies List (with versions)](#3-dependencies-list-with-versions)
4. [Environment Setup Guide](#4-environment-setup-guide)
5. [Deployment Instructions](#5-deployment-instructions)
6. [Live Demo URL](#6-live-demo-url)

---

## 1. Prerequisites

- **Node.js** – v18 or v20 LTS recommended (required for both frontend and backend).
- **npm** – v9+ (comes with Node).
- **PostgreSQL** – 14+ (local or hosted, e.g. [Neon](https://neon.tech), [Render](https://render.com), or local install).
- **Git** – to clone the repository.

---

## 2. Compilation / Installation Instructions

### Clone the repository

```bash
git clone <repository-url>
cd heno
```

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (see [Environment Setup](#4-environment-setup-guide)). Then:

```bash
# Development: run the server (default port 3000)
npm start
# or: node index.js
```

The backend does not require a separate “build” step for development. For production, `npm start` runs `node index.js` (no compile step). If you use Prisma elsewhere, run `npx prisma generate` when needed.

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` or `.env.development` file in `frontend/` if you want to point to a local backend (see [Environment Setup](#4-environment-setup-guide)). Then:

```bash
# Development: Vite dev server (default http://localhost:5173)
npm run dev
```

**Production build:**

```bash
npm run build
```

Output is in `frontend/dist/`. Serve that folder with any static host or use:

```bash
npm run preview
```

to preview the production build locally.

### Run full stack locally

1. Start PostgreSQL and ensure `DATABASE_URL` in `backend/.env` is correct.
2. In one terminal: `cd backend && npm start`.
3. In another: `cd frontend && npm run dev`.
4. Open `http://localhost:5173` and (if `.env` points frontend to `http://localhost:3000`) the app will use the local backend.

---

## 3. Dependencies List (with versions)

Exact resolved versions come from `package-lock.json` in each folder. Below are the **declared** ranges from `package.json` and, where available, **resolved** versions from `npm list --depth=0`.

### Backend (`backend/package.json`)

| Package | Declared | Resolved (example) |
|--------|----------|----------------------|
| @anthropic-ai/sdk | ^0.78.0 | 0.78.0 |
| @google/generative-ai | ^0.24.1 | 0.24.1 |
| @prisma/client | ^5.16.1 | 5.22.0 |
| axios | ^1.7.2 | 1.13.2 |
| bcrypt | ^5.1.1 | 5.1.1 |
| connect-session-sequelize | ^7.1.7 | 7.1.7 |
| cors | ^2.8.5 | 2.8.6 |
| dotenv | ^16.4.5 | 16.6.1 |
| express | ^4.19.2 | 4.22.1 |
| express-session | ^1.18.0 | 1.19.0 |
| firebase | ^10.12.2 | 10.14.1 |
| morgan | ^1.10.0 | 1.10.1 |
| node-cron | ^3.0.3 | 3.0.3 |
| node-schedule | ^2.1.1 | 2.1.1 |
| nodemailer | ^6.9.14 | 6.10.1 |
| openai | ^6.25.0 | 6.25.0 |
| passport | ^0.7.0 | 0.7.0 |
| passport-local | ^1.0.0 | 1.0.0 |
| pexels | ^1.4.0 | 1.4.0 |
| pg | ^8.12.0 | 8.17.2 |
| pg-hstore | ^2.3.4 | 2.3.4 |
| sequelize | ^6.37.3 | 6.37.7 |
| socket.io | ^4.7.5 | 4.8.3 |
| zod | ^4.3.6 | 4.3.6 |

**Backend devDependencies:** `prisma` ^5.16.1 (e.g. 5.22.0).

### Frontend (`frontend/package.json`)

| Package | Declared |
|--------|----------|
| @fortawesome/fontawesome-svg-core | ^6.5.2 |
| @fortawesome/free-brands-svg-icons | ^6.5.2 |
| @fortawesome/free-regular-svg-icons | ^6.5.2 |
| @fortawesome/free-solid-svg-icons | ^6.5.2 |
| @fortawesome/react-fontawesome | ^0.2.2 |
| axios | ^1.7.2 |
| firebase | ^10.12.2 |
| moment | ^2.30.1 |
| moment-timezone | ^0.5.45 |
| node-cron | ^3.0.3 |
| nodemailer | ^6.9.14 |
| openai | ^4.52.2 |
| pexels | ^1.4.0 |
| react | ^18.3.1 |
| react-beautiful-dnd | ^13.1.1 |
| react-big-calendar | ^1.13.1 |
| react-calendar | ^5.0.0 |
| react-dom | ^18.3.1 |
| react-google-charts | ^4.0.1 |
| react-icons | ^5.2.1 |
| react-router-dom | ^6.24.0 |
| react-transition-group | ^4.4.5 |
| socket.io-client | ^4.7.5 |

**Frontend devDependencies:** @types/react ^18.3.3, @types/react-dom ^18.3.0, @vitejs/plugin-react ^4.3.1, eslint ^8.57.0, eslint-plugin-react ^7.34.2, eslint-plugin-react-hooks ^4.6.2, eslint-plugin-react-refresh ^0.4.7, vite ^5.3.1.

For **exact** frontend versions, run `npm list --depth=0` in `frontend/` or use `npm ci` for reproducible installs from `package-lock.json`.

---

## 4. Environment Setup Guide

### Backend (`backend/.env`)

Create `backend/.env` with at least:

```env
# Required: PostgreSQL connection string (local or hosted)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"

# Required for AI task recommendations
GEMINI_API_KEY="your-google-gemini-api-key"

# Session secret (required in production; use a long random string)
SESSION_SECRET="your-session-secret"

# Optional: when frontend is on a different origin (e.g. production)
FRONTEND_ORIGIN="https://your-frontend-domain.com"

# Optional: enable cross-origin cookies (set to true when frontend ≠ backend origin)
COOKIE_CROSS_ORIGIN=true

# Optional: port (default 3000)
PORT=3000

# Optional: email (currently used in commented-out code)
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASS=your-app-password
# EMAIL_FROM=your-email@gmail.com
```

- **Local:** `DATABASE_URL` can use `localhost` and no SSL if your PostgreSQL allows it (you may need to set `ssl: false` in `backend/index.js` for local DB).
- **Production:** Use a hosted PostgreSQL URL with SSL. Set `FRONTEND_ORIGIN` and `COOKIE_CROSS_ORIGIN=true` so login and sessions work from the deployed frontend.

### Frontend

The app reads the API base URL from **Vite** env:

- **Development:** Create `frontend/.env.development` (optional):

  ```env
  VITE_API_URL=http://localhost:3000
  ```

  If unset, the app falls back to the production API URL (see `frontend/src/config.js`).

- **Production build:** Create `frontend/.env.production`:

  ```env
  VITE_API_URL=https://your-backend-url.com
  ```

  Replace with your real backend URL (e.g. `https://heno-backend.onrender.com`). The build inlines this at build time.

**Important:** Only variables prefixed with `VITE_` are exposed to the client. Do not put secrets in frontend env files.

---

## 5. Deployment Instructions

### Backend (e.g. Render)

The backend is a Node.js server that listens on `PORT` and uses PostgreSQL and session store.

1. **Database:** Create a PostgreSQL instance (e.g. Render PostgreSQL, Neon, Supabase). Copy the connection string.
2. **Web service:** Create a “Web Service” (Render, Railway, Fly.io, etc.). Connect the repo and set:
   - **Build command:** `npm install` (or `npm ci`).
   - **Start command:** `npm start` (or `node index.js`).
   - **Root directory:** `backend` (if the repo root is the monorepo).
3. **Environment variables:** Set in the host’s dashboard:
   - `DATABASE_URL` – PostgreSQL URL (often provided by the host).
   - `GEMINI_API_KEY` – for AI features.
   - `SESSION_SECRET` – long random string.
   - `FRONTEND_ORIGIN` – full URL of the frontend (e.g. `https://heno.onrender.com` or your Vercel URL).
   - `COOKIE_CROSS_ORIGIN` – set to `true` when frontend and backend are on different origins.
4. **Trust proxy:** The app sets `trust proxy: 1` for correct `req.secure` behind a reverse proxy (e.g. Render); no extra config needed.

### Frontend (e.g. Vercel / Netlify / static)

1. **Build:** Use build command `npm run build`, output directory `dist` (Vite default).
2. **Env:** Set `VITE_API_URL` to your deployed backend URL (e.g. `https://heno-backend.onrender.com`) in the host’s “Environment variables” for production.
3. **Single-page app:** If the app uses client-side routing (e.g. React Router), configure the host to serve `index.html` for all routes (Vercel/Netlify usually do this by default for SPAs).

### Session / cookies

- With frontend and backend on **different domains**, set on the backend:
  - `FRONTEND_ORIGIN` = frontend URL.
  - `COOKIE_CROSS_ORIGIN=true`.
- Backend uses `sameSite: 'none'` and `secure: true` in that case so cookies are sent cross-origin. Ensure the backend is served over HTTPS.

---

## 6. Live Demo URL

- **Backend API (hosted):**  
  **https://heno-backend.onrender.com**  
  Use this as `VITE_API_URL` for a frontend that should talk to the shared demo backend.

- **Live demo (full app):**  
  *If the frontend is hosted, add the URL here, for example:*
  - *Frontend: [https://heno.onrender.com](https://heno-1p67.onrender.com/) (or your Vercel/Netlify URL)*

If you deploy the frontend, update this section with the actual live app URL.

---

*Last updated: March 2025. For user-facing help, see the User Documentation folder.*
