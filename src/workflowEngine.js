require('dotenv').config();

const fs = require('fs').promises;
const path = require('path');
const { executePromptModule } = require('./modules/promptModule');
const { executeSaveModule } = require('./modules/saveModule');
const { executeUserInputModule } = require('./modules/userInputModule');
const { executeDecisionModule } = require('./modules/decisionModule');
const { resolveInputs } = require('./utils/inputResolver');
const { executeDisplayModule } = require('./modules/displayModule');
const { saveWorkflowRun } = require('./workflowRuns');
const { exec } = require('child_process');

class Workflow {
  constructor(definition, workflowDir) {
    this.name = definition.name;
    this.steps = definition.steps;
    this.initialStep = definition.initial_step;
    this.workflowDir = workflowDir;
    console.log('Workflow directory set to:', this.workflowDir); // Add this line
  }

  static async loadFromFile(filePath) {
    const workflowName = path.basename(filePath, '.json');
    const fullPath = path.resolve(process.cwd(), 'workflows', workflowName, filePath);
    const workflowDir = path.dirname(fullPath);
    console.log('Full workflow path:', fullPath); // Add this line
    console.log('Workflow directory:', workflowDir); // Add this line
    const data = await fs.readFile(fullPath, 'utf8');
    const definition = JSON.parse(data);
    return new Workflow(definition, workflowDir);
  }
}

async function executeWorkflow(workflowFile) {
  const workflow = await Workflow.loadFromFile(workflowFile);
  const results = {};
  let currentStep = workflow.initialStep;

  while (currentStep) {
    const stepDefinition = workflow.steps[currentStep];
    console.log(`Executing step: ${currentStep}`);
    // console.log('Step definition:', JSON.stringify(stepDefinition, null, 2));
    
    if (!stepDefinition) {
      console.error(`Step definition not found for step: ${currentStep}`);
      break;
    }

    const resolvedInputs = stepDefinition.inputs ? resolveInputs(stepDefinition.inputs, results) : {};
    // console.log(`Resolved inputs for ${currentStep}:`, resolvedInputs);

    try {
      const response = await executeModule(stepDefinition, resolvedInputs, results, workflow);
      // console.log(`Response from ${currentStep}:`, response);
      results[currentStep] = response;
      currentStep = getNextModule(stepDefinition, response);
    } catch (error) {
      console.error(`Error in step ${currentStep}:`, error);
      results[currentStep] = { error: error.message };
      currentStep = null;
    }
  }

  await saveWorkflowRun(workflow.name, results);

  return results;
}

async function executeModule(moduleDefinition, resolvedInputs, results, workflow) {
  if (!moduleDefinition) {
    throw new Error('Module definition is undefined');
  }

  switch (moduleDefinition.type) {
    case 'prompt':
      return await executePromptModule(moduleDefinition, resolvedInputs, workflow);
    case 'save':
      return await executeSaveModule(moduleDefinition, results);
    case 'user_input':
      return await executeUserInputModule(moduleDefinition);
    case 'decision':
      return await executeDecisionModule(moduleDefinition, resolvedInputs, workflow);
    case 'display':
      return await executeDisplayModule(moduleDefinition, resolvedInputs, results);
    default:
      throw new Error(`Unsupported module type: ${moduleDefinition.type}`);
  }
}

function getNextModule(moduleDefinition, response) {
  if (moduleDefinition.type === 'decision') {
    return moduleDefinition.next[response.decision];
  }
  return moduleDefinition.next;
}

async function runWorkflow() {
  const workflowFile = process.argv[2];
  
  if (!workflowFile) {
    console.log("Please provide a workflow file name as an argument.");
    return;
  }

  const fileExtension = path.extname(workflowFile);

  if (fileExtension !== '.json') {
    console.log("The workflow file must be a JSON file.");
    return;
  }

  try {
    const results = await executeWorkflow(workflowFile);
    console.log("Workflow execution complete. Opening results in browser...");
    exec('open http://localhost:3000');  // For macOS
    // Use 'start' instead of 'open' for Windows
    // Use 'xdg-open' for Linux
  } catch (error) {
    console.error("Error executing workflow:", error.message);
  }
}

runWorkflow();