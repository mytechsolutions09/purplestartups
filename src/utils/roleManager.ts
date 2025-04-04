import { supabase } from './supabaseClient';

export interface UserRole {
  user_id: string;
  role: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Assign a role to a user
 */
export const assignRole = async (userId: string, role: string): Promise<{ success: boolean; error: any }> => {
  try {
    // Check if user profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('user_id, role')
      .eq('user_id', userId)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }
    
    let result;
    
    if (existingProfile) {
      // Update existing profile
      result = await supabase
        .from('user_profiles')
        .update({ role, updated_at: new Date() })
        .eq('user_id', userId);
    } else {
      // Create new profile
      result = await supabase
        .from('user_profiles')
        .insert([
          { 
            user_id: userId, 
            role,
            created_at: new Date(),
            updated_at: new Date()
          }
        ]);
    }
    
    if (result.error) throw result.error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error assigning role:', error);
    return { success: false, error };
  }
};

/**
 * Get user's current role
 */
export const getUserRole = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    
    return data?.role || null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

/**
 * Get all users with their roles
 */
export const getAllUserRoles = async (): Promise<UserRole[]> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('user_id, role, created_at, updated_at');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error getting all user roles:', error);
    return [];
  }
}; 