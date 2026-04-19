export default function handler(req, res) {
  res.status(200).json({ 
    message: 'ESM test success', 
    env: process.env.NODE_ENV,
    time: new Date().toISOString() 
  });
}
