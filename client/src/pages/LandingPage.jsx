import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { RiskBadge } from '../components/RiskBadge';
import { ScoreGauge } from '../components/ScoreGauge';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  Activity,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  Layers,
  FileText,
  BarChart2,
  Lock,
  ExternalLink,
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const samplePresets = [
    {
      title: 'Viral Health Miracle Cure Claim',
      category: 'Health Misinformation Risk',
      snippet: 'SHOCKING! Doctors are BANNED from discussing this 100% guaranteed miracle remedy. What big pharma is hiding will blow your mind. Share this everywhere before it is deleted!',
      score: 95,
      level: 'High Risk',
    },
    {
      title: 'Peer-Reviewed Oncology Research Paper',
      category: 'Credible Journalistic Reporting',
      snippet: 'According to researchers at Oxford University and data published in the peer-reviewed Lancet Oncology journal, preliminary findings suggest that the targeted monoclonal antibody therapy demonstrated improved response rates.',
      score: 5,
      level: 'Low Risk',
    },
    {
      title: 'Unverified Energy Grid Leak',
      category: 'Sensationalism & Clickbait',
      snippet: 'An anonymous top insider confirms what everyone knows: a deep state cover-up is actively poisoning municipal energy grids. Mainstream media refuses to report this.',
      score: 64,
      level: 'Moderate Risk',
    },
  ];

  const handleTestPreset = (preset) => {
    navigate('/analyze', {
      state: {
        presetTitle: preset.title,
        presetContent: preset.snippet,
      },
    });
  };

  const faqs = [
    {
      q: 'Does TruthLens AI prove whether a claim is 100% true or false?',
      a: 'No. TruthLens AI evaluates linguistic patterns, sensationalist framing, anonymous attribution markers, and emotional arousal syntax. It generates an explainable Risk Index to help readers verify suspicious rhetorical styles, but writing style alone does not establish empirical truth.',
    },
    {
      q: 'How does the modular NLP analysis pipeline work?',
      a: 'The text undergoes structural tokenization, uppercase/punctuation distribution audits, heuristic keyword and regex pattern matching against known deceptive rhetoric tropes, and sourcing verifiability evaluations. These factors are synthesized into calibrated sub-metrics and actionable verification steps.',
    },
    {
      q: 'Can I test TruthLens without an external OpenAI or Claude API key?',
      a: 'Yes! TruthLens AI is designed with an internal modular NLP Heuristic Engine running locally via FastAPI (with a built-in Node.js fallback). It requires zero paid API tokens and operates out-of-the-box for offline academic demonstrations.',
    },
    {
      q: 'Can I save my analyses and monitor metrics over time?',
      a: 'Yes. All completed audits can be saved into MongoDB, where you can view comprehensive visual trend charts, category distributions, search previous audits in History, and export clean formatted reports.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 selection:bg-brand-cyan/20 selection:text-brand-cyan">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden bg-radial-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan text-xs font-semibold mb-6 animate-pulse-subtle">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Assisted Credibility Auditing & Linguistic Risk Detection</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Look closer.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-electric to-brand-blue">
              Know what to trust.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            TruthLens AI reveals deceptive rhetorical tactics, sensationalism, and unverified attribution across news articles and social media posts with explainable linguistic risk scoring.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/analyze"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-navy-950 font-bold text-base shadow-lg shadow-brand-cyan/25 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Analyze a Claim</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-navy-700 bg-navy-900/80 hover:bg-navy-800 text-slate-200 font-semibold text-base transition-all hover:border-slate-500"
            >
              <BarChart2 className="w-4 h-4 text-brand-cyan" />
              <span>Explore Dashboard</span>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero external AI keys needed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Modular FastAPI & MERN Stack</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Explainable rhetorical signals</span>
            </div>
          </div>

          {/* Interactive Product Preview Card */}
          <div className="mt-16 max-w-4xl mx-auto text-left">
            <div className="saas-card border-navy-700/80 shadow-2xl p-6 md:p-8 relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-navy-800 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono text-brand-cyan uppercase tracking-wider">
                      Live Audit Demonstration
                    </span>
                    <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-full font-semibold">
                      High Risk Detected
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white">
                    "Miracle Cure BANNED by Doctors! Big Pharma suppression exposed."
                  </h3>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-black font-mono text-rose-400">95 / 100</div>
                    <div className="text-[11px] text-slate-400">Linguistic Risk</div>
                  </div>
                </div>
              </div>

              {/* Middle Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
                <div className="p-3.5 rounded-xl bg-navy-950/60 border border-navy-800">
                  <div className="text-xs text-slate-400 font-medium mb-1">Sensationalism Index</div>
                  <div className="text-xl font-bold font-mono text-rose-400">88%</div>
                  <div className="text-[11px] text-slate-400 mt-1">High-arousal panic keywords identified</div>
                </div>
                <div className="p-3.5 rounded-xl bg-navy-950/60 border border-navy-800">
                  <div className="text-xs text-slate-400 font-medium mb-1">Attribution Clarity</div>
                  <div className="text-xl font-bold font-mono text-amber-400">12%</div>
                  <div className="text-[11px] text-slate-400 mt-1">Anonymous sources without peer references</div>
                </div>
                <div className="p-3.5 rounded-xl bg-navy-950/60 border border-navy-800">
                  <div className="text-xs text-slate-400 font-medium mb-1">Artificial Urgency</div>
                  <div className="text-xl font-bold font-mono text-rose-400">94%</div>
                  <div className="text-[11px] text-slate-400 mt-1">"Share before deleted" virality pressure</div>
                </div>
              </div>

              {/* Signals tags preview */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-navy-800/80 items-center justify-between">
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20">
                    ⚠ Absolutist Certainty: "100% guaranteed"
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20">
                    ⚠ Suppression Cue: "Doctors banned"
                  </span>
                </div>
                <Link
                  to="/analyze"
                  className="text-xs font-semibold text-brand-cyan hover:underline flex items-center gap-1"
                >
                  Test your own claim <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preset Quick-Test Bar */}
      <section className="py-12 border-y border-navy-800/80 bg-navy-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Test Instant Demonstrations with One Click
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Select any pre-configured case study to instantly run the analysis engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {samplePresets.map((preset, idx) => (
              <div
                key={idx}
                onClick={() => handleTestPreset(preset)}
                className="saas-card saas-card-hover p-5 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <RiskBadge level={preset.level} score={preset.score} size="small" />
                    <span className="text-[11px] font-mono text-slate-400">{preset.category}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-brand-cyan transition-colors line-clamp-1 mb-2">
                    {preset.title}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    "{preset.snippet}"
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-navy-800 flex items-center justify-between text-xs font-semibold text-brand-cyan">
                  <span>Load into Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Capabilities Grid */}
      <section className="py-20 md:py-28 bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-cyan">
              Engine Architecture
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2 tracking-tight">
              Comprehensive NLP Credibility Audit
            </h2>
            <p className="text-sm md:text-base text-slate-400 mt-3">
              TruthLens integrates transparent lexical heuristics, syntactic distribution checks, and attribution auditing without black-box confusion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="saas-card p-6">
              <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Linguistic Pattern Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Flags sensationalist framing, hyperbolic superlatives, conspiratorial tropes, and excessive capitalization density.
              </p>
            </div>

            <div className="saas-card p-6">
              <div className="w-12 h-12 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Attribution Audit</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Separates named institutions and peer-reviewed citations from vague phrasing like "experts confirm" or anonymous leaks.
              </p>
            </div>

            <div className="saas-card p-6">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Explainable Risk Index</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calibrated 0-100 risk score breakdown explaining exactly which linguistic patterns contributed to the score.
              </p>
            </div>

            <div className="saas-card p-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Verification Playbook</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Provides actionable, domain-specific guidance on checking primary registries, WHO/CDC databases, and wire services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Workflow Section */}
      <section className="py-20 border-t border-navy-800/80 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-cyan">
              Operational Workflow
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-2">How TruthLens Analyzes Content</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="p-6 rounded-2xl bg-navy-900/80 border border-navy-800 relative">
              <div className="text-4xl font-extrabold font-mono text-brand-cyan/20 mb-3">01</div>
              <h3 className="text-lg font-bold text-white mb-2">Input Submission</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Paste any news excerpt, controversial claim, or social post with optional title and origin URL into the workspace.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-navy-900/80 border border-navy-800 relative">
              <div className="text-4xl font-extrabold font-mono text-brand-cyan/20 mb-3">02</div>
              <h3 className="text-lg font-bold text-white mb-2">Linguistic Audit</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                FastAPI extracts sentence structure, capitalization ratios, emotion keywords, and credibility markers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-navy-900/80 border border-navy-800 relative">
              <div className="text-4xl font-extrabold font-mono text-brand-cyan/20 mb-3">03</div>
              <h3 className="text-lg font-bold text-white mb-2">Synthesis & Action</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive the risk score, highlighted warning patterns, positive signals, and verification instructions to save or export.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-navy-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-cyan">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-2">Clarity & Responsible AI</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-navy-800 bg-navy-900/60 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm sm:text-base font-semibold text-white hover:text-brand-cyan transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180 text-brand-cyan' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 border-t border-navy-800/60 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 border-t border-navy-800 bg-gradient-to-b from-navy-900/40 to-navy-950 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to audit your first claim?
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mb-8">
            Experience real-time explainable NLP risk detection built with full-stack MERN and Python FastAPI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/analyze"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-navy-950 font-bold text-sm shadow-lg shadow-brand-cyan/25 hover:brightness-110 transition-all"
            >
              Open Analysis Workspace
            </Link>
            <Link
              to="/methodology"
              className="px-6 py-3.5 rounded-xl border border-navy-700 hover:bg-navy-800 text-slate-300 font-semibold text-sm transition-all"
            >
              Read Methodology
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
export default LandingPage;
