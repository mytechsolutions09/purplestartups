import { createClient } from '@supabase/supabase-js';

// Get environment variables from .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
}

// Create Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 