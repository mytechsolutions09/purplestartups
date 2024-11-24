export interface StartupTask {
  title: string;
  description: string;
  timeline: string;
  resources?: string[];
  metrics?: string[];
  estimatedCost?: string;
}

export interface StartupStep {
  title: string;
  description: string;
  tasks: StartupTask[];
  keyMetrics?: string[];
  estimatedTimeframe: string;
  criticalFactors: string[];
}

export interface StartupPlan {
  idea: string;
  overview: string;
  problemStatement: string;
  targetMarket: {
    demographics: string[];
    psychographics: string[];
    marketSize: string;
  };
  valueProposition: string;
  steps: StartupStep[];
  keyTraits: {
    title: string;
    description: string;
  }[];
}

export interface SavedPlan {
  id: string;
  idea: string;
  timestamp: number;
  plan: StartupPlan;
}