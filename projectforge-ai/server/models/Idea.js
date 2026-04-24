import mongoose from 'mongoose';

const ideaSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  techStack: [{ type: String }],
  difficultyLevel: { type: String },
  innovationScore: { type: Number },
  feasibilityScore: { type: Number },
  cost: { type: String },
  resumeValue: { type: String },
  impact: { type: String },
  embedding: { type: [Number], index: true }, // Simple index for vector search later
}, { timestamps: true });

export default mongoose.model('Idea', ideaSchema);
