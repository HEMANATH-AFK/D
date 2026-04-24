import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import ideaRoutes from './routes/ideas.js';
import chatRoutes from './routes/chat.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.send('ProjectForge AI API');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log(`[Database] Attempting to connect to MongoDB URI: ${process.env.MONGODB_URI ? 'URI Configured' : 'Missing URI'}`);

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000 // 10s timeout to fail fast
})
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas successfully.');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    if (err.cause) console.error('Cause:', err.cause);
  });
