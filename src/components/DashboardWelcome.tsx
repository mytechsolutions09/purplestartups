import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardWelcome: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="text-center p-10">
      <h2 className="text-xl font-medium text-gray-900 mb-2">
        Welcome to your account dashboard
      </h2>
      <p className="text-gray-600 mb-4">
        {user?.email ? `Signed in as ${user.email}` : 'Select an option from the sidebar to manage your account settings'}
      </p>
      
      <div className="mt-8 flex justify-center">
        <Link
          to="/dashboard/profile"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Go to Profile
        </Link>
      </div>
    </div>
  );
};

export default DashboardWelcome;
