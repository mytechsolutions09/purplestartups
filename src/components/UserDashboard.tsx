import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Settings, BarChart2, FileText } from 'lucide-react';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="flex items-center space-x-4 mb-8">
        <div className="bg-indigo-100 p-3 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Welcome, {user.email}</h2>
          <p className="text-gray-500">Let's grow your startup</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          to="/profile" 
          className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all flex flex-col items-center text-center"
        >
          <div className="bg-blue-100 p-3 rounded-full mb-4">
            <Settings className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-800">Your Profile</h3>
          <p className="text-gray-500 text-sm mt-2">View and edit your account details</p>
        </Link>
        
        <Link 
          to="/" 
          className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all flex flex-col items-center text-center"
        >
          <div className="bg-purple-100 p-3 rounded-full mb-4">
            <BarChart2 className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-800">Generate Ideas</h3>
          <p className="text-gray-500 text-sm mt-2">Explore new startup concepts</p>
        </Link>
        
        <Link 
          to="/saved-ideas" 
          className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all flex flex-col items-center text-center"
        >
          <div className="bg-green-100 p-3 rounded-full mb-4">
            <FileText className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-800">Saved Ideas</h3>
          <p className="text-gray-500 text-sm mt-2">View your saved startup ideas</p>
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard; 