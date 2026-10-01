# Nexus Clean — Production Deployment Guide
**Smart Waste Management & Predictive Intelligence Platform**  
*"Don't Just Report Waste. Predict It."*

---

## 1. System Architecture Overview

```
                                 [ Cloudflare / CDN ]
                                          |
                      +-------------------+-------------------+
                      |                                       |
             (Frontend Requests)                     (API Requests)
                      v                                       v
         +--------------------------+            +--------------------------+
         |      Vercel / Netlify    |            |     Render / Railway     |
         | React + Vite SPA (dist)  | ---------> | Node.js + Express API    |
         | Port: 443 (HTTPS)        |  REST API  | Port: 5000 / 10000       |
         +--------------------------+            +-------------+------------+
                                                               |
                                            +------------------+------------------+
                                            v                                     v
                               +--------------------------+          +--------------------------+
                               |    Supabase / Postgres   |          |      Google Gemini       |
                               | PostgreSQL 16 Database   |          | Generative AI (Vision)   |
                               | (Auth & Lifecycle State) |          | (Waste & Verification)   |
                               +--------------------------+          +--------------------------+
```

---

## 2. Recommended Production Stack (Zero-Cost Hackathon/Starter)

| Layer | Service / Host | Reason | Cost |
| :--- | :--- | :--- | :--- |
| **Frontend** | [Vercel](https://vercel.com) or [Netlify](https://netlify.com) | Edge CDN, instant Vite builds, zero-config SPA routing | Free |
| **Backend** | [Render](https://render.com) or [Railway](https://railway.app) | Native Node.js web service, health checks, environment variables | Free / Hobby |
| **Database** | [Supabase](https://supabase.com) | Managed PostgreSQL, Row Level Security, instant connection pooling | Free |
| **AI Vision** | [Google AI Studio](https://aistudio.google.com) | Gemini 1.5 Flash / 2.5 Flash for image classification & resolution verify | Free tier |

---

## 3. Production Deployment Walkthrough

### Step 1: Database Setup on Supabase
1. Go to [https://supabase.com](https://supabase.com) and create a new project.
2. Select your closest region and set a strong database password.
3. Open the **SQL Editor** in your Supabase dashboard.
4. Copy and paste the contents of `backend/database/schema.sql` and click **Run**.
5. Copy and paste the contents of `backend/database/seed.sql` and click **Run**.
6. Navigate to **Project Settings -> API** and copy:
   - **Project URL** (`https://xyzcompany.supabase.co`)
   - **anon / public key**
   - **service_role key** (Secret — keep confidential!)

---

### Step 2: Backend Deployment (Render.com)

1. Push your repository to GitHub or GitLab.
2. In [Render Dashboard](https://dashboard.render.com), click **New + -> Web Service**.
3. Select your repository.
4. Configure service settings:
   - **Name**: `nexus-clean-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`
5. Configure Environment Variables under the **Environment** tab:

| Variable | Recommended Value | Notes |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables helmet, sanitized errors, secure cookies |
| `PORT` | `10000` | Render assigns port automatically |
| `HOST` | `0.0.0.0` | Container host binding |
| `JWT_SECRET` | *(Generate a 64-char random hex string)* | Used for JWT signing |
| `FRONTEND_URL` | `https://your-nexus-clean.vercel.app` | Comma-separated allowed CORS origins |
| `SUPABASE_URL` | `https://xyz.supabase.co` | From Supabase Project Settings |
| `SUPABASE_ANON_KEY` | `eyJhb...` | Public API key |
| `SUPABASE_SERVICE_ROLE_KEY`| `eyJhb...` | Private admin service role key |
| `GEMINI_API_KEY` | *(Your Google Gemini API Key)* | From Google AI Studio |

6. Click **Create Web Service**. Wait for the build to finish.
7. Note down your backend URL: e.g., `https://nexus-clean-backend.onrender.com`.
8. Verify it:
   ```bash
   curl https://nexus-clean-backend.onrender.com/health
   # Returns: {"status":"healthy","uptime":...}
   ```

---

### Step 3: Frontend Deployment (Vercel)

1. Open [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New... -> Project**.
2. Import your GitHub repository.
3. In the project setup screen:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables** and add:

| Key | Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://nexus-clean-backend.onrender.com/api` | Live backend API URL |
| `VITE_API_BASE_URL` | `https://nexus-clean-backend.onrender.com/api` | Mirror for compatibility |

5. Click **Deploy**.
6. When deployment finishes, update your backend's `FRONTEND_URL` variable in Render with your actual Vercel domain (`https://nexus-clean.vercel.app`) to authorize CORS.

---

### Step 4: Alternative — One-Click Render Blueprint

If deploying both frontend and backend on Render:
1. In Render Dashboard, click **New + -> Blueprint**.
2. Select your repository. Render will automatically detect `render.yaml`.
3. Fill in the prompted secret environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`).
4. Click **Apply**. Both backend and static frontend will build and link automatically.

---

### Step 5: Alternative — Full Docker Container Stack (VPS / Self-Hosted)

For running on a VPS (Ubuntu, Debian, AWS EC2, DigitalOcean):

```bash
# 1. Clone repository
git clone https://github.com/yourusername/nexus-clean.git
cd nexus-clean

# 2. Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your production secrets

# 3. Build and launch all 3 containers (Postgres, Backend, Frontend/Nginx)
docker compose up -d --build

# 4. Check status
docker compose ps
docker compose logs -f backend
```

- **Frontend Accessible at**: `http://your-server-ip:3000`
- **Backend API Accessible at**: `http://your-server-ip:5000/api`
- **Postgres Database**: `port 5432`

---

## 4. Test Accounts & Verification

Use these accounts to test the live production system:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Citizen (Verified)** | `aarav.sharma@example.com` | `Citizen@123` | Report waste, pick up requests, track complaints, view Eco-Score |
| **Citizen (New)** | `priya.patel@example.com` | `Citizen@123` | Eco-Score tier progression, community awareness |
| **Administrator** | `admin@nexusclean.gov.in` | `Admin@123` | Admin dashboard, predictive hotspots, dispatch pickups, verify resolutions |

---

## 5. Security & Reliability Highlights

1. **Rate Limiting**:
   - `/api/auth/*`: 30 attempts per 15 minutes per IP (prevents brute-force attacks).
   - `/api/*`: 500 requests per 15 minutes per IP (DDoS and scraper protection).
2. **Reverse Proxy Trust**:
   - `app.set('trust proxy', 1)` configured for accurate client IP resolution behind Cloudflare, Vercel, and Render.
3. **HTTP Security Headers**:
   - Enabled via Helmet (`nosniff`, `xssFilter`, frameguard `DENY`, referrerPolicy).
4. **Environment Isolation**:
   - Error messages are sanitized in production (`NODE_ENV=production`) to prevent stack trace leakage.
5. **Fault Tolerant Architecture**:
   - If Supabase or PostgreSQL credentials are not present, the backend automatically operates on resilient seeded memory models.
   - If Gemini AI API keys are not supplied, the AI engine transparently switches to deterministic "Prototype Intelligence" with clear transparency flags.
