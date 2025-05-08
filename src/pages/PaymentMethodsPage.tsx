import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, Trash2, PlusCircle, CheckCircle, CreditCard as CardIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { paymentService } from '../services/paymentService';

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal';
  isDefault: boolean;
  details: {
    brand?: string;
    last4?: string;
    expMonth?: number;
    expYear?: number;
    email?: string;
  };
}

const PaymentMethodsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showAddCard, setShowAddCard] = useState(false);
  
  // Form fields for adding a new card
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  
  // Load existing payment methods
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Get payment methods from supabase via our service
        const methods = await paymentService.getPaymentMethods(user.id);
        setPaymentMethods(methods);
        
      } catch (err) {
        console.error('Error fetching payment methods:', err);
        setError('Failed to load your payment methods.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPaymentMethods();
  }, [user]);
  
  const handleSetDefault = async (methodId: string) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Use our payment service
      await paymentService.setDefaultPaymentMethod(user.id, methodId);
      
      // Update the local state
      setPaymentMethods(methods => 
        methods.map(method => ({
          ...method,
          isDefault: method.id === methodId
        }))
      );
      
    } catch (err) {
      console.error('Error setting default payment method:', err);
      setError('Failed to update your default payment method.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemove = async (methodId: string) => {
    if (!user) return;
    
    const confirmed = window.confirm('Are you sure you want to remove this payment method?');
    if (!confirmed) return;
    
    try {
      setLoading(true);
      
      // Use our payment service
      await paymentService.removePaymentMethod(user.id, methodId);
      
      // Update the local state
      setPaymentMethods(methods => methods.filter(method => method.id !== methodId));
      
    } catch (err) {
      console.error('Error removing payment method:', err);
      setError('Failed to remove payment method.');
    } finally {
      setLoading(false);
    }
  };
  
  const addPaymentMethod = async () => {
    if (!user) {
      setError('You must be logged in to add a payment method.');
      return;
    }
    
    try {
      // In development mode, show an alert explaining the test approach
      if (import.meta.env.DEV) {
        alert('In development mode, please use the testing links below to simulate PayPal connection.');
        return;
      }
      
      // In production, use the production URL
      const productionPayPalUrl = 'https://www.paypal.com/connect?flowEntry=static&client_id=YOUR_PRODUCTION_CLIENT_ID&scope=openid email https://uri.paypal.com/services/paypalattributes&redirect_uri=https://api.purplestartups.com/api/paypal/connect/callback';
      
      // Add the current URL as state
      const stateParam = encodeURIComponent(JSON.stringify({
        returnUrl: window.location.href
      }));
      
      // Redirect to PayPal
      window.location.href = `${productionPayPalUrl}&state=${stateParam}`;
    } catch (error) {
      console.error('Error initiating PayPal connect:', error);
      setError('Failed to connect to PayPal. Please try again.');
    }
  };
  
  const formatCardBrand = (brand: string) => {
    return brand.charAt(0).toUpperCase() + brand.slice(1);
  };
  
  const formatExpiryDate = (month: number, year: number) => {
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
  };
  
  if (loading && paymentMethods.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment Methods</h1>
      
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* List of payment methods */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {paymentMethods.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {paymentMethods.map((method) => (
              <li key={method.id} className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {method.type === 'paypal' ? (
                      <>
                        <div className="h-10 w-14 bg-blue-100 rounded flex items-center justify-center mr-4">
                          <span className="font-bold text-blue-800">PayPal</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">PayPal</p>
                          <p className="text-sm text-gray-500">
                            {method.details.email}
                            {method.isDefault && <span className="ml-2 text-xs font-medium text-green-600">(Default)</span>}
                          </p>
                        </div>
                      </>
                    ) : null}
                  </div>
                  
                  <div className="flex space-x-2">
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefault(method.id)}
                        className="text-sm text-indigo-600 hover:text-indigo-900"
                        disabled={loading}
                      >
                        Set as default
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleRemove(method.id)}
                      className="text-sm text-red-600 hover:text-red-900"
                      disabled={loading}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500 mb-4">No payment methods found</p>
          </div>
        )}
      </div>
      
      {/* Add new payment method */}
      <div className="mt-8 space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Add Payment Method</h2>
        
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <button
            onClick={addPaymentMethod}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Connect PayPal
          </button>
        </div>
      </div>
      
      {/* Add a temporary testing link below the PayPal connect button */}
      {import.meta.env.DEV && (
        <>
          <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
            <h3 className="text-sm font-medium text-yellow-800">Development Testing Links</h3>
            <p className="mt-2 text-sm text-yellow-700">
              These links are only visible in development mode.
            </p>
            <div className="mt-3 flex flex-col space-y-2">
              <a 
                href="https://www.sandbox.paypal.com/connect?flowEntry=static&client_id=AWnZ79yRUYBbYIvLmvi73KaWJgjwXH-lSnekJrwK37M9XhxMeKU7uGdvBUG50fq9pFDq3avOXIfvvZEr&scope=openid email https://uri.paypal.com/services/paypalattributes&redirect_uri=https://api.purplestartups.com/api/paypal/connect/callback&state=testing123"
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
              >
                Direct PayPal Sandbox Link
              </a>
              <button
                onClick={() => {
                  // Add a mock PayPal account to simulate successful connection
                  const mockPayPalAccount = {
                    id: `paypal_${Date.now()}`,
                    type: 'paypal',
                    isDefault: paymentMethods.length === 0,
                    details: {
                      email: user?.email || 'user@example.com'
                    }
                  };
                  setPaymentMethods(prev => [...prev, mockPayPalAccount]);
                }}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
              >
                Simulate PayPal Connection
              </button>
            </div>
          </div>
        </>
      )}
      
      <div className="mt-8">
        <button
          onClick={() => navigate('/subscription')}
          className="text-indigo-600 hover:text-indigo-900 font-medium"
        >
          Back to Subscription Plans
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodsPage; 