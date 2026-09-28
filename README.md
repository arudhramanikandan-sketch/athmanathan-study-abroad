# ATHMANATHAN STUDY ABROAD 🎓

> **Your Dream. Our Guidance.**  
> Official full-stack platform for Athmanathan Study Abroad: Overseas education counseling, destinations, courses, university directory, visa assistance, student essentials, eSIMs, and interactive announcements.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** (or yarn / pnpm / bun)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/<your-username>/athmanathan-study-abroad.git
cd athmanathan-study-abroad
npm install
```

### 2. Configure Environment (Optional)
Copy the example environment configuration:
```bash
cp .env.example .env
```
Key variables:
- `SESSION_SECRET`: Secret key for signing admin session tokens.
- `PORT`: Server port (defaults to `3000`).
- `GEMINI_API_KEY`: (Optional) For AI-assisted features.

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚡ Deployment to Vercel (Ready Out of the Box)

This project is pre-configured with `vercel.json` and a serverless entry point at `api/index.ts` to seamlessly deploy both the Vite frontend and Express API backend on Vercel without manual configuration.

### Deploy via GitHub (Recommended)
1. Push this repository to **GitHub**.
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Click **"Add New..."** > **"Project"** and select your GitHub repository.
4. Vercel automatically detects the Vite framework and settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. (Optional) Add your environment variables in Vercel Project Settings:
   - `SESSION_SECRET`: Any random secure string (e.g. `asa_secure_secret_2026`)
6. Click **Deploy**. Vercel will build the frontend into static CDN edge assets and deploy the backend APIs as serverless functions.

---

## 🐳 Self-Hosted & Container Deployment (Docker / VPS / Cloud Run / Render)

You can also deploy as a standard Node.js full-stack service on Render, Railway, Fly.io, Cloud Run, or your own VPS:

```bash
# Build frontend and compile backend
npm run build

# Start production server
npm start
```
The server will automatically serve both the static Vite frontend and the `/api` backend endpoints on `http://0.0.0.0:${PORT || 3000}`.

---

## 📁 Project Architecture

```
├── api/                  # Vercel Serverless Function entry point (api/index.ts)
├── data/                 # JSON persistent database store (athmanathan_db.json)
├── public/               # Static assets, official logos, SVG posters, and uploads
│   ├── logo.jpeg         # Default official brand logo
│   ├── default-logo.jpeg # Default fallback logo
│   ├── posters/          # Campaign and spot admission posters (e.g., Malaysia Hospitality)
│   └── uploads/          # Admin-uploaded media files
├── server/               # Backend Express architecture
│   ├── app.ts            # Configured Express application & middlewares
│   ├── auth.ts           # Admin authentication, TOTP 2FA, rate limiting, and sessions
│   ├── db.ts             # Resilient database manager & initial seeding
│   ├── live-data.ts      # Live forex and destination weather proxies
│   └── routes.ts         # REST API routes (/api/public/*, /api/admin/*)
├── src/                  # React 19 Frontend SPA (Vite + Tailwind CSS)
│   ├── components/       # Reusable UI components (Navbar, Footer, Modals, etc.)
│   ├── pages/            # Page views (Home, About, Countries, Courses, Admin, etc.)
│   ├── api.ts            # Typed client API services
│   ├── types.ts          # Core TypeScript domain models
│   └── App.tsx           # Client root with deep-link & hash routing
├── vercel.json           # Vercel deployment configuration & routing rewrites
├── vite.config.ts        # Vite build & bundler configuration
└── server.ts             # Development and Node.js production server entry point
```

---

## 🔐 Admin Portal

- **URL**: Navigate to `/admin` or press `Ctrl + Shift + A` anywhere on the site.
- **Default Super Admin**:
  - **Username**: `admin`
  - **Default Password**: `Admin@2026`
- **Security Features**:
  - Secure HttpOnly session tokens with Bearer fallback
  - Optional Google Authenticator / Microsoft Authenticator TOTP 2FA
  - Brute-force rate limiting protection
  - Complete audit logging of all configuration changes

---

## 📄 License & Ownership

© 2026 Athmanathan Study Abroad. All rights reserved.
Govt. Regd. (MSME UDYAM-TN-03-0134152).
