import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface RoleBasedRouteProps {
  element: React.ReactNode;
  allowedRoles: string[];
  redirectPath: string;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  element,
  allowedRoles,
  redirectPath
}) => {
  const { user, isAdmin, loading } = useAuth();
  
  // Add extensive logging to debug the issue
  console.log('RoleBasedRoute rendered with:', { 
    user: user?.id, 
    isAdmin, 
    allowedRoles,
    redirectPath,
    loading
  });
  
  // Show loading state while checking
  if (loading) {
    console.log('Auth is still loading, showing loading indicator');
    return <div className="p-8 text-center">Checking permissions...</div>;
  }

  // If user is not logged in, redirect to login
  if (!user) {
    console.log('User not logged in, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Debug admin check
  console.log('Checking if user has required role:', {
    isAdmin,
    allowedRoles,
    hasRequiredRole: allowedRoles.includes('admin') && isAdmin
  });

  // Simple admin check
  if (allowedRoles.includes('admin') && isAdmin) {
    console.log('✅ Access granted to admin route');
    return <>{element}</>;
  }
  
  // Redirect if not admin
  console.log('❌ Access denied, redirecting to:', redirectPath);
  return <Navigate to={redirectPath} replace />;
};

export default RoleBasedRoute;
