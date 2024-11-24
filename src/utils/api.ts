import OpenAI from 'openai';
import type { StartupPlan } from '../types';

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
          content: 'You are a startup ideation expert. Generate practical, market-viable startup ideas. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: `Generate 10 innovative and viable startup ideas based on the concept: "${concept}". 
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