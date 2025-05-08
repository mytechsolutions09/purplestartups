import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { PlusCircle, CreditCard, Trash2, CheckCircle, AlertCircle, X } from 'lucide-react';
import { paymentService } from '../../services/paymentService';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

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

const BillingPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  // Load existing payment methods
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Get payment methods from our service
        let methods = await paymentService.getPaymentMethods(user.id);
        
        // For development: if no methods are returned and we're in dev mode, add a sample PayPal method
        if (methods.length === 0 && import.meta.env.DEV) {
          methods = [{
            id: 'dev_paypal_1',
            type: 'paypal',
            isDefault: true,
            details: {
              email: user.email || 'dev@example.com'
            }
          }];
        }
        
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
  
  // Add this effect to check for PayPal redirect results
  useEffect(() => {
    const redirectResult = paymentService.handlePayPalRedirect(window.location.search);
    
    if (redirectResult) {
      setNotification({
        type: redirectResult.success ? 'success' : 'error',
        message: redirectResult.message
      });
      
      // Clean up the URL
      const url = new URL(window.location.href);
      url.search = '';
      window.history.replaceState({}, document.title, url.toString());
      
      // Refresh payment methods if successful
      if (redirectResult.success && user) {
        fetchPaymentMethods();
      }
    }
  }, []);
  
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
      // Get PayPal client ID from environment variables
      const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
      if (!clientId) {
        setNotification({
          type: 'error',
          message: 'PayPal client ID not configured. Please contact support.'
        });
        return;
      }
      
      // Build the PayPal OAuth URL
      const apiUrl = import.meta.env.VITE_API_URL || window.location.origin;
      const redirectUri = `${apiUrl}/api/paypal/connect/callback`;
      const returnUrl = window.location.href;
      
      // Include user ID and return URL in the state parameter
      const state = encodeURIComponent(JSON.stringify({
        userId: user.id,
        returnUrl
      }));
      
      // Build the PayPal connect URL - use sandbox for development, production for prod
      const envDomain = import.meta.env.DEV ? 'sandbox.' : '';
      const paypalUrl = `https://www.${envDomain}paypal.com/connect` +
        `?flowEntry=static` +
        `&client_id=${clientId}` +
        `&scope=openid email https://uri.paypal.com/services/paypalattributes` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&state=${state}`;
      
      // Redirect to PayPal
      window.location.href = paypalUrl;
    } catch (error) {
      console.error('Error initiating PayPal connect:', error);
      setNotification({
        type: 'error',
        message: 'Failed to connect to PayPal. Please try again.'
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Billing</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage your payment methods and subscription details.
            </p>
          </div>
        </div>
        
        {error && (
          <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4">
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
        
        {notification && (
          <div className={`mt-4 p-4 rounded-md ${notification.type === 'success' ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'} border-l-4`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {notification.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm ${notification.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                  {notification.message}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setNotification(null)}
                    className={`inline-flex rounded-md p-1.5 ${notification.type === 'success' ? 'bg-green-50 text-green-500 hover:bg-green-100' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}
                  >
                    <span className="sr-only">Dismiss</span>
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Subscription details */}
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Subscription Details</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Current Plan</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user?.subscription?.planName || 'No active subscription'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user?.subscription?.status 
                    ? <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {user.subscription.status}
                      </span> 
                    : <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                  }
                </dd>
              </div>
              {user?.subscription?.currentPeriodEnd && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Renewal Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(user.subscription.currentPeriodEnd).toLocaleDateString()}
                  </dd>
                </div>
              )}
              {user?.subscription?.planId === 'free' && user?.subscription?.generationsRemaining !== undefined && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Generations Remaining</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user.subscription.generationsRemaining}
                  </dd>
                </div>
              )}
            </dl>
            
            <div className="mt-6">
              <a 
                href="/subscription" 
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Change subscription plan
              </a>
            </div>
          </div>
        </div>
        
        {/* Payment Methods */}
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">PayPal Payment Methods</h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage your connected PayPal accounts
              </p>
            </div>
            {/* PayPal logo */}
            <div className="h-10 w-16">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 124 33" className="h-full w-full">
                <path fill="#253B80" d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.97-1.142-2.694-1.746-4.985-1.746zM47 13.154c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.469 1.044.332 1.906zM66.654 13.075h-3.275a.57.57 0 0 0-.563.481l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.803l1.77-11.209a.568.568 0 0 0-.561-.658zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317zM84.096 13.075h-3.291a.954.954 0 0 0-.787.417l-4.539 6.686-1.924-6.425a.953.953 0 0 0-.912-.678h-3.234a.57.57 0 0 0-.541.754l3.625 10.638-3.408 4.811a.57.57 0 0 0 .465.9h3.287a.949.949 0 0 0 .781-.408l10.946-15.8a.57.57 0 0 0-.468-.895z"/>
                <path fill="#179BD7" d="M94.992 6.749h-6.84a.95.95 0 0 0-.938.802l-2.766 17.537a.569.569 0 0 0 .562.658h3.51a.665.665 0 0 0 .656-.562l.785-4.971a.95.95 0 0 1 .938-.803h2.164c4.506 0 7.105-2.18 7.785-6.5.307-1.89.012-3.375-.873-4.415-.971-1.142-2.694-1.746-4.983-1.746zm.789 6.405c-.373 2.454-2.248 2.454-4.062 2.454h-1.031l.725-4.583a.568.568 0 0 1 .562-.481h.473c1.234 0 2.4 0 3.002.704.359.42.468 1.044.331 1.906zM115.434 13.075h-3.273a.567.567 0 0 0-.562.481l-.145.916-.23-.332c-.709-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.311 6.586-.312 1.918.131 3.752 1.219 5.031 1 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .564.66h2.949a.95.95 0 0 0 .938-.803l1.771-11.209a.571.571 0 0 0-.565-.658zm-4.565 6.374c-.314 1.871-1.801 3.127-3.695 3.127-.949 0-1.711-.305-2.199-.883-.484-.574-.666-1.391-.514-2.301.297-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.501.589.699 1.411.554 2.317zM119.295 7.23l-2.807 17.858a.569.569 0 0 0 .562.658h2.822c.469 0 .867-.34.939-.803l2.768-17.536a.57.57 0 0 0-.562-.659h-3.16a.571.571 0 0 0-.562.482z"/>
                <path fill="#253B80" d="M7.266 29.154l.523-3.322-1.165-.027H1.061L4.927 1.292a.316.316 0 0 1 .314-.268h9.38c3.114 0 5.263.648 6.385 1.927.526.6.861 1.227 1.023 1.917.17.724.173 1.589.007 2.644l-.012.077v.676l.526.298a3.69 3.69 0 0 1 1.065.812c.45.513.741 1.165.864 1.938.127.795.085 1.741-.123 2.812-.24 1.232-.628 2.305-1.152 3.183a6.547 6.547 0 0 1-1.825 2c-.696.494-1.523.869-2.458 1.109-.906.236-1.939.355-3.072.355h-.73c-.522 0-1.029.188-1.427.525a2.21 2.21 0 0 0-.744 1.328l-.055.299-.924 5.855-.042.215c-.011.068-.03.102-.058.125a.155.155 0 0 1-.096.035H7.266z"/>
                <path fill="#179BD7" d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.326c-.661 0-1.218.48-1.321 1.132L6.596 26.83l-.399 2.533a.704.704 0 0 0 .695.814h4.881c.578 0 1.069-.42 1.16-.99l.048-.248.919-5.832.059-.32c.09-.572.582-.992 1.16-.992h.73c4.729 0 8.431-1.92 9.513-7.476.452-2.321.218-4.259-.978-5.622a4.667 4.667 0 0 0-1.336-1.03z"/>
                <path fill="#222D65" d="M21.754 7.151a9.757 9.757 0 0 0-1.203-.267 15.284 15.284 0 0 0-2.426-.177h-7.352a1.172 1.172 0 0 0-1.159.992L8.05 17.605l-.045.289a1.336 1.336 0 0 1 1.321-1.132h2.752c5.405 0 9.637-2.195 10.874-8.545.037-.188.068-.371.096-.55a6.594 6.594 0 0 0-1.017-.429 9.045 9.045 0 0 0-.277-.087z"/>
                <path fill="#253B80" d="M9.614 7.699a1.169 1.169 0 0 1 1.159-.991h7.352c.871 0 1.684.057 2.426.177a9.757 9.757 0 0 1 1.481.353c.365.121.704.264 1.017.429.368-2.347-.003-3.945-1.272-5.392C20.378.682 17.853 0 14.622 0h-9.38c-.66 0-1.223.48-1.325 1.133L.01 25.898a.806.806 0 0 0 .795.932h5.791l1.454-9.225 1.564-9.906z"/>
              </svg>
            </div>
          </div>
          
          <div className="border-t border-gray-200">
            {loading && paymentMethods.length === 0 ? (
              <div className="px-4 py-5 sm:p-6 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : paymentMethods.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {paymentMethods.map((method) => (
                  <li key={method.id} className="px-4 py-4 sm:px-6">
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
              <div className="px-4 py-5 sm:p-6 text-center">
                <p className="text-gray-500 mb-4">No PayPal accounts found</p>
                <p className="text-sm text-gray-500">
                  Connect your PayPal account to manage subscription payments
                </p>
              </div>
            )}
          </div>
          
          {/* Add Payment Method - Make this section more prominent and PayPal-specific */}
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6 bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Connect with PayPal</h3>
                <p className="mt-1 text-sm text-gray-500">
                  PayPal is our exclusive payment provider. Connect your PayPal account to manage your subscription.
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <button
                  onClick={addPaymentMethod}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Connect PayPal
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BillingPage; 