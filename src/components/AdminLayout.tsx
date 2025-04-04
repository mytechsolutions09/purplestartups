import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation, Outlet } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Admin Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        
        <nav className="mt-6">
          <ul className="space-y-2 px-4">
            <li>
              <Link 
                to="/admin/dashboard" 
                className={`block py-2.5 px-4 rounded transition ${
                  isActiveRoute('/admin/dashboard') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/users" 
                className={`block py-2.5 px-4 rounded transition ${
                  isActiveRoute('/admin/users') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Users
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/content" 
                className={`block py-2.5 px-4 rounded transition ${
                  isActiveRoute('/admin/content') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Content
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/settings" 
                className={`block py-2.5 px-4 rounded transition ${
                  isActiveRoute('/admin/settings') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Settings
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/analytics" 
                className={`block py-2.5 px-4 rounded transition ${
                  isActiveRoute('/admin/analytics') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Analytics
              </Link>
            </li>
            <li className="pt-4 mt-4 border-t border-gray-700">
              <Link 
                to="/dashboard" 
                className="block py-2.5 px-4 rounded text-gray-300 hover:bg-gray-700"
              >
                Back to App
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Admin Control Panel</h1>
            <div className="flex items-center">
              <span className="mr-4 text-sm text-gray-600">
                Logged in as {user?.email}
              </span>
              <Link 
                to="/admin-debug" 
                className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded hover:bg-purple-200"
              >
                Debug
              </Link>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 