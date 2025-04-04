import { supabase } from './supabaseClient';

/**
 * Set up the database schema for role-based access control
 */
export async function setupRoleSchema() {
  try {
    // First try to create the table if it doesn't exist
    const { error } = await supabase.rpc('create_user_profiles_if_not_exists');
    
    if (error) {
      console.error('Error creating user_profiles table:', error);
      throw error;
    }
    
    console.log('Role schema setup successful');
    return { success: true };
  } catch (error) {
    console.error('Error setting up role schema:', error);
    return { success: false, error };
  }
}

export const setupRoleSchemaOld = async (): Promise<{ success: boolean; error: any }> => {
  try {
    // Create user_profiles table directly using a SQL query instead of the function
    const { error: userProfilesError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS public.user_profiles (
          user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          full_name TEXT,
          email TEXT,
          role TEXT NOT NULL DEFAULT 'user',
          avatar_url TEXT,
          subscription_status TEXT DEFAULT 'free',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (userProfilesError) throw userProfilesError;
    
    // Create site_settings table directly using a SQL query
    const { error: settingsError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS public.site_settings (
          id SERIAL PRIMARY KEY,
          site_name TEXT DEFAULT 'Startup Guru',
          site_description TEXT DEFAULT 'AI-powered startup idea generation and roadmap planning',
          logo_url TEXT,
          contact_email TEXT DEFAULT 'contact@example.com',
          support_email TEXT DEFAULT 'support@example.com',
          enable_signup BOOLEAN DEFAULT TRUE,
          maintenance_mode BOOLEAN DEFAULT FALSE,
          enable_payments BOOLEAN DEFAULT TRUE,
          max_file_size INTEGER DEFAULT 5,
          default_user_quota INTEGER DEFAULT 3,
          custom_css TEXT,
          meta_keywords TEXT DEFAULT 'startup, AI, business plan, entrepreneur',
          api_rate_limit INTEGER DEFAULT 100,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (settingsError) throw settingsError;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error setting up role schema:', error);
    return { success: false, error };
  }
}; 