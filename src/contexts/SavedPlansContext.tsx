import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SavedPlan } from '../types';

interface SavedPlansContextType {
  savedPlans: SavedPlan[];
  savePlan: (plan: SavedPlan) => void;
  removePlan: (id: string) => void;
  downloadPlan: (id: string) => void;
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

  return (
    <SavedPlansContext.Provider value={{ savedPlans, savePlan, removePlan, downloadPlan }}>
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