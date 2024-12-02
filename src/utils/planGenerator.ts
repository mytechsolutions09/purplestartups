import type { StartupPlan } from '../types';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function generateStartupPlan(idea: string): Promise<StartupPlan> {
  const prompt = `Generate a comprehensive startup plan for the following idea: "${idea}"
  
  Include:
  1. Overview
  2. Problem statement
  3. Target market (demographics, psychographics, market size)
  4. Value proposition
  5. Implementation steps (with tasks, timelines, and resources)
  6. Key traits for success
  
  Format the response as a JSON object matching the StartupPlan type.`;

  try {
    const completion = await openai.createCompletion({
      model: "gpt-4",
      prompt: prompt,
      max_tokens: 2000,
      temperature: 0.7,
    });

    const planData = JSON.parse(completion.data.choices[0].text?.trim() || '{}');
    return planData as StartupPlan;
  } catch (error) {
    console.error('Error generating startup plan:', error);
    throw new Error('Failed to generate startup plan');
  }
}