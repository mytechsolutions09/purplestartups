import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { Sparkles, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardWelcome: React.FC = () => {
  const { user } = useAuth();
  const { subscription, remainingPlans } = useSubscription();

  const getPlanName = () => {
    switch (subscription.plan) {
      case 'pro': return 'Pro';
      case 'enterprise': return 'Enterprise';
      default: return 'Free';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold">Welcome{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}!</h1>
      </div>

      {/* Plan Usage Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Your {getPlanName()} Plan</h2>
            <Link to="/pricing" className="text-sm text-pink-600 hover:text-pink-800 font-medium">
              View Plans
            </Link>
          </div>
        </div>
        
        <div className="p-5">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <p className="text-gray-600 mb-1">Plan Generations</p>
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 text-pink-600 mr-2" />
                <span className="text-2xl font-bold">{remainingPlans}</span>
                <span className="text-gray-500 ml-2">/ {subscription.plansLimit} remaining</span>
              </div>
              
              {remainingPlans === 0 && (
                <div className="mt-2 flex items-start text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1 mt-0.5" />
                  <p className="text-sm">You've reached your plan limit for this month</p>
                </div>
              )}
            </div>
            
            {remainingPlans === 0 && (
              <Link 
                to="/pricing"
                className="px-4 py-2 bg-pink-600 text-white text-sm font-medium rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                Upgrade Plan
              </Link>
            )}
          </div>
          
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-pink-600 h-2.5 rounded-full" 
                style={{ width: `${((subscription.plansGenerated / subscription.plansLimit) * 100)}%` }}
              ></div>
            </div>
          </div>
          
          {subscription.nextReset && (
            <p className="text-xs text-gray-500 mt-2">
              Resets on {new Date(subscription.nextReset).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Other dashboard content */}
    </div>
  );
};

export default DashboardWelcome; 