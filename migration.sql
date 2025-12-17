-- Enable Row Level Security (RLS) and add user_id column to tables
-- Run this in Supabase Dashboard > SQL Editor

-- 1. Staff Table
ALTER TABLE staff ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own staff" ON staff FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own staff" ON staff FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own staff" ON staff FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own staff" ON staff FOR DELETE USING (auth.uid() = user_id);

-- 2. Task Types Table
ALTER TABLE task_types ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE task_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own task_types" ON task_types FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own task_types" ON task_types FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own task_types" ON task_types FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own task_types" ON task_types FOR DELETE USING (auth.uid() = user_id);

-- 3. Shifts Table
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own shifts" ON shifts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own shifts" ON shifts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own shifts" ON shifts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own shifts" ON shifts FOR DELETE USING (auth.uid() = user_id);

-- 4. Assignments Table
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own assignments" ON assignments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own assignments" ON assignments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own assignments" ON assignments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own assignments" ON assignments FOR DELETE USING (auth.uid() = user_id);

-- 5. Requests Table
ALTER TABLE requests ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own requests" ON requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own requests" ON requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own requests" ON requests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own requests" ON requests FOR DELETE USING (auth.uid() = user_id);

-- Allow authenticated users to insert/select/update/delete based on policies
GRANT ALL ON staff TO authenticated;
GRANT ALL ON task_types TO authenticated;
GRANT ALL ON shifts TO authenticated;
GRANT ALL ON assignments TO authenticated;
GRANT ALL ON requests TO authenticated;
