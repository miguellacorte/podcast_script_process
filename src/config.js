require('dotenv').config({ path: '.env' });

module.exports = {
  openaiApiKey: process.env.OPENAI_API_KEY,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  dataFile: './data/responses.json',
};