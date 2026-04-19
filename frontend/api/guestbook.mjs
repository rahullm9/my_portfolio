import mongoose from 'mongoose';

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
  reactions: {
    like: { type: Number, default: 0 },
    heart: { type: Number, default: 0 },
    rocket: { type: Number, default: 0 }
  }
}, { timestamps: true });

const Guestbook = mongoose.models.Guestbook || mongoose.model('Guestbook', guestbookSchema);

// --- HANDLER ---
export default async function handler(req, res) {
  // Add CORS headers manually for standalone function
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
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

  if (req.method === 'PATCH') {
    try {
      const { id, reactionType } = req.body;
      if (!id || !reactionType) {
        return res.status(400).json({ error: 'Comment ID and reactionType are required' });
      }

      const allowedReactions = ['like', 'heart', 'rocket'];
      if (!allowedReactions.includes(reactionType)) {
        return res.status(400).json({ error: 'Invalid reaction type' });
      }

      const updatedComment = await Guestbook.findByIdAndUpdate(
        id,
        { $inc: { [`reactions.${reactionType}`]: 1 } },
        { new: true }
      );

      if (!updatedComment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      return res.status(200).json(updatedComment);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
