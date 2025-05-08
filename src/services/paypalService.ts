import { supabase } from '../utils/supabaseClient';

/**
 * Service for handling PayPal-related API calls
 */
export const paypalService = {
  /**
   * Create a PayPal order for subscription payment
   */
  createOrder: async (planId: string, userId: string) => {
    try {
      // Call your backend API to create a PayPal order
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          userId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create PayPal order');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      throw error;
    }
  },
  
  /**
   * Capture a PayPal payment after approval
   */
  capturePayment: async (orderId: string, planId: string, userId: string) => {
    try {
      const response = await fetch('/api/paypal/capture-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          planId,
          userId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to capture PayPal payment');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error capturing PayPal payment:', error);
      throw error;
    }
  },
  
  /**
   * Cancel a PayPal subscription
   */
  cancelSubscription: async (subscriptionId: string, userId: string) => {
    try {
      const response = await fetch(`/api/paypal/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
          userId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel PayPal subscription');
      }
      
      // Update subscription status in database
      await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('user_id', userId)
        .eq('paypal_subscription_id', subscriptionId);
      
      return await response.json();
    } catch (error) {
      console.error('Error canceling PayPal subscription:', error);
      throw error;
    }
  }
}; 