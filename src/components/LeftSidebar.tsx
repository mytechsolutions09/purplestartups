import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Shield, Bell, CreditCard, HelpCircle, FileText } from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => 
        `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
          isActive 
            ? 'bg-indigo-50 text-indigo-600 font-medium' 
            : 'text-gray-600 hover:bg-gray-50'
        }`
      }
    >
      <div className="flex-shrink-0">{icon}</div>
      <span>{label}</span>
    </NavLink>
  );
};

const LeftSidebar: React.FC = () => {
  return (
    <div className="w-full max-w-xs bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-indigo-600 px-6 py-4">
        <h2 className="text-lg font-medium text-white">Account Settings</h2>
      </div>
      
      <div className="p-4 space-y-1">
        <NavItem 
          to="/profile" 
          icon={<User className="h-5 w-5" />} 
          label="Your Profile" 
        />
        <NavItem 
          to="/account/security" 
          icon={<Shield className="h-5 w-5" />} 
          label="Security" 
        />
        <NavItem 
          to="/saved-ideas" 
          icon={<FileText className="h-5 w-5" />} 
          label="Saved Ideas" 
        />
        <NavItem 
          to="/account/notifications" 
          icon={<Bell className="h-5 w-5" />} 
          label="Notifications" 
        />
        <NavItem 
          to="/account/billing" 
          icon={<CreditCard className="h-5 w-5" />} 
          label="Billing" 
        />
        <NavItem 
          to="/help" 
          icon={<HelpCircle className="h-5 w-5" />} 
          label="Help & Support" 
        />
      </div>
    </div>
  );
};

export default LeftSidebar; 