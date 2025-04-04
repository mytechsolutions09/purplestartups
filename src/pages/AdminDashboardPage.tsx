import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import TrendingKeywordsManager from '../components/admin/TrendingKeywordsManager';

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    console.log('AdminDashboardPage mounted');
    
    return () => {
      console.log('AdminDashboardPage unmounted');
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">User Management</h2>
          <p className="text-gray-600 mb-4">Manage users, roles and permissions</p>
          <a href="/admin/users" className="text-blue-600 hover:text-blue-800">View Users →</a>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Content Management</h2>
          <p className="text-gray-600 mb-4">Manage website content and pages</p>
          <a href="/admin/content" className="text-blue-600 hover:text-blue-800">Manage Content →</a>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Site Settings</h2>
          <p className="text-gray-600 mb-4">Configure application settings</p>
          <a href="/admin/settings" className="text-blue-600 hover:text-blue-800">Edit Settings →</a>
        </div>
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-3">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">125</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-700">64</div>
            <div className="text-sm text-gray-600">Active Subscriptions</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-700">842</div>
            <div className="text-sm text-gray-600">Ideas Generated</div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <TrendingKeywordsManager />
      </div>
    </div>
  );
};

export default AdminDashboardPage; 