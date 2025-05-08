const express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');

// Configure PayPal environment
function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  
  if (process.env.NODE_ENV === 'production') {
    return new paypal.core.LiveEnvironment(clientId, clientSecret);
  } else {
    return new paypal.core.SandboxEnvironment(clientId, clientSecret);
  }
}

const client = new paypal.core.PayPalHttpClient(environment());

// Get plan price by ID
async function getPlanPrice(planId) {
  // Plans should match exactly what's in the SubscriptionPage component
  const plans = {
    'free': { 
      price: 0, 
      name: 'Basic Plan',
      description: 'AI Startup Generator, Basic Business Plan Templates, Market Research Tools'
    },
    'pro': { 
      price: 19.99, 
      name: 'Pro Plan',
      description: 'Advanced AI Analysis, Custom Business Plans, Financial Projections, Priority Support'
    },
    'enterprise': { 
      price: 49.99, 
      name: 'Enterprise Plan',
      description: 'Custom AI Training, API Access, Advanced Analytics, White-label Solutions'
    }
  };
  
  return plans[planId] || { price: 0, name: 'Unknown Plan', description: 'No description available' };
}

// Create a PayPal order
router.post('/create-order', async (req, res) => {
  const { planId, userId } = req.body;
  
  if (!planId) {
    return res.status(400).json({ error: 'Plan ID is required' });
  }
  
  try {
    const planDetails = await getPlanPrice(planId);
    
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: planId,
        description: `Subscription: ${planDetails.name} - ${planDetails.description}`,
        custom_id: userId, // Store user ID for reference
        amount: {
          currency_code: 'USD',
          value: planDetails.price.toString()
        }
      }],
      application_context: {
        brand_name: 'Purple Startups',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.APP_URL || 'http://localhost:3000'}/subscription/success`,
        cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/subscription/cancel`,
      }
    });
    
    const order = await client.execute(request);
    
    return res.json({
      id: order.result.id,
      status: order.result.status
    });
    
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return res.status(500).json({ error: 'Failed to create PayPal order' });
  }
});

// Capture a PayPal payment
router.post('/capture-order', async (req, res) => {
  const { orderId, planId, userId } = req.body;
  
  if (!orderId) {
    return res.status(400).json({ error: 'Order ID is required' });
  }
  
  try {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.prefer("return=representation");
    
    const capture = await client.execute(request);
    const captureId = capture.result.purchase_units[0].payments.captures[0].id;
    const planDetails = await getPlanPrice(planId);
    
    // In a real app, you would store all this information in your database
    // Here's an example of what you might store:
    
    const subscriptionData = {
      userId,
      planId,
      planName: planDetails.name,
      planDescription: planDetails.description,
      price: planDetails.price,
      currency: capture.result.purchase_units[0].payments.captures[0].amount.currency_code,
      paypalOrderId: orderId,
      paypalCaptureId: captureId,
      status: 'active',
      paymentMethod: 'paypal',
      startDate: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    };
    
    // Store this in your database
    // await db.subscriptions.create(subscriptionData);
    
    return res.json({
      captureId,
      subscriptionId: orderId, // For simplicity, using order ID as subscription ID
      status: 'active',
      planDetails: {
        name: planDetails.name,
        price: planDetails.price
      },
      message: 'Payment successful'
    });
    
  } catch (error) {
    console.error('Error capturing PayPal payment:', error);
    return res.status(500).json({ error: 'Failed to capture PayPal payment' });
  }
});

// Cancel a PayPal subscription
router.post('/cancel-subscription', async (req, res) => {
  const { subscriptionId, userId } = req.body;
  
  if (!subscriptionId) {
    return res.status(400).json({ error: 'Subscription ID is required' });
  }
  
  try {
    // In a real app with recurring subscriptions, you would call PayPal's subscription API
    // For this example, we'll just update the database
    
    // Example database update (using your preferred DB library)
    // await db.subscriptions.update({ status: 'canceled' }, { where: { id: subscriptionId, userId } });
    
    return res.json({
      success: true,
      message: 'Subscription canceled successfully'
    });
    
  } catch (error) {
    console.error('Error canceling PayPal subscription:', error);
    return res.status(500).json({ error: 'Failed to cancel PayPal subscription' });
  }
});

// Record a PayPal subscription
router.post('/record-subscription', async (req, res) => {
  const { userId, planId, subscriptionId } = req.body;
  
  if (!userId || !planId || !subscriptionId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const planDetails = await getPlanPrice(planId);
    
    // In a real app, you would store this in your database
    // For example with Supabase:
    /*
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_id: planId,
        plan_name: planDetails.name,
        paypal_subscription_id: subscriptionId,
        status: 'active',
        price: planDetails.price,
        currency: 'USD',
        start_date: new Date(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      });
      
    if (error) throw error;
    */
    
    // Return success response
    return res.json({
      success: true,
      subscriptionId,
      planDetails
    });
    
  } catch (error) {
    console.error('Error recording subscription:', error);
    return res.status(500).json({ error: 'Failed to record subscription' });
  }
});

// Add an endpoint to handle subscription webhooks from PayPal
router.post('/webhook', async (req, res) => {
  try {
    const event = req.body;
    
    // Process different webhook events
    switch (event.event_type) {
      case 'BILLING.SUBSCRIPTION.CREATED':
        // Handle subscription created
        break;
      case 'BILLING.SUBSCRIPTION.CANCELLED':
        // Handle subscription cancelled
        break;
      case 'BILLING.SUBSCRIPTION.RENEWED':
        // Handle subscription renewed
        break;
      case 'PAYMENT.SALE.COMPLETED':
        // Handle payment completed
        break;
      default:
        console.log(`Unhandled event type: ${event.event_type}`);
    }
    
    res.status(200).send();
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(400).send();
  }
});

// Update the connect endpoint to be environment-agnostic
router.get('/connect', async (req, res) => {
  try {
    // Get the base URL based on environment
    const baseUrl = process.env.APP_URL || (
      process.env.NODE_ENV === 'production' 
        ? 'https://purplestartups.com' 
        : 'http://localhost:3000'
    );
    
    // Get return URL (where to redirect after PayPal authorization)
    const returnUrl = req.query.returnUrl || `${baseUrl}/payment-methods`;
    
    // Get API URL based on environment
    const apiUrl = process.env.API_URL || (
      process.env.NODE_ENV === 'production'
        ? 'https://api.purplestartups.com'
        : 'http://localhost:5000'
    );
    
    // Create PayPal OAuth URL
    const paypalConnectUrl = `https://www.sandbox.paypal.com/connect?flowEntry=static&client_id=${process.env.PAYPAL_CLIENT_ID}&scope=openid email https://uri.paypal.com/services/paypalattributes&redirect_uri=${encodeURIComponent(
      `${apiUrl}/api/paypal/connect/callback`
    )}&state=${encodeURIComponent(JSON.stringify({ returnUrl }))}`;
    
    // Redirect to PayPal
    res.redirect(paypalConnectUrl);
  } catch (error) {
    console.error('Error initiating PayPal connect:', error);
    // Get base URL for redirection on error
    const baseUrl = process.env.APP_URL || (
      process.env.NODE_ENV === 'production' 
        ? 'https://purplestartups.com' 
        : 'http://localhost:3000'
    );
    res.redirect(`${baseUrl}/payment-methods?error=connection_failed`);
  }
});

// Add a callback handler for PayPal connection
router.get('/connect/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    
    if (!code) {
      throw new Error('No authorization code received from PayPal');
    }
    
    // Parse the state parameter to get our return URL
    const { returnUrl } = JSON.parse(decodeURIComponent(state as string));
    
    // In a real implementation, exchange the authorization code for tokens
    // const tokenResponse = await exchangeCodeForTokens(code);
    
    // For our demo, we'll simulate a successful connection
    const userId = req.session?.userId; // You'd get this from your session
    
    // Create a new payment method record in your database
    // In a real implementation, this would include PayPal account details from the token exchange
    /*
    await supabase.from('payment_methods').insert({
      user_id: userId,
      type: 'paypal',
      details: {
        email: 'demo@example.com', // In reality, this would come from the PayPal API
      },
      is_default: false,
      created_at: new Date()
    });
    */
    
    // Redirect back to the payment methods page with a success message
    res.redirect(`${returnUrl}?success=paypal_connected`);
  } catch (error) {
    console.error('Error handling PayPal connect callback:', error);
    res.redirect(`${process.env.APP_URL || 'https://purplestartups.com'}/payment-methods?error=connection_failed`);
  }
});

module.exports = router; 