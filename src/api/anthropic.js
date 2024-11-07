const Anthropic = require('@anthropic-ai/sdk');
const config = require('../config');

const anthropic = new Anthropic({
  apiKey: config.anthropicApiKey,
});

async function generateAnthropicResponse(promptData) {
  try {
    const response = await anthropic.messages.create({
      model: promptData.model,
      max_tokens: promptData.max_tokens,
      temperature: promptData.temperature,
      system: promptData.systemPrompt,
      messages: [
        { role: "user", content: promptData.userPrompt }
      ],
      tools: [{
        name: promptData.responseSchema.name,
        description: "Ensure the response adheres to the specified JSON schema.",
        input_schema: promptData.responseSchema.schema
      }],
      tool_choice: { type: "tool", name: promptData.responseSchema.name }
    });

    if (response && response.content && response.content[0] && response.content[0].type === 'tool_use') {
      return response.content[0].input;
    } else {
      console.error("Invalid response format:", response);
      return null;
    }
  } catch (error) {
    console.error("Error calling Anthropic API:", error);
    return null;
  }
}

module.exports = { generateAnthropicResponse };