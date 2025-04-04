import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminEntryPage: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Special force refetch of admin status
    const checkAdminDirectly = async () => {
      if (!user) {
        console.log('No user, redirecting to login');
        navigate('/login');
        return;
      }
      
      if (loading) {
        console.log('Still loading, waiting...');
        return;
      }
      
      console.log('AdminEntryPage - Checking admin status:', { isAdmin });
      
      if (isAdmin) {
        console.log('Confirmed admin, redirecting to dashboard');
        navigate('/admin/dashboard');
      } else {
        console.log('Not admin, redirecting to regular dashboard');
        navigate('/dashboard');
      }
    };
    
    checkAdminDirectly();
  }, [user, isAdmin, loading, navigate]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Checking Admin Permissions</h1>
        <div className="spinner h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-t-transparent mx-auto"></div>
        <p className="mt-4">Please wait while we verify your admin access...</p>
        <p className="mt-2 text-sm text-gray-500">
          Status: {loading ? 'Loading...' : isAdmin ? 'Admin ✓' : 'Not admin ✗'}
        </p>
      </div>
    </div>
  );
};

export default AdminEntryPage; 