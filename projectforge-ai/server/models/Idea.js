import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema({
  innovationScore: Number,
  feasibilityScore: Number,
  complexityScore: Number,
  marketRelevanceScore: Number,
  overallScore: Number,
  pros: [String],
  cons: [String],
  feedback: String,
  timestamp: { type: Date, default: Date.now }
});

const ideaSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  problem_statement: { type: String },
  solution: { type: String },
  tech_stack: [{ type: String }],
  uniqueness_factor: { type: String },
  
  // Validation info
  isUnique: Boolean,
  similarityResults: Object,
  
  // Evaluation info
  evaluations: [evaluationSchema], // Array to support versioning/re-evaluation
  
  // Architecture info
  architecture: {
    frontend: Object,
    backend: Object,
    database: Object,
    services: [String],
    deployment: Object
  },
  
  // Improvement info
  improvements: Object,
  
  // Versioning
  version: { type: Number, default: 1 },
  parentIdea: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea' }, // For versioning
  
  embedding: { type: [Number], index: true },
}, { timestamps: true });

export default mongoose.model('Idea', ideaSchema);
