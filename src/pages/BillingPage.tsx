import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { CreditCard, DollarSign, Clock, Plus, Loader, AlertTriangle, CheckCircle, XCircle, Zap, Star, Building } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { useSubscription, PLAN_TYPES } from '../contexts/SubscriptionContext';
import PayPalButton from '../components/PayPalButton';
import { loadPayPalSDK } from '../utils/scriptLoader';

interface PaymentMethod {
  id: string;
  last4: string;
  brand: string;
  exp_month: number;
  exp_year: number;
  isDefault: boolean;
}

interface BillingHistory {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  invoice_url?: string;
  order_id?: string;
  plan?: string;
}

interface Subscription {
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_end: string;
  cancel_at_period_end: boolean;
  billing_cycle: 'monthly' | 'annually';
}

interface PlanFeature {
  name: string;
  included: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  annualSavings: number;
  planLimit: number;
  icon: React.ReactNode;
  features: PlanFeature[];
}

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

const BillingPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { 
    subscription, 
    upgradeToPro, 
    upgradeToEnterprise,
    remainingPlans
  } = useSubscription();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [billingInfo, setBillingInfo] = useState<any>(null);
  const [showPayPalButtons, setShowPayPalButtons] = useState<{[key: string]: boolean}>({});
  const [paypalSDKLoaded, setPayPalSDKLoaded] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const pricingPlans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Basic',
      description: 'For solo entrepreneurs and startups',
      monthlyPrice: 0,
      annualPrice: 0,
      annualSavings: 0,
      icon: <Zap className="h-6 w-6 text-gray-500" />,
      features: [
        { name: 'AI Startup Generator', included: true },
        { name: 'Basic Business Plan Templates', included: true },
        { name: 'Market Research Tools', included: true },
        { name: 'Email Support', included: true },
        { name: '1 User', included: true },
        { name: '2 Projects per month', included: true },
        { name: 'Community Access', included: true },
        { name: 'Advanced AI Analysis', included: false },
        { name: 'Custom Business Plans', included: false },
        { name: 'Financial Projections', included: false },
        { name: 'Priority Support', included: false }
      ],
      planLimit: 2
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Ideal for growing businesses and teams',
      monthlyPrice: 19.99,
      annualPrice: 19.99,
      annualSavings: 39.96,
      icon: <Star className="h-6 w-6 text-indigo-600" />,
      features: [
        { name: 'Everything in Basic, plus:', included: true },
        { name: 'Advanced AI Analysis', included: true },
        { name: 'Custom Business Plans', included: true },
        { name: 'Financial Projections', included: true },
        { name: 'Priority Support', included: true },
        { name: 'All Apps Included', included: true },
        { name: '2 Team Members', included: true },
        { name: '10 Projects', included: true },
        { name: 'Custom Branding', included: true }
      ],
      planLimit: 10
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations and agencies',
      monthlyPrice: 49.99,
      annualPrice: 49.99,
      annualSavings: 99.96,
      icon: <Building className="h-6 w-6 text-indigo-600" />,
      features: [
        { name: 'Everything in Pro, plus:', included: true },
        { name: '50 Projects', included: true },
        { name: 'Dedicated Account Manager', included: true },
        { name: 'Custom AI Models', included: true },
        { name: 'Enterprise Analytics', included: true },
        { name: 'SLA Support', included: true },
        { name: 'Unlimited Team Members', included: true },
        { name: 'White Label Options', included: true },
        { name: 'Custom Integrations', included: true },
        { name: 'Training Sessions', included: true }
      ],
      planLimit: 50
    }
  ];

  useEffect(() => {
    if (user) {
      // Initialize without the mock credit card data
      setBillingHistory([
        {
          id: 'in_1234',
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          amount: 199.99,
          status: 'paid',
          invoice_url: '#'
        },
        {
          id: 'in_1235',
          date: new Date().toISOString(),
          amount: 199.99,
          status: 'paid',
          invoice_url: '#'
        }
      ]);
      
      // Set billing cycle based on user's preferences (could come from DB)
      setBillingCycle('monthly');
      
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // First check if PayPal SDK is already loaded
    if (window.paypal) {
      setPayPalSDKLoaded(true);
      return;
    }
    
    // If not loaded yet, try to load it
    loadPayPalSDK()
      .then(() => {
        console.log('PayPal SDK loaded successfully');
        setPayPalSDKLoaded(true);
      })
      .catch(error => {
        console.error('Failed to load PayPal SDK:', error);
        setError('Could not load payment processor. Please try again later.');
      });
  }, []);

  useEffect(() => {
    if (error) {
      // Clear error after 5 seconds
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleCancelSubscription = async () => {
    if (!user) return;
    
    setShowCancelConfirm(false);
    
    try {
      setIsChangingPlan(true);
      
      // If in development, use the mock implementation
      if (IS_DEVELOPMENT) {
        console.log("DEVELOPMENT MODE: Using mock subscription cancellation");
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Show success message
        setError(null);
        setSuccessMessage("Your subscription has been canceled successfully.");
        setIsChangingPlan(false);
        return;
      }
      
      // PRODUCTION CODE BEGINS HERE
      console.log("PRODUCTION MODE: Canceling subscription for user:", user.id);
      
      // Try multiple endpoints in sequence until one works
      const endpoints = [
        '/api/subscription/cancel',
        '/.netlify/functions/cancel-subscription',
        `${import.meta.env.VITE_API_URL || ''}/subscription/cancel`
      ];
      
      let response = null;
      let error = null;
      
      // Try each endpoint until one works
      for (const endpoint of endpoints) {
        try {
          console.log(`Attempting to cancel subscription using endpoint: ${endpoint}`);
          
          response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              userId: user.id,
              subscriptionId: subscription?.id || '' 
            }),
          });
          
          console.log(`Response from ${endpoint}:`, response.status);
          
          if (response.ok) {
            console.log(`Successfully canceled subscription using ${endpoint}`);
            break; // Exit the loop if successful
          }
        } catch (err) {
          console.error(`Error with endpoint ${endpoint}:`, err);
          error = err;
        }
      }
      
      // If we've tried all endpoints and none worked
      if (!response || !response.ok) {
        throw new Error(error || `Failed to cancel subscription: All endpoints failed`);
      }
      
      // Handle successful response
      let result = { message: 'Subscription canceled successfully' };
      
      try {
        const responseText = await response.text();
        if (responseText) {
          result = JSON.parse(responseText);
        }
      } catch (jsonError) {
        console.warn('Could not parse JSON response, using default message');
      }
      
      // Show success message
      setError(null);
      setSuccessMessage(result.message || "Your subscription has been canceled successfully.");
      
      // Update subscription context
      if (typeof refreshSubscription === 'function') {
        try {
          await refreshSubscription();
          console.log('Subscription data refreshed');
        } catch (refreshError) {
          console.error('Failed to refresh subscription data:', refreshError);
        }
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      setError(error instanceof Error ? error.message : 
        "Failed to cancel subscription. Please try again or contact support.");
    } finally {
      setIsChangingPlan(false);
    }
  };

  const handleResumeSubscription = async () => {
    setIsChangingPlan(true);
    try {
      // Call the API to resume subscription
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ cancel_at_period_end: false })
        .eq('user_id', user?.id);
        
      if (error) throw error;
      
      // Refetch billing info
      fetchBillingInfo();
    } catch (err) {
      console.error('Error resuming subscription:', err);
      setError('Failed to resume subscription. Please try again.');
    } finally {
      setIsChangingPlan(false);
    }
  };

  const handlePayWithPayPal = async (planId: string) => {
    setIsChangingPlan(true);
    setError(null);
    
    try {
      // Call the appropriate upgrade function based on the plan
      const upgradeFunction = planId === 'pro' ? upgradeToPro : upgradeToEnterprise;
      const result = await upgradeFunction('paypal');
      
      // If there's a redirect URL from PayPal, redirect to it
      if (result && window.location.href.includes('redirectUrl')) {
        window.location.href = window.location.href.split('redirectUrl=')[1];
      } else {
        // Handle the regular flow (for example, showing a success message)
        // This is just temporary until we have the full PayPal integration
        setIsChangingPlan(false);
      }
    } catch (error) {
      console.error('Error processing PayPal payment:', error);
      setError('Failed to process payment. Please try again.');
      setIsChangingPlan(false);
    }
  };

  const handleChangePlan = async (planId: string) => {
    try {
      setIsChangingPlan(true);
      
      console.log("BillingPage: Initiating plan change to", planId);
      
      // If user is already on this plan, show message and return
      if (subscription.plan === planId) {
        console.log(`BillingPage: Already on ${planId} plan, no change needed`);
        setError(`You are already on the ${planId} plan.`);
        setIsChangingPlan(false);
        return;
      }
      
      // Show PayPal buttons for this plan
      setShowPayPalButtons({ [planId]: true });
      setIsChangingPlan(false);
      
    } catch (error) {
      console.error("Error changing plan:", error);
      setError("Failed to upgrade plan. Please try again later.");
      setIsChangingPlan(false);
    }
  };

  const handleChangeBillingCycle = async (cycle: 'monthly' | 'annually') => {
    setIsChangingPlan(true);
    try {
      // Update the billing cycle in user_subscriptions table instead
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ billing_cycle: cycle })
        .eq('user_id', user?.id);
        
      if (error) throw error;
      
      // Update local state
      setBillingCycle(cycle);
    } catch (err) {
      console.error('Error changing billing cycle:', err);
      setError('Failed to change billing cycle. Please try again.');
    } finally {
      setIsChangingPlan(false);
    }
  };

  // Get current plan display info
  const getCurrentPlanInfo = () => {
    // Find the matching plan from pricingPlans based on subscription
    const plan = pricingPlans.find(p => p.id === (subscription.plan === PLAN_TYPES.BASIC ? 'free' : 
                                                 subscription.plan === PLAN_TYPES.PRO ? 'pro' : 'enterprise'));
    
    if (plan) {
      return plan; // Return the complete plan with features from pricingPlans
    }
    
    // Fallback plan with features if no match found
    switch (subscription.plan) {
      case PLAN_TYPES.ENTERPRISE:
        return {
          name: 'Enterprise',
          monthlyPrice: 29.99,
          annualPrice: 299.88,
          annualSavings: 59.99,
          planLimit: 50,
          id: 'enterprise',
          description: 'For larger organizations',
          icon: <Building className="h-6 w-6 text-indigo-500" />,
          features: [
            { name: 'Everything in Pro, plus:', included: true },
            { name: '50 Projects', included: true },
            { name: 'Dedicated Account Manager', included: true },
            { name: 'Custom AI Models', included: true },
            { name: 'Enterprise Analytics', included: true },
            { name: 'SLA Support', included: true },
            { name: 'Unlimited Team Members', included: true }
          ]
        };
      case PLAN_TYPES.PRO:
        return {
          name: 'Pro',
          monthlyPrice: 9.99,
          annualPrice: 99.99,
          annualSavings: 19.89,
          planLimit: 10,
          id: 'pro',
          description: 'For growing businesses',
          icon: <Star className="h-6 w-6 text-pink-500" />,
          features: [
            { name: 'Everything in Basic, plus:', included: true },
            { name: 'Advanced AI Analysis', included: true },
            { name: 'Custom Business Plans', included: true },
            { name: 'Financial Projections', included: true },
            { name: 'Priority Support', included: true },
            { name: '10 Projects', included: true }
          ]
        };
      default:
        return {
          name: 'Free',
          monthlyPrice: 0,
          annualPrice: 0,
          annualSavings: 0,
          planLimit: 2,
          id: 'free',
          description: 'For personal use',
          icon: <Zap className="h-6 w-6 text-gray-500" />,
          features: [
            { name: 'AI Startup Generator', included: true },
            { name: 'Basic Business Plan Templates', included: true },
            { name: 'Market Research Tools', included: true },
            { name: '2 Projects per month', included: true }
          ]
        };
    }
  };

  const currentPlan = getCurrentPlanInfo();

  useEffect(() => {
    // Update billing info whenever subscription changes
    console.log('BillingPage: Current subscription plan:', subscription.plan);
    
    if (subscription && user) {
      fetchBillingInfo();
    }
  }, [subscription, user]);

  const fetchBillingInfo = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Correct way to query user_subscriptions
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle(); // Use maybeSingle instead of single to avoid errors
      
      if (subscriptionError) {
        console.error('Error fetching subscription:', subscriptionError);
      } else if (subscriptionData) {
        setBillingInfo(subscriptionData);
      }
      
      // Correct way to query billing_info with proper headers
      const { data: billingData, error: billingError } = await supabase
        .from('billing_info')
        .select('*')
        .eq('user_id', user.id);
      
      if (billingError) {
        console.error('Error fetching billing info:', billingError);
      }
      
      // Fetch billing history
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (paymentsError) {
        console.error('Error fetching payment history:', paymentsError);
      } else {
        setBillingHistory(paymentsData || []);
      }
      
    } catch (err) {
      console.error('Error loading billing data:', err);
      setError('Failed to load billing data');
    } finally {
      setIsLoading(false);
    }
  };

  // Add this useEffect to handle return from PayPal
  useEffect(() => {
    // Check if the URL contains PayPal success parameters
    const params = new URLSearchParams(window.location.search);
    const paymentId = params.get('paymentId');
    const payerId = params.get('PayerID');
    
    if (paymentId && payerId) {
      const completePayment = async () => {
        setIsLoading(true);
        try {
          // Call your API to complete the payment
          // This would be implemented in your SubscriptionContext
          await completePayPalUpgrade(paymentId, payerId);
          
          // Clear the URL parameters after processing
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Show success message
          // You can add a success message UI component here
        } catch (error) {
          console.error('Error completing PayPal payment:', error);
          setError('Failed to complete payment. Please contact support.');
        } finally {
          setIsLoading(false);
        }
      };
      
      completePayment();
    }
  }, []);

  // Add this function to handle PayPal payment success
  const handlePayPalSuccess = async (details: any, planId: string) => {
    try {
      setIsChangingPlan(true);
      
      // Call your backend to verify and process the payment
      const response = await fetch('/api/subscriptions/verify-paypal-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          planId,
          paymentDetails: details,
          orderId: details.id
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to verify payment');
      }
      
      // If verification was successful, upgrade the plan
      if (planId === 'pro') {
        await upgradeToPro();
      } else if (planId === 'enterprise') {
        await upgradeToEnterprise();
      }
      
      // Refetch billing info
      fetchBillingInfo();
      setError(null);
      setSuccessMessage(`Successfully upgraded to ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan!`);
      
      // Hide PayPal buttons
      setShowPayPalButtons({});
      
    } catch (error) {
      console.error("Error processing PayPal payment:", error);
      setError("Failed to process payment. Please try again.");
    } finally {
      setIsChangingPlan(false);
    }
  };

  // Update your fetchBillingData function to get real PayPal transaction history
  const fetchBillingData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Fetch real transaction history from Supabase
      const { data: payments, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching billing history:', error);
        setError('Failed to load billing history');
        return;
      }
      
      // Transform payment data to match BillingHistory interface
      const billingData = payments ? payments.map(payment => ({
        id: payment.id,
        date: payment.created_at,
        amount: payment.amount,
        status: payment.status as 'paid' | 'pending' | 'failed',
        invoice_url: payment.invoice_url,
        order_id: payment.order_id,
        plan: payment.plan
      })) : [];
      
      setBillingHistory(billingData);
      
      // Also fetch subscription info
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (!subscriptionError && subscriptionData) {
        setBillingInfo(subscriptionData);
      }
    } catch (err) {
      console.error('Error loading billing data:', err);
      setError('Failed to load billing data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMockPayment = async (planId: string) => {
    try {
      setIsChangingPlan(true);
      
      // Get the proper amount based on plan
      const amount = planId === 'pro' ? 19.99 : planId === 'enterprise' ? 49.99 : 0;
      
      // Create mock payment details
      const mockPaymentDetails = {
        id: `MOCK-${Date.now()}`,
        status: 'COMPLETED',
        payer: {
          email_address: user?.email || 'test@example.com',
          payer_id: `MOCK-PAYER-${user?.id || '123'}`
        },
        purchase_units: [{
          amount: {
            value: amount.toFixed(2), // Ensure proper decimal formatting
            currency_code: 'USD'
          }
        }],
        create_time: new Date().toISOString(),
        update_time: new Date().toISOString()
      };
      
      // Call the same success handler you'd call with PayPal
      await handlePayPalSuccess(mockPaymentDetails, planId);
      
      // Show success message
      alert('Mock payment successful! This is just for testing.');
    } catch (error) {
      console.error('Mock payment error:', error);
      setError('An error occurred with the mock payment.');
    } finally {
      setIsChangingPlan(false);
      setShowPayPalButtons({});
    }
  };

  // Add this function to handle PayPal upgrades
  const completePayPalUpgrade = async (paymentId: string, payerId: string) => {
    try {
      const response = await fetch('/api/complete-paypal-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentId, payerId, userId: user?.id }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to complete payment');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error completing PayPal payment:', error);
      throw error;
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return 'N/A';
      }
      
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'N/A';
    }
  };

  const formatCurrency = (amount: number): string => {
    // Always format as dollars with 2 decimal places
    // Don't try to guess if it's in cents or dollars based on value
    return `$${amount.toFixed(2)}`;
  };

  const getNextBillingDate = () => {
    if (!subscription || !subscription.nextReset) {
      return 'N/A';
    }
    
    // Convert Date to string before passing to formatDate
    return formatDate(subscription.nextReset.toString());
  };

  const nextBillingDate = getNextBillingDate();

  const currentPrice = subscription?.plan === PLAN_TYPES.ANNUALLY
    ? currentPlan?.annualPrice
    : currentPlan?.monthlyPrice;

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-6">Billing & Subscription</h2>
      
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        {/* Current Plan */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-indigo-800 flex items-center">
                <DollarSign className="h-5 w-5 text-indigo-500 mr-2" />
                Current Plan
              </h3>
              
              {subscription.plan !== PLAN_TYPES.BASIC && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {billingCycle === 'annually' ? 'Annual' : 'Monthly'}
                </span>
              )}
            </div>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <div className="sm:flex sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center">
                  {currentPlan?.icon}
                  <h4 className="ml-2 text-xl font-bold text-gray-900">{currentPlan?.name}</h4>
                  
                  {currentPlan?.id !== 'free' && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {billingCycle === 'annually' ? 'Annual' : 'Monthly'}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500">{currentPlan?.description}</p>
                
                {currentPlan?.id !== 'free' && (
                  <p className="mt-2 text-sm text-gray-600">
                    {billingCycle === 'annually' ? (
                      <>
                        <span className="font-semibold">{formatCurrency(currentPlan.annualPrice!)}</span> per month, billed annually.
                        <span className="ml-1 text-green-600">
                          You save {formatCurrency(currentPlan.annualSavings!)} per year.
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="font-semibold">{formatCurrency(currentPlan.monthlyPrice!)}</span> per month, billed monthly.
                      </>
                    )}
                  </p>
                )}
                
                <p className="mt-2 text-sm text-gray-600">
                  Plan limit: {currentPlan?.planLimit || 0} roadmaps per month
                </p>
                
                <p className="mt-2 text-sm text-gray-600">
                  Next billing date: <span className="font-medium">{nextBillingDate}</span>
                </p>
                
                {subscription.plan !== PLAN_TYPES.BASIC && (
                  <p className="mt-2 text-sm text-red-600">
                    Your subscription will end on {nextBillingDate}.
                  </p>
                )}
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {currentPlan?.id !== 'free' && (
                    <div className="mt-4 space-x-3">
                      {billingCycle === 'monthly' && (
                        <button
                          type="button"
                          onClick={() => handleChangeBillingCycle('annually')}
                          disabled={isChangingPlan}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        >
                          {isChangingPlan ? (
                            <Loader className="animate-spin h-4 w-4 mr-2" />
                          ) : null}
                          Switch to Annual Billing
                          <span className="ml-1 text-green-600">(Save {formatCurrency(currentPlan.annualSavings!)})</span>
                        </button>
                      )}
                      
                      {billingCycle === 'annually' && (
                        <button
                          type="button"
                          onClick={() => handleChangeBillingCycle('monthly')}
                          disabled={isChangingPlan}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        >
                          {isChangingPlan ? (
                            <Loader className="animate-spin h-4 w-4 mr-2" />
                          ) : null}
                          Switch to Monthly Billing
                        </button>
                      )}
                    </div>
                  )}
                  
                  {subscription.plan !== PLAN_TYPES.BASIC && (
                    <button
                      type="button"
                      onClick={handleCancelSubscription}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      <XCircle className="h-4 w-4 mr-2 text-red-500" />
                      Cancel Subscription
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
                <div className="mt-3 rounded-md shadow sm:mt-0">
                  <button
                    type="button"
                    onClick={() => {
                      const plansModal = document.getElementById('change-plan-modal');
                      if (plansModal) {
                        plansModal.classList.remove('hidden');
                      }
                    }}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                  >
                    Change Plan
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Your Plan Features</h4>
              <ul className="space-y-2">
                {currentPlan?.features
                  .filter(feature => feature.included)
                  .map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature.name}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Billing History */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <Clock className="h-5 w-5 text-indigo-500 mr-2" />
              Billing History
            </h3>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            {billingHistory.length === 0 ? (
              <div className="text-center py-6">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No billing history</h3>
                <p className="mt-1 text-sm text-gray-500">Your payment history will appear here after your first payment.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {billingHistory.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Subscription payment {item.plan ? `(${item.plan})` : ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {formatCurrency(item.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === 'paid' ? 'bg-green-100 text-green-800' : 
                            item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.order_id ? item.order_id.substring(0, 8) + '...' : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.invoice_url ? (
                            <a 
                              href={item.invoice_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View Receipt
                            </a>
                          ) : (
                            '-'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Change Plan Modal (Hidden by default) */}
      <div id="change-plan-modal" className="hidden fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Select a Plan</h3>
            <button 
              type="button" 
              onClick={() => {
                const plansModal = document.getElementById('change-plan-modal');
                if (plansModal) {
                  plansModal.classList.add('hidden');
                }
              }}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {pricingPlans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`relative rounded-lg border ${
                    subscription?.plan === plan.id
                      ? 'border-indigo-500 ring-2 ring-indigo-500'
                      : 'border-gray-300'
                  } bg-white p-6 shadow-sm focus:outline-none`}
                >
                  {subscription?.plan === plan.id && (
                    <div className="absolute -top-2 -right-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        Current Plan
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    {plan.icon}
                    <h3 className="ml-2 text-lg font-medium text-gray-900">{plan.name}</h3>
                  </div>
                  
                  <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                  
                  <div className="mt-4">
                    {plan.id === 'free' ? (
                      <p className="text-2xl font-bold text-gray-900">Free</p>
                    ) : (
                      <div>
                        <div className="flex items-baseline">
                          <p className="text-2xl font-bold text-gray-900">${plan.annualPrice}</p>
                          <p className="ml-1 text-sm font-medium text-gray-500">/mo</p>
                        </div>
                        <p className="text-sm text-gray-500">billed annually</p>
                        <p className="text-xs text-green-600 mt-1">Save ${plan.annualSavings} annually</p>
                      </div>
                    )}
                  </div>
                  
                  <ul className="mt-6 space-y-4">
                    {plan.features.slice(0, 6).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature.name}</span>
                      </li>
                    ))}
                    {plan.features.length > 6 && (
                      <li className="text-sm text-gray-600 pl-7">
                        +{plan.features.length - 6} more features
                      </li>
                    )}
                  </ul>
                  
                  <div className="mt-6">
                    {showPayPalButtons[plan.id] && paypalSDKLoaded ? (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Complete payment with PayPal:</h4>
                        <PayPalButton
                          planId={plan.id}
                          amount={plan.id === 'pro' ? 1999 : plan.id === 'enterprise' ? 4999 : 0}
                          onSuccess={(details) => handlePayPalSuccess(details, plan.id)}
                          onError={(error) => {
                            console.error("PayPal error:", error);
                            setError("PayPal payment failed. Please try again.");
                            setShowPayPalButtons({});
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPayPalButtons({})}
                          className="w-full mt-2 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : showPayPalButtons[plan.id] ? (
                      <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">Loading payment options...</p>
                        <div className="mt-2 inline-flex items-center px-4 py-2">
                          <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Complete payment:</h4>
                        {/* Mock Payment Button (only in development) */}
                        {process.env.NODE_ENV !== 'production' && (
                          <button
                            type="button"
                            onClick={() => handleMockPayment(plan.id)}
                            className="w-full mt-2 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                          >
                            Development: Mock Payment
                          </button>
                        )}
                        
                        <button
                          type="button"
                          onClick={() => handleChangePlan(plan.id)}
                          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                          disabled={isChangingPlan || subscription.plan === plan.id}
                        >
                          {isChangingPlan ? (
                            <Loader className="animate-spin h-4 w-4 mr-2" />
                          ) : null}
                          {plan.id === 'free' ? 'Downgrade' : 
                            (subscription.plan === 'free' as any) ? 'Upgrade' : 
                            plan.id === 'enterprise' ? 'Upgrade' : 'Downgrade'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage; 