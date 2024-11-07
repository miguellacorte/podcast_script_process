require('dotenv').config();
require('dotenv').config({ path: '.env.local', override: true });

if (!process.env.OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY is not set in environment variables.');
  console.error('Please ensure you have a valid API key in your .env.local file.');
  process.exit(1);
}

const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const OpenAI = require("openai");

const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());

app.use(express.static('public'));
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.get('/runs', async (req, res) => {
    const runsDir = path.join(__dirname, 'workflow_runs');
    const files = await fs.readdir(runsDir);
    const runFiles = files.filter(file => file.endsWith('.json'));
    res.json(runFiles);
});

app.get('/run/:filename', async (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'workflow_runs', filename);
    
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        res.json(jsonData);
    } catch (error) {
        res.status(404).send('File not found');
    }
});

app.post('/format-text', async (req, res) => {
    try {
        const { text } = req.body;
        console.log('Received text to format:', text);

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant that formats text to be more readable. Add appropriate line breaks, indentation, and spacing to improve readability. If it's a list or outline, format it with proper indentation and bullet points or numbers. if the text is a script or dialogue, follow principles and conventions of the format you're given." },
                { role: "user", content: `Please format the following text to be more readable:\n\n${text}` }
            ],
        });
        
        let formattedText = response.choices[0].message.content;
        console.log('Formatted text from OpenAI:', formattedText);
        
        // Try to parse as JSON, but if it fails, just return the formatted text
        try {
            const jsonObject = JSON.parse(formattedText);
            formattedText = JSON.stringify(jsonObject, null, 2);
            console.log('Parsed and re-stringified as JSON');
        } catch (error) {
            console.log('Not valid JSON, returning formatted text as-is');
        }
        
        res.json({ formattedText });
    } catch (error) {
        console.error('Error formatting text:', error);
        res.status(500).json({ error: 'Error formatting text' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});