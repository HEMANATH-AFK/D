import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  skills: [{ type: String }],
  interests: [{ type: String }],
  domain: { type: String, default: 'General' },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
