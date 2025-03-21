import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../utils/supabaseClient';
import { PaymentService } from '../services/PaymentService';

type PlanType = 'basic' | 'pro' | 'enterprise';

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
    plan: 'basic',
    plansGenerated: 0,
    plansLimit: 2, // Basic plan default
    nextReset: null,
    isLoading: true
  });

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setSubscription({
          plan: 'basic',
          plansGenerated: 0,
          plansLimit: 2,
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
              plan: 'basic',
              plans_generated: 0,
              plans_limit: 2,
              reset_date: nextMonth.toISOString()
            })
            .select('*')
            .single();
            
          if (insertError) throw insertError;
          
          setSubscription({
            plan: 'basic',
            plansGenerated: 0,
            plansLimit: 2,
            nextReset: nextMonth,
            isLoading: false
          });
        } else {
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
              plan: data.plan,
              plansGenerated: 0,
              plansLimit: data.plan === 'basic' ? 2 : 10,
              nextReset: nextMonth,
              isLoading: false
            });
          } else {
            // Use existing data
            setSubscription({
              plan: data.plan,
              plansGenerated: data.plans_generated,
              plansLimit: data.plan === 'basic' ? 2 : 10,
              nextReset: resetDate,
              isLoading: false
            });
          }
        }
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setSubscription({
          plan: 'basic',
          plansGenerated: 0,
          plansLimit: 2,
          nextReset: null,
          isLoading: false
        });
      }
    };

    fetchSubscription();
  }, [user]);

  const incrementPlansGenerated = async (): Promise<boolean> => {
    if (!user) return false;
    
    if (subscription.plansGenerated >= subscription.plansLimit) {
      return false; // Quota exceeded
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
        planType: 'pro',
        amount: 9.99,
        currency: 'USD'
      });
      
      // Only update the subscription if payment was successful
      if (paymentResult.success) {
        const { error } = await supabase
          .from('user_subscriptions')
          .update({
            plan: 'pro',
            plans_limit: 10
          })
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        setSubscription(prev => ({
          ...prev,
          plan: 'pro',
          plansLimit: 10
        }));
        
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
        planType: 'enterprise',
        amount: 29.99,
        currency: 'USD'
      });
      
      // Only update the subscription if payment was successful
      if (paymentResult.success) {
        const { error } = await supabase
          .from('user_subscriptions')
          .update({
            plan: 'enterprise',
            plans_limit: 50
          })
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        setSubscription(prev => ({
          ...prev,
          plan: 'enterprise',
          plansLimit: 50
        }));
        
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