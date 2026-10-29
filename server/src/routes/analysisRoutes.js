import express from 'express';
import {
  createAnalysis,
  getAnalyses,
  getAnalysisById,
  deleteAnalysis,
} from '../controllers/analysisController.js';
import { optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(optionalProtect, createAnalysis)
  .get(optionalProtect, getAnalyses);

router.route('/:id')
  .get(optionalProtect, getAnalysisById)
  .delete(optionalProtect, deleteAnalysis);

export default router;
