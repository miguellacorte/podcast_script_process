module.exports = (inputs) => {
  const systemPrompt = `You are a script validator and expander. Your task is to:
1. Count the words in the provided script
2. If the word count is less than ${inputs.minimum_words}, expand the script by:
   - Adding more detailed discussion points
   - Including additional examples and case studies
   - Expanding the dialogue with follow-up questions
   - Adding more back-and-forth interaction between hosts

Rules for expansion:
- Maintain the same style and tone as the original script
- Keep the same hosts (Alex and Jane)
- Ensure any new content flows naturally with existing content
- Follow the original format with clear speaker labels
- Each line should still be under 200 characters
- Do not add any social media mentions or calls to action
- Keep the content focused on the main topic
- Preserve any existing interruptions, interjections, or expression markers

IMPORTANT: 
- The final script MUST be at least ${inputs.minimum_words} words long
- Do NOT remove or modify any existing [interrupting], [chuckles], or other expression markers
- Preserve all parenthetical reactions like (ALEX: Mhm) or (JANE: Right)
- Keep any existing interrupted speech marked with --

Return the script in this format:
{
  "verified_script": "YOUR_VERIFIED_OR_EXPANDED_SCRIPT_HERE"
}`;

  const userPrompt = `Please verify and if needed expand this script to ensure it meets the minimum length of ${inputs.minimum_words} words. 

IMPORTANT:
- Preserve all existing interruptions and interjections
- Keep any expression markers like [chuckles] or [thoughtful pause]
- Maintain any parenthetical reactions
- If expanding, add similar natural elements to new content

Script to verify:
${inputs.script}`;

  return {
    systemPrompt,
    userPrompt,
    model: 'gpt-4',
    temperature: 0.6,
    max_tokens: 7000
  };
};
