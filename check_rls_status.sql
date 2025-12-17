-- DIAGNOSTIC SCRIPT
-- Run this in Supabase Dashboard > SQL Editor to check the actual security state.

-- 1. Check if RLS is enabled (rowsecurity should be true)
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('staff', 'shifts', 'assignments', 'task_types', 'requests');

-- 2. List all active policies
SELECT tablename, policyname, cmd, roles, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- 3. Simulation Test
-- Switch to the role used by logged-in users
SET ROLE authenticated;

-- Try to count staff (Should be 0 if RLS is working and no user_id is set for the current context)
-- Note: In SQL Editor, auth.uid() is usually NULL, so strict policies should return 0 rows.
SELECT 'Visible Staff Count (as authenticated role)' as result_label, count(*) as visible_count FROM staff;

-- Reset to admin
RESET ROLE;
