const { generateResponse } = require('../api/openai');
const path = require('path');
const fs = require('fs');

async function executePromptModule(moduleDefinition, inputs, workflow) {
  // console.log('Executing prompt module:', JSON.stringify(moduleDefinition, null, 2));
  // console.log('Inputs:', JSON.stringify(inputs, null, 2));

  const promptFile = path.join(workflow.workflowDir, moduleDefinition.prompt_file);
  console.log('Full prompt file path:', promptFile);
  
  if (!fs.existsSync(promptFile)) {
    console.error('Prompt file does not exist:', promptFile);
    throw new Error(`Prompt file not found: ${promptFile}`);
  }

  const promptModule = require(promptFile);
  const promptConfig = promptModule(inputs);

  try {
    const response = await generateResponse(
      promptConfig.userPrompt,
      promptConfig.model,
      promptConfig.temperature,
      promptConfig.max_tokens
    );

    console.log('API response:', response);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(response);
    } catch (error) {
      console.warn('Response is not valid JSON, wrapping in an object');
      parsedResponse = { [moduleDefinition.output_key || 'response']: response };
    }

    // console.log('Parsed response:', JSON.stringify(parsedResponse, null, 2));
    
    // Include system and user prompts in the response
    return {
      ...parsedResponse,
      systemPrompt: promptConfig.systemPrompt,
      userPrompt: promptConfig.userPrompt
    };
  } catch (error) {
    console.error('Error in prompt module:', error);
    throw error;
  }
}

module.exports = { executePromptModule };