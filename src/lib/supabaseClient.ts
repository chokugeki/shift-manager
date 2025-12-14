
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are missing. Please check .env.local');
}

// Protocol Check
if (!supabaseUrl.startsWith('https://')) {
    throw new Error('Supabase URL must start with "https://". Please check .env.local');
}

// Validation: Check if the user accidentally used the Dashboard URL
try {
    const urlObj = new URL(supabaseUrl);
    if (urlObj.hostname === 'supabase.com') {
        throw new Error('It looks like you used the Dashboard URL. Please use the "Project URL" found in Settings > API (format: https://[id].supabase.co).');
    }
} catch (e) {
    if (e instanceof Error && e.message.includes('Dashboard URL')) {
        throw e;
    }
    // Ignore other URL parsing errors to allow for internal/localhost URLs if needed, 
    // but basic format error will likely be caught by createClient anyway.
}


export const supabase = createClient(supabaseUrl, supabaseAnonKey);
