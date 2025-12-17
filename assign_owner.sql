-- ASSIGN ORPHANED DATA TO A USER
-- Replace 'YOUR_UUID_HERE' with the User UUID of the account that should own this data.
-- You can find the UUID in Supabase Dashboard > Authentication > Users.

-- Example: UPDATE staff SET user_id = 'abc-123-def-456' WHERE user_id IS NULL;

-- 1. Staff
UPDATE staff SET user_id = 'YOUR_UUID_HERE' WHERE user_id IS NULL;

-- 2. Task Types
UPDATE task_types SET user_id = 'YOUR_UUID_HERE' WHERE user_id IS NULL;

-- 3. Shifts
UPDATE shifts SET user_id = 'YOUR_UUID_HERE' WHERE user_id IS NULL;

-- 4. Assignments
UPDATE assignments SET user_id = 'YOUR_UUID_HERE' WHERE user_id IS NULL;

-- 5. Requests
UPDATE requests SET user_id = 'YOUR_UUID_HERE' WHERE user_id IS NULL;
