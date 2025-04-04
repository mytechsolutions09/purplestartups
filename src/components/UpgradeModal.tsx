import React from 'react';
import { X, Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../contexts/SubscriptionContext';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: 'free' | 'pro' | 'enterprise';
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ 
  isOpen, 
  onClose, 
  currentPlan 
}) => {
  const navigate = useNavigate();
  const { upgradeToPro, upgradeToEnterprise } = useSubscription();

  if (!isOpen) return null;

  const handleUpgrade = async (plan: 'pro' | 'enterprise') => {
    let success = false;
    
    if (plan === 'pro') {
      success = await upgradeToPro();
    } else if (plan === 'enterprise') {
      success = await upgradeToEnterprise();
    }
    
    if (success) {
      onClose();
      // Maybe show a success message
    }
  };

  const handleViewPlans = () => {
    onClose();
    navigate('/pricing');
  };

  const planLimits = {
    free: 2,
    pro: 10,
    enterprise: 50
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                You've reached your plan limit
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  You've used all {planLimits[currentPlan]} plan generations available in your {currentPlan} plan this month.
                  Upgrade to generate more startup plans.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900">Your current plan: {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}</h4>
              <p className="text-sm text-gray-500 mt-1">
                {planLimits[currentPlan]} plan generations per month
              </p>
            </div>

            <div className="space-y-3">
              {currentPlan === 'free' && (
                <button
                  type="button"
                  onClick={() => handleUpgrade('pro')}
                  className="w-full flex items-center justify-between p-4 border border-transparent rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">Upgrade to Pro</span>
                    <span className="text-xs opacity-90">{planLimits.pro} plans per month</span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}

              {(currentPlan === 'free' || currentPlan === 'pro') && (
                <button
                  type="button"
                  onClick={() => handleUpgrade('enterprise')}
                  className={`w-full flex items-center justify-between p-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    currentPlan === 'pro' 
                      ? 'border-transparent text-white bg-pink-600 hover:bg-pink-700 focus:ring-pink-500' 
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-pink-500'
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">Upgrade to Enterprise</span>
                    <span className="text-xs opacity-90">{planLimits.enterprise} plans per month</span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}

              <button
                type="button"
                onClick={handleViewPlans}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                View all plans
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
