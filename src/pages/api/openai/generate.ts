import { Configuration, OpenAIApi } from 'openai';
import type { NextApiRequest, NextApiResponse } from 'next';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { prompt, temperature = 0.7, max_tokens = 1000 } = req.body;

    const completion = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct",
      prompt,
      temperature,
      max_tokens,
    });

    const response = completion.data.choices[0].text;
    
    // Parse the response as JSON
    try {
      const parsedResponse = JSON.parse(response || '{}');
      res.status(200).json(parsedResponse);
    } catch (error) {
      console.error('Failed to parse OpenAI response:', error);
      res.status(500).json({ message: 'Failed to parse AI response' });
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ message: 'Error generating content' });
  }
} 