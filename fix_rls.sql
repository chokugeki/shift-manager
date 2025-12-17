-- FORCE ENABLE RLS AND RESET POLICIES
-- Run this in Supabase Dashboard > SQL Editor to fix the visibility issue.

-- 1. Staff Table
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own staff" ON staff;
DROP POLICY IF EXISTS "Users can insert their own staff" ON staff;
DROP POLICY IF EXISTS "Users can update their own staff" ON staff;
DROP POLICY IF EXISTS "Users can delete their own staff" ON staff;
-- Drop potential permissive policies if any (common names)
DROP POLICY IF EXISTS "Enable read access for all users" ON staff;
DROP POLICY IF EXISTS "Enable insert for all users" ON staff;
DROP POLICY IF EXISTS "Enable update for all users" ON staff;
DROP POLICY IF EXISTS "Enable delete for all users" ON staff;

CREATE POLICY "Users can view their own staff" ON staff FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own staff" ON staff FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own staff" ON staff FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own staff" ON staff FOR DELETE USING (auth.uid() = user_id);

-- 2. Task Types Table
ALTER TABLE task_types ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own task_types" ON task_types;
DROP POLICY IF EXISTS "Users can insert their own task_types" ON task_types;
DROP POLICY IF EXISTS "Users can update their own task_types" ON task_types;
DROP POLICY IF EXISTS "Users can delete their own task_types" ON task_types;

CREATE POLICY "Users can view their own task_types" ON task_types FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own task_types" ON task_types FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own task_types" ON task_types FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own task_types" ON task_types FOR DELETE USING (auth.uid() = user_id);

-- 3. Shifts Table
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own shifts" ON shifts;
DROP POLICY IF EXISTS "Users can insert their own shifts" ON shifts;
DROP POLICY IF EXISTS "Users can update their own shifts" ON shifts;
DROP POLICY IF EXISTS "Users can delete their own shifts" ON shifts;

CREATE POLICY "Users can view their own shifts" ON shifts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own shifts" ON shifts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own shifts" ON shifts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own shifts" ON shifts FOR DELETE USING (auth.uid() = user_id);

-- 4. Assignments Table
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own assignments" ON assignments;
DROP POLICY IF EXISTS "Users can insert their own assignments" ON assignments;
DROP POLICY IF EXISTS "Users can update their own assignments" ON assignments;
DROP POLICY IF EXISTS "Users can delete their own assignments" ON assignments;

CREATE POLICY "Users can view their own assignments" ON assignments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own assignments" ON assignments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own assignments" ON assignments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own assignments" ON assignments FOR DELETE USING (auth.uid() = user_id);

-- 5. Requests Table
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own requests" ON requests;
DROP POLICY IF EXISTS "Users can insert their own requests" ON requests;
DROP POLICY IF EXISTS "Users can update their own requests" ON requests;
DROP POLICY IF EXISTS "Users can delete their own requests" ON requests;

CREATE POLICY "Users can view their own requests" ON requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own requests" ON requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own requests" ON requests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own requests" ON requests FOR DELETE USING (auth.uid() = user_id);
