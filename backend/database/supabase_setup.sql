-- ============================================================================
-- Nexus Clean — Complete Supabase PostgreSQL Production Setup Script
-- Run this script in the Supabase Dashboard -> SQL Editor
-- "Don't Just Report Waste. Predict It."
-- ============================================================================

-- 1. DROP EXISTING OBJECTS (FOR CLEAN INSTALL / RESET)
DROP TABLE IF EXISTS sorting_items CASCADE;
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
DROP TABLE IF EXISTS schema_migrations CASCADE;

-- 2. CREATE SCHEMA_MIGRATIONS
CREATE TABLE schema_migrations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. USERS TABLE
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

-- 4. COMPLAINTS TABLE
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

-- 5. COMPLAINT IMAGES TABLE
CREATE TABLE complaint_images (
  id SERIAL PRIMARY KEY,
  complaint_id VARCHAR(64) NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_type VARCHAR(32) NOT NULL CHECK (image_type IN ('before', 'after', 'verification', 'attachment')),
  uploaded_by VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. COMPLAINT STATUS HISTORY (Lifecycle Timeline Steps)
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

-- 7. PICKUP REQUESTS TABLE
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

-- 8. PREDICTIVE HOTSPOTS TABLE
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

-- 9. HOTSPOT COMPLAINT LINKAGE
CREATE TABLE hotspot_complaints (
  id SERIAL PRIMARY KEY,
  hotspot_id VARCHAR(64) NOT NULL REFERENCES hotspots(id) ON DELETE CASCADE,
  complaint_id VARCHAR(64) NOT NULL REFERENCES complaints(id) ON DELETE CASCADE
);

-- 10. RESOLUTION VERIFICATIONS TABLE
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

-- 11. ECO SCORES TABLE
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

-- 12. ECO ACTIVITIES TABLE
CREATE TABLE eco_activities (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(64) NOT NULL,
  points INT NOT NULL,
  description TEXT NOT NULL,
  reference_id VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. AWARENESS CONTENT TABLE
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

-- 14. SORTING ITEMS TABLE (Interactive Sorting Game)
CREATE TABLE sorting_items (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL,
  icon VARCHAR(64),
  image TEXT,
  fact TEXT NOT NULL,
  accepted_in JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. NOTIFICATIONS TABLE
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

-- INDEXES
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_area ON complaints(area);
CREATE INDEX idx_complaints_priority ON complaints(priority);
CREATE INDEX idx_complaints_user ON complaints(user_id);
CREATE INDEX idx_pickups_status ON pickup_requests(status);
CREATE INDEX idx_pickups_area ON pickup_requests(area);
CREATE INDEX idx_hotspots_risk ON hotspots(risk);
CREATE INDEX idx_eco_activities_user ON eco_activities(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_sorting_items_cat ON sorting_items(category);

-- TRIGGER FUNCTION FOR AUTO UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_complaints_updated_at BEFORE UPDATE ON complaints FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_pickups_updated_at BEFORE UPDATE ON pickup_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_hotspots_updated_at BEFORE UPDATE ON hotspots FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_eco_scores_updated_at BEFORE UPDATE ON eco_scores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_service_role_all" ON users FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "users_read_own" ON users FOR SELECT TO authenticated USING (auth.uid()::text = id);

ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "complaints_service_role_all" ON complaints FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "complaints_public_read" ON complaints FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "complaints_insert" ON complaints FOR INSERT TO authenticated WITH CHECK (true);

ALTER TABLE pickup_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pickups_service_role_all" ON pickup_requests FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "pickups_read_own" ON pickup_requests FOR SELECT TO authenticated USING (auth.uid()::text = user_id);
CREATE POLICY "pickups_insert" ON pickup_requests FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id);

ALTER TABLE hotspots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hotspots_service_role_all" ON hotspots FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "hotspots_public_read" ON hotspots FOR SELECT TO authenticated, anon USING (true);

ALTER TABLE eco_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "eco_scores_service_role_all" ON eco_scores FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "eco_scores_read_own" ON eco_scores FOR SELECT TO authenticated USING (auth.uid()::text = user_id);

ALTER TABLE awareness_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "awareness_public_read" ON awareness_content FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "awareness_service_role_all" ON awareness_content FOR ALL TO service_role USING (true) WITH CHECK (true);

ALTER TABLE sorting_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sorting_public_read" ON sorting_items FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "sorting_service_role_all" ON sorting_items FOR ALL TO service_role USING (true) WITH CHECK (true);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifs_service_role_all" ON notifications FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "notifs_read_own" ON notifications FOR SELECT TO authenticated USING (auth.uid()::text = user_id);

-- RECORD COMPLETED MIGRATIONS
INSERT INTO schema_migrations (name) VALUES
('001_create_schema.sql'),
('002_create_sorting_items.sql'),
('003_supabase_rls_and_triggers.sql')
ON CONFLICT (name) DO NOTHING;

-- SEED VERIFIED BASELINE DATA
INSERT INTO users (id, name, email, password_hash, role, location, area, phone, avatar, title, department, jurisdiction)
VALUES 
('USR-CITIZEN-01', 'Aarav Sharma', 'citizen@nexusclean.org', '$2a$10$wN9iM1f0xYh3q890aJbvcuY7fFzHk3L1PZ5F9P2Ym3T5yV7qI2H3u', 'citizen', 'Civil Lines, Kanpur', 'Civil Lines', '+91 98765 43210', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', 'Civic Ambassador', 'Community Action', 'Zone 3'),
('USR-ADMIN-01', 'Officer Sunita Verma', 'admin@nexusclean.org', '$2a$10$wN9iM1f0xYh3q890aJbvcuY7fFzHk3L1PZ5F9P2Ym3T5yV7qI2H3u', 'admin', 'Municipal HQ, Kanpur', 'Civil Lines', '+91 94150 11223', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80', 'Chief Sanitation & Operations Director', 'Municipal Smart Waste Directorate', 'Zone 3 & Central Corridor'),
('USR-COLLECTOR-01', 'Ramesh Yadav', 'collector@nexusclean.org', '$2a$10$wN9iM1f0xYh3q890aJbvcuY7fFzHk3L1PZ5F9P2Ym3T5yV7qI2H3u', 'collector', 'Dispatch Depot 4', 'Zone 3', '+91 98390 99887', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', 'Field Operations Lead', 'Rapid Response Unit #04', 'Zone 3')
ON CONFLICT (id) DO NOTHING;

INSERT INTO eco_scores (user_id, total, max, level, monthly_improvement, breakdown, achievements)
VALUES (
  'USR-CITIZEN-01', 78, 100, 'Eco Guardian (Tier II)', '+18%',
  '[{"category": "Waste Reporting", "points": 20, "max": 25}, {"category": "Proper Segregation", "points": 25, "max": 30}, {"category": "Community Participation", "points": 18, "max": 25}, {"category": "Awareness Activities", "points": 15, "max": 20}]'::jsonb,
  '[{"id": "ach-1", "title": "First Reporter", "description": "Logged your first verified municipal waste issue", "icon": "Flag", "unlocked": true, "date": "May 2025"}]'::jsonb
) ON CONFLICT (user_id) DO NOTHING;

INSERT INTO awareness_content (id, title, category, color, bin_color, examples, disposal_guide, environmental_impact)
VALUES 
('aw-wet', 'Organic & Kitchen Waste', 'Wet Waste', 'emerald', 'Green Bin', '["Leftover cooked food", "Vegetable peels & seeds", "Fruit remains", "Coffee grounds & tea bags"]'::jsonb, 'Segregate daily without plastic liners. Deposit in green municipal composting bin.', 'Converted to nutrient-dense compost and clean bio-CNG fuel.'),
('aw-dry', 'Dry Recyclables & Paper', 'Dry Waste', 'blue', 'Blue Bin', '["Newspapers & office paper", "Cardboard boxes", "Dry plastics", "Clean glass bottles"]'::jsonb, 'Keep clean, uncontaminated, and dry. Flatten cardboard to save collection volume.', 'Re-entered into the circular economy, saving trees and water.'),
('aw-hazardous', 'Household Hazardous & Medical Waste', 'Hazardous', 'rose', 'Red Bin / Sealed', '["Batteries & button cells", "Paint solvents", "Pesticide cans", "Expired medicines"]'::jsonb, 'Keep tightly sealed in heavy-duty containment bags marked HAZARD.', 'Safe processing prevents heavy metal groundwater contamination.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sorting_items (id, name, category, icon, image, fact, accepted_in)
VALUES 
('item-1', 'Plastic Water Bottle', 'Recyclable', 'Milk', 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=400&q=80', 'PET bottles can take up to 450 years to decompose. Empty and crush before recycling!', '["Recyclable", "Dry"]'::jsonb),
('item-2', 'Banana Peel', 'Wet', 'Apple', 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=400&q=80', 'Banana peels decompose in 2-5 weeks and enrich soil with potassium and nitrogen.', '["Wet"]'::jsonb),
('item-3', 'Lithium AA Battery', 'Hazardous', 'BatteryCharging', 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=400&q=80', 'Batteries contain cadmium, lead, and acid that pollute soil if dumped in landfills.', '["Hazardous", "E-Waste"]'::jsonb),
('item-4', 'Corrugated Cardboard Box', 'Dry', 'Package', 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80', 'Flattening cardboard boxes reduces collection vehicle volume by 70%.', '["Dry", "Recyclable"]'::jsonb)
ON CONFLICT (id) DO NOTHING;
