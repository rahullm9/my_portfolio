require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// --- DATABASE CONNECTION ---
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    if (!process.env.MONGODB_URI) {
      console.error('CRITICAL: MONGODB_URI is not defined');
      return;
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
  }
};

// --- SCHEMA ---
const guestbookSchema = new mongoose.Schema({
  author: { type: String, required: true },
  avatar: { type: String },
  email: { type: String },
  text: { type: String, required: true },
}, { timestamps: true });

const Guestbook = mongoose.models.Guestbook || mongoose.model('Guestbook', guestbookSchema);

// --- APP INITIALIZATION ---
const app = express();

app.use(cors({
  origin: ['https://rahullm9.github.io', 'https://rahulmahato-portfolio.vercel.app', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// --- ROUTES ---

// Middleware to ensure DB is connected for every request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// GET Comments
app.get('/api/guestbook', async (req, res) => {
  try {
    const comments = await Guestbook.find().sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST Comment
app.post('/api/guestbook', async (req, res) => {
  try {
    const { author, avatar, text, email } = req.body;
    if (!author || !text) {
      return res.status(400).json({ error: 'Author and text are required' });
    }
    const newComment = await Guestbook.create({ author, avatar, text, email });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Consolidated backend is running' });
});

module.exports = app;
