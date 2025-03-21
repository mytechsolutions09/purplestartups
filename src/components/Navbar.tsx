import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { useSavedPlans } from '../contexts/SavedPlansContext';
import { useNavigate, Link } from 'react-router-dom';
import type { StartupPlan } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, LogIn, UserPlus, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  onSelectPlan: (plan: StartupPlan) => void;
}

function Navbar({ onSelectPlan }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { savedPlans, removePlan } = useSavedPlans();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Icons.Rocket className="h-6 w-6 text-indigo-600" />
              </div>
              <span className="text-xl font-bold text-gray-900">StartupGuru</span>
            </Link>
          </div>

          {/* Right-aligned items */}
          <div className="flex items-center space-x-4">
            <Link
              to="/features"
              className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
            >
              About
            </Link>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <LayoutDashboard className="h-4 w-4 mr-1" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl z-50 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Saved Plans</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Icons.X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            {savedPlans.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-gray-50 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Icons.Rocket className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-gray-500">No saved plans yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedPlans.map((saved) => (
                  <div
                    key={saved.id}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <button
                        onClick={() => {
                          onSelectPlan(saved.plan);
                          setIsOpen(false);
                        }}
                        className="text-left"
                      >
                        <h3 className="font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                          {saved.idea}
                        </h3>
                      </button>
                      <button
                        onClick={() => removePlan(saved.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Delete plan"
                      >
                        <Icons.Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Icons.Clock className="h-4 w-4 mr-1" />
                      {new Date(saved.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar; 