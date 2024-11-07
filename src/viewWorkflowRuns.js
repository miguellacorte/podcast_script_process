const { getWorkflowRuns, readWorkflowRun } = require('./workflowRuns');

function displayStepDetails(step, result) {
  console.log(`\nStep: ${step}`);
  console.log(`Type: ${result.type}`);
  
  if (result.systemPrompt) {
    console.log('System Prompt:');
    console.log(result.systemPrompt);
  }
  
  if (result.userPrompt) {
    console.log('User Prompt:');
    console.log(result.userPrompt);
  }
  
  if (result.model) {
    console.log(`Model: ${result.model}`);
  }
  
  if (result.response) {
    console.log('Response:');
    console.log(JSON.stringify(result.response, null, 2));
  }
  
  if (result.error) {
    console.log('Error:');
    console.log(result.error);
  }
}

async function viewWorkflowRuns() {
  try {
    const runs = await getWorkflowRuns();

    if (runs.length === 0) {
      console.log("No workflow runs found.");
      return;
    }

    console.log("Available workflow runs:");
    runs.forEach((run, index) => {
      console.log(`${index + 1}. ${run}`);
    });

    // You can add user input here to select a specific run to view in detail
    // For now, we'll just display the latest run

    const latestRun = runs[runs.length - 1];
    const runData = await readWorkflowRun(latestRun);

    console.log("\nLatest Workflow Run:");
    console.log(`Workflow: ${runData.workflowName}`);
    console.log(`Timestamp: ${runData.timestamp}`);
    console.log("\nResults:");
    Object.entries(runData.results).forEach(([step, result]) => {
      displayStepDetails(step, result);
    });

  } catch (error) {
    console.error("Error viewing workflow runs:", error.message);
  }
}

viewWorkflowRuns();