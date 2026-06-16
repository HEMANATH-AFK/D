/**
 * Robustly parses JSON from AI responses using regex to extract the first JSON object or array.
 * 
 * @param {string} text - Raw string output from the AI model.
 * @returns {Object|Array|null} The parsed JSON object or array, or null if parsing fails.
 */
export const safeJSONParse = (text) => {
  try {
    if (!text) return null;
    const match = text.match(/[\[{][\s\S]*[\]}]/);
    if (!match) return null;
    return JSON.parse(match[0]);
  } catch (err) {
    console.error("❌ JSON PARSE ERROR:", err.message);
    return null;
  }
};

/**
 * Calculates a Jaccard similarity coefficient between two strings based on tokenized words.
 * 
 * @param {string} str1 - First string for comparison.
 * @param {string} str2 - Second string for comparison.
 * @returns {number} Jaccard similarity coefficient (0 to 1).
 */
export const getSimilarity = (str1, str2) => {
  const s1 = new Set(str1.toLowerCase().split(/\s+/));
  const s2 = new Set(str2.toLowerCase().split(/\s+/));
  const intersection = new Set([...s1].filter(x => s2.has(x)));
  const union = new Set([...s1, ...s2]);
  return intersection.size / union.size;
};

/**
 * Filters out generated project ideas that exceed the similarity threshold against existing ideas.
 * 
 * @param {Array<Object>} newIdeas - Array of newly generated idea candidates.
 * @param {Array<Object>} existingIdeas - Array of historically saved ideas.
 * @param {number} [threshold=0.4] - The Jaccard similarity threshold for rejection.
 * @returns {Array<Object>} Filtered list of ideas.
 */
export const filterDuplicates = (newIdeas, existingIdeas, threshold = 0.4) => {
  return newIdeas.filter(newIdea => {
    return !existingIdeas.some(existing => {
      const titleSim = getSimilarity(newIdea.title, existing.title);
      const descSim = getSimilarity(newIdea.description, existing.description);
      return titleSim > threshold || descSim > threshold;
    });
  });
};
