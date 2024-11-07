const readline = require('readline');

async function executeUserInputModule(moduleDefinition) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(moduleDefinition.prompt, (answer) => {
      rl.close();
      resolve({ [moduleDefinition.output_key]: answer });
    });
  });
}

module.exports = { executeUserInputModule };
