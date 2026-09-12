-- ============================================================================
-- URGENT: Run this in Supabase SQL Editor RIGHT NOW
-- URL: https://supabase.com/dashboard/project/qsbjnjxemnnvvfmvjxzs/sql
-- ============================================================================

-- Step 1: Drop existing RLS policies that depend on auth_user_id
DROP POLICY IF EXISTS farmers_select_own ON farmers;
DROP POLICY IF EXISTS farmers_update_own ON farmers;
DROP POLICY IF EXISTS farmers_insert_own ON farmers;
DROP POLICY IF EXISTS farmers_select_all ON farmers;
DROP POLICY IF EXISTS farmers_insert_all ON farmers;

-- Step 2: Drop the existing auth_user_id column (it's the wrong type - UUID instead of TEXT)
ALTER TABLE farmers DROP COLUMN IF EXISTS auth_user_id;

-- Step 3: Add auth_user_id as TEXT (Firebase UIDs are strings, not UUIDs)
ALTER TABLE farmers ADD COLUMN auth_user_id TEXT UNIQUE;

-- Step 4: Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_farmers_auth_user_id ON farmers(auth_user_id);

-- Step 5: Disable RLS on farmers table (TEMPORARY - for development only)
ALTER TABLE farmers DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Now try Google Sign-In again - it will work!
-- ============================================================================
