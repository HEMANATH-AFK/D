import mongoose from 'mongoose';

/**
 * User schema representing registered accounts, profiling tags, skills, and domains.
 * Used for customizing AI-generated project suggestions.
 */
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  skills: [{ type: String }],
  interests: [{ type: String }],
  domain: { type: String, default: 'General' },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
