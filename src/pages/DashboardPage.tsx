import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Settings, Shield, FileText, Bell, CreditCard, Key, Image, HelpCircle } from 'lucide-react';
import { Navigate } from 'react-router-dom';

interface SidebarLinkProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
  isActive: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, title, description, to, isActive }) => (
  <Link 
    to={to} 
    className={`flex items-start p-4 rounded-lg transition-colors ${
      isActive ? 'bg-indigo-50' : 'hover:bg-gray-50'
    }`}
  >
    <div className={`p-2 rounded-full ${isActive ? 'bg-indigo-100' : 'bg-gray-100'}`}>
      {React.cloneElement(icon as React.ReactElement, { 
        className: `h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-gray-600'}` 
      })}
    </div>
    <div className="ml-3">
      <h3 className={`text-sm font-medium ${isActive ? 'text-indigo-700' : 'text-gray-900'}`}>
        {title}
      </h3>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  </Link>
);

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    // If we're exactly at /dashboard, navigate to the profile sub-route
    if (location.pathname === '/dashboard') {
      navigate('/dashboard/profile', { replace: true });
    }
  }, [location.pathname, navigate]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const navigationItems = [
    {
      title: 'Profile Information',
      description: 'Update your personal information and details',
      icon: <Settings />,
      to: '/dashboard/profile'
    },
    {
      title: 'Security',
      description: 'Manage your password and security settings',
      to: '/dashboard/security',
      icon: <Shield />
    },
    {
      title: 'Saved Ideas',
      description: 'View and manage your saved startup ideas',
      to: '/dashboard/saved-ideas',
      icon: <FileText />
    },
    {
      title: 'Notifications',
      description: 'Customize your notification preferences',
      to: '/dashboard/notifications',
      icon: <Bell />
    },
    {
      title: 'Billing',
      description: 'Manage your subscription and payment methods',
      to: '/dashboard/billing',
      icon: <CreditCard />
    },
    {
      title: 'API Access',
      description: 'Get API keys and manage integrations',
      to: '/dashboard/api',
      icon: <Key />
    },
    {
      title: 'Profile Picture',
      description: 'Upload or change your profile picture',
      to: '/dashboard/avatar',
      icon: <Image />
    },
    {
      title: 'Help & Support',
      description: 'Get help with your account or contact support',
      to: '/dashboard/help',
      icon: <HelpCircle />
    }
  ];
  
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="md:w-72 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-200">
                {navigationItems.map((item) => (
                  <SidebarLink
                    key={item.to}
                    icon={item.icon}
                    title={item.title}
                    description={item.description}
                    to={item.to}
                    isActive={location.pathname === item.to}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1">
            {location.pathname === '/dashboard/saved-ideas' ? (
              <Outlet />
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <Outlet />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 