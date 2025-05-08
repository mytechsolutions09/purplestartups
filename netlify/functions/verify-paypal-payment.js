// Netlify serverless function to verify PayPal payments
const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Server-side key for admin rights
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// PayPal configuration
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

// Use for API authorization
const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');

// Get PayPal access token
async function getPayPalAccessToken() {
  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`
    },
    body: 'grant_type=client_credentials'
  });
  
  const data = await response.json();
  return data.access_token;
}

// Verify PayPal order details
async function verifyPayPalOrder(orderId, accessToken) {
  const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  return await response.json();
}

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method not allowed' }) };
  }
  
  try {
    // Parse the request body
    const { userId, planId, paymentDetails, orderId } = JSON.parse(event.body);
    
    // Validate required fields
    if (!userId || !planId || !orderId) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ message: 'Missing required fields' }) 
      };
    }
    
    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();
    
    // Verify the order with PayPal
    const orderDetails = await verifyPayPalOrder(orderId, accessToken);
    
    // Check if order is valid and completed
    if (orderDetails.status !== 'COMPLETED') {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ 
          message: 'Payment not completed', 
          paypalStatus: orderDetails.status 
        }) 
      };
    }
    
    // Determine plan details based on planId
    const planDetails = {
      pro: {
        plan: 'pro',
        plansLimit: 10, // Match your PLAN_LIMITS for Pro
        amount: 19.99
      },
      enterprise: {
        plan: 'enterprise',
        plansLimit: 50, // Match your PLAN_LIMITS for Enterprise
        amount: 49.99
      }
    };
    
    const planInfo = planDetails[planId];
    
    // Verify payment amount (optional but recommended)
    const paidAmount = parseFloat(orderDetails.purchase_units[0].amount.value);
    if (paidAmount < planInfo.amount) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ 
          message: 'Payment amount does not match plan price',
          expected: planInfo.amount,
          received: paidAmount
        }) 
      };
    }
    
    // Record the payment in your database
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .insert([{
        user_id: userId,
        order_id: orderId,
        amount: Math.round(parseFloat(orderDetails.purchase_units[0].amount.value) * 100),
        status: 'paid',
        created_at: new Date().toISOString(),
        plan: planInfo.plan
      }]);
    
    if (paymentError) {
      console.error('Supabase error:', paymentError);
      return { 
        statusCode: 500, 
        body: JSON.stringify({ message: 'Database error', error: paymentError.message }) 
      };
    }
    
    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Payment verified and subscription updated',
        planId: planInfo.plan,
        orderId: orderId
      })
    };
    
  } catch (error) {
    console.error('Error verifying PayPal payment:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error', error: error.message })
    };
  }
}; 