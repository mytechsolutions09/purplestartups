import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { Loader, CheckCircle, AlertTriangle, User } from 'lucide-react';

const AdminSetupPage: React.FC = () => {
  const { user, refreshUserRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user profile:', error);
        }
        
        setUserProfile(data);
      } catch (err) {
        console.error('Error checking user profile:', err);
      }
    };
    
    checkUserProfile();
  }, [user]);

  const assignAdminRole = async () => {
    if (!user) return;
    
    setLoading(true);
    setStatus('loading');
    
    try {
      let result;
      
      if (userProfile) {
        // Update existing profile
        result = await supabase
          .from('user_profiles')
          .update({ 
            role: 'admin',
            updated_at: new Date()
          })
          .eq('user_id', user.id);
      } else {
        // Create new profile
        result = await supabase
          .from('user_profiles')
          .insert([{
            user_id: user.id,
            email: user.email,
            role: 'admin',
            created_at: new Date(),
            updated_at: new Date()
          }]);
      }
      
      if (result.error) throw result.error;
      
      setStatus('success');
      setMessage('Admin role assigned successfully! You can now access the admin panel.');
      
      // Refresh page to update auth context with new role
      setTimeout(() => {
        window.location.href = '/admin';
      }, 2000);
      
    } catch (error: any) {
      console.error('Error assigning admin role:', error);
      setStatus('error');
      setMessage(`Failed to assign admin role: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createTables = async () => {
    setLoading(true);
    setStatus('loading');
    setMessage('Creating necessary database tables...');
    
    try {
      // This SQL will create the SQL function needed for table creation if it doesn't exist
      const createFunctionSql = `
        CREATE OR REPLACE FUNCTION create_table_if_not_exists(
          table_name text,
          column_definitions text
        ) RETURNS void AS $$
        BEGIN
          IF NOT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = create_table_if_not_exists.table_name
          ) THEN
            EXECUTE 'CREATE TABLE public.' || quote_ident(table_name) || ' (' || column_definitions || ')';
          END IF;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `;
      
      // Run it directly as superuser in Supabase Dashboard SQL Editor instead
      // const { error: functionError } = await supabase.rpc('create_function_if_not_exists', { 
      //   function_sql: createFunctionSql 
      // });
      
      // if (functionError) throw functionError;
      
      // Then create the tables using our utility
      const { success, error } = await import('../utils/roleSchema').then(
        module => module.setupRoleSchema()
      );
      
      if (!success) throw error;
      
      setStatus('success');
      setMessage('Database tables created successfully! Click "Assign Admin Role" to continue.');
      
    } catch (error: any) {
      console.error('Error creating tables:', error);
      setStatus('error');
      setMessage(`Failed to create tables: ${error.message}. You may need to run the SQL function manually through the Supabase dashboard.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
      <div className="max-w-3xl mx-auto w-full px-4 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Setup</h1>
            
            {!user ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      You need to be logged in to access this page.{' '}
                      <a href="/login" className="font-medium underline text-yellow-700 hover:text-yellow-600">
                        Log in
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <User className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Logged in as: <span className="font-semibold">{user.email}</span>
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        Current role: <span className="font-semibold">{userProfile?.role || 'Not set'}</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <button
                    onClick={createTables}
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {loading && status === 'loading' ? (
                      <><Loader className="animate-spin h-5 w-5 mr-2" /> Creating Tables...</>
                    ) : (
                      'Step 1: Create Database Tables'
                    )}
                  </button>
                  
                  <button
                    onClick={assignAdminRole}
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    {loading && status === 'loading' ? (
                      <><Loader className="animate-spin h-5 w-5 mr-2" /> Assigning Role...</>
                    ) : (
                      'Step 2: Assign Admin Role'
                    )}
                  </button>
                  
                  <button
                    onClick={async () => {
                      setLoading(true);
                      await refreshUserRole();
                      setLoading(false);
                      setStatus('success');
                      setMessage('Role refreshed successfully! Try accessing the admin panel now.');
                    }}
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {loading ? (
                      <><Loader className="animate-spin h-5 w-5 mr-2" /> Refreshing Role...</>
                    ) : (
                      'Step 3: Refresh Role Status'
                    )}
                  </button>
                  
                  {status === 'success' && (
                    <div className="bg-green-50 border-l-4 border-green-400 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-green-700">{message}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {status === 'error' && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AlertTriangle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{message}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSetupPage; 