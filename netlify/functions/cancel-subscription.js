const { createClient } = require('@supabase/supabase-js');

// Utility function for consistent logging
const log = (message, data) => {
  console.log(`[cancel-subscription] ${message}`, data || '');
};

// Update the database table name if needed
const TABLE_NAME = 'subscriptions'; // or 'user_subscriptions' - use the correct table name

exports.handler = async (event, context) => {
  // Initialize Supabase client with admin privileges
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  log('Function invoked');
  
  // Always set proper headers for JSON response
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*', // Enable CORS
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
  
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    log('Handling OPTIONS request');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'OK' })
    };
  }
  
  try {
    // Log raw request for debugging
    log('Raw request body:', event.body);
    
    // Parse the request body
    const { userId, subscriptionId } = JSON.parse(event.body || '{}');
    
    log('Parsed request data:', { userId, subscriptionId });
    
    if (!userId) {
      log('Missing userId');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          message: 'User ID is required',
          success: false 
        })
      };
    }
    
    log('Canceling subscription for user:', userId);
    
    // Update the subscription status in the database
    const { data, error } = await supabase
      .from(TABLE_NAME) // Use the table name constant
      .update({
        status: 'canceled',
        cancel_at_period_end: true,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
    
    if (error) {
      log('Database error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          message: 'Database error', 
          error: error.message,
          success: false
        })
      };
    }
    
    log('Subscription canceled successfully');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Subscription canceled successfully',
        data: data || {},
        success: true
      })
    };
    
  } catch (error) {
    log('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'Server error', 
        error: error.message,
        success: false 
      })
    };
  }
}; 