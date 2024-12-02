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
          content: `Generate top 20 new trending startup keywords for 2024. 
            Respond with JSON in the format: {"keywords": ["keyword1", "keyword2", ...]}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
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

export interface TrendingKeyword {
  keyword: string;
  score: number;
  category: string;
  relatedEvents: string[];
  predictedGrowth: number;
  confidence: number;
  timeframe: string;
  marketImpact: 'Low' | 'Medium' | 'High';
  industryFocus: string[];
  geographicRelevance: string[];
}

export async function getPredictedTrendingKeywords(): Promise<TrendingKeyword[]> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: "system",
          content: "You are an expert business trend analyst. Return only valid JSON without any additional text or explanation."
        },
        {
          role: "user",
          content: `Generate 6 trending business keywords based on current world events and market conditions.
          Return the data in this exact JSON structure:
          {
            "keywords": [
              {
                "keyword": "string",
                "score": number,
                "category": "string",
                "relatedEvents": ["string"],
                "predictedGrowth": number,
                "confidence": number,
                "timeframe": "string",
                "marketImpact": "High|Medium|Low",
                "industryFocus": ["string"],
                "geographicRelevance": ["string"]
              }
            ]
          }
          
          Ensure each trend is:
          - Data-driven and specific
          - Actionable for businesses
          - Based on verifiable current events
          - Relevant to modern market conditions`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      top_p: 0.9,
    });

    const responseText = completion.choices[0].message.content || '';
    
    try {
      // Parse the response directly
      const response = JSON.parse(responseText);
      
      // Validate and transform the response
      if (response?.keywords && Array.isArray(response.keywords)) {
        return response.keywords.map((k: any) => ({
          keyword: String(k.keyword || ''),
          score: Number(k.score || 0),
          category: String(k.category || ''),
          relatedEvents: Array.isArray(k.relatedEvents) ? k.relatedEvents.map(String) : [],
          predictedGrowth: Number(k.predictedGrowth || 0),
          confidence: Number(k.confidence || 0),
          timeframe: String(k.timeframe || ''),
          marketImpact: k.marketImpact || 'Medium',
          industryFocus: Array.isArray(k.industryFocus) ? k.industryFocus.map(String) : [],
          geographicRelevance: Array.isArray(k.geographicRelevance) ? k.geographicRelevance.map(String) : []
        }));
      }

      console.error('Invalid response structure:', response);
      return [];
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError, 'Raw response:', responseText);
      return [];
    }
  } catch (error) {
    console.error('Error fetching trending keywords:', error);
    throw new Error('Failed to generate trending keywords');
  }
}

export const generateWebsitePrompt = async (idea: string): Promise<string> => {
  if (!idea) {
    throw new Error('Idea is required');
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_ANYTHING_LLM_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a website design expert who creates detailed prompts for AI website generation."
          },
          {
            role: "user",
            content: `Create a detailed website design prompt for the following startup idea: ${idea}

Please include:
1. Recommended website sections and pages
2. Key features and functionality
3. Design style and branding recommendations
4. Content requirements
5. User experience considerations
6. Technical requirements
7. Call-to-action suggestions
8. SEO recommendations

Make the prompt detailed enough for an AI tool to generate a complete website design.`
          }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating website prompt:', error);
    throw error;
  }
};