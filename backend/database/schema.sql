-- ============================================================================
-- Nexus Clean — PostgreSQL / Supabase Relational Database Schema
-- "Don't Just Report Waste. Predict It."
-- ============================================================================

-- Drop existing tables if re-running migration
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS awareness_content CASCADE;
DROP TABLE IF EXISTS eco_activities CASCADE;
DROP TABLE IF EXISTS eco_scores CASCADE;
DROP TABLE IF EXISTS resolution_verifications CASCADE;
DROP TABLE IF EXISTS hotspot_complaints CASCADE;
DROP TABLE IF EXISTS hotspots CASCADE;
DROP TABLE IF EXISTS pickup_requests CASCADE;
DROP TABLE IF EXISTS complaint_status_history CASCADE;
DROP TABLE IF EXISTS complaint_images CASCADE;
DROP TABLE IF EXISTS complaints CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. USERS TABLE
CREATE TABLE users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen', 'admin', 'collector')),
  location VARCHAR(255),
  area VARCHAR(255),
  phone VARCHAR(64),
  avatar TEXT,
  title VARCHAR(255),
  department VARCHAR(255),
  jurisdiction VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. COMPLAINTS TABLE
CREATE TABLE complaints (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL CHECK (category IN (
    'Overflowing Bin',
    'Roadside Garbage',
    'Illegal Dumping',
    'Missed Collection',
    'Improper Segregation',
    'Construction Waste',
    'Other'
  )),
  description TEXT NOT NULL,
  address VARCHAR(255) NOT NULL,
  area VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  priority VARCHAR(32) NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
  status VARCHAR(64) NOT NULL DEFAULT 'Pending' CHECK (status IN (
    'Pending',
    'Assigned',
    'In Progress',
    'Resolution Submitted',
    'Resolved'
  )),
  assigned_team VARCHAR(255) DEFAULT 'Pending Dispatch',
  before_image TEXT,
  after_image TEXT,
  ai_analysis JSONB DEFAULT '{}'::jsonb,
  verification JSONB DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. COMPLAINT IMAGES TABLE
CREATE TABLE complaint_images (
  id SERIAL PRIMARY KEY,
  complaint_id VARCHAR(64) NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_type VARCHAR(32) NOT NULL CHECK (image_type IN ('before', 'after', 'verification', 'attachment')),
  uploaded_by VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. COMPLAINT STATUS HISTORY (Timeline)
CREATE TABLE complaint_status_history (
  id SERIAL PRIMARY KEY,
  complaint_id VARCHAR(64) NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  step INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(64) NOT NULL,
  time VARCHAR(64) NOT NULL,
  actor VARCHAR(255) NOT NULL,
  notes TEXT,
  completed BOOLEAN DEFAULT TRUE,
  current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PICKUP REQUESTS TABLE
CREATE TABLE pickup_requests (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  requester_name VARCHAR(255) NOT NULL,
  requester_phone VARCHAR(64) NOT NULL,
  waste_type VARCHAR(64) NOT NULL CHECK (waste_type IN (
    'Wet',
    'Dry',
    'Recyclable',
    'E-Waste',
    'Bulk Waste',
    'Other'
  )),
  estimated_quantity VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  area VARCHAR(255) NOT NULL,
  zone VARCHAR(64) DEFAULT 'Zone 3',
  preferred_date DATE NOT NULL,
  preferred_time VARCHAR(64) NOT NULL,
  photo_url TEXT,
  status VARCHAR(64) NOT NULL DEFAULT 'Pickup Requested' CHECK (status IN (
    'Pickup Requested',
    'Assigned',
    'Scheduled',
    'In Progress',
    'Completed',
    'Cancelled'
  )),
  priority VARCHAR(32) NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
  assigned_crew VARCHAR(255) DEFAULT 'Central Dispatch Routing',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PREDICTIVE HOTSPOTS TABLE
CREATE TABLE hotspots (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  area VARCHAR(255) NOT NULL,
  risk VARCHAR(32) NOT NULL CHECK (risk IN ('HIGH', 'MEDIUM', 'LOW')),
  risk_score INT NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  complaints_count INT NOT NULL DEFAULT 0,
  trend VARCHAR(32) NOT NULL,
  trend_direction VARCHAR(16) NOT NULL CHECK (trend_direction IN ('up', 'down', 'neutral')),
  primary_issue VARCHAR(255) NOT NULL,
  secondary_issue VARCHAR(255),
  coord_x INT DEFAULT 50,
  coord_y INT DEFAULT 50,
  peak_hours VARCHAR(128),
  ai_recommendation TEXT,
  deep_analysis JSONB DEFAULT '{}'::jsonb,
  is_prototype BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. HOTSPOT COMPLAINT LINKAGE
CREATE TABLE hotspot_complaints (
  id SERIAL PRIMARY KEY,
  hotspot_id VARCHAR(64) NOT NULL REFERENCES hotspots(id) ON DELETE CASCADE,
  complaint_id VARCHAR(64) NOT NULL REFERENCES complaints(id) ON DELETE CASCADE
);

-- 8. RESOLUTION VERIFICATIONS TABLE
CREATE TABLE resolution_verifications (
  id SERIAL PRIMARY KEY,
  complaint_id VARCHAR(64) NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  score INT NOT NULL CHECK (score >= 0 AND score <= 100),
  summary TEXT,
  status VARCHAR(64) NOT NULL DEFAULT 'Pending Admin Approval' CHECK (status IN (
    'Pending Admin Approval',
    'Approved',
    'Recheck Requested',
    'Rejected'
  )),
  submitted_by_team VARCHAR(255),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_by VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  notes TEXT,
  is_prototype BOOLEAN DEFAULT TRUE
);

-- 9. ECO SCORES TABLE
CREATE TABLE eco_scores (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(64) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total INT NOT NULL DEFAULT 50 CHECK (total >= 0 AND total <= 100),
  max INT NOT NULL DEFAULT 100,
  level VARCHAR(64) NOT NULL DEFAULT 'Eco Starter (Tier I)',
  monthly_improvement VARCHAR(32) DEFAULT '+0%',
  breakdown JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. ECO ACTIVITIES TABLE
CREATE TABLE eco_activities (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(64) NOT NULL,
  points INT NOT NULL,
  description TEXT NOT NULL,
  reference_id VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. AWARENESS CONTENT TABLE
CREATE TABLE awareness_content (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL,
  color VARCHAR(32),
  bin_color VARCHAR(64),
  examples JSONB DEFAULT '[]'::jsonb,
  disposal_guide TEXT,
  environmental_impact TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. NOTIFICATIONS TABLE
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(32) NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'alert')),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  link VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES for High-Performance Queries
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_area ON complaints(area);
CREATE INDEX idx_complaints_priority ON complaints(priority);
CREATE INDEX idx_complaints_user ON complaints(user_id);
CREATE INDEX idx_pickups_status ON pickup_requests(status);
CREATE INDEX idx_pickups_area ON pickup_requests(area);
CREATE INDEX idx_hotspots_risk ON hotspots(risk);
CREATE INDEX idx_eco_activities_user ON eco_activities(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
