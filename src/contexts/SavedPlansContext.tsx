import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SavedPlan } from '../types';

interface SavedPlansContextType {
  savedPlans: SavedPlan[];
  savePlan: (plan: SavedPlan) => void;
  removePlan: (id: string) => void;
}

const SavedPlansContext = createContext<SavedPlansContextType | null>(null);

export function SavedPlansProvider({ children }: { children: React.ReactNode }) {
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>(() => {
    const saved = localStorage.getItem('savedStartupPlans');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('savedStartupPlans', JSON.stringify(savedPlans));
  }, [savedPlans]);

  const savePlan = (plan: SavedPlan) => {
    setSavedPlans(prev => [plan, ...prev]);
  };

  const removePlan = (id: string) => {
    setSavedPlans(prev => prev.filter(plan => plan.id !== id));
  };

  return (
    <SavedPlansContext.Provider value={{ savedPlans, savePlan, removePlan }}>
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