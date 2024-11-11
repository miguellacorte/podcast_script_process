const OpenAI = require('openai');

console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables. Please check your .env.local file.');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateResponse(prompt, model, temperature, max_tokens) {
  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      temperature: temperature,
      max_tokens: max_tokens,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}

module.exports = { generateResponse };