import axios from 'axios';
import { analyzeTextFallback } from '../utils/fallbackAnalyzer.js';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

/**
 * Dispatch content analysis to Python FastAPI NLP service.
 * Resiliently falls back to local Node.js NLP engine if microservice is offline.
 */
export const requestAnalysis = async (content, title = '', sourceUrl = '') => {
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/api/v1/analyze`,
      { content, title, sourceUrl },
      { timeout: 7000 }
    );

    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error('Invalid format returned by Python AI service');
  } catch (err) {
    console.warn(`[AI Service Notice] Python microservice unavailable (${err.message}). Using local Node.js fallback analyzer.`);
    return analyzeTextFallback(content, title, sourceUrl);
  }
};

/**
 * Query Python AI microservice health.
 */
export const checkAIHealth = async () => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/health`, { timeout: 3000 });
    return {
      connected: true,
      service: response.data.service || 'TruthLens AI Python Service',
      mode: response.data.mode || 'demo_heuristic',
      activeProvider: response.data.activeProvider || 'Heuristic NLP Engine',
    };
  } catch (err) {
    return {
      connected: false,
      service: 'Node.js Fallback Engine (Python microservice standby)',
      mode: 'fallback_heuristic',
      error: err.message,
    };
  }
};
