import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  BarChart2, 
  Bell, 
  LogOut, 
  Menu, 
  X, 
  Search,
  Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import Logo from '../Logo';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  // Check user role from Supabase
  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        
        setUserRole(data?.role || null);
        
        // Redirect if not admin
        if (data?.role !== 'admin') {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        navigate('/dashboard');
      }
    };
    
    checkUserRole();
  }, [user, navigate]);
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  // Navigation items for sidebar
  const navItems = [
    { 
      title: 'Dashboard', 
      path: '/admin', 
      icon: <LayoutDashboard className="w-5 h-5" /> 
    },
    { 
      title: 'User Management', 
      path: '/admin/users', 
      icon: <Users className="w-5 h-5" /> 
    },
    { 
      title: 'Content', 
      path: '/admin/content', 
      icon: <FileText className="w-5 h-5" /> 
    },
    { 
      title: 'Analytics', 
      path: '/admin/analytics', 
      icon: <BarChart2 className="w-5 h-5" /> 
    },
    { 
      title: 'Settings', 
      path: '/admin/settings', 
      icon: <Settings className="w-5 h-5" /> 
    },
  ];
  
  // If still loading or not admin, don't render admin panel
  if (!user || userRole !== 'admin') {
    return <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center space-y-4">
        <Shield className="w-12 h-12 text-red-500" />
        <p className="text-xl font-medium">Admin access required</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Back to Dashboard
        </button>
      </div>
    </div>;
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      <div className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
      </div>
      
      {/* Sidebar (mobile and desktop) */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 transition duration-300 transform bg-white border-r border-gray-200 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-0`}>
        
        {/* Close button (mobile only) */}
        <div className="absolute top-0 right-0 -mr-12 pt-2 md:hidden">
          {sidebarOpen && (
            <button 
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          )}
        </div>
        
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <Link to="/admin" className="flex items-center">
            <Logo asLink={false} />
          </Link>
        </div>
        
        {/* Navigation */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  location.pathname === item.path 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </Link>
            ))}
          </nav>
          
          {/* Logout button */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button 
              onClick={handleLogout}
              className="flex items-center text-red-600 hover:text-red-800 w-full"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navbar */}
        <div className="sticky top-0 z-10 flex-shrink-0 h-16 bg-white border-b border-gray-200 flex items-center">
          {/* Mobile menu button */}
          <button
            className="px-4 border-r border-gray-200 text-gray-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 flex justify-between items-center px-4">
            <div className="flex-1">
              <div className="max-w-xs w-full lg:max-w-sm">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Search"
                    type="search"
                  />
                </div>
              </div>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6">
              {/* Notifications */}
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <Bell className="h-6 w-6" />
              </button>
              
              {/* Profile */}
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={`https://ui-avatars.com/api/?name=${user?.email?.split('@')[0]}&background=6366F1&color=fff`}
                    alt="User avatar"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700 hidden md:block">
                    {user?.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 