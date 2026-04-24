import express from 'express';
import { auth } from '../middleware/auth.js';
import { chatWithBot } from '../ai/rag.js';
import Idea from '../models/Idea.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { messages } = req.body;
    console.log(`[API] POST /api/chat - User: ${req.user.id}`);
    
    // RAG: Retrieve user's past ideas as context
    const ideas = await Idea.find({ user: req.user.id }).limit(5);
    
    try {
      const reply = await chatWithBot(messages, ideas);
      res.json({
        success: true,
        data: {
          message: reply,
          metadata: { contextIdeasUsed: ideas.length }
        }
      });
    } catch (chatError) {
      console.error(`[API Error] chatWithBot final failure:`, chatError.message);
      // Fallback message so the UI doesn't break
      res.json({
        success: true, // we still return success to the UI but with a fallback message
        data: {
          message: "I'm currently experiencing high traffic or network issues with the AI provider. However, I can still help you review your past ideas from the dashboard!",
          metadata: { fallback: true }
        }
      });
    }
  } catch (error) {
    console.error(`[API Error] POST /api/chat:`, error);
    res.status(500).json({ 
      success: false, 
      error: "Server error during chat initialization" 
    });
  }
});

export default router;
