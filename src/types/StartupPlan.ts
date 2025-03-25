// Minimal interface for StartupPlan to fix the type error
export interface StartupStep {
  title: string;
  description: string;
  tasks: {
    title: string;
    description: string;
    resources?: string[];
    metrics?: string[];
  }[];
}

export interface StartupPlan {
  id?: string;
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
  timestamp?: number;
} 