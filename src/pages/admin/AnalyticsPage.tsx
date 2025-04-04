import React from 'react';

const AnalyticsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-2">Total Users</h2>
          <div className="text-3xl font-bold text-blue-600">248</div>
          <div className="text-sm text-green-600 mt-1">↑ 12% from last month</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-2">Ideas Generated</h2>
          <div className="text-3xl font-bold text-purple-600">1,547</div>
          <div className="text-sm text-green-600 mt-1">↑ 8% from last month</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-2">Active Plans</h2>
          <div className="text-3xl font-bold text-emerald-600">642</div>
          <div className="text-sm text-green-600 mt-1">↑ 15% from last month</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">User Growth</h2>
          <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
            <p className="text-gray-500">User growth chart placeholder</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Ideas by Category</h2>
          <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
            <p className="text-gray-500">Ideas category chart placeholder</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">john.doe@example.com</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Generated new idea</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10 minutes ago</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">alice.smith@example.com</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Created new account</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 hour ago</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">robert.jones@example.com</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Saved roadmap</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3 hours ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage; 