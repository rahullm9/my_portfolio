require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const guestbookRoutes = require('./routes/guestbookRoutes');

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['https://rahullm9.github.io', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Main Routes Hub
app.use('/api/guestbook', guestbookRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running' });
});

// 404 Fallback for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'API route not found' });
});

// Local dev: start the server normally
// Vercel: export the app to be used as a serverless function
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;
