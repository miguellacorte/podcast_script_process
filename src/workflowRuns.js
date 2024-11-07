const fs = require('fs').promises;
const path = require('path');

const WORKFLOW_RUNS_DIR = path.join(process.cwd(), 'workflow_runs');

async function ensureDirectoryExists(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

async function saveWorkflowRun(workflowName, results) {
  await ensureDirectoryExists(WORKFLOW_RUNS_DIR);

  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const fileName = `${workflowName}_${timestamp}.json`;
  const filePath = path.join(WORKFLOW_RUNS_DIR, fileName);

  const runData = {
    workflowName,
    timestamp,
    results
  };

  await fs.writeFile(filePath, JSON.stringify(runData, null, 2));
  console.log(`Workflow run saved: ${filePath}`);
}

async function getWorkflowRuns() {
  await ensureDirectoryExists(WORKFLOW_RUNS_DIR);

  const files = await fs.readdir(WORKFLOW_RUNS_DIR);
  return files.filter(file => file.endsWith('.json'));
}

async function readWorkflowRun(fileName) {
  const filePath = path.join(WORKFLOW_RUNS_DIR, fileName);
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

module.exports = {
  saveWorkflowRun,
  getWorkflowRuns,
  readWorkflowRun
};