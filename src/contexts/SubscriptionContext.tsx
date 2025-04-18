import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../utils/supabaseClient';
import { PaymentService } from '../services/PaymentService';
import { createBroadcastChannel } from '../utils/broadcastChannel';

// Create a broadcast channel for subscription changes
const subscriptionChannel = createBroadcastChannel('subscription_updates');

// Define plan types as constants to ensure consistency
export const PLAN_TYPES = {
  BASIC: 'basic' as const,
  PRO: 'pro' as const,
  ENTERPRISE: 'enterprise' as const
};

type PlanType = typeof PLAN_TYPES[keyof typeof PLAN_TYPES];

// Define plan limits
export const PLAN_LIMITS = {
  [PLAN_TYPES.BASIC]: 2,
  [PLAN_TYPES.PRO]: 10,
  [PLAN_TYPES.ENTERPRISE]: 50
};

interface SubscriptionState {
  plan: PlanType;
  plansGenerated: number;
  plansLimit: number;
  nextReset: Date | null;
  isLoading: boolean;
}

interface SubscriptionContextType {
  subscription: SubscriptionState;
  incrementPlansGenerated: () => Promise<boolean>; // Returns true if within quota
  canGeneratePlan: boolean;
  upgradeToPro: () => Promise<boolean>;
  upgradeToEnterprise: () => Promise<boolean>;
  remainingPlans: number;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionState>({
    plan: PLAN_TYPES.BASIC,
    plansGenerated: 0,
    plansLimit: PLAN_LIMITS[PLAN_TYPES.BASIC],
    nextReset: null,
    isLoading: true
  });

  // Listen for subscription changes from other tabs/components
  useEffect(() => {
    subscriptionChannel.addEventListener('message', (event: MessageEvent) => {
      if (event.data.type === 'SUBSCRIPTION_UPDATED' && 
          event.data.userId === user?.id) {
        console.log('Received subscription update:', event.data.plan);
        fetchSubscription();
      }
    });

    return () => {
      subscriptionChannel.close();
    };
  }, [user?.id]);

  // Function to fetch subscription data
  const fetchSubscription = async () => {
    if (!user) {
      setSubscription({
        plan: PLAN_TYPES.BASIC,
        plansGenerated: 0,
        plansLimit: PLAN_LIMITS[PLAN_TYPES.BASIC],
        nextReset: null,
        isLoading: false
      });
      return;
    }

    try {
      // Get the user's subscription data
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      console.log('Fetched subscription data:', data);

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        // Create a new subscription record for this user
        const now = new Date();
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        
        const { data: newData, error: insertError } = await supabase
          .from('user_subscriptions')
          .insert({
            user_id: user.id,
            plan: PLAN_TYPES.BASIC,
            plans_generated: 0,
            plans_limit: PLAN_LIMITS[PLAN_TYPES.BASIC],
            reset_date: nextMonth.toISOString()
          })
          .select('*')
          .single();
          
        if (insertError) throw insertError;
        
        setSubscription({
          plan: PLAN_TYPES.BASIC,
          plansGenerated: 0,
          plansLimit: PLAN_LIMITS[PLAN_TYPES.BASIC],
          nextReset: nextMonth,
          isLoading: false
        });
      } else {
        // Validate the plan type
        let planType: PlanType = data.plan;
        if (!Object.values(PLAN_TYPES).includes(planType)) {
          console.warn(`Unknown plan type "${planType}" found in database, defaulting to BASIC`);
          planType = PLAN_TYPES.BASIC;
        }

        // Check if we need to reset the counter
        const resetDate = new Date(data.reset_date);
        const now = new Date();
        
        if (now > resetDate) {
          // Reset the counter and set a new reset date
          const nextMonth = new Date(now);
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          
          await supabase
            .from('user_subscriptions')
            .update({
              plans_generated: 0,
              reset_date: nextMonth.toISOString()
            })
            .eq('user_id', user.id);
            
          setSubscription({
            plan: planType,
            plansGenerated: 0,
            plansLimit: PLAN_LIMITS[planType],
            nextReset: nextMonth,
            isLoading: false
          });
        } else {
          // Use existing data
          setSubscription({
            plan: planType,
            plansGenerated: data.plans_generated,
            plansLimit: PLAN_LIMITS[planType],
            nextReset: resetDate,
            isLoading: false
          });
        }
      }
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setSubscription({
        plan: PLAN_TYPES.BASIC,
        plansGenerated: 0,
        plansLimit: PLAN_LIMITS[PLAN_TYPES.BASIC],
        nextReset: null,
        isLoading: false
      });
    }
  };

  // Initialize subscription data
  useEffect(() => {
    fetchSubscription();
  }, [user]);

  const incrementPlansGenerated = async (): Promise<boolean> => {
    if (!user) return false;
    
    if (subscription.plansGenerated >= subscription.plansLimit) {
      // Already at the limit
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          plans_generated: subscription.plansGenerated + 1
        })
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setSubscription(prev => ({
        ...prev,
        plansGenerated: prev.plansGenerated + 1
      }));
      
      return true;
    } catch (err) {
      console.error('Error incrementing plans generated:', err);
      return false;
    }
  };

  const upgradeToPro = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Process payment first
      const paymentResult = await PaymentService.processPayment({
        userId: user.id,
        planType: PLAN_TYPES.PRO,
        amount: 9.99,
        currency: 'USD'
      });
      
      // Only update the subscription if payment was successful
      if (paymentResult.success) {
        console.log('Upgrading to Pro plan...');
        const { error } = await supabase
          .from('user_subscriptions')
          .update({
            plan: PLAN_TYPES.PRO,
            plans_limit: PLAN_LIMITS[PLAN_TYPES.PRO]
          })
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        // Verify the update was successful
        const { data: updatedData, error: verifyError } = await supabase
          .from('user_subscriptions')
          .select('plan')
          .eq('user_id', user.id)
          .single();
          
        if (verifyError) throw verifyError;
        
        console.log('Database plan updated to:', updatedData?.plan);
        
        setSubscription(prev => ({
          ...prev,
          plan: PLAN_TYPES.PRO,
          plansLimit: PLAN_LIMITS[PLAN_TYPES.PRO]
        }));
        
        // Broadcast the subscription change
        subscriptionChannel.postMessage({
          type: 'SUBSCRIPTION_UPDATED',
          userId: user.id,
          plan: PLAN_TYPES.PRO
        });
        
        return true;
      } else {
        // Payment failed - show error
        console.error('Payment failed:', paymentResult.errorMessage);
        return false;
      }
    } catch (err) {
      console.error('Error upgrading to pro:', err);
      return false;
    }
  };

  const upgradeToEnterprise = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Process payment first
      const paymentResult = await PaymentService.processPayment({
        userId: user.id,
        planType: PLAN_TYPES.ENTERPRISE,
        amount: 29.99,
        currency: 'USD'
      });
      
      // Only update the subscription if payment was successful
      if (paymentResult.success) {
        console.log('Upgrading to Enterprise plan...');
        
        // First verify current plan
        const { data: currentData } = await supabase
          .from('user_subscriptions')
          .select('plan')
          .eq('user_id', user.id)
          .single();
          
        console.log('Current plan before update:', currentData?.plan);
        
        // Update the subscription plan in the database
        const { error } = await supabase
          .from('user_subscriptions')
          .update({
            plan: PLAN_TYPES.ENTERPRISE,
            plans_limit: PLAN_LIMITS[PLAN_TYPES.ENTERPRISE]
          })
          .eq('user_id', user.id);
          
        if (error) {
          console.error('Failed to update plan in database:', error);
          throw error;
        }
        
        // Verify the update was successful
        const { data: updatedData, error: verifyError } = await supabase
          .from('user_subscriptions')
          .select('plan')
          .eq('user_id', user.id)
          .single();
          
        if (verifyError) throw verifyError;
        
        console.log('Database plan updated to:', updatedData?.plan);
        
        // Force update local state to match database
        setSubscription(prev => {
          const updated = {
            ...prev,
            plan: PLAN_TYPES.ENTERPRISE,
            plansLimit: PLAN_LIMITS[PLAN_TYPES.ENTERPRISE]
          };
          console.log('Updated local subscription state:', updated);
          return updated;
        });
        
        // Broadcast the subscription change
        subscriptionChannel.postMessage({
          type: 'SUBSCRIPTION_UPDATED',
          userId: user.id,
          plan: PLAN_TYPES.ENTERPRISE
        });
        
        return true;
      } else {
        // Payment failed - show error
        console.error('Payment failed:', paymentResult.errorMessage);
        return false;
      }
    } catch (err) {
      console.error('Error upgrading to enterprise:', err);
      return false;
    }
  };

  const canGeneratePlan = subscription.plansGenerated < subscription.plansLimit;
  const remainingPlans = subscription.plansLimit - subscription.plansGenerated;

  return (
    <SubscriptionContext.Provider value={{ 
      subscription,
      incrementPlansGenerated,
      canGeneratePlan,
      upgradeToPro,
      upgradeToEnterprise,
      remainingPlans
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
} 