import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { SavedPlan } from '../types';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from './AuthContext';

interface SavedPlansContextType {
  savedPlans: SavedPlan[];
  savePlan: (plan: any) => Promise<void>;
  removePlan: (id: string) => Promise<void>;
  downloadPlan: (id: string) => void;
  isPlanSaved: (idea: string) => boolean;
  getPlanByIdea: (idea: string) => SavedPlan | null;
  getPlanById: (id: string) => SavedPlan | null;
  isLoading: boolean;
  error: string | null;
}

const SavedPlansContext = createContext<SavedPlansContextType | null>(null);

export function SavedPlansProvider({ children }: { children: React.ReactNode }) {
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load plans from Supabase when user is authenticated
  useEffect(() => {
    const loadPlans = async () => {
      if (!user) {
        // If no user, try to load from localStorage as fallback
        const saved = localStorage.getItem('savedStartupPlans');
        setSavedPlans(saved ? JSON.parse(saved) : []);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('startup_plans')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setSavedPlans(data || []);
      } catch (err) {
        console.error('Error loading saved plans:', err);
        setError('Failed to load your saved plans');
        // Fallback to localStorage
        const saved = localStorage.getItem('savedStartupPlans');
        setSavedPlans(saved ? JSON.parse(saved) : []);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlans();
  }, [user]);

  // Save plans to localStorage as backup
  useEffect(() => {
    localStorage.setItem('savedStartupPlans', JSON.stringify(savedPlans));
  }, [savedPlans]);

  // Save plan to Supabase and state
  const savePlan = async (plan: any) => {
    if (!plan) return;

    try {
      setError(null);
      const newPlan: SavedPlan = {
        id: uuidv4(),
        idea: plan.idea,
        timestamp: Date.now(),
        plan: plan.plan,
        marketMetrics: plan.marketMetrics,
        competitors: plan.competitors,
        riskAssessment: plan.riskAssessment,
        researchData: plan.researchData,
        marketingStrategy: plan.marketingStrategy,
        websitePrompt: plan.websitePrompt
      };

      if (user) {
        // Save ALL plan data to Supabase
        const { error } = await supabase
          .from('startup_plans')
          .insert({
            id: newPlan.id,
            user_id: user.id,
            idea: newPlan.idea,
            timestamp: new Date(newPlan.timestamp).toISOString(),
            plan_data: {
              plan: plan.plan,
              marketMetrics: plan.marketMetrics,
              competitors: plan.competitors,
              riskAssessment: plan.riskAssessment,
              researchData: plan.researchData,
              marketingStrategy: plan.marketingStrategy,
              websitePrompt: plan.websitePrompt
            }
          });
          
        if (error) throw error;
      }

      // Update local state
      setSavedPlans(prevPlans => [newPlan, ...prevPlans]);
    } catch (err) {
      console.error('Error saving plan:', err);
      setError('Failed to save your plan');
    }
  };

  // Remove plan from Supabase and state
  const removePlan = async (id: string) => {
    try {
      setError(null);
      
      if (user) {
        // Remove from Supabase if user is logged in
        const { error } = await supabase
          .from('startup_plans')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);
          
        if (error) throw error;
      }

      // Update local state
      setSavedPlans(prevPlans => prevPlans.filter(plan => plan.id !== id));
    } catch (err) {
      console.error('Error removing plan:', err);
      setError('Failed to delete your plan');
    }
  };

  const downloadPlan = (id: string) => {
    const plan = savedPlans.find(p => p.id === id);
    if (!plan) return;

    const downloadContent = {
      idea: plan.idea,
      timestamp: new Date(plan.timestamp).toLocaleString(),
      plan: plan.plan,
    };

    const jsonString = JSON.stringify(downloadContent, null, 2);
    
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `startup-plan-${plan.id}.json`;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isPlanSaved = (idea: string) => {
    if (!idea) return false;
    
    // Normalize the idea string for comparison
    const normalizedIdea = idea.trim().toLowerCase();
    
    // Check if the plan exists using the normalized idea
    return savedPlans.some(p => {
      // Also normalize saved ideas for comparison
      const savedIdea = (p.idea || '').trim().toLowerCase();
      return savedIdea === normalizedIdea;
    });
  };
  
  const getPlanByIdea = (idea: string) => {
    return savedPlans.find(p => p.idea === idea) || null;
  };

  const getPlanById = (id: string) => {
    if (!id) return null;
    
    // Ensure we're comparing strings
    const searchId = String(id).trim();
    
    const foundPlan = savedPlans.find(plan => String(plan.id).trim() === searchId);
    console.log(`Looking for ID "${searchId}". Found:`, foundPlan ? 'Yes' : 'No');
    
    return foundPlan || null;
  };

  return (
    <SavedPlansContext.Provider value={{ 
      savedPlans, 
      savePlan, 
      removePlan,
      downloadPlan,
      isPlanSaved,
      getPlanByIdea,
      getPlanById,
      isLoading,
      error
    }}>
      {children}
    </SavedPlansContext.Provider>
  );
}

export function useSavedPlans() {
  const context = useContext(SavedPlansContext);
  if (!context) {
    throw new Error('useSavedPlans must be used within a SavedPlansProvider');
  }
  return context;
}

export default SavedPlansProvider; 