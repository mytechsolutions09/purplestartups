import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';

const AuthDebug: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  
  const checkDatabaseRole = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      alert(`Database role check: ${JSON.stringify(data)}\nError: ${error ? error.message : 'None'}`);
    } catch (err) {
      alert(`Error checking role: ${err}`);
    }
  };
  
  return (
    <div className="p-4 m-4 border rounded bg-white">
      <h2 className="text-lg font-bold mb-4">Auth Debug Panel</h2>
      
      <div className="mb-4">
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>User authenticated:</strong> {user ? 'Yes' : 'No'}</p>
        {user && (
          <>
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </>
        )}
        <p><strong>Is Admin (from context):</strong> {isAdmin ? 'Yes' : 'No'}</p>
      </div>
      
      <div className="space-y-2">
        <button 
          onClick={checkDatabaseRole}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Check Database Role
        </button>
        
        <button 
          onClick={() => window.location.href = '/admin'}
          className="ml-2 px-4 py-2 bg-purple-500 text-white rounded"
        >
          Try Admin Access
        </button>
      </div>
    </div>
  );
};

export default AuthDebug; 