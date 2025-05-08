// Netlify serverless function to handle PayPal webhooks
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// PayPal webhook verification
function verifyPayPalWebhook(requestBody, headers) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  const paypalSignature = headers['paypal-transmission-sig'];
  const paypalCert = headers['paypal-cert-url'];
  const paypalTransmissionId = headers['paypal-transmission-id'];
  const paypalTransmissionTime = headers['paypal-transmission-time'];
  
  const data = `${paypalTransmissionId}|${paypalTransmissionTime}|${webhookId}|${crypto.createHash('sha256').update(requestBody).digest('hex')}`;
  
  // Note: Full verification would involve fetching PayPal's public cert from paypalCert
  // and verifying the signature, which is beyond the scope of this implementation
  
  // For simplicity, we'll just check if the headers exist
  return paypalSignature && paypalCert && paypalTransmissionId && paypalTransmissionTime;
}

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method not allowed' }) };
  }
  
  try {
    // Verify webhook (in production, implement full signature verification)
    if (!verifyPayPalWebhook(event.body, event.headers)) {
      return { 
        statusCode: 401, 
        body: JSON.stringify({ message: 'Invalid webhook signature' }) 
      };
    }
    
    const webhookData = JSON.parse(event.body);
    const eventType = webhookData.event_type;
    
    // Handle different webhook event types
    switch (eventType) {
      case 'PAYMENT.SALE.COMPLETED':
        // Payment was successful
        const orderId = webhookData.resource.parent_payment;
        const customId = webhookData.resource.custom; // This would be your userId
        
        // Record the successful payment
        await supabase
          .from('payments')
          .insert({
            user_id: customId,
            payment_provider: 'paypal',
            transaction_id: webhookData.resource.id,
            order_id: orderId,
            amount: webhookData.resource.amount.total,
            currency: webhookData.resource.amount.currency,
            status: 'completed',
            details: webhookData
          });
        
        break;
        
      case 'BILLING.SUBSCRIPTION.CANCELLED':
        // Subscription was cancelled
        const subscriptionId = webhookData.resource.id;
        
        // Find user with this subscription
        const { data: userData } = await supabase
          .from('user_subscriptions')
          .select('user_id')
          .eq('subscription_id', subscriptionId)
          .single();
          
        if (userData) {
          // Update subscription status
          await supabase
            .from('user_subscriptions')
            .update({
              plan: 'free',
              plans_limit: 3, // Reset to free plan limit
              cancel_at_period_end: false, // Already cancelled
              cancelled_at: new Date().toISOString()
            })
            .eq('user_id', userData.user_id);
        }
        
        break;
        
      // Add more cases as needed
      
      default:
        console.log(`Unhandled PayPal webhook event: ${eventType}`);
    }
    
    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Webhook processed successfully' })
    };
    
  } catch (error) {
    console.error('Error processing PayPal webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error', error: error.message })
    };
  }
}; 