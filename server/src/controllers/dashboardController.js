import mongoose from 'mongoose';
import Analysis from '../models/Analysis.js';
import { checkAIHealth } from '../services/aiService.js';

export const getDashboardMetrics = async (req, res, next) => {
  try {
    const aiStatus = await checkAIHealth();
    const isDbConnected = mongoose.connection.readyState === 1;

    let totalAnalyses = 0;
    let highRiskCount = 0;
    let moderateRiskCount = 0;
    let lowRiskCount = 0;
    let avgRiskScore = 0;
    let categoryDistribution = [];
    let dailyTrend = [];
    let recentAnalyses = [];

    const userFilter = req.user ? { userId: req.user._id } : {};

    if (isDbConnected) {
      totalAnalyses = await Analysis.countDocuments(userFilter);

      if (totalAnalyses > 0) {
        highRiskCount = await Analysis.countDocuments({ ...userFilter, riskLevel: 'High Risk' });
        moderateRiskCount = await Analysis.countDocuments({ ...userFilter, riskLevel: 'Moderate Risk' });
        lowRiskCount = await Analysis.countDocuments({ ...userFilter, riskLevel: 'Low Risk' });

        // Calculate average score
        const scoreAgg = await Analysis.aggregate([
          { $match: userFilter },
          { $group: { _id: null, avgScore: { $avg: '$riskScore' } } },
        ]);
        avgRiskScore = scoreAgg.length > 0 ? Math.round(scoreAgg[0].avgScore) : 0;

        // Category breakdown aggregation
        const catAgg = await Analysis.aggregate([
          { $match: userFilter },
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]);
        categoryDistribution = catAgg.map(c => ({
          name: c._id || 'Uncategorized',
          value: c.count,
        }));

        // Recent analyses
        recentAnalyses = await Analysis.find(userFilter)
          .sort({ createdAt: -1 })
          .limit(6)
          .select('_id title category riskScore riskLevel createdAt sourceUrl')
          .lean();

        // 7-day trends aggregation
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const trendAgg = await Analysis.aggregate([
          {
            $match: {
              ...userFilter,
              createdAt: { $gte: sevenDaysAgo },
            },
          },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              count: { $sum: 1 },
              avgScore: { $avg: '$riskScore' },
            },
          },
          { $sort: { _id: 1 } },
        ]);

        dailyTrend = trendAgg.map(t => ({
          date: t._id,
          analyses: t.count,
          avgRisk: Math.round(t.avgScore),
        }));
      }
    }

    // If trend data is empty (e.g. brand new database), construct 7-day baseline slots with real counts
    if (dailyTrend.length === 0) {
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        dailyTrend.push({
          date: dateStr,
          analyses: 0,
          avgRisk: 0,
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        kpis: {
          totalAnalyses,
          highRiskCount,
          moderateRiskCount,
          lowRiskCount,
          avgRiskScore,
          highRiskRatio: totalAnalyses > 0 ? Math.round((highRiskCount / totalAnalyses) * 100) : 0,
        },
        categoryDistribution,
        dailyTrend,
        recentAnalyses,
        systemHealth: {
          databaseConnected: isDbConnected,
          aiService: aiStatus,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
