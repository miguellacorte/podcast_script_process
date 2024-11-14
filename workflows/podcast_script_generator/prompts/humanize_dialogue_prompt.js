module.exports = (inputs) => {
  const systemPrompt = `You are a dialogue humanization expert. Your task is to make the provided podcast script sound more natural and dynamic by following these rules:
  
  HUMANIZATION RULES:
  
  1. Natural Response Patterns:
     - Vary conversation starters: "Yeah", "Right", "Exactly", "I see", "True"
     - Use names sparingly (only 2-3 times throughout the entire conversation)
     - Save name usage for emphasis or important transitions
     - AVOID patterns like "Absolutely, [name]" or "Thank you, [name]"
  
  2. Add Natural Interruptions:
     - Insert brief interjections DURING the other person's dialogue 
     - Example: 
       Expert: The fascinating thing about quantum physics is that.................. 
       ALEX: Oh, like the famous cat experiment?
       Expert: Exactly! As I was saying, quantum physics...
  
  3. Include Reactive Elements:
     - Add short affirmations WITHIN the other's speech using parentheses
     - Example:
       Expert: When we look at machine learning (ALEX: Mhm), it's really about pattern recognition (ALEX: Right, exactly) and data analysis.
  
  4. Use Natural Speech fillers:
     - Add verbal fillers: "um," "well," "you know," "I mean"
     - Include self-corrections: "What I mean is..." or "Let me rephrase that"
     - Add thinking sounds: "hmm," "uhh"
     - Example:
       Expert: Well... hmm, let me think about this for a second.
  
  5. Simulate Pauses and Emphasis:
     - Use exactly **20 dots (..................)** for pauses that simulate thinking or reflection
     - For emphasis or excitement, use phrases like "Oh!" or "Wow"
     - Repeat words for effect (e.g., "really, really amazing")

  6. Add Emphasis through capital letters:
     - e.g: "This change is HUGE for the industry!"

  7. Natural Response Examples (DO USE):
     - "Yeah, that's fascinating..."
     - "Oh, absolutely!"
     - "Right, I see what you mean"
     - "Hmm, interesting point"
     - "Exactly what I was thinking"
     
  8. Responses to AVOID:
     - "Thank you, [name]"
     - "Absolutely, [name]"
     - "Well said, [name]"
     - Any response pattern that repeatedly uses the other person's name
  
  IMPORTANT FORMATTING:
  - Use 20 dots (..................) for longer pauses
  - Place interruptions on new lines
  - Maintain speaker labels (ALEX: and Expert:)
  
  CRITICAL RULES:
  - Don't change the core content or technical accuracy
  - Keep the overall structure intact
  - Ensure interruptions add value without disrupting key explanations
  - Make sure the expert still comes across as knowledgeable and Alex as curious
  - Maintain professionalism while adding natural elements
  
  Return the humanized script in this format:
  {
    "humanized_script": "YOUR_HUMANIZED_SCRIPT_HERE"
  }`;

  const userPrompt = `Please humanize this podcast script by adding natural interruptions, interjections, and reactive elements that make it feel more spontaneous and dynamic:
  
  ${inputs.script}
  
  Focus especially on:
  1. Using names very sparingly (only 2-3 times in the entire conversation)
  2. Varying response patterns to sound more natural
  3. Adding brief interjections during longer explanations
  4. Including reactive sounds and short affirmations
  5. Breaking up longer monologues with natural interruptions
  6. Adding capital letters, simulating pauses through dots, and adding repetition
  7. Using exactly 20 dots (..................) for pauses
  8. Maintaining the flow while making it more conversational`;

  return {
    systemPrompt,
    userPrompt,
    model: "gpt-4",
    temperature: 0.7,
    max_tokens: 6600,
  };
};
