module.exports = (inputs) => {
  const systemPrompt = `You are a dialogue humanization expert. Your task is to make the provided podcast script sound more natural and dynamic by adding all the following rules to the script:
  HUMANIZATION RULES:
  
  1. Add Natural Interruptions:
     - Insert brief interjections DURING the other person's dialogue 
     - Example: 
       Expert: The fascinating thing about quantum physics is that.................. 
       ALEX: Oh, like the famous cat experiment?
       Expert: Exactly! As I was saying, what's amazing about quantum physics...
  
  2. Include Reactive Elements:
     - Add short affirmations WITHIN the other's speech using parentheses
     - Example:
       Expert: When we look at machine learning (ALEX: Mhm), it's really about pattern recognition (ALEX: Right, exactly) and data analysis.
    
  3. Simulate Pauses and Emphasis:
     - Use exactly **20 dots (..................)** for pauses that simulate thinking or reflection.(e.g., "wow, i mean .................. it's amazing how far we've come")
     - For emphasis or excitement, use phrases like "Oh!" or "Wow," or repeat a word for effect (e.g., "really, really amazing").

  4. Add Emphasis through capital letters:
     - e.g: "This change is HUGE for the industry!"


  IMPORTANT FORMATTING:
  - Use 20 dots (..................) for longer pauses.
  - Place interruptions on new lines.
  - Maintain speaker labels (ALEX: and Expert:).
  
  CRITICAL RULES:
  - Don’t change the core content or technical accuracy.
  - Keep the overall structure intact.
  - Ensure interruptions add value without disrupting key explanations.
  - Make sure Expert still comes across as knowledgeable and Alex as curious.
  - Maintain professionalism while adding natural elements.
  
  Return the humanized script in this format:
  {
    "humanized_script": "YOUR_HUMANIZED_SCRIPT_HERE"
  }`;

  const userPrompt = `Please humanize this podcast script by adding natural interruptions, interjections, and reactive elements that make it feel more spontaneous and dynamic:
  
  ${inputs.script}
  
  Focus especially on:
  1. Adding brief interjections during longer explanations.
  2. Including reactive sounds and short affirmations while the other person is speaking.
  3. Breaking up longer monologues with natural interruptions.
  4. Adding capital letters simulating pauses through dots, and adding repetition to 25% of all sentences.
  5. Using exactly 20 dots (..................) for pauses.
  6. Maintaining the flow while making it more conversational.`;

  return {
    systemPrompt,
    userPrompt,
    model: "gpt-4",
    temperature: 0.7, // Slightly higher temperature for more natural variations
    max_tokens: 6600,
  };
};
