import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader, Settings, AlertTriangle } from 'lucide-react';
import LeftSidebar from '../components/LeftSidebar';

const AccountSettingsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="md:w-64 flex-shrink-0">
            <LeftSidebar />
          </aside>
          
          <div className="flex-1">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="bg-indigo-600 px-6 py-4">
                <h1 className="text-lg font-medium text-white">Account Settings</h1>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-indigo-600" />
                    General Settings
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage your account settings and preferences
                  </p>
                </div>
                
                <div className="rounded-md bg-yellow-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Account Settings
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          This feature is under development. Please check back soon for more account settings options.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsPage; 