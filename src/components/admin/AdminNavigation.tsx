import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings } from 'lucide-react';

const AdminNavigation: React.FC = () => {
  const navItems = [
    { path: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { path: '/admin/users', icon: <Users className="w-5 h-5" />, label: 'Users' },
    { path: '/admin/content', icon: <FileText className="w-5 h-5" />, label: 'Content' },
    { path: '/admin/settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' }
  ];

  return (
    <nav className="bg-gray-800 h-full overflow-y-auto">
      <div className="py-6">
        <div className="px-4 mb-6">
          <h2 className="text-lg font-semibold text-white">Admin Panel</h2>
        </div>
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavigation; 