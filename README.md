# Orchet: AI Podcast Script Generator

A Node.js-based framework that generates engaging podcast scripts using AI. The system features a specialized podcast script generator that creates natural conversations between two hosts (Alex and Jane) on any given topic.

## Podcast Script Generator

The podcast script generator creates 15-20 minute podcast scripts through a multi-step process:

1. **User Input**: Asks for the topic/concept you want to create a podcast about
2. **Analysis & Brainstorming**: Analyzes the topic and generates key discussion points
3. **Script Generation**: Creates a detailed conversation between Alex and Jane
4. **Length Verification**: Ensures the script meets the minimum length requirement (2000 words)

### Prompt Files

Located in `workflows/podcast_script_generator/prompts/`:

- `analyze_and_brainstorm_prompt.js`: Analyzes the topic and creates discussion points
- `podcast_script_prompt.js`: Generates the actual podcast conversation
- `verify_length_prompt.js`: Verifies and expands the script if needed

### Script Format

The generated scripts follow a consistent structure:
- 2-3 minute introduction
- 10-15 minute main discussion (3-4 key points)
- 2-3 minute closing segment

## What is Orchet?

Orchet is an agent framework that:
- Executes AI workflows step by step
- Manages interactions with AI models (OpenAI, Anthropic)
- Handles state and data flow between steps
- Provides a modular architecture for creating complex AI workflows

### How Orchet Works

1. **Workflow Definition**: JSON files define the steps and their sequence
2. **Modules**: Different types of steps (prompts, user input, etc.)
3. **State Management**: Passes data between steps
4. **API Integration**: Handles communication with AI models

## Setup & Usage

1. **Installation**:
   ```bash
   git clone [repository-url]
   cd orchet
   npm install
   ```

2. **Configuration**:
   Create a `.env` file:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

3. **Running the Podcast Generator**:
   ```bash
   npm run workflow podcast_script_generator.json
   ```
   Follow the prompts to enter your topic.

4. **View Generated Scripts**:
   ```bash
   npm run view-runs
   ```

## File Structure

```
orchet/
├── src/                      # Core framework code
├── workflows/
│   └── podcast_script_generator/
│       ├── podcast_script_generator.json    # Workflow definition
│       └── prompts/                         # Prompt files
│           ├── analyze_and_brainstorm_prompt.js
│           ├── podcast_script_prompt.js
│           └── verify_length_prompt.js
└── workflow_runs/            # Generated scripts storage
```

## Features

- Generate natural, conversational podcast scripts
- Minimum 2000-word scripts (15-20 minutes)
- Two-host format (Alex and Jane)
- No Q&A sections or external guests
- Detailed examples and case studies
- Natural dialogue flow

## License

This project is open-source and available under the MIT License.