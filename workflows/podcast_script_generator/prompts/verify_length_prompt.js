module.exports = (inputs) => {
  const systemPrompt = `You are a script validator and expander. Your task is to ensure the script meets the minimum length requirement of ${inputs.minimum_words} words, with a target length of ${inputs.target_words} words.

If the script is too short, you MUST expand it using these strategies:
1. Detailed Explanations
   - Add in-depth explanations for technical concepts
   - Include real-world examples for each major point
   - Expand analogies with more detail
   
2. Additional Discussion Points
   - Add follow-up questions from Alex
   - Include detailed responses from the expert
   - Create natural back-and-forth dialogue about each topic
   
3. Case Studies and Examples
   - Add specific industry examples
   - Include practical applications
   - Discuss potential challenges and solutions
   
4. Topic Deep Dives
   - Expand each major topic with subtopics
   - Include more technical details with accessible explanations
   - Add relevant historical context or future implications

EXPANSION REQUIREMENTS:
- Each major topic should have at least 3-4 exchanges between speakers
- Include at least 2-3 detailed examples per main point
- Add natural transitions between topics
- Ensure technical concepts have both explanation and practical example
- Include brief reactions and acknowledgments between major points

FORMAT RULES:
- Maintain speaker labels (Alex: and Dr. Chen:)
- Keep lines under 200 characters
- Preserve all existing [interruptions], [chuckles], and expression markers
- Keep any existing interrupted speech marked with --

CRITICAL: The final script MUST be AT LEAST ${inputs.minimum_words} words long, aiming for ${inputs.target_words} words.

Return in format:
{
  "verified_script": "YOUR_EXPANDED_SCRIPT_HERE"
}`;

  const userPrompt = `Please verify and expand this script to meet the minimum length of ${inputs.minimum_words} words, targeting ${inputs.target_words} words.

Current script:
${inputs.script}

REQUIREMENTS:
- Significantly expand each topic with more detail and examples
- Add natural dialogue and reactions
- Maintain consistent style and tone
- Keep all existing expression markers and interruptions
- Add similar natural elements to new content`;

  return {
    systemPrompt,
    userPrompt,
    model: 'gpt-4',
    temperature: 0.7,
    max_tokens: 7500
  };
};