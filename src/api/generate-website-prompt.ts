import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateWebsitePrompt(idea: string) {
  if (!idea) {
    throw new Error('Idea is required');
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a website design expert who creates detailed prompts for AI website generation."
        },
        {
          role: "user",
          content: `Generate a detailed prompt for AI tools to create a website for the following startup idea: "${idea}"

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

Please format the response in a clear, structured way that can be directly used with AI tools like Claude or ChatGPT.`
        }
      ],
      temperature: 0.7
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating website prompt:', error);
    throw error;
  }
} 