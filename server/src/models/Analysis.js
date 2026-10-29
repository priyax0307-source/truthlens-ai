import mongoose from 'mongoose';

const warningSignalSchema = new mongoose.Schema(
  {
    signal: { type: String, required: true },
    severity: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    category: { type: String, default: 'Linguistic Alert' },
    description: { type: String, required: true },
    example: { type: String, default: '' },
  },
  { _id: false }
);

const positiveSignalSchema = new mongoose.Schema(
  {
    signal: { type: String, required: true },
    category: { type: String, default: 'Credibility Marker' },
    description: { type: String, required: true },
  },
  { _id: false }
);

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    guestId: {
      type: String,
      default: null,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      maxLength: [200, 'Title cannot exceed 200 characters'],
      default: 'Untitled Analysis',
    },
    sourceUrl: {
      type: String,
      trim: true,
      default: '',
    },
    content: {
      type: String,
      required: [true, 'Analysis content is required'],
      maxLength: [25000, 'Content cannot exceed 25,000 characters'],
    },
    contentType: {
      type: String,
      enum: ['article', 'social_post', 'claim', 'statement'],
      default: 'claim',
    },
    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      index: true,
    },
    riskLevel: {
      type: String,
      enum: ['Low Risk', 'Moderate Risk', 'High Risk'],
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      default: 'General Claim',
      index: true,
    },
    summary: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      required: true,
    },
    warningSignals: [warningSignalSchema],
    positiveSignals: [positiveSignalSchema],
    metrics: {
      wordCount: { type: Number, default: 0 },
      sentenceCount: { type: Number, default: 0 },
      avgSentenceLength: { type: Number, default: 0 },
      capsRatio: { type: Number, default: 0 },
      exclamationCount: { type: Number, default: 0 },
      sensationalismScore: { type: Number, default: 0 },
      attributionScore: { type: Number, default: 0 },
      urgencyScore: { type: Number, default: 0 },
      readingTimeSeconds: { type: Number, default: 0 },
    },
    verificationSteps: [{ type: String }],
    limitations: {
      type: String,
      required: true,
    },
    providerInfo: {
      providerId: { type: String, default: 'heuristic-nlp-v1' },
      providerName: { type: String, default: 'TruthLens Heuristic NLP Engine' },
      providerMode: { type: String, default: 'demo_heuristic' },
      disclaimer: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for search
analysisSchema.index({ title: 'text', content: 'text', category: 'text' });

const Analysis = mongoose.model('Analysis', analysisSchema);
export default Analysis;
