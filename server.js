console.log('Current working directory:', process.cwd());

require('dotenv').config({ path: '.env.local' });

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
const port = 3001;

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

        // First, try to parse if it's JSON
        let scriptContent = text;
        try {
            const jsonContent = JSON.parse(text);
            if (jsonContent.humanized_script) {
                scriptContent = jsonContent.humanized_script;
            } else if (jsonContent.podcast_script) {
                scriptContent = jsonContent.podcast_script;
            } else if (jsonContent.script_with_fillers) {
                scriptContent = jsonContent.script_with_fillers;
            } else if (jsonContent.verified_script) {
                scriptContent = jsonContent.verified_script;
            }
        } catch (e) {
            // Not JSON, use text as is
            console.log('Not JSON content, using raw text');
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { 
                    role: "system", 
                    content: `You are a script formatting expert. Format the provided text with these rules:
                        1. Add proper line breaks between speakers
                        2. Add an empty line between different speakers' dialogues
                        3. Keep speaker labels (ALEX: and Expert:) in bold or caps
                        4. Preserve all existing formatting markers like (...) or [...]
                        5. Maintain any existing emphasis (CAPS, italics)
                        6. Format any lists or structured content with proper indentation
                        7. Return the text in HTML format with appropriate tags
                        8. Use <br> for line breaks and <p> for paragraphs
                        9. Use <strong> for speaker names
                        10. Preserve exact spacing for pauses (..................)`
                },
                { 
                    role: "user", 
                    content: `Please format this script for readability:\n\n${scriptContent}` 
                }
            ],
        });
        
        let formattedText = response.choices[0].message.content;
        
        // Add CSS styling wrapper
        formattedText = `
            <div style="
                font-family: Arial, sans-serif;
                line-height: 1.6;
                max-width: 800px;
                margin: 20px auto;
                padding: 20px;
                background-color: #f9f9f9;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            ">
                ${formattedText}
            </div>
        `;
        
        res.json({ formattedText });
    } catch (error) {
        console.error('Error formatting text:', error);
        res.status(500).json({ error: 'Error formatting text' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});