import type { StartupPlan, StartupStep } from '../types';

export function generateStartupPlan(idea: string): StartupPlan {
  // In a real implementation, this would call an AI API
  const steps: StartupStep[] = [
    {
      title: "Idea Validation & Problem Definition",
      description: "Validate the concept and clearly define the problem being solved",
      estimatedTimeframe: "4-6 weeks",
      criticalFactors: [
        "Problem clarity",
        "Market need validation",
        "Solution feasibility"
      ],
      tasks: [
        {
          title: "Problem Analysis",
          description: "Define and document the specific problem your solution addresses",
          timeline: "1 week",
          resources: ["Market research tools", "Customer interview templates"]
        },
        {
          title: "Market Validation",
          description: "Conduct surveys and interviews with potential customers",
          timeline: "2-3 weeks",
          resources: ["Survey tools", "Interview guides"],
          metrics: ["Interview completion rate", "Problem validation score"]
        },
        {
          title: "Competition Analysis",
          description: "Research existing solutions and market gaps",
          timeline: "1-2 weeks",
          resources: ["Competitor analysis framework", "Market research databases"]
        }
      ]
    },
    {
      title: "Market Research & Analysis",
      description: "Deep dive into market dynamics and customer segments",
      estimatedTimeframe: "3-4 weeks",
      criticalFactors: [
        "Market size validation",
        "Customer segment clarity",
        "Competitive landscape understanding"
      ],
      tasks: [
        {
          title: "Target Audience Definition",
          description: "Create detailed customer personas and segment analysis",
          timeline: "1-2 weeks",
          resources: ["Demographics data", "Psychographics analysis tools"]
        },
        {
          title: "Market Size Assessment",
          description: "Calculate TAM, SAM, and SOM for your market",
          timeline: "1 week",
          resources: ["Market sizing templates", "Industry reports"]
        },
        {
          title: "Competitive Analysis",
          description: "Detailed analysis of direct and indirect competitors",
          timeline: "1-2 weeks",
          resources: ["Competitive analysis framework"]
        }
      ]
    },
    {
      title: "Business Plan Development",
      description: "Create a comprehensive business strategy and financial model",
      estimatedTimeframe: "4-5 weeks",
      criticalFactors: [
        "Financial viability",
        "Clear revenue model",
        "Realistic projections"
      ],
      tasks: [
        {
          title: "Revenue Model Definition",
          description: "Design and validate your revenue streams",
          timeline: "1-2 weeks",
          resources: ["Business model canvas", "Revenue model templates"]
        },
        {
          title: "Financial Projections",
          description: "Create detailed financial forecasts and budgets",
          timeline: "2 weeks",
          resources: ["Financial modeling templates"],
          estimatedCost: "Varies by industry"
        },
        {
          title: "Strategic Planning",
          description: "Define short and long-term business objectives",
          timeline: "1 week",
          resources: ["Strategic planning framework"]
        }
      ]
    }
  ];

  return {
    idea,
    overview: `A comprehensive plan to bring ${idea} to market, focusing on validation, planning, and execution.`,
    problemStatement: `This solution addresses the growing need for ${idea.toLowerCase()} in today's market.`,
    targetMarket: {
      demographics: ["Age: 25-45", "Urban professionals", "Tech-savvy users"],
      psychographics: ["Value-conscious", "Early adopters", "Quality-focused"],
      marketSize: "$500M - $1B annually"
    },
    valueProposition: `Delivering innovative ${idea.toLowerCase()} solutions that enhance efficiency and user experience.`,
    steps,
    keyTraits: [
      {
        title: "Customer-Centric Approach",
        description: "Keep users at the center of all decisions"
      },
      {
        title: "Data-Driven Decision Making",
        description: "Use metrics and feedback to guide development"
      },
      {
        title: "Agile Execution",
        description: "Maintain flexibility to adapt to market changes"
      }
    ]
  };
}