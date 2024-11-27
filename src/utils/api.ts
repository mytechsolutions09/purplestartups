import OpenAI from 'openai';
import type { StartupPlan, ResearchProject, TechnologyTrend, MarketingStrategy } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_ANYTHING_LLM_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateIdeasWithAI(concept: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: 'system',
          content: 'You are a startup ideation expert. Generate practical, market-viable new startup ideas. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: `Generate 12 innovative and viable startup ideas based on the concept: "${concept}". 
            Each idea should be unique, practical, and have market potential. 
            Respond with JSON in the format: {"ideas": ["idea1", "idea2", ...]}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    if (!response.choices?.[0]?.message?.content) {
      throw new Error('Invalid API response format');
    }

    const content = JSON.parse(response.choices[0].message.content);
    return content.ideas || [];
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate ideas');
  }
}

export async function generateStartupPlanWithAI(idea: string): Promise<StartupPlan> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: 'system',
          content: 'You are a startup planning expert. Generate detailed, actionable startup plans. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: `Create a detailed startup plan for: "${idea}". Include overview, problem statement, target market, and value proposition.
            Respond with JSON in the format:
            {
              "overview": "string",
              "problemStatement": "string",
              "targetMarket": {
                "demographics": ["string"],
                "psychographics": ["string"],
                "marketSize": "string"
              },
              "valueProposition": "string",
              "steps": [{
                "title": "string",
                "description": "string",
                "estimatedTimeframe": "string",
                "criticalFactors": ["string"],
                "tasks": [{
                  "title": "string",
                  "description": "string",
                  "timeline": "string",
                  "resources": ["string"],
                  "metrics": ["string"]
                }]
              }],
              "keyTraits": [{
                "title": "string",
                "description": "string"
              }]
            }`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    if (!response.choices?.[0]?.message?.content) {
      throw new Error('Invalid API response format');
    }

    const content = JSON.parse(response.choices[0].message.content);
    return {
      idea,
      overview: content.overview || '',
      problemStatement: content.problemStatement || '',
      targetMarket: {
        demographics: content.targetMarket?.demographics || [],
        psychographics: content.targetMarket?.psychographics || [],
        marketSize: content.targetMarket?.marketSize || ''
      },
      valueProposition: content.valueProposition || '',
      steps: content.steps || [],
      keyTraits: content.keyTraits || []
    };
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate startup plan');
  }
}

export async function getTrendingKeywords(): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: 'system',
          content: 'You are a startup trend analyst. Generate trending startup keywords. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: `Generate top 30 new trending startup keywords for 2024. 
            Respond with JSON in the format: {"keywords": ["keyword1", "keyword2", ...]}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    if (!response.choices?.[0]?.message?.content) {
      throw new Error('Invalid API response format');
    }

    const content = JSON.parse(response.choices[0].message.content);
    return content.keywords || [];
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch trending keywords');
  }
}

export async function getMarketAnalysis(idea: string): Promise<MarketMetrics> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: 'system',
          content: 'You are a market analysis expert. Generate realistic market metrics for startup ideas.'
        },
        {
          role: 'user',
          content: `Generate market analysis metrics for: "${idea}". Include market size, growth rate, competitor count, and customer acquisition cost.
            Respond with JSON in the format:
            {
              "marketSize": "string (e.g., $500M)",
              "growthRate": "string (e.g., 12.5% YoY)",
              "competitorCount": number,
              "customerAcquisitionCost": "string (e.g., $50-100)"
            }`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    if (!response.choices?.[0]?.message?.content) {
      throw new Error('Invalid API response format');
    }

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch market analysis');
  }
}

export async function generateRiskAssessment(idea: string): Promise<RiskAssessment> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: 'system',
          content: 'You are a startup risk assessment expert. Generate detailed risk analysis. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: `Analyze potential risks for the startup idea: "${idea}". 
            Include market risks, financial risks, operational risks, and mitigation strategies.
            Respond with JSON in the format:
            {
              "marketRisks": [{"risk": "string", "impact": "High|Medium|Low", "mitigation": "string"}],
              "financialRisks": [{"risk": "string", "impact": "High|Medium|Low", "mitigation": "string"}],
              "operationalRisks": [{"risk": "string", "impact": "High|Medium|Low", "mitigation": "string"}],
              "overallRiskScore": number
            }`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    if (!response.choices?.[0]?.message?.content) {
      throw new Error('Invalid API response format');
    }

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate risk assessment');
  }
}

export async function getCompetitorAnalysis(idea: string): Promise<Competitor[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: 'system',
          content: 'You are a competitive analysis expert. Generate detailed competitor analysis for startup ideas.'
        },
        {
          role: 'user',
          content: `Analyze potential competitors for the startup idea: "${idea}". 
            Include their strengths, weaknesses, market share, and unique selling points.
            Respond with JSON in the format:
            {
              "competitors": [{
                "name": "string",
                "strengths": ["string"],
                "weaknesses": ["string"],
                "marketShare": "string",
                "uniqueSellingPoints": ["string"]
              }]
            }`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    if (!response.choices?.[0]?.message?.content) {
      throw new Error('Invalid API response format');
    }

    const content = JSON.parse(response.choices[0].message.content);
    return content.competitors || [];
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch competitor analysis');
  }
}

export async function getResearchAndDevelopment(idea: string): Promise<{
  projects: ResearchProject[];
  trends: TechnologyTrend[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: 'system',
          content: 'You are an R&D expert. Generate detailed research projects and technology trends analysis. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: `Analyze R&D opportunities for the startup idea: "${idea}". 
            Include research projects and relevant technology trends.
            Respond with JSON in the format:
            {
              "projects": [{
                "id": "string",
                "title": "string",
                "description": "string",
                "status": "planning|in-progress|completed|on-hold",
                "priority": "high|medium|low",
                "timeline": "string",
                "budget": "string",
                "objectives": ["string"],
                "keyFindings": ["string"],
                "technicalChallenges": ["string"],
                "resources": ["string"]
              }],
              "trends": [{
                "name": "string",
                "description": "string",
                "maturityLevel": "emerging|growing|mature",
                "relevanceScore": number,
                "potentialImpact": "string",
                "implementationComplexity": "high|medium|low",
                "estimatedCost": "string"
              }]
            }`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    if (!response.choices?.[0]?.message?.content) {
      throw new Error('Invalid API response format');
    }

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch R&D analysis');
  }
}

export async function getMarketingStrategy(idea: string): Promise<MarketingStrategy> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: 'system',
          content: 'You are a marketing strategy expert. Generate comprehensive marketing plans for startups.'
        },
        {
          role: 'user',
          content: `Create a marketing strategy for: "${idea}". 
            Include channels, budget allocation, timeline, and KPIs.
            Respond with JSON in the format:
            {
              "channels": [{
                "name": "string",
                "description": "string",
                "priority": "high|medium|low",
                "estimatedBudget": "string",
                "expectedROI": "string",
                "tactics": ["string"]
              }],
              "timeline": [{
                "phase": "string",
                "duration": "string",
                "activities": ["string"],
                "goals": ["string"]
              }],
              "kpis": [{
                "metric": "string",
                "target": "string",
                "timeframe": "string"
              }],
              "budgetAllocation": {
                "total": "string",
                "breakdown": [{
                  "category": "string",
                  "percentage": number,
                  "amount": "string"
                }]
              }
            }`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    if (!response.choices?.[0]?.message?.content) {
      throw new Error('Invalid API response format');
    }

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate marketing strategy');
  }
}

export async function getTechnologyStack(idea: string): Promise<TechnologyStack[]> {
  const response = await fetch(`${API_BASE_URL}/api/technology/stack`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idea }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch technology stack');
  }

  return response.json();
}

export async function getTechnologyRoadmap(idea: string): Promise<TechnologyRoadmapItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/technology/roadmap`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idea }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch technology roadmap');
  }

  return response.json();
}

export async function getTechnologyTrends(idea: string): Promise<TechnologyTrend[]> {
  const response = await fetch(`${API_BASE_URL}/api/technology/trends`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idea }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch technology trends');
  }

  return response.json();
}

export async function getTechnicalDebt(idea: string): Promise<TechnicalDebtMetric[]> {
  const response = await fetch(`${API_BASE_URL}/api/technology/debt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idea }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch technical debt metrics');
  }

  return response.json();
}