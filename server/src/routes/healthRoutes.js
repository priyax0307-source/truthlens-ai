import express from 'express';
import mongoose from 'mongoose';
import { checkAIHealth } from '../services/aiService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const aiHealth = await checkAIHealth();
  const dbConnected = mongoose.connection.readyState === 1;

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      server: {
        status: 'healthy',
        uptime: Math.round(process.uptime()),
      },
      database: {
        status: dbConnected ? 'connected' : 'disconnected',
        target: process.env.MONGO_URI
          ? (process.env.MONGO_URI.includes('mongodb+srv') || process.env.MONGO_URI.includes('mongodb.net')
              ? 'mongodb_atlas'
              : 'custom_uri')
          : 'not_configured',
        host: dbConnected ? mongoose.connection.host : null,
        name: dbConnected ? mongoose.connection.name : null,
      },
      aiService: aiHealth,
    },
  });
});

export default router;
