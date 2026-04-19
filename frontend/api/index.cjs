try {
  const app = require('./backend/server.js');
  module.exports = app;
} catch (error) {
  module.exports = (req, res) => {
    res.status(500).json({
      error: 'Functional Invocation Failed during initialization',
      message: error.message,
      stack: error.stack,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        HAS_MONGO_URI: !!process.env.MONGODB_URI
      }
    });
  };
}
