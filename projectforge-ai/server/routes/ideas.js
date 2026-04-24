import express from 'express';
import Idea from '../models/Idea.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';
import { generateEmbedding, generateIdea } from '../ai/rag.js';

const router = express.Router();

// Helper for cosine similarity
function cosineSimilarity(A, B) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < A.length; i++) {
    dotProduct += A[i] * B[i];
    normA += A[i] * A[i];
    normB += B[i] * B[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

router.post('/generate', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Fetch all existing ideas to prevent duplicates
    const existingIdeas = await Idea.find({}, 'title description embedding');
    const existingTitles = existingIdeas.map(i => i.title);

    let isDuplicate = true;
    let attempts = 0;
    let newIdeaData;
    let newEmbedding;

    // Retry loop to ensure uniqueness
    while (isDuplicate && attempts < 3) {
      attempts++;
      newIdeaData = await generateIdea(user, existingTitles);
      newEmbedding = await generateEmbedding(`${newIdeaData.title} ${newIdeaData.description}`);
      
      if (!newEmbedding) {
        return res.status(500).json({ message: 'Failed to generate embedding' });
      }

      // Check similarity
      isDuplicate = false;
      for (const idea of existingIdeas) {
        if (idea.embedding && idea.embedding.length > 0) {
          const sim = cosineSimilarity(newEmbedding, idea.embedding);
          if (sim > 0.8) {
            isDuplicate = true;
            break;
          }
        }
      }
    }

    if (isDuplicate) {
      return res.status(500).json({ message: 'Failed to generate a unique idea after multiple attempts. Please try again.' });
    }

    const newIdea = new Idea({
      ...newIdeaData,
      user: req.user.id,
      embedding: newEmbedding
    });

    await newIdea.save();
    
    res.status(201).json({
      success: true,
      data: newIdea
    });
  } catch (error) {
    console.error(`[API Error] POST /api/ideas/generate:`, error);
    res.status(500).json({ 
      success: false, 
      error: "Server error generating idea. The AI provider might be experiencing high traffic." 
    });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const ideas = await Idea.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching ideas' });
  }
});

// Semantic search route
router.post('/search', auth, async (req, res) => {
  try {
    const { query } = req.body;
    const queryEmbedding = await generateEmbedding(query);
    
    if (!queryEmbedding) return res.status(400).json({ message: "Failed to process query" });

    const allIdeas = await Idea.find({ user: req.user.id });
    
    const scoredIdeas = allIdeas.map(idea => ({
      ...idea.toObject(),
      score: idea.embedding ? cosineSimilarity(queryEmbedding, idea.embedding) : 0
    })).sort((a, b) => b.score - a.score).slice(0, 5); // top 5

    res.json(scoredIdeas);
  } catch (error) {
    res.status(500).json({ message: 'Server error searching ideas' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const idea = await Idea.findOne({ _id: req.params.id, user: req.user.id });
    if (!idea) return res.status(404).json({ message: 'Idea not found' });
    res.json(idea);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching idea' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const idea = await Idea.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!idea) return res.status(404).json({ message: 'Idea not found' });
    res.json({ message: 'Idea deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting idea' });
  }
});

export default router;
