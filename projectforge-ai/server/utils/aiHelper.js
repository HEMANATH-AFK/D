/**
 * Robustly parses JSON from AI responses using regex to extract the first JSON object or array.
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
 * Calculates a basic Jaccard similarity between two strings based on words.
 * This is a lightweight alternative to external libraries.
 */
export const getSimilarity = (str1, str2) => {
  const s1 = new Set(str1.toLowerCase().split(/\s+/));
  const s2 = new Set(str2.toLowerCase().split(/\s+/));
  const intersection = new Set([...s1].filter(x => s2.has(x)));
  const union = new Set([...s1, ...s2]);
  return intersection.size / union.size;
};

/**
 * Filters out ideas that are too similar to existing ones.
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
