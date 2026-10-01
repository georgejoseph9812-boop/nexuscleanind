-- ============================================================================
-- Migration: 002_create_sorting_items.sql
-- Description: Interactive Waste Sorting Game & Quiz Questions Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS sorting_items (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL,
  icon VARCHAR(64),
  image TEXT,
  fact TEXT NOT NULL,
  accepted_in JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sorting_items_cat ON sorting_items(category);
