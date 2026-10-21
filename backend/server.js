const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware — enable all dev origins (localhost, 127.0.0.1, LAN IP)
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/citizen', require('./routes/citizen'));
app.use('/api/friday', require('./routes/ai')); // FRIDAY uses same AI routes
app.use('/api/traffic', require('./routes/traffic'));
app.use('/api/disease', require('./routes/disease'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'VietCarbon AI — Vietnam Smart Sustainability Platform',
    version: '1.0.0',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    ai: process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here' ? 'configured' : 'not configured',
    diseaseSystem: 'online',
    email: ((process.env.SMTP_USER || process.env.GMAIL_USER) && (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD)) ? 'SMTP configured' : 'mock mode',
    elevenLabs: process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID ? 'configured' : 'not configured',
    timestamp: new Date().toISOString(),
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  const primaryUri = process.env.MONGODB_URI;
  const localFallbackUri = 'mongodb://127.0.0.1:27017/vietcarbonai';
  let dbStatus = 'disconnected';

  if (primaryUri) {
    try {
      await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 5000 });
      console.log('✓ MongoDB connected');
      dbStatus = 'connected';
    } catch (err) {
      console.warn(`Primary MongoDB connection failed (${err.message}). Attempting local fallback...`);
    }
  }

  if (dbStatus !== 'connected') {
    try {
      await mongoose.connect(localFallbackUri, { serverSelectionTimeoutMS: 3000 });
      console.log(`✓ MongoDB connected to local fallback: ${localFallbackUri}`);
      dbStatus = 'connected';
    } catch (localErr) {
      console.error('Local MongoDB connection failed:', localErr.message);
      console.log('\nTo fix: Update MONGODB_URI in backend/.env or run local MongoDB on port 27017\n');
    }
  }

  app.listen(PORT, () => {
    console.log(`\n🌿 GreenAgentOS Backend running on port ${PORT} (${dbStatus === 'connected' ? 'DB online' : 'DB offline'})`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🤖 AI: ${process.env.GROQ_API_KEY ? 'Groq connected' : 'Fallback mode'}`);
    console.log(`📧 Email: ${(process.env.SMTP_USER || process.env.GMAIL_USER) ? 'SMTP configured' : 'Mock mode'}`);
    console.log(`🔊 ElevenLabs: ${process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID ? 'configured' : 'not configured'}\n`);
  });
}

startServer();
