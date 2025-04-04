import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface RoleBasedRouteProps {
  element: React.ReactNode;
  allowedRoles: string[];
  redirectPath?: string;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  element,
  allowedRoles,
  redirectPath = '/login'
}) => {
  const { user, isAdmin, loading } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // For admin routes
  if (allowedRoles.includes('admin') && !isAdmin) {
    return <Navigate to={redirectPath} replace />;
  }
  
  // Return the requested route element
  return <>{element}</>;
};

export default RoleBasedRoute; 