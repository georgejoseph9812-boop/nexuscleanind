# Nexus Clean — Backend API Service

> **Tagline**: *"Don't Just Report Waste. Predict It."*  
> **Lifecycle**: `DETECT → ANALYZE → PREDICT → PREVENT → COLLECT → VERIFY → IMPROVE`

The Nexus Clean backend is an Express.js and Supabase PostgreSQL REST API providing smart civic waste reporting, predictive hotspot intelligence, AI-assisted image analysis, smart route recommendations, dynamic civic gamification (Eco-Score), and municipal administration endpoints.

---

## 🛠 Tech Stack

- **Runtime**: Node.js (v18+)
- **Web Framework**: Express.js
- **Database**: PostgreSQL (via Supabase) with in-memory seed data fallback
- **Authentication**: JWT & Role-Based Access Control (`citizen`, `admin`, `collector`)
- **AI Engine**: Google Gemini API (`@google/generative-ai` & `@google/genai`) with **Prototype Intelligence** fallback
- **Image Handling**: Multer for multipart form uploads and static storage

---

## 📁 Project Architecture

```
nexus-clean/
├── frontend/                     # React + Vite + Tailwind frontend
│   └── src/
│       └── services/api.js      # Central API integration layer
│
└── backend/                      # Express.js REST API
    ├── database/
    │   ├── schema.sql           # Complete PostgreSQL DDL schema
    │   └── seed.sql             # Realistic hackathon demo datasets
    ├── uploads/                 # Static storage for user-submitted photos
    ├── src/
    │   ├── config/
    │   │   ├── env.js           # Typed environment variables
    │   │   └── supabase.js      # Supabase client initializer
    │   ├── controllers/         # Request handling & HTTP responses
    │   ├── middleware/          # Auth, JWT, validation, upload, error handlers
    │   ├── routes/              # Express API route modules
    │   ├── services/            # Core business & AI logic
    │   │   ├── geminiService.js     # Multimodal AI analysis & verification
    │   │   ├── predictionService.js # Explainable risk scoring model
    │   │   ├── analyticsService.js  # Recharts-ready aggregations
    │   │   ├── ecoScoreService.js   # Civic points & achievements
    │   │   └── databaseService.js   # Unified repository layer
    │   ├── utils/               # Formatting, IDs, and logger
    │   ├── validators/          # Input validation schemas
    │   ├── app.js               # Express application configuration
    │   └── server.js            # Server entrypoint
    ├── .env.example
    ├── package.json
    └── README.md
```

---

## 🚀 Quick Start & Installation

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Default `.env` configuration:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Supabase (Optional for local testing; runs with resilient seed data if empty)
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Google Gemini API Key (Optional; returns Prototype Intelligence if empty)
GEMINI_API_KEY=

# JWT Authentication
JWT_SECRET=nexus_clean_hackathon_super_secret_jwt_key_2026
JWT_EXPIRES_IN=7d
```

### 3. Run Locally
**Development mode (auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Once running, verify at:
```
http://localhost:5000/api/health
```

---

## 🗄️ Database Setup (Supabase PostgreSQL)

1. Create a project in [Supabase](https://supabase.com).
2. Open the **SQL Editor** in the Supabase Dashboard.
3. Run the schema file:
   - Copy contents of `database/schema.sql` and click **Run**.
4. Run the seed data file:
   - Copy contents of `database/seed.sql` and click **Run**.
5. Copy your **Project URL** and **anon/service-role API key** from *Project Settings → API* into `backend/.env`.

> **Note for Local Testing**: If Supabase credentials are left blank, the backend automatically runs with a built-in seed repository containing all demo users, complaints (`NC-1042` to `NC-1045`), pickups (`PK-2081` to `PK-2084`), and hotspots (`HS-01` to `HS-05`).

---

## 🤖 AI Features & Fallback Policy

### AI Waste Analysis (`POST /api/ai/analyze-waste`)
- If `GEMINI_API_KEY` is configured: Gemini 1.5 Flash evaluates the waste photo and returns detection, priority, and composition.
- If `GEMINI_API_KEY` is not configured: Safely returns structured **Prototype Intelligence** clearly labeled:
  ```json
  {
    "success": true,
    "data": {
      "detectedIssue": "Overflowing Bin (High Density Organic & Plastic)",
      "confidence": 94,
      "priority": "HIGH",
      "suggestedAction": "Schedule emergency collection within 4 hours.",
      "isPrototype": true,
      "notice": "Prototype Intelligence — Gemini credentials will be connected later."
    }
  }
  ```

### AI Resolution Verification (`POST /api/ai/verify-resolution`)
- Compares before and after cleanup photos to compute a verification clearance percentage (e.g. `92%`).

---

## 📡 API Endpoints Reference

### 1. Health Check
- `GET /api/health` — Check server status and integration modes.

### 2. Authentication & Users
- `POST /api/auth/register` — Register a new citizen.
  - Body: `{ name, email, password, location, area }`
- `POST /api/auth/login` — Sign in and obtain JWT token.
  - Body: `{ email, password }`
- `POST /api/auth/logout` — Invalidate session.
- `GET /api/users/me` — Retrieve current authenticated user profile and Eco-Score.

### 3. Complaints Management
- `GET /api/complaints` — List complaints (supports `?status=Pending&priority=High&area=Civil+Lines&search=term`).
- `GET /api/complaints/:id` — Get single complaint with full 6-step lifecycle timeline.
- `POST /api/complaints` — Submit a complaint (generates ID like `NC-1046`).
- `PATCH /api/complaints/:id` — Update complaint details.
- `PATCH /api/complaints/:id/status` — Advance complaint status (`Pending` → `Assigned` → `In Progress` → `Resolution Submitted` → `Resolved`).

### 4. Waste Pickups
- `GET /api/pickups` — Get pickup requests and dynamic smart route preview.
- `GET /api/pickups/:id` — Get single pickup details.
- `POST /api/pickups` — Request specialized collection (generates `PK-2085`).
- `PATCH /api/pickups/:id/status` — Update pickup status.

### 5. Predictive Hotspots
- `GET /api/hotspots` — Fetch high-risk predictive waste clusters with AI recommendations.
- `GET /api/hotspots/:id` — Get granular hotspot historical and root-cause analysis.
- `POST /api/hotspots/regenerate` — Refresh explainable forecast calculations.

### 6. Analytics & Recharts Data
- `GET /api/analytics` — Complete Recharts payload (complaints over time, by category, resolution rates, waste distribution).
- `GET /api/analytics/recurring-problems` — Root causes and recommended municipal actions.

### 7. Civic Gamification (Eco-Score)
- `GET /api/eco-score` — Get score, breakdown, level, and unlocked achievements.
- `POST /api/eco-score/activity` — Log eco-action (+10 pts for verified report, +5 for quiz).

### 8. Awareness & Quiz
- `GET /api/awareness` — Waste stream guides and disposal instruction cards.
- `GET /api/awareness/quiz` — Interactive items for the "Sort the Waste" challenge.

### 9. Admin Operations
- `GET /api/admin/dashboard` — Key operational metrics and dispatch stats.
- `GET /api/admin/pickups/recommendations` — Fleet route optimization.

### 10. File Uploads
- `POST /api/upload` — Upload multipart image and get relative URL `/uploads/...`.

---

## 👥 Demo Credentials

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Citizen** | `citizen@nexusclean.org` | `demo123` | Citizen Dashboard, Reporting, Eco-Score |
| **Admin** | `admin@nexusclean.org` | `demo123` | Control Room, Predictive Intelligence, Fleet Dispatch |
| **Collector**| `collector@nexusclean.org` | `demo123` | Field Pickup Operations |
