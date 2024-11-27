import React, { createContext, useContext, useState } from 'react';
import type { StartupPlan, MarketMetrics, Competitor, RiskAssessment, ResearchProject, TechnologyTrend, MarketingStrategy } from '../types';

interface StoredPlan {
  path: string;
  idea: string;
  timestamp: number;
}

interface StorePageContextType {
  storedPlan: StoredPlan | null;
  setStoredPlan: (plan: StoredPlan | null) => void;
}

const StorePageContext = createContext<StorePageContextType | undefined>(undefined);

export function StorePageProvider({ children }: { children: React.ReactNode }) {
  const [storedPlan, setStoredPlan] = useState<StoredPlan | null>(null);

  return (
    <StorePageContext.Provider value={{ storedPlan, setStoredPlan }}>
      {children}
    </StorePageContext.Provider>
  );
}

export function useStorePage() {
  const context = useContext(StorePageContext);
  if (context === undefined) {
    throw new Error('useStorePage must be used within a StorePageProvider');
  }
  return context;
} 