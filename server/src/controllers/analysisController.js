import mongoose from 'mongoose';
import Analysis from '../models/Analysis.js';
import { requestAnalysis } from '../services/aiService.js';

// In-memory cache fallback in case MongoDB connection is offline
const memoryAnalyses = [];

export const createAnalysis = async (req, res, next) => {
  try {
    const { content, title, sourceUrl, contentType = 'claim', guestId } = req.body;

    if (!content || typeof content !== 'string' || content.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Content text must be at least 5 characters long.',
      });
    }

    if (content.length > 25000) {
      return res.status(400).json({
        success: false,
        message: 'Content exceeds the maximum allowable length of 25,000 characters.',
      });
    }

    // Call AI service / NLP engine
    const analysisResult = await requestAnalysis(content, title, sourceUrl);

    const recordData = {
      userId: req.user ? req.user._id : null,
      guestId: req.user ? null : (guestId || 'guest_session'),
      title: analysisResult.title || title || 'Untitled Analysis',
      sourceUrl: sourceUrl || '',
      content: content.trim(),
      contentType: contentType || 'claim',
      riskScore: analysisResult.riskScore,
      riskLevel: analysisResult.riskLevel,
      category: analysisResult.category,
      summary: analysisResult.summary,
      explanation: analysisResult.explanation,
      warningSignals: analysisResult.warningSignals || [],
      positiveSignals: analysisResult.positiveSignals || [],
      metrics: analysisResult.metrics || {},
      verificationSteps: analysisResult.verificationSteps || [],
      limitations: analysisResult.limitations,
      providerInfo: analysisResult.providerInfo,
    };

    let savedRecord;
    if (mongoose.connection.readyState === 1) {
      savedRecord = await Analysis.create(recordData);
    } else {
      // Memory fallback
      savedRecord = {
        ...recordData,
        _id: new mongoose.Types.ObjectId().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      memoryAnalyses.unshift(savedRecord);
    }

    res.status(201).json({
      success: true,
      data: savedRecord,
      message: 'Credibility analysis completed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalyses = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      riskLevel,
      category,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      guestId,
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const conditions = [];

    // Filter by user if logged in, or include guest's records + public demonstration audits
    if (req.user) {
      conditions.push({ userId: req.user._id });
    } else if (guestId) {
      conditions.push({
        $or: [
          { guestId: guestId },
          { guestId: null, userId: null },
          { guestId: 'guest_session' },
        ],
      });
    }

    if (riskLevel && riskLevel !== 'All') {
      conditions.push({ riskLevel });
    }

    if (category && category !== 'All') {
      conditions.push({ category });
    }

    if (search && search.trim()) {
      conditions.push({
        $or: [
          { title: { $regex: search.trim(), $options: 'i' } },
          { content: { $regex: search.trim(), $options: 'i' } },
          { category: { $regex: search.trim(), $options: 'i' } },
        ],
      });
    }

    const query = conditions.length > 0 ? { $and: conditions } : {};

    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    if (mongoose.connection.readyState === 1) {
      const total = await Analysis.countDocuments(query);
      const items = await Analysis.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean();

      return res.status(200).json({
        success: true,
        data: items,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum) || 1,
        },
      });
    }

    // Fallback from memory array
    let filtered = [...memoryAnalyses];
    if (req.user) {
      filtered = filtered.filter(a => String(a.userId) === String(req.user._id));
    }
    if (riskLevel && riskLevel !== 'All') {
      filtered = filtered.filter(a => a.riskLevel === riskLevel);
    }
    if (category && category !== 'All') {
      filtered = filtered.filter(a => a.category === category);
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(a => a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q));
    }

    filtered.sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      if (order === 'asc') return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });

    const paginated = filtered.slice(skip, skip + limitNum);

    res.status(200).json({
      success: true,
      data: paginated,
      pagination: {
        total: filtered.length,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(filtered.length / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalysisById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const item = await Analysis.findById(id);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Analysis report not found.',
        });
      }
      return res.status(200).json({
        success: true,
        data: item,
      });
    }

    const memItem = memoryAnalyses.find(a => String(a._id) === String(id));
    if (!memItem) {
      return res.status(404).json({
        success: false,
        message: 'Analysis report not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: memItem,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAnalysis = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const item = await Analysis.findById(id);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Analysis report not found.',
        });
      }

      // Check ownership if user logged in
      if (req.user && item.userId && String(item.userId) !== String(req.user._id)) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to delete this analysis report.',
        });
      }

      await Analysis.findByIdAndDelete(id);
      return res.status(200).json({
        success: true,
        message: 'Analysis report deleted successfully.',
      });
    }

    const idx = memoryAnalyses.findIndex(a => String(a._id) === String(id));
    if (idx === -1) {
      return res.status(404).json({
        success: false,
        message: 'Analysis report not found.',
      });
    }

    memoryAnalyses.splice(idx, 1);
    res.status(200).json({
      success: true,
      message: 'Analysis report deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
