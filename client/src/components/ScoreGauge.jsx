import React from 'react';

export const ScoreGauge = ({ score = 50, riskLevel = 'Moderate Risk', size = 200 }) => {
  const clampedScore = Math.max(0, Math.min(100, score));
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  // Arc spans 260 degrees (leaving an open gap at bottom)
  const arcFraction = 0.75;
  const totalArc = circumference * arcFraction;
  const strokeDashoffset = totalArc - (clampedScore / 100) * totalArc;

  let strokeColor = '#10B981'; // emerald
  let glowColor = 'rgba(16, 185, 129, 0.4)';
  let levelColor = 'text-emerald-400';

  if (clampedScore >= 70) {
    strokeColor = '#EF4444'; // rose/red
    glowColor = 'rgba(239, 68, 68, 0.4)';
    levelColor = 'text-rose-400';
  } else if (clampedScore >= 35) {
    strokeColor = '#F59E0B'; // amber
    glowColor = 'rgba(245, 158, 11, 0.4)';
    levelColor = 'text-amber-400';
  }

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Glow ambient background */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-30 transition-all duration-700"
          style={{ backgroundColor: glowColor }}
        ></div>

        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 180 180">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>

          {/* Track background */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="#1E293B"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={`${totalArc} ${circumference}`}
            strokeLinecap="round"
          />

          {/* Value Progress Arc */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke={strokeColor}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={`${totalArc} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px ${strokeColor})`,
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold tracking-tight text-white font-mono">
            {clampedScore}
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 mt-0.5">
            Risk Index
          </span>
          <span className={`text-xs font-semibold mt-1 ${levelColor}`}>
            {riskLevel}
          </span>
        </div>
      </div>

      <div className="mt-2 text-center">
        <p className="text-[11px] text-slate-400 max-w-[200px] leading-tight">
          Linguistic Risk Score (0 = Highly Credible, 100 = Severe Anomaly)
        </p>
      </div>
    </div>
  );
};
export default ScoreGauge;
