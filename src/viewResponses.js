const { readData } = require('./storage');

async function viewResponses() {
  const data = await readData();
  
  if (data.length === 0) {
    console.log("No responses found.");
    return;
  }

  data.forEach(item => {
    console.log(`ID: ${item.id}`);
    console.log(`Prompt: ${item.prompt}`);
    console.log(`Response: ${item.response}`);
    console.log('---');
  });
}

viewResponses();