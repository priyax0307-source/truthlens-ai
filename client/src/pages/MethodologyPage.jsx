import React from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import {
  ShieldCheck,
  Cpu,
  Layers,
  FileCode,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Scale,
  Sparkles,
  Search,
  BookOpen,
} from 'lucide-react';

export const MethodologyPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs font-mono text-brand-cyan mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ACADEMIC AUDIT SPECIFICATION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              NLP Architecture & Verification Methodology
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              Detailed technical blueprint explaining data ingestion, tokenization, feature extraction, calibrated scoring formulas, limitations, and responsible AI ethics.
            </p>
          </div>

          <div className="space-y-8">
            {/* Pipeline Stage Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stage 1 */}
              <div className="saas-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center font-mono font-bold text-brand-cyan text-sm">
                    01
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Preprocessing & Ingestion</h3>
                    <span className="text-[11px] text-slate-400 font-mono">Input Normalization</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Text submissions are cleaned by stripping non-standard unicode characters, separating sentence boundaries using punctuation delimiters, and isolating word tokens via regex word boundary matching (<code className="text-cyan-300">\b\w+\b</code>).
                </p>
                <div className="text-[11px] font-mono text-slate-400 p-3 rounded-lg bg-navy-950/70 border border-navy-800">
                  Metrics extracted: word count, sentence count, uppercase word ratio, exclamation density, and average sentence length.
                </div>
              </div>

              {/* Stage 2 */}
              <div className="saas-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center font-mono font-bold text-brand-blue text-sm">
                    02
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Linguistic Feature Extraction</h3>
                    <span className="text-[11px] text-slate-400 font-mono">Pattern Recognition</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Identifies known rhetorical tropes correlated with viral deception campaigns across four primary categories:
                </p>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li><strong className="text-white">Sensationalism & Hyperbole:</strong> "Mind-blowing", "Banned by doctors".</li>
                  <li><strong className="text-white">Artificial Urgency:</strong> "Share before deleted", "Viral alert".</li>
                  <li><strong className="text-white">Anonymous Attribution:</strong> "Experts reveal", "Sources confirm".</li>
                  <li><strong className="text-white">Conspiracy Framing:</strong> "Cover-up", "Big Pharma hiding".</li>
                </ul>
              </div>

              {/* Stage 3 */}
              <div className="saas-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center font-mono font-bold text-purple-400 text-sm">
                    03
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Credibility Counter-Balancing</h3>
                    <span className="text-[11px] text-slate-400 font-mono">Positive Signals</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  To avoid penalizing legitimate urgent journalism, the engine audits for positive journalistic and scientific markers that offset risk scores:
                </p>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Explicit attribution to named agencies (AP, Reuters, WHO, Lancet).</li>
                  <li>Epistemic hedges ("preliminary findings suggest", "further research is needed").</li>
                  <li>Quotation balance and multi-perspective framing.</li>
                </ul>
              </div>

              {/* Stage 4 */}
              <div className="saas-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-emerald-400 text-sm">
                    04
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Calibrated Scoring Formula</h3>
                    <span className="text-[11px] text-slate-400 font-mono">0–100 Risk Index</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Starting from a neutral baseline prior (15 points), the formula accumulates weighted risk penalties for each warning pattern and deducts points for verified credibility markers, clamped safely between 5 and 95.
                </p>
                <div className="text-[11px] font-mono text-cyan-300 p-2.5 rounded-lg bg-navy-950/70 border border-navy-800">
                  RiskScore = Clamp(15 + Σ(Weight_warning * hits) - Σ(Credit_positive * hits), 5, 95)
                </div>
              </div>
            </div>

            {/* Implemented vs Planned Roadmap Comparison */}
            <div className="saas-card p-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Platform Architecture: Current Status vs Roadmap
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Academic transparency distinguishing implemented v1.0 features from future v2.0 deep learning capabilities.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Implemented v1.0 */}
                <div className="p-5 rounded-xl bg-navy-950/70 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Implemented Features (Version 1.0)</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>Modular Python FastAPI microservice architecture with BaseAnalysisEngine contract.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>Heuristic rule-based NLP feature extractor with exact-match substring highlighting.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>Node.js Express resilient fallback engine ensuring zero downtime if Python is offline.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>MongoDB persistence with aggregation pipelines for real KPI dashboards and trends.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>JWT authentication, bcrypt password hashing, and user-isolated history records.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>Exportable formatted plain-text reports and domain-tailored verification steps.</span>
                    </li>
                  </ul>
                </div>

                {/* Planned v2.0 */}
                <div className="p-5 rounded-xl bg-navy-950/70 border border-navy-700 space-y-3">
                  <div className="flex items-center gap-2 text-brand-cyan font-bold text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Planned Enhancements (Version 2.0 Roadmap)</span>
                  </div>
                  <ul className="text-xs text-slate-400 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-brand-cyan font-bold">•</span>
                      <span>Fine-tuned RoBERTa transformer model trained on FEVER & LIAR benchmark datasets.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-cyan font-bold">•</span>
                      <span>Automated Google Fact Check Tools API retrieval and ClaimReview schema cross-referencing.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-cyan font-bold">•</span>
                      <span>Automated reverse-image search API integration for social media image claims.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-cyan font-bold">•</span>
                      <span>Browser extension for in-situ Twitter/X and WhatsApp Web veracity auditing.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Responsible AI & Ethics Section */}
            <div className="p-6 rounded-2xl bg-navy-900/90 border border-navy-750 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                <Scale className="w-5 h-5" />
                <span>Responsible AI & Academic Ethics Statement</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
                <p>
                  <strong>Style Is Not Truth:</strong> Linguistic and stylistic patterns are correlational indicators, not causal proofs of falsehood. A fabricated story can be written in sober, academic language, while genuine whistleblowers and breaking disaster reporting often employ urgent, emotional phrasing.
                </p>
                <p>
                  <strong>No Fabricated Claims:</strong> TruthLens AI does not invent fact-checks, create fictitious citations, or simulate real-time web verification results that did not take place. The app transparently designates its analysis provider as a heuristic NLP demonstration engine.
                </p>
                <p>
                  <strong>Human in the Loop:</strong> The platform is designed as an investigative assistant. It equips users with structured verification questions and primary-source checklists rather than acting as an automated censor or final arbiter of truth.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};
export default MethodologyPage;
