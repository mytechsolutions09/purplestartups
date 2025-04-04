import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';

const AdminDebugPage: React.FC = () => {
  const { user, isAdmin, refreshUserRole } = useAuth();
  const [roleData, setRoleData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sqlQuery, setSqlQuery] = useState<string>(`
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
`);

  const checkRole = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      setRoleData(data);
    } catch (err: any) {
      console.error('Error checking role:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // First check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        // Error other than "not found"
        throw checkError;
      }
      
      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ role: 'admin' })
          .eq('user_id', user.id);
        
        if (updateError) throw updateError;
        setSuccess("Profile already exists. Updated role to admin.");
      } else {
        // Create new profile
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert([{ 
            user_id: user.id,
            email: user.email,
            role: 'admin',
            created_at: new Date().toISOString()
          }]);
        
        if (insertError) throw insertError;
        setSuccess("Created new user profile with admin role");
      }
      
      // Refresh role in auth context
      await refreshUserRole();
      await checkRole();
    } catch (err: any) {
      console.error('Error creating/updating profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fixRoleSchema = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (!user) {
        throw new Error("You must be logged in to perform this action");
      }
      
      // First check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        // Error other than "not found"
        throw checkError;
      }
      
      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ role: 'admin' })
          .eq('user_id', user.id);
        
        if (updateError) throw updateError;
      } else {
        // Create new profile
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert([{ 
            user_id: user.id,
            email: user.email,
            role: 'admin', 
            created_at: new Date().toISOString()
          }]);
        
        if (insertError) throw insertError;
      }
      
      setSuccess("User profile created or updated with admin role successfully!");
      
      // Refresh role in auth context
      await refreshUserRole();
      await checkRole();
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Debug Panel</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        {user ? (
          <div className="space-y-2">
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Admin Status:</strong> {isAdmin ? '✅ Admin' : '❌ Not Admin'}</p>
          </div>
        ) : (
          <p className="text-red-600">Not logged in</p>
        )}
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Profile Data</h2>
        <button 
          onClick={checkRole}
          disabled={loading || !user}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 mb-4"
        >
          {loading ? 'Checking...' : 'Check Role Data'}
        </button>
        
        {roleData ? (
          <div className="mt-4 p-4 bg-gray-100 rounded overflow-auto">
            <pre>{JSON.stringify(roleData, null, 2)}</pre>
          </div>
        ) : (
          <p>No role data fetched yet</p>
        )}
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Fix Actions</h2>
        
        <div className="space-y-4">
          <button 
            onClick={createUserProfile}
            disabled={loading || !user}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Create/Update Admin Profile'}
          </button>
          
          <button 
            onClick={fixRoleSchema}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Fix Role Schema Tables'}
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {success && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
            <strong>Success:</strong> {success}
          </div>
        )}
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Manual Database Setup</h2>
        <p className="mb-4">If you're getting table creation errors, run this SQL in your Supabase dashboard:</p>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-4 overflow-auto">
          <pre className="whitespace-pre-wrap">{sqlQuery}</pre>
        </div>
        
        <button
          onClick={() => {
            navigator.clipboard.writeText(sqlQuery);
            alert('SQL copied to clipboard!');
          }}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
        >
          Copy SQL
        </button>
        
        <p className="mt-4 text-sm text-gray-600">
          1. Go to your Supabase dashboard<br/>
          2. Navigate to "SQL Editor"<br/>
          3. Paste this SQL and run it<br/>
          4. Return here and click "Create/Update Admin Profile"
        </p>
      </div>
    </div>
  );
};

export default AdminDebugPage; 