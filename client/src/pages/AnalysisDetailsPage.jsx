import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { ScoreGauge } from '../components/ScoreGauge';
import { RiskBadge } from '../components/RiskBadge';
import { SignalCard } from '../components/SignalCard';
import { Modal } from '../components/Modal';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import {
  ArrowLeft,
  Copy,
  Trash2,
  ExternalLink,
  Calendar,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Check,
  Share2,
  FileText,
  Quote,
  HelpCircle,
} from 'lucide-react';

export const AnalysisDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const data = await api.getAnalysisById(id);
        setReport(data);
      } catch (err) {
        setError(err.message || 'Report could not be retrieved.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const handleCopy = () => {
    if (!report) return;
    const textReport = `TRUTHLENS AI AUDIT REPORT
Title: ${report.title}
Score: ${report.riskScore}/100 (${report.riskLevel})
Category: ${report.category}
Date: ${new Date(report.createdAt).toLocaleString()}
Source: ${report.sourceUrl || 'N/A'}

SUBMITTED CONTENT:
"${report.content}"

EXECUTIVE SUMMARY:
${report.summary}

EXPLANATION:
${report.explanation}

LINGUISTIC WARNING SIGNALS:
${report.warningSignals?.map((w, i) => `${i + 1}. [${w.severity.toUpperCase()}] ${w.signal}: ${w.description}`).join('\n') || 'None'}

POSITIVE CREDIBILITY MARKERS:
${report.positiveSignals?.map((p, i) => `${i + 1}. ${p.signal}: ${p.description}`).join('\n') || 'None'}

VERIFICATION STEPS:
${report.verificationSteps?.map((v, i) => `${i + 1}. ${v}`).join('\n')}

LIMITATIONS DISCLAIMER:
${report.limitations}
`;

    navigator.clipboard.writeText(textReport);
    setCopied(true);
    showToast('success', 'Full analysis report copied to clipboard.');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.deleteAnalysis(id);
      showToast('success', 'Analysis report deleted successfully.');
      setDeleteModalOpen(false);
      navigate('/history');
    } catch (err) {
      showToast('error', err.message || 'Failed to delete report.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Back Link */}
          <div className="mb-6">
            <Link
              to="/history"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-brand-cyan transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Audit History</span>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-6">
              <div className="h-48 bg-navy-850 rounded-2xl animate-pulse"></div>
              <div className="h-64 bg-navy-850 rounded-2xl animate-pulse"></div>
            </div>
          ) : error ? (
            <div className="saas-card p-8 text-center text-rose-300">
              <h2 className="text-lg font-bold mb-2">Error Loading Report</h2>
              <p className="text-xs text-slate-400 mb-6">{error}</p>
              <Link
                to="/history"
                className="px-4 py-2 rounded-lg bg-navy-800 text-xs font-semibold text-white"
              >
                Return to History
              </Link>
            </div>
          ) : report ? (
            <div className="space-y-6">
              {/* Top Banner Card */}
              <div className="saas-card p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-navy-800">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <RiskBadge level={report.riskLevel} score={report.riskScore} />
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-navy-800 border border-navy-700 text-brand-cyan">
                        {report.category}
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {report.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(report.createdAt).toLocaleString()}
                      </span>
                      {report.sourceUrl && (
                        <a
                          href={report.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-brand-cyan hover:underline truncate max-w-xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span className="truncate">{report.sourceUrl}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Top Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-navy-700 bg-navy-850 hover:bg-navy-800 text-xs font-semibold text-white transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-brand-cyan" />}
                      <span>{copied ? 'Copied' : 'Copy Report'}</span>
                    </button>
                    <button
                      onClick={() => setDeleteModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold text-rose-400 transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Score & Factors */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 items-center">
                  <div className="flex justify-center">
                    <ScoreGauge score={report.riskScore} riskLevel={report.riskLevel} size={180} />
                  </div>

                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Executive Assessment
                      </h3>
                      <p className="text-sm text-slate-200 leading-relaxed font-medium">
                        {report.summary}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-navy-950/70 border border-navy-800 text-xs text-slate-300 leading-relaxed">
                      <span className="font-semibold text-white">Linguistic Rationale: </span>
                      {report.explanation}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-lg bg-navy-950/60 border border-navy-800 text-center">
                        <div className="text-[10px] text-slate-400 uppercase">Sensationalism</div>
                        <div className="text-lg font-bold font-mono text-white mt-0.5">
                          {report.metrics?.sensationalismScore ?? 0}%
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-navy-950/60 border border-navy-800 text-center">
                        <div className="text-[10px] text-slate-400 uppercase">Attribution Clarity</div>
                        <div className="text-lg font-bold font-mono text-white mt-0.5">
                          {report.metrics?.attributionScore ?? 0}%
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-navy-950/60 border border-navy-800 text-center">
                        <div className="text-[10px] text-slate-400 uppercase">Urgency Pressure</div>
                        <div className="text-lg font-bold font-mono text-white mt-0.5">
                          {report.metrics?.urgencyScore ?? 0}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Original Content Snippet */}
              <div className="saas-card p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Quote className="w-4 h-4 text-brand-cyan" />
                  <h3 className="text-sm font-bold text-white">Original Submitted Content</h3>
                </div>
                <div className="p-4 rounded-xl bg-navy-950/80 border border-navy-800 text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
                  {report.content}
                </div>
              </div>

              {/* Signals Split */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Warning Signals */}
                <div className="saas-card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base font-bold text-white">
                      Linguistic Warning Signals ({report.warningSignals?.length || 0})
                    </h3>
                  </div>

                  {report.warningSignals?.length > 0 ? (
                    <div className="space-y-3">
                      {report.warningSignals.map((sig, i) => (
                        <SignalCard key={i} signal={sig} type="warning" />
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-navy-950/50 border border-navy-800 text-xs text-slate-400 text-center">
                      No warning signals recorded.
                    </div>
                  )}
                </div>

                {/* Positive Signals */}
                <div className="saas-card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-base font-bold text-white">
                      Credibility Markers ({report.positiveSignals?.length || 0})
                    </h3>
                  </div>

                  {report.positiveSignals?.length > 0 ? (
                    <div className="space-y-3">
                      {report.positiveSignals.map((sig, i) => (
                        <SignalCard key={i} signal={sig} type="positive" />
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-navy-950/50 border border-navy-800 text-xs text-slate-400 text-center">
                      No formal citations or hedging markers detected.
                    </div>
                  )}
                </div>
              </div>

              {/* Verification Steps */}
              <div className="saas-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-brand-cyan" />
                  <h3 className="text-base font-bold text-white">
                    Suggested Practical Verification Steps
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {report.verificationSteps?.map((step, idx) => (
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

              {/* Limitations Notice */}
              <div className="p-5 rounded-2xl bg-navy-900/80 border border-navy-750 text-xs text-slate-400 leading-relaxed flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200">Responsible AI Notice: </span>
                  {report.limitations}
                </div>
              </div>
            </div>
          ) : null}

          {/* Delete Confirmation Modal */}
          <Modal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            title="Confirm Report Deletion"
          >
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              Are you sure you want to permanently delete this credibility report? This action will remove the record from MongoDB and cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-navy-750 bg-navy-800 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-xs font-semibold text-white shadow-md shadow-rose-950/50 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </Modal>
        </main>
      </div>

      <Footer />
    </div>
  );
};
export default AnalysisDetailsPage;
