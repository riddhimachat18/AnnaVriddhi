-- Farm Revenue Copilot — PostgreSQL schema
-- Run once against your DB: psql -d farm_revenue_copilot -f schema.sql

-- ── Farmers ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS farmers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  phone         TEXT UNIQUE NOT NULL,
  state         TEXT NOT NULL,
  district      TEXT,
  land_area_ac  NUMERIC(8,2),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Crops ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS crops (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id     UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  crop_type     TEXT NOT NULL,           -- e.g. "wheat", "rice", "cotton"
  variety       TEXT,
  sow_date      DATE NOT NULL,
  expected_harvest_date DATE,
  area_ac       NUMERIC(8,2),
  status        TEXT NOT NULL DEFAULT 'active',  -- active | harvested | failed
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Crop-state snapshots (computed by scheduled job) ──────────────────
CREATE TABLE IF NOT EXISTS crop_state_snapshots (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_id       UUID NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
  score         SMALLINT CHECK (score BETWEEN 0 AND 100),
  soil_moisture_pct  NUMERIC(5,2),
  leaf_color_score   NUMERIC(5,2),
  pest_pressure_score NUMERIC(5,2),
  growth_stage_pct   NUMERIC(5,2),
  computed_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Grading events ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS grading_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_id       UUID NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
  grade         TEXT NOT NULL,           -- A1, A2, B1, B2, C …
  score         SMALLINT,
  image_url     TEXT,
  breakdown     JSONB,                   -- { color, size, moisture, pestDamage }
  estimated_market_price NUMERIC(10,2),
  currency      TEXT DEFAULT 'INR',
  unit          TEXT DEFAULT 'quintal',
  notes         TEXT,
  graded_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── Recommendation event log ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS recommendation_events (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_id          UUID NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
  type             TEXT NOT NULL,       -- irrigation | fertilizer | pesticide | harvest | scheme
  priority         TEXT NOT NULL,       -- high | medium | low
  title            TEXT NOT NULL,
  body             TEXT,
  status           TEXT NOT NULL DEFAULT 'pending',  -- pending | acknowledged | dismissed | acted
  action_taken     TEXT,
  action_notes     TEXT,
  acknowledged_at  TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── Irrigation logs ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS irrigation_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_id     UUID NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  amount_mm   NUMERIC(6,2),
  method      TEXT,                     -- drip | sprinkler | flood | manual
  logged_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Schemes ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS schemes (
  id               TEXT PRIMARY KEY,
  name             TEXT NOT NULL,
  provider         TEXT,
  type             TEXT,                -- income_support | crop_insurance | loan | subsidy
  benefit          TEXT,
  eligibility      JSONB,
  states_eligible  TEXT[],
  crops_eligible   TEXT[],
  apply_url        TEXT,
  deadline         DATE
);

-- ── Indexes ───────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_crops_farmer      ON crops (farmer_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_crop    ON crop_state_snapshots (crop_id);
CREATE INDEX IF NOT EXISTS idx_rec_events_crop   ON recommendation_events (crop_id);
CREATE INDEX IF NOT EXISTS idx_grading_crop      ON grading_events (crop_id);
CREATE INDEX IF NOT EXISTS idx_irrigation_crop   ON irrigation_logs (crop_id);
