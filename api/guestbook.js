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

// --- HANDLER ---
module.exports = async (req, res) => {
  // Add CORS headers manually for standalone function
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await connectDB();

  if (req.method === 'GET') {
    try {
      const comments = await Guestbook.find().sort({ createdAt: -1 });
      return res.status(200).json(comments);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { author, avatar, text, email } = req.body;
      if (!author || !text) {
        return res.status(400).json({ error: 'Author and text are required' });
      }
      const newComment = await Guestbook.create({ author, avatar, text, email });
      return res.status(201).json(newComment);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
