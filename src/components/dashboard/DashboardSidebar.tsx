import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Users, 
  Settings, 
  CreditCard, 
  Mail, 
  HelpCircle, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const DashboardSidebar: React.FC = () => {
  const location = useLocation();
  const { signOut, isAdmin } = useAuth();
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Projects', href: '/dashboard/projects', icon: FileText },
    // Add other standard navigation items...
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];
  
  // Admin navigation if the user is an admin
  const adminNavigation = isAdmin ? [
    { name: 'Admin Dashboard', href: '/admin', icon: Users },
    // Add other admin navigation items...
  ] : [];
  
  const combinedNavigation = [...navigation, ...adminNavigation];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow border-r border-gray-200 bg-white pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <img 
            className="h-8 w-auto" 
            src="/logo.svg" 
            alt="Purple Startups" 
          />
          <span className="ml-2 text-xl font-bold text-indigo-600">Purple Startups</span>
        </div>
        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2 bg-white space-y-1">
            {combinedNavigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${isActive(item.href) 
                      ? 'bg-indigo-50 text-indigo-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                >
                  <IconComponent 
                    className={`
                      mr-3 flex-shrink-0 h-5 w-5
                      ${isActive(item.href) ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}
                    `}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="px-2 pb-2">
          <button
            onClick={signOut}
            className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
          >
            <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar; 