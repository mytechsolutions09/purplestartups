import React, { useState } from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { X } from 'lucide-react';

interface QuotaExceededModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuotaExceededModal: React.FC<QuotaExceededModalProps> = ({ isOpen, onClose }) => {
  const { subscription, upgradeToPro, upgradeToEnterprise } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  if (!isOpen) return null;
  
  const handleUpgradeToPro = async () => {
    setIsProcessing(true);
    setPaymentError(null);
    
    const success = await upgradeToPro();
    
    if (success) {
      onClose();
    } else {
      setPaymentError('Payment failed. Please try again or use a different payment method.');
    }
    
    setIsProcessing(false);
  };
  
  const handleUpgradeToEnterprise = async () => {
    setIsProcessing(true);
    setPaymentError(null);
    
    const success = await upgradeToEnterprise();
    
    if (success) {
      onClose();
    } else {
      setPaymentError('Payment failed. Please try again or use a different payment method.');
    }
    
    setIsProcessing(false);
  };
  
  const resetDate = subscription.nextReset 
    ? new Date(subscription.nextReset).toLocaleDateString()
    : 'in 30 days';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold text-gray-800">Plan Limit Reached</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="bg-amber-50 text-amber-800 p-4 rounded-lg mb-4">
            <p>You've used all your {subscription.plansLimit} plan generations for this month.</p>
            <p className="mt-2 text-sm">Your quota will reset on {resetDate}.</p>
          </div>
          
          <h3 className="text-lg font-medium mb-2">Upgrade to Pro</h3>
          <p className="text-gray-600 mb-4">
            Get 10 startup plan generations per month, plus additional features.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex justify-between mb-2">
              <span>Current plan:</span>
              <span className="font-medium">Basic (2 plans/month)</span>
            </div>
            <div className="flex justify-between">
              <span>Pro plan:</span>
              <span className="font-medium">Pro (10 plans/month)</span>
            </div>
          </div>
          
          {paymentError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mt-4">
              {paymentError}
            </div>
          )}
          
          <div className="flex justify-end space-x-3 mt-6">
            <button 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Maybe Later
            </button>
            <button 
              onClick={handleUpgradeToPro}
              disabled={isProcessing}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Upgrade to Pro'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotaExceededModal; 