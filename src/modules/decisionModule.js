const { generateResponse } = require('../api/openai');
const path = require('path');
const fs = require('fs');

async function executeDecisionModule(moduleDefinition, resolvedInputs, workflow) {
  try {
    let promptFile = moduleDefinition.prompt_file;
    if (!promptFile.startsWith('prompts/')) {
      promptFile = path.join('prompts', promptFile);
    }
    const promptFilePath = path.resolve(workflow.workflowDir, promptFile);
    const prompt = require(promptFilePath);
    const promptData = prompt(resolvedInputs);

    const response = await generateResponse(promptData);

    return response;
  } catch (error) {
    console.error(`Error in decision module:`, error);
    return null;
  }
}

module.exports = { executeDecisionModule };