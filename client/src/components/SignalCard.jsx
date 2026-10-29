import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Quote } from 'lucide-react';

export const SignalCard = ({ signal, type = 'warning' }) => {
  const isWarning = type === 'warning';
  const severity = signal.severity || 'medium';

  let borderColor = 'border-amber-500/30';
  let bgColor = 'bg-amber-500/5';
  let badgeColor = 'bg-amber-500/10 text-amber-300 border-amber-500/30';
  let Icon = AlertTriangle;

  if (isWarning) {
    if (severity === 'high') {
      borderColor = 'border-rose-500/40';
      bgColor = 'bg-rose-500/5';
      badgeColor = 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      Icon = AlertCircle;
    } else {
      borderColor = 'border-amber-500/30';
      bgColor = 'bg-amber-500/5';
      badgeColor = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      Icon = AlertTriangle;
    }
  } else {
    // Positive credibility marker
    borderColor = 'border-emerald-500/35';
    bgColor = 'bg-emerald-500/5';
    badgeColor = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    Icon = CheckCircle2;
  }

  return (
    <div className={`p-4 rounded-xl border ${borderColor} ${bgColor} transition-all duration-200 relative overflow-hidden`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 shrink-0 ${isWarning ? (severity === 'high' ? 'text-rose-400' : 'text-amber-400') : 'text-emerald-400'}`} />
          <h4 className="text-sm font-semibold text-white tracking-tight">
            {signal.signal || signal.category}
          </h4>
        </div>
        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeColor}`}>
          {isWarning ? `${severity} impact` : 'credibility marker'}
        </span>
      </div>

      {signal.example && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-navy-950/60 border border-navy-800 my-2 text-xs font-mono text-cyan-300">
          <Quote className="w-3 h-3 text-slate-500 shrink-0" />
          <span className="truncate">"{signal.example}"</span>
        </div>
      )}

      <p className="text-xs text-slate-300 leading-relaxed mt-1">
        {signal.description}
      </p>
    </div>
  );
};
export default SignalCard;
