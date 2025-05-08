import { supabase } from '../utils/supabaseClient';

interface SubscriptionInput {
  planId: string;
  paymentMethodId: string;
}

export const subscriptionService = {
  /**
   * Create a new subscription
   */
  createSubscription: async (userId: string, subscription: SubscriptionInput) => {
    // This should call your backend API, which would then interact with Stripe
    try {
      // Example of how this would be implemented with a real API
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          planId: subscription.planId,
          paymentMethodId: subscription.paymentMethodId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  },
  
  /**
   * Get subscription details for a user
   */
  getSubscription: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      throw error;
    }
  },
  
  /**
   * Cancel a subscription
   */
  cancelSubscription: async (userId: string) => {
    try {
      // This would call your backend API, which would then interact with Stripe
      const response = await fetch(`/api/subscriptions/${userId}/cancel`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  },
  
  /**
   * Update a subscription to a different plan
   */
  updateSubscription: async (userId: string, newPlanId: string) => {
    try {
      const response = await fetch(`/api/subscriptions/${userId}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: newPlanId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update subscription');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  },
}; 