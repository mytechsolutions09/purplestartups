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
  plan_data?: {
    plan?: any;
    marketMetrics?: any;
    competitors?: any;
    riskAssessment?: any;
    researchData?: any;
    marketingStrategy?: any;
  };
  plan?: any;
  marketMetrics?: any;
  competitors?: any;
  riskAssessment?: any;
  researchData?: any;
  marketingStrategy?: any;
  userId?: string;
}

export interface Risk {
  risk: string;
  impact: 'High' | 'Medium' | 'Low';
  mitigation: string;
}

export interface RiskAssessment {
  marketRisks: Risk[];
  financialRisks: Risk[];
  operationalRisks: Risk[];
  overallRiskScore: number;
}

export interface Competitor {
  name: string;
  strengths: string[];
  weaknesses: string[];
  marketShare: string;
  uniqueSellingPoints: string[];
}

export interface Milestone {
  title: string;
  description: string;
  deadline: string;
  status: 'pending' | 'completed' | 'at-risk';
  dependencies: string[];
}

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
  description: string;
  maturityLevel: 'emerging' | 'growing' | 'mature';
  relevanceScore: number;
  potentialImpact: string;
  implementationComplexity: 'high' | 'medium' | 'low';
  estimatedCost: string;
}

export interface BusinessModelCanvas {
  keyPartners: {
    partners: string[];
    strategicAlliances: string[];
    supplierRelationships: string[];
  };
  keyActivities: {
    activities: string[];
    processes: string[];
    operations: string[];
  };
  keyResources: {
    physical: string[];
    intellectual: string[];
    human: string[];
    financial: string[];
  };
  valuePropositions: {
    products: string[];
    services: string[];
    benefits: string[];
    uniqueFeatures: string[];
  };
  customerRelationships: {
    types: string[];
    strategies: string[];
    automationLevel: string;
  };
  channels: {
    marketing: string[];
    sales: string[];
    distribution: string[];
  };
  customerSegments: {
    segments: string[];
    characteristics: string[];
    needs: string[];
  };
  costStructure: {
    fixedCosts: string[];
    variableCosts: string[];
    economies: string[];
  };
  revenueStreams: {
    sources: string[];
    pricing: string[];
    strategies: string[];
  };
}

export interface MarketMetrics {
  marketSize: string;
  growthRate: string;
  competitorCount: number;
  customerAcquisitionCost: string;
}