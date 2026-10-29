import express from 'express';
import { getDashboardMetrics } from '../controllers/dashboardController.js';
import { optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/metrics', optionalProtect, getDashboardMetrics);

export default router;
