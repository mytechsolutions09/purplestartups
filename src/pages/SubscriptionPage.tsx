import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Check, AlertCircle, Loader } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// This would come from your API or environment variables
const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Basic',
    price: 0,
    interval: 'month',
    features: [
      'AI Startup Generator',
      'Basic Business Plan Templates',
      'Market Research Tools',
      'Email Support',
      '1 User',
      '2 Projects per month',
      'Community Access'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    interval: 'month',
    annualPrice: 16.67,
    annualSavings: 39.89,
    features: [
      'Everything in Basic, plus:',
      'Advanced AI Analysis',
      'Custom Business Plans',
      'Financial Projections',
      'Priority Support',
      'All Apps Included',
      '2 Team Members',
      '10 Projects'
    ],
    recommended: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 49.99,
    interval: 'month',
    features: [
      'Everything in Pro, plus:',
      'Dedicated Account Manager',
      'Custom AI Training',
      'API Access',
      'Advanced Analytics',
      'White-label Solutions',
      'Unlimited Team Members',
      'Unlimited Projects'
    ]
  }
];

const SubscriptionPage: React.FC = () => {
  const { user, updateUserSubscription } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [showBillingForm, setShowBillingForm] = useState(false);

  useEffect(() => {
    // Fetch the user's current subscription from your backend API
    const fetchSubscription = async () => {
      if (user) {
        try {
          setLoading(true);
          // Replace with actual API call when ready
          // const response = await subscriptionService.getSubscription(user.id);
          // setCurrentSubscription(response);
          
          // For now, initialize with null until we have real data
          setCurrentSubscription(null);
        } catch (err) {
          console.error('Error fetching subscription:', err);
          setError('Failed to load your subscription information.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSubscription();
  }, [user]);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    
    // If selecting the free plan, process it immediately without payment
    if (planId === 'free') {
      handleFreePlanActivation();
    } else {
      // For paid plans, show the billing form
      setShowBillingForm(true);
      // Scroll to billing form
      setTimeout(() => {
        document.getElementById('billing-form')?.scrollIntoView({
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  // Add a function to handle free plan activation
  const handleFreePlanActivation = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get free plan details
      const freePlanDetails = SUBSCRIPTION_PLANS.find(plan => plan.id === 'free');
      if (!freePlanDetails) {
        throw new Error('Free plan details not found');
      }
      
      // Call your backend to record the free subscription
      const response = await fetch('/api/subscriptions/activate-free', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to activate free plan');
      }
      
      // Update user context with subscription details
      updateUserSubscription({
        id: `free_${Date.now()}`, // Generate a dummy ID for the free subscription
        planId: 'free',
        planName: freePlanDetails.name,
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        paymentMethod: 'none',
        price: 0,
        generationsRemaining: 2 // Initialize with 2 generations
      });
      
      setSuccess(`Your free Basic plan is now active. You can create up to 2 projects.`);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error activating free plan:', error);
      setError('Failed to activate your free plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Map your plan IDs to PayPal subscription plan IDs
  const getPlanIdForSubscription = (planType: string | null) => {
    if (!planType) return null;
    
    const planMap: Record<string, string> = {
      'free': 'P-FREE_PLAN_ID', // You won't typically have a PayPal plan for free tier
      'pro': 'P-3TD65701NR4199121NAMKKBY', // Pro plan ID from your snippet
      'enterprise': 'P-88R22545VS611054BNAMKGCY' // Enterprise plan ID from previous snippet
    };
    
    return planMap[planType] || null;
  };

  // Handle subscription approved
  const handleSubscriptionApproved = async (subscriptionId: string) => {
    if (!user || !selectedPlan) return;
    
    try {
      setLoading(true);
      
      // Get the plan details
      const selectedPlanDetails = SUBSCRIPTION_PLANS.find(plan => plan.id === selectedPlan);
      if (!selectedPlanDetails) {
        throw new Error('Selected plan details not found');
      }
      
      // Call your backend to record the subscription
      const response = await fetch('/api/paypal/record-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          planId: selectedPlan,
          subscriptionId: subscriptionId
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to record subscription');
      }
      
      // Update user context with subscription details
      updateUserSubscription({
        id: subscriptionId,
        planId: selectedPlan,
        planName: selectedPlanDetails.name,
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        paymentMethod: 'paypal',
        price: selectedPlanDetails.price
      });
      
      setSuccess(`Successfully subscribed to ${selectedPlanDetails.name} plan with PayPal!`);
      
      // Redirect to dashboard after successful subscription
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error processing PayPal subscription:', error);
      setError('Failed to process your subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle PayPal order creation
  const createPayPalOrder = async () => {
    if (!selectedPlan || !user) return;
    
    try {
      // Call your backend to create a PayPal order
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: selectedPlan,
          userId: user.id,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create PayPal order');
      }
      
      const orderData = await response.json();
      return orderData.id;
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      setError('Failed to create PayPal order. Please try again.');
      return null;
    }
  };

  // Handle PayPal payment approval
  const onPayPalApprove = async (data: any) => {
    try {
      setLoading(true);
      
      const selectedPlanDetails = SUBSCRIPTION_PLANS.find(plan => plan.id === selectedPlan);
      if (!selectedPlanDetails) {
        throw new Error('Selected plan details not found');
      }
      
      // Call your backend to capture the PayPal payment
      const response = await fetch('/api/paypal/capture-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: data.orderID,
          planId: selectedPlan,
          userId: user?.id,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to complete PayPal payment');
      }
      
      const result = await response.json();
      
      // Update user context with subscription details
      updateUserSubscription({
        id: result.subscriptionId,
        planId: selectedPlan,
        planName: selectedPlanDetails.name,
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        paymentMethod: 'paypal',
        price: selectedPlanDetails.price
      });
      
      setSuccess(`Successfully subscribed to ${selectedPlanDetails.name} plan with PayPal!`);
      
      // Redirect to dashboard after successful subscription
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error processing PayPal payment:', error);
      setError('Failed to process your payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !currentSubscription) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
        <span className="ml-2 text-lg">Loading subscription details...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Subscription Plans</h1>
        <p className="mt-4 text-lg text-gray-600">
          Choose the perfect plan for your startup journey
        </p>
      </div>

      {error && (
        <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-8 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Current subscription info */}
      {currentSubscription && (
        <div className="mb-8 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Current Subscription</h2>
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <p className="text-gray-700">
                <span className="font-medium">Plan:</span> {currentSubscription.planName}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Status:</span> {currentSubscription.status.charAt(0).toUpperCase() + currentSubscription.status.slice(1)}
              </p>
              {currentSubscription.currentPeriodEnd && (
                <p className="text-gray-700">
                  <span className="font-medium">Renews on:</span> {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              )}
            </div>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to cancel your subscription?')) {
                  updateUserSubscription(null);
                  setCurrentSubscription(null);
                  setSuccess('Your subscription has been canceled. You will have access until the end of your billing period.');
                }
              }}
              className="mt-4 md:mt-0 px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cancel Subscription
            </button>
          </div>
        </div>
      )}

      {/* Pricing plans */}
      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <div 
            key={plan.id}
            className={`bg-white rounded-lg border ${plan.recommended ? 'border-indigo-500 shadow-lg' : 'border-gray-200'} overflow-hidden`}
          >
            {plan.recommended && (
              <div className="bg-indigo-500 text-white text-center py-2 text-sm font-medium">
                Recommended
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                <span className="ml-1 text-gray-500">/{plan.interval}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">{feature}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full px-4 py-2 border rounded-md text-sm font-medium ${
                    selectedPlan === plan.id
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 border-transparent'
                      : 'bg-white text-gray-900 hover:bg-gray-50 border-gray-300'
                  }`}
                  disabled={loading || (currentSubscription && currentSubscription.planId === plan.id)}
                >
                  {currentSubscription && currentSubscription.planId === plan.id
                    ? 'Current Plan'
                    : selectedPlan === plan.id
                      ? 'Selected'
                      : 'Select Plan'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PayPal billing form */}
      {showBillingForm && selectedPlan && (
        <div id="billing-form" className="mt-12 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Complete Your Subscription</h3>
          
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <p className="text-sm text-gray-600">
              You'll be redirected to PayPal to complete your purchase. Your subscription will be activated immediately after payment.
            </p>
            <div className="mt-3 text-sm font-medium">
              {selectedPlan && (
                <p>
                  Selected plan: <span className="text-indigo-600">
                    {SUBSCRIPTION_PLANS.find(plan => plan.id === selectedPlan)?.name || 'Unknown'}
                  </span> - ${SUBSCRIPTION_PLANS.find(plan => plan.id === selectedPlan)?.price || '0'}/month
                </p>
              )}
            </div>
          </div>
          
          <PayPalScriptProvider options={{ 
            "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID || "AVnZ79yRUYBbYIvLmvi73KaWJgjwXH-lSnekJrwK37M9XhxMeKU7uGdvBUG50fq9pFDq3avOXIfvvZEr",
            currency: "USD",
            intent: "subscription",
            vault: true
          }}>
            <PayPalButtons
              style={{ 
                layout: "vertical",
                shape: "rect",
                color: "gold",
                label: "paypal"
              }}
              disabled={loading}
              createSubscription={(data, actions) => {
                // Get the plan ID based on selected plan
                const planId = getPlanIdForSubscription(selectedPlan);
                
                return actions.subscription.create({
                  plan_id: planId
                });
              }}
              onApprove={(data, actions) => {
                // Handle successful subscription
                handleSubscriptionApproved(data.subscriptionID);
                return actions.subscription.get();
              }}
              onError={(err) => {
                console.error('PayPal error:', err);
                setError('There was a problem with PayPal. Please try again.');
              }}
            />
          </PayPalScriptProvider>
          
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={() => setShowBillingForm(false)}
              className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Manage your payment methods
          <Link to="/payment-methods" className="ml-2 text-indigo-600 hover:text-indigo-900 font-medium">
            Payment settings
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPage; 