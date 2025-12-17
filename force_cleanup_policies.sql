-- NUCLEAR CLEANUP SCRIPT
-- This script will:
-- 1. Force enable RLS on all tables.
-- 2. Find AND DROP ALL existing policies (regardless of name) for these tables.
-- 3. Re-create the single, strict "Owner Only" policy.

DO $$
DECLARE
    r RECORD;
BEGIN
    -- 1. Enable RLS enforced
    EXECUTE 'ALTER TABLE staff ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE task_types ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE shifts ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE assignments ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE requests ENABLE ROW LEVEL SECURITY';

    -- 2. Drop ALL existing policies for these tables (Dynamic Cleanup)
    FOR r IN 
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE tablename IN ('staff', 'task_types', 'shifts', 'assignments', 'requests')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
        RAISE NOTICE 'Dropped policy: % on table %', r.policyname, r.tablename;
    END LOOP;
END $$;

-- 3. Re-create STRICT policies
CREATE POLICY "strict_isolation_staff" ON staff USING (auth.uid() = user_id);
CREATE POLICY "strict_isolation_task_types" ON task_types USING (auth.uid() = user_id);
CREATE POLICY "strict_isolation_shifts" ON shifts USING (auth.uid() = user_id);
CREATE POLICY "strict_isolation_assignments" ON assignments USING (auth.uid() = user_id);
CREATE POLICY "strict_isolation_requests" ON requests USING (auth.uid() = user_id);

-- 4. Grant access (RLS will filter the rows)
GRANT ALL ON staff TO authenticated, anon;
GRANT ALL ON task_types TO authenticated, anon;
GRANT ALL ON shifts TO authenticated, anon;
GRANT ALL ON assignments TO authenticated, anon;
GRANT ALL ON requests TO authenticated, anon;
