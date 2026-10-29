import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { ScoreGauge } from '../components/ScoreGauge';
import { RiskBadge } from '../components/RiskBadge';
import { SignalCard } from '../components/SignalCard';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import {
  Sparkles,
  RotateCcw,
  Send,
  Copy,
  ExternalLink,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Bookmark,
  FileText,
  Info,
  Clock,
  Check,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

export const AnalyzePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [contentType, setContentType] = useState('claim');
  
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Check if routed from Landing Page presets
  useEffect(() => {
    if (location.state?.presetContent) {
      setContent(location.state.presetContent);
      if (location.state?.presetTitle) {
        setTitle(location.state.presetTitle);
      }
    }
  }, [location.state]);

  const presetExamples = [
    {
      name: 'Viral Health Cure',
      title: 'Miracle Remedy Suppressed by Authorities',
      text: 'SHOCKING! Doctors are BANNED from discussing this 100% guaranteed miracle remedy. What big pharma is hiding will blow your mind. Share this everywhere before it is deleted by authorities! Millions have already cured their joint pain overnight.',
      url: 'https://example-viral-post.org/miracle-cure',
      type: 'social_post',
    },
    {
      name: 'Peer-Reviewed Science',
      title: 'Phase II Oncology Trial Results',
      text: 'According to researchers at Oxford University and data published in the peer-reviewed Lancet Oncology journal, preliminary findings suggest that the targeted monoclonal antibody therapy demonstrated improved response rates. However, the authors noted that further research is needed and clinical trials are ongoing.',
      url: 'https://www.reuters.com/health/oncology-phase2-trial-results',
      type: 'article',
    },
    {
      name: 'Conspiracy Leak',
      title: 'Unverified Grid Infiltration Claim',
      text: 'An anonymous top insider confirms what everyone knows: a deep state cover-up is actively poisoning our municipal energy grids. Mainstream media is lying to you and refuses to broadcast this explosive leak.',
      url: 'https://example-forum.net/unverified-leak',
      type: 'claim',
    },
    {
      name: 'Crypto Hype',
      title: 'Guaranteed 500% ROI Algorithm',
      text: 'Get rich quick with this secret crypto code! 100% proven returns guaranteed within 48 hours. The financial elite don\'t want you to know how everyday investors are exploiting this free money glitch.',
      url: 'https://telegram-crypto-wealth.example/promo',
      type: 'social_post',
    },
  ];

  const handleLoadPreset = (preset) => {
    setTitle(preset.title);
    setContent(preset.text);
    setSourceUrl(preset.url);
    setContentType(preset.type);
    setResult(null);
    showToast('info', `Loaded preset: "${preset.name}"`);
  };

  const handleClear = () => {
    setTitle('');
    setContent('');
    setSourceUrl('');
    setResult(null);
  };

  const handleAnalyze = async (e) => {
    e?.preventDefault();
    if (!content.trim() || content.trim().length < 5) {
      showToast('error', 'Please enter at least 5 characters to analyze.');
      return;
    }

    setAnalyzing(true);
    setAnalysisStep(1);

    // Multi-stage animated progress simulation
    const timer1 = setTimeout(() => setAnalysisStep(2), 400);
    const timer2 = setTimeout(() => setAnalysisStep(3), 800);

    try {
      const data = await api.analyzeContent({
        title: title.trim(),
        content: content.trim(),
        sourceUrl: sourceUrl.trim(),
        contentType,
      });

      setTimeout(() => {
        setResult(data);
        setAnalyzing(false);
        setAnalysisStep(0);
        showToast('success', `Analysis completed: ${data.riskLevel} (${data.riskScore}/100)`);
      }, 1100);
    } catch (err) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setAnalyzing(false);
      setAnalysisStep(0);
      showToast('error', err.message || 'Analysis failed. Please check network connection.');
    }
  };

  const handleCopyReport = () => {
    if (!result) return;
    const textReport = `TRUTHLENS AI CREDIBILITY REPORT
Title: ${result.title}
Risk Index: ${result.riskScore}/100 (${result.riskLevel})
Category: ${result.category}
Date: ${new Date(result.createdAt || Date.now()).toLocaleString()}

SUMMARY:
${result.summary}

EXPLANATION:
${result.explanation}

LINGUISTIC WARNING SIGNALS:
${result.warningSignals?.map((w, i) => `${i + 1}. [${w.severity.toUpperCase()}] ${w.signal}: ${w.description}`).join('\n') || 'None detected.'}

POSITIVE CREDIBILITY MARKERS:
${result.positiveSignals?.map((p, i) => `${i + 1}. ${p.signal}: ${p.description}`).join('\n') || 'None detected.'}

SUGGESTED VERIFICATION STEPS:
${result.verificationSteps?.map((v, i) => `${i + 1}. ${v}`).join('\n')}

LIMITATIONS DISCLAIMER:
${result.limitations}
`;

    navigator.clipboard.writeText(textReport);
    setCopied(true);
    showToast('success', 'Report copied to clipboard in clean plain text format.');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-brand-cyan mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI ANALYSIS WORKSPACE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Inspect Claim Credibility
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Submit raw text, viral claims, or news excerpts to audit linguistic risk patterns and verification pathways.
              </p>
            </div>

            {/* Clear Button */}
            {(content || title) && (
              <button
                onClick={handleClear}
                className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-navy-700 bg-navy-900 text-xs font-medium text-slate-300 hover:text-white hover:bg-navy-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Inputs</span>
              </button>
            )}
          </div>

          {/* Quick Presets Bar */}
          <div className="mb-6 p-4 rounded-xl bg-navy-900/70 border border-navy-800/80">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-brand-cyan" />
                Quick-Load Demonstrations:
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Click any case study to test the engine
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {presetExamples.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleLoadPreset(preset)}
                  className="px-3 py-1.5 rounded-lg border border-navy-750 bg-navy-850 hover:bg-navy-800 hover:border-brand-cyan/40 text-xs font-medium text-slate-200 transition-all"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form Card */}
          <form onSubmit={handleAnalyze} className="saas-card p-5 sm:p-6 mb-8 relative">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Headline or Claim Title <span className="text-slate-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Breaking: Miracle herbal tea eliminates knee inflammation"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/80 border border-navy-750 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-brand-cyan transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Content Type
                </label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/80 border border-navy-750 text-white text-sm focus:outline-none focus:border-brand-cyan transition-colors"
                >
                  <option value="claim">Short Claim / Statement</option>
                  <option value="social_post">Social Media Post</option>
                  <option value="article">News Article / Op-Ed</option>
                </select>
              </div>
            </div>

            {/* Main Text Content Input */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Content Text to Analyze <span className="text-brand-cyan">*</span>
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  {content.length} / 25,000 chars
                </span>
              </div>
              <textarea
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste the news excerpt, viral post, WhatsApp forward, or claim statement here..."
                required
                className="w-full p-4 rounded-xl bg-navy-950/80 border border-navy-750 text-white placeholder-slate-400 text-sm leading-relaxed focus:outline-none focus:border-brand-cyan transition-colors"
              />
            </div>

            {/* Source URL */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Original Source Link / Domain <span className="text-slate-400">(Optional)</span>
              </label>
              <input
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://example.com/article-url"
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/80 border border-navy-750 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-brand-cyan transition-colors"
              />
            </div>

            {/* Submit Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-navy-800">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-brand-cyan" />
                <span>Runs through modular FastAPI linguistic heuristics with explainable output.</span>
              </div>

              <button
                type="submit"
                disabled={analyzing || !content.trim()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-navy-950 font-bold text-sm shadow-md shadow-brand-cyan/20 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {analyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>
                      {analysisStep === 1 && 'Tokenizing Text...'}
                      {analysisStep === 2 && 'Auditing Rhetorical Signals...'}
                      {analysisStep === 3 && 'Synthesizing Risk Score...'}
                      {analysisStep === 0 && 'Analyzing...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Credibility Audit</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Analysis Result View */}
          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Score and Overview Banner Card */}
              <div className="saas-card p-6 md:p-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-6 border-b border-navy-800">
                  {/* Gauge */}
                  <div className="shrink-0 flex justify-center">
                    <ScoreGauge score={result.riskScore} riskLevel={result.riskLevel} size={190} />
                  </div>

                  {/* Summary & Category */}
                  <div className="flex-1 space-y-3 text-center lg:text-left">
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                      <RiskBadge level={result.riskLevel} score={result.riskScore} />
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-navy-800 border border-navy-700 text-brand-cyan">
                        {result.category}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {result.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {result.summary}
                    </p>

                    <div className="p-3.5 rounded-xl bg-navy-950/70 border border-navy-800 text-xs text-slate-300 leading-relaxed">
                      <span className="font-semibold text-white">Why this score was generated: </span>
                      {result.explanation}
                    </div>
                  </div>

                  {/* Quick Export Actions */}
                  <div className="shrink-0 flex flex-col gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleCopyReport}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-navy-700 bg-navy-800 hover:bg-navy-750 text-xs font-semibold text-white transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-brand-cyan" />}
                      <span>{copied ? 'Copied!' : 'Copy Formatted Report'}</span>
                    </button>

                    {result._id && (
                      <Link
                        to={`/analysis/${result._id}`}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-brand-cyan/30 bg-brand-cyan/10 hover:bg-brand-cyan/20 text-xs font-semibold text-brand-cyan transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Open Permanent Report</span>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Submetrics row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
                  <div className="p-3.5 rounded-xl bg-navy-950/60 border border-navy-800">
                    <div className="text-[11px] text-slate-400 font-medium">Sensationalism Score</div>
                    <div className="text-xl font-bold font-mono text-white mt-1">
                      {result.metrics?.sensationalismScore ?? 0}%
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-navy-950/60 border border-navy-800">
                    <div className="text-[11px] text-slate-400 font-medium">Attribution Score</div>
                    <div className="text-xl font-bold font-mono text-white mt-1">
                      {result.metrics?.attributionScore ?? 0}%
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-navy-950/60 border border-navy-800">
                    <div className="text-[11px] text-slate-400 font-medium">Urgency Pressure</div>
                    <div className="text-xl font-bold font-mono text-white mt-1">
                      {result.metrics?.urgencyScore ?? 0}%
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-navy-950/60 border border-navy-800">
                    <div className="text-[11px] text-slate-400 font-medium">Word Count / Reading</div>
                    <div className="text-base font-bold font-mono text-white mt-1">
                      {result.metrics?.wordCount ?? 0} words (~{result.metrics?.readingTimeSeconds ?? 10}s)
                    </div>
                  </div>
                </div>
              </div>

              {/* Signals Grid (Warning Signals & Positive Signals) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Warning Signals */}
                <div className="saas-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                      <h3 className="text-base font-bold text-white">
                        Linguistic Warning Signals ({result.warningSignals?.length || 0})
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-400">Rhetorical Alerts</span>
                  </div>

                  {result.warningSignals && result.warningSignals.length > 0 ? (
                    <div className="space-y-3">
                      {result.warningSignals.map((sig, idx) => (
                        <SignalCard key={idx} signal={sig} type="warning" />
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center rounded-xl bg-navy-950/50 border border-navy-800 text-xs text-slate-400">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                      No prominent sensationalist rhetoric or urgency cues detected.
                    </div>
                  )}
                </div>

                {/* Positive Signals */}
                <div className="saas-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <h3 className="text-base font-bold text-white">
                        Credibility Markers ({result.positiveSignals?.length || 0})
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-400">Journalistic Hygiene</span>
                  </div>

                  {result.positiveSignals && result.positiveSignals.length > 0 ? (
                    <div className="space-y-3">
                      {result.positiveSignals.map((sig, idx) => (
                        <SignalCard key={idx} signal={sig} type="positive" />
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center rounded-xl bg-navy-950/50 border border-navy-800 text-xs text-slate-400">
                      <Info className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-80" />
                      No explicit named citations or academic hedging patterns found in this excerpt.
                    </div>
                  )}
                </div>
              </div>

              {/* Actionable Verification Steps */}
              <div className="saas-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-brand-cyan" />
                  <h3 className="text-base font-bold text-white">
                    Suggested Verification Steps
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {result.verificationSteps?.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-navy-950/60 border border-navy-800 text-xs text-slate-200"
                    >
                      <span className="w-5 h-5 rounded-full bg-brand-cyan/10 text-brand-cyan font-bold flex items-center justify-center shrink-0 text-[11px] border border-brand-cyan/20">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Explicit Limitations Card */}
              <div className="p-5 rounded-2xl bg-navy-900/90 border border-navy-750 text-xs text-slate-400 leading-relaxed flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200">Limitations & Responsible AI Disclaimer: </span>
                  {result.limitations}
                  <div className="mt-1 font-mono text-[11px] text-slate-400">
                    Engine: {result.providerInfo?.providerName} ({result.providerInfo?.providerMode})
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};
export default AnalyzePage;
