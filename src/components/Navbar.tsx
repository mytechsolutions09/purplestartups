import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { useSavedPlans } from '../contexts/SavedPlansContext';
import { useNavigate, Link } from 'react-router-dom';
import type { StartupPlan } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, UserPlus, LayoutDashboard, Menu, X } from 'lucide-react';
import Logo from './Logo';

interface NavbarProps {
  onSelectPlan: (plan: StartupPlan) => void;
}

function Navbar({ onSelectPlan }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { savedPlans, removePlan } = useSavedPlans();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Create a reset function to pass to Logo
  const resetAppState = () => {
    // This will be called when the logo is clicked
    window.location.href = '/'; // Force a complete page refresh to reset all state
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo section */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Logo resetAppState={resetAppState} />
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700"
                >
                  <LayoutDashboard className="h-5 w-5 mr-1" />
                  <span>Dashboard</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  <LogIn className="h-5 w-5 mr-1" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700"
                >
                  <UserPlus className="h-5 w-5 mr-1" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              to="/features" 
              className="block py-2 px-4 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className="block py-2 px-4 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <div className="space-y-1">
                <Link
                  to="/dashboard"
                  className="flex w-full items-center px-4 py-2 text-sm font-medium border border-transparent rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 m-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="h-5 w-5 mr-2" />
                  Dashboard
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  to="/login"
                  className="flex w-full items-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 m-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="flex w-full items-center px-4 py-2 text-sm font-medium bg-pink-600 text-white rounded-md shadow-sm hover:bg-pink-700 m-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar; 