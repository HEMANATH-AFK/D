import express from 'express';
import Idea from '../models/Idea.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';
import { generateEmbedding } from '../ai/rag.js';
import { generateIdeas } from '../engines/ideaEngine.js';
import { validateIdea } from '../engines/validationEngine.js';
import { evaluateIdea } from '../engines/evaluationEngine.js';
import { generateArchitecture } from '../engines/architectureEngine.js';
import { suggestImprovements } from '../engines/improvementEngine.js';
import { compareIdeas } from '../engines/comparisonEngine.js';

const router = express.Router();

/**
 * @route   POST /api/ideas/generate
 * @desc    Generate unique project ideas based on user profile
 */
router.post('/generate', auth, async (req, res) => {
  try {
    console.log(`[API] POST /api/ideas/generate - User ID: ${req.user.id}`);
    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const ideas = await generateIdeas(user, 3);
    
    res.json({ success: true, data: ideas });
  } catch (error) {
    console.error("❌ GENERATE ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to generate ideas", error: error.message });
  }
});

/**
 * @route   POST /api/ideas/save
 * @desc    Save selected idea and run initial validation/evaluation
 */
router.post('/save', auth, async (req, res) => {
  try {
    const { ideaData } = req.body;
    if (!ideaData || !ideaData.title) {
      return res.status(400).json({ message: "Incomplete idea data provided" });
    }

    const newIdea = new Idea({
      ...ideaData,
      user: req.user.id
    });

    // Neural Pre-processing
    const validation = await validateIdea(newIdea);
    newIdea.isUnique = validation.isUnique;
    newIdea.similarityResults = validation;

    const evaluation = await evaluateIdea(newIdea);
    newIdea.evaluations = [evaluation];

    const embedding = await generateEmbedding(`${newIdea.title} ${newIdea.description}`);
    if (embedding) newIdea.embedding = embedding;

    await newIdea.save();
    console.log(`✅ Idea Saved: ${newIdea.title}`);

    res.status(201).json({ success: true, data: newIdea });
  } catch (error) {
    console.error("❌ SAVE ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to save idea", error: error.message });
  }
});

/**
 * @route   GET /api/ideas/architecture/:id
 * @desc    Fetch or generate architectural blueprint
 */
router.get('/architecture/:id', auth, async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).json({ message: "Idea ID required" });

    const idea = await Idea.findOne({ _id: req.params.id, user: req.user.id });
    if (!idea) return res.status(404).json({ message: "Idea not found" });

    if (idea.architecture && Object.keys(idea.architecture).length > 0) {
      return res.json(idea.architecture);
    }

    console.log(`🧠 Synthesizing architecture for: ${idea.title}`);
    const architecture = await generateArchitecture(idea);
    
    idea.architecture = architecture;
    await idea.save();

    res.json(architecture);
  } catch (error) {
    console.error("❌ ARCHITECTURE ERROR:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

/**
 * @route   GET /api/ideas/improve/:id
 * @desc    Fetch or generate improvement suggestions
 */
router.get('/improve/:id', auth, async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).json({ message: "Idea ID required" });

    const idea = await Idea.findOne({ _id: req.params.id, user: req.user.id });
    if (!idea) return res.status(404).json({ message: "Idea not found" });

    const improvements = await suggestImprovements(idea);
    idea.improvements = improvements;
    await idea.save();

    res.json(improvements);
  } catch (error) {
    console.error("❌ IMPROVEMENT ERROR:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

/**
 * @route   POST /api/ideas/compare
 * @desc    Cross-analyze two ideas
 */
router.post('/compare', auth, async (req, res) => {
  try {
    const { idA, idB } = req.body;
    if (!idA || !idB) return res.status(400).json({ message: "Two ideas (idA, idB) required for comparison" });

    const [ideaA, ideaB] = await Promise.all([
      Idea.findById(idA),
      Idea.findById(idB)
    ]);

    if (!ideaA || !ideaB) return res.status(404).json({ message: "One or both ideas not found" });

    const result = await compareIdeas(ideaA, ideaB);
    res.json(result);
  } catch (error) {
    console.error("❌ COMPARE ERROR:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

/**
 * @route   GET /api/ideas/history
 * @desc    Get user's project archive
 */
router.get('/history', auth, async (req, res) => {
  try {
    const ideas = await Idea.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(ideas);
  } catch (error) {
    console.error("❌ HISTORY ERROR:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

/**
 * @route   GET /api/ideas/:id
 * @desc    Get single idea details
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const idea = await Idea.findOne({ _id: req.params.id, user: req.user.id });
    if (!idea) return res.status(404).json({ message: "Idea not found" });
    res.json(idea);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

/**
 * @route   GET /api/ideas/stats/trending
 * @desc    Get trending tech stack statistics
 */
router.get('/stats/trending', auth, async (req, res) => {
  try {
    const stats = await Idea.aggregate([
      { $unwind: "$tech_stack" },
      { $group: { _id: "$tech_stack", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

export default router;
