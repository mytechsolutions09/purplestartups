export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  priority: 'high' | 'medium' | 'low';
  timeline: string;
  budget: string;
  objectives: string[];
  keyFindings: string[];
  technicalChallenges: string[];
  resources: string[];
}

export interface TechnologyTrend {
  name: string;
  trend: 'Rising' | 'Stable' | 'Declining';
  impact: 'High' | 'Medium' | 'Low';
}

export interface MarketingStrategy {
  channels: {
    name: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    estimatedBudget: string;
    expectedROI: string;
    tactics: string[];
  }[];
  timeline: {
    phase: string;
    duration: string;
    activities: string[];
    goals: string[];
  }[];
  kpis: {
    metric: string;
    target: string;
    timeframe: string;
  }[];
  budgetAllocation: {
    total: string;
    breakdown: {
      category: string;
      percentage: number;
      amount: string;
    }[];
  };
}

export interface TechnicalDebtMetric {
  category: string;
  score: number;
} 