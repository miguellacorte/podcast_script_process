const { saveResponse } = require('../storage');

async function executeSaveModule(moduleDefinition, results) {
  const { inputs } = moduleDefinition;
  const dataToSave = {};

  for (const [key, value] of Object.entries(inputs)) {
    if (typeof value === 'string' && value.startsWith('${') && value.endsWith('}')) {
      const [moduleId, path] = value.slice(2, -1).split('.');
      // Check if the module and path exist before accessing
      if (results[moduleId] && results[moduleId][path] !== undefined) {
        dataToSave[key] = results[moduleId][path];
      } else {
        // If the path doesn't exist, skip this field
        console.log(`Skipping undefined field: ${key}`);
      }
    } else {
      dataToSave[key] = value;
    }
  }

  await saveResponse(moduleDefinition.name, JSON.stringify(dataToSave));
  return dataToSave;
}

module.exports = { executeSaveModule };