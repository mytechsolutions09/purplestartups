import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function generateWebsitePrompt(idea: string) {
  const prompt = `Generate a detailed prompt for AI tools to create a website for the following startup idea: "${idea}"

The prompt should include:
1. Website purpose and target audience
2. Key features and functionality needed
3. Suggested pages and content structure
4. Design style and branding guidelines
5. Technical requirements
6. User experience considerations
7. Call-to-actions and conversion goals
8. SEO requirements
9. Mobile responsiveness guidelines
10. Integration requirements (if any)

Please format the response in a clear, structured way that can be directly used with AI tools like Claude or ChatGPT.`;

  const completion = await openai.createCompletion({
    model: "gpt-4", // or your preferred model
    prompt: prompt,
    max_tokens: 1000,
    temperature: 0.7,
  });

  return completion.data.choices[0].text?.trim() || '';
} 