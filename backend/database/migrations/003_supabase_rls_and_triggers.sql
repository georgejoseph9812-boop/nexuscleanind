-- ============================================================================
-- Migration: 003_supabase_rls_and_triggers.sql
-- Description: Supabase Row Level Security (RLS) Policies and Automated Triggers
-- ============================================================================

-- 1. AUTOMATED UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to core tables
DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_complaints_updated_at ON complaints;
CREATE TRIGGER trigger_complaints_updated_at
  BEFORE UPDATE ON complaints
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_pickups_updated_at ON pickup_requests;
CREATE TRIGGER trigger_pickups_updated_at
  BEFORE UPDATE ON pickup_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_hotspots_updated_at ON hotspots;
CREATE TRIGGER trigger_hotspots_updated_at
  BEFORE UPDATE ON hotspots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_eco_scores_updated_at ON eco_scores;
CREATE TRIGGER trigger_eco_scores_updated_at
  BEFORE UPDATE ON eco_scores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 2. SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- Note: The Nexus Clean Express backend acts as the authoritative API gateway,
-- connecting via DATABASE_URL or the Supabase Service Role Key.
-- Service role inherently bypasses RLS for administrative and server logic.
-- The following policies secure direct client/anon queries and restrict perimeter access.

-- Table: users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role full access on users"
  ON users FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can read own record"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id);

-- Table: complaints
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role full access on complaints"
  ON complaints FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read on verified complaints"
  ON complaints FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Allow authenticated citizens to insert complaints"
  ON complaints FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Table: complaint_status_history
ALTER TABLE complaint_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role full access on complaint_status_history"
  ON complaint_status_history FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow read access to complaint timeline"
  ON complaint_status_history FOR SELECT
  TO authenticated, anon
  USING (true);

-- Table: complaint_images
ALTER TABLE complaint_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role full access on complaint_images"
  ON complaint_images FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow read access to complaint images"
  ON complaint_images FOR SELECT
  TO authenticated, anon
  USING (true);

-- Table: pickup_requests
ALTER TABLE pickup_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role full access on pickup_requests"
  ON pickup_requests FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Citizens can view own pickup requests"
  ON pickup_requests FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Citizens can insert pickup requests"
  ON pickup_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

-- Table: hotspots
ALTER TABLE hotspots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role full access on hotspots"
  ON hotspots FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated and anon to read predictive hotspots"
  ON hotspots FOR SELECT
  TO authenticated, anon
  USING (true);

-- Table: eco_scores
ALTER TABLE eco_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role full access on eco_scores"
  ON eco_scores FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Citizens can view own eco score"
  ON eco_scores FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Table: eco_activities
ALTER TABLE eco_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role full access on eco_activities"
  ON eco_activities FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Citizens can view own eco activities"
  ON eco_activities FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Table: awareness_content (Public Civic Guide)
ALTER TABLE awareness_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on awareness content"
  ON awareness_content FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Allow service_role full access on awareness_content"
  ON awareness_content FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Table: sorting_items (Public Waste Sorting Game)
ALTER TABLE sorting_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on sorting items"
  ON sorting_items FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Allow service_role full access on sorting_items"
  ON sorting_items FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Table: notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role full access on notifications"
  ON notifications FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);
