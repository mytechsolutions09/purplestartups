import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AdminRouteProps {
  element: React.ReactNode;
  redirectPath: string;
}

// Brand new component specifically for admin routes
const AdminRoute: React.FC<AdminRouteProps> = ({
  element,
  redirectPath
}) => {
  const { user, isAdmin, loading } = useAuth();
  
  // Detailed logging for debugging
  console.log('AdminRoute check:', { 
    user: user?.id, 
    email: user?.email,
    isAdmin, 
    path: window.location.pathname,
    loading
  });
  
  if (loading) {
    return <div className="p-8 text-center font-bold">Verifying admin permissions...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Direct admin check with explicit logging
  if (isAdmin) {
    console.log('✅ ADMIN ACCESS GRANTED to', window.location.pathname);
    return <>{element}</>;
  } else {
    console.log('❌ ADMIN ACCESS DENIED to', window.location.pathname);
    return <Navigate to={redirectPath} replace />;
  }
};

export default AdminRoute; 