import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import Analysis from './models/Analysis.js';
import { analyzeTextFallback } from './utils/fallbackAnalyzer.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly resolve server/.env first, then root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: {
    success: false,
    message: 'Too many requests from this IP address, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Body parsers
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/analyses', analysisRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/health', healthRoutes);

// Root ping
app.get('/', (req, res) => {
  res.json({
    name: 'TruthLens AI API Gateway',
    version: '1.0.0',
    status: 'online',
    documentation: '/api/health',
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Seed initial realistic demonstration records if database is empty
const seedSampleDataIfEmpty = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return;
    }
    const count = await Analysis.countDocuments();
    if (count === 0) {
      console.log('[Seed] Populating initial demonstration analysis records...');
      const seedItems = [
        {
          title: 'Viral Health Claim: 100% Miracle Herbal Remedy Cures All Arthritis',
          content: 'SHOCKING revelation! Doctors are BANNED from discussing this 100% guaranteed miracle remedy. What big pharma is hiding will blow your mind. Share this everywhere before it is deleted by authorities! Millions have already cured their joint pain overnight without surgery.',
          sourceUrl: 'https://example-viral-post.org/health-breakthrough',
        },
        {
          title: 'Unverified Leak: Secret Insider Confirms Energy Grid Sabotage',
          content: 'An anonymous top insider confirms what everyone knows: a deep state cover-up is actively poisoning our municipal energy grids. Mainstream media is lying to you and refuses to broadcast the explosive leak.',
          sourceUrl: 'https://example-social-forum.net/post/92841',
        },
        {
          title: 'Clinical Trial: New Targeted Immunotherapy Shows Efficacy in Phase II',
          content: 'According to researchers at Oxford University and data published in the peer-reviewed Lancet Oncology journal, preliminary findings suggest that the targeted monoclonal antibody therapy demonstrated improved response rates. However, the authors noted that further research is needed and clinical trials are ongoing.',
          sourceUrl: 'https://www.reuters.com/health/oncology-phase2-trial-results',
        },
        {
          title: 'Crypto Hype: Guaranteed 500% ROI Using Automated Secret Algorithm',
          content: 'Get rich quick with this secret crypto code! 100% proven returns guaranteed within 48 hours. The financial elite don\'t want you to know how everyday investors are exploiting this free money glitch.',
          sourceUrl: 'https://telegram-channel-crypto-wealth.io',
        },
        {
          title: 'Official Bureau: Consumer Price Index Moderates in September',
          content: 'According to the official report released by the Bureau of Labor Statistics on Tuesday, consumer price inflation cooled to 2.4% annualized. Economists surveyed by Reuters remarked that while core goods prices flattened, housing service costs remained slightly elevated.',
          sourceUrl: 'https://apnews.com/article/economy-inflation-cpi-september',
        },
      ];

      for (const item of seedItems) {
        const analyzed = analyzeTextFallback(item.content, item.title, item.sourceUrl);
        await Analysis.create({
          title: item.title,
          sourceUrl: item.sourceUrl,
          content: item.content,
          contentType: 'claim',
          riskScore: analyzed.riskScore,
          riskLevel: analyzed.riskLevel,
          category: analyzed.category,
          summary: analyzed.summary,
          explanation: analyzed.explanation,
          warningSignals: analyzed.warningSignals,
          positiveSignals: analyzed.positiveSignals,
          metrics: analyzed.metrics,
          verificationSteps: analyzed.verificationSteps,
          limitations: analyzed.limitations,
          providerInfo: analyzed.providerInfo,
        });
      }
      console.log('[Seed] 5 initial demonstration records created successfully.');
    }
  } catch (err) {
    console.warn('[Seed Warning] Could not check or seed initial data:', err.message);
  }
};

// Start Server
const startServer = async () => {
  await connectDB();
  await seedSampleDataIfEmpty();

  app.listen(PORT, () => {
    console.log(`[TruthLens Server] REST API listening on http://localhost:${PORT}`);
  });
};

startServer();
