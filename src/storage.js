const fs = require('fs').promises;
const path = require('path');
const config = require('./config');

async function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
}

async function saveResponse(prompt, response) {
  try {
    await ensureDirectoryExists(config.dataFile);
    const data = await readData();
    data.push({ id: Date.now(), prompt, response });
    await fs.writeFile(config.dataFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error saving response:", error.message);
    throw error;
  }
}

async function readData() {
  try {
    await ensureDirectoryExists(config.dataFile);
    const data = await fs.readFile(config.dataFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    console.error("Error reading data:", error.message);
    throw error;
  }
}

module.exports = { saveResponse, readData };