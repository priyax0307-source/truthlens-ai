import React from 'react';

export const StatCard = ({ title, value, icon: Icon, badgeText, badgeColor = 'cyan', description, trend }) => {
  const badgeColorMap = {
    cyan: 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  return (
    <div className="saas-card saas-card-hover p-5 relative overflow-hidden group">
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className="p-2.5 rounded-lg bg-navy-800/80 border border-navy-700/80 text-brand-cyan group-hover:border-brand-cyan/30 transition-colors">
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
          {value}
        </span>
        {badgeText && (
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badgeColorMap[badgeColor] || badgeColorMap.cyan}`}
          >
            {badgeText}
          </span>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-slate-400 leading-relaxed">
          {description}
        </p>
      )}

      {/* Background ambient accent */}
      <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-brand-cyan/5 rounded-full blur-xl group-hover:bg-brand-cyan/10 transition-all duration-300"></div>
    </div>
  );
};
export default StatCard;
