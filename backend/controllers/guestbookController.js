const Guestbook = require('../models/Guestbook');

// @desc    Get all guestbook comments
// @route   GET /api/guestbook
// @access  Public
const getComments = async (req, res) => {
  try {
    const comments = await Guestbook.find().sort({ createdAt: 1 });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// @desc    Add a guestbook comment
// @route   POST /api/guestbook
// @access  Public
const addComment = async (req, res) => {
  try {
    const { author, avatar, text } = req.body;
    
    if (!author || !text) {
      return res.status(400).json({ error: 'Author and text are required' });
    }

    const newComment = new Guestbook({
      author,
      avatar: avatar || `https://ui-avatars.com/api/?name=${author}`,
      text
    });

    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    console.error('Error saving comment:', error);
    res.status(500).json({ error: 'Failed to save comment' });
  }
};

module.exports = {
  getComments,
  addComment
};
