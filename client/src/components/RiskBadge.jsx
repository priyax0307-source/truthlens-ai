import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

export const RiskBadge = ({ level = 'Low Risk', score = null, size = 'default' }) => {
  let colorStyles = '';
  let icon = null;

  if (level === 'High Risk' || (score !== null && score >= 70)) {
    colorStyles = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    icon = <AlertOctagon className={size === 'small' ? 'w-3 h-3' : 'w-4 h-4'} />;
  } else if (level === 'Moderate Risk' || (score !== null && score >= 35)) {
    colorStyles = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    icon = <AlertTriangle className={size === 'small' ? 'w-3 h-3' : 'w-4 h-4'} />;
  } else {
    colorStyles = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    icon = <ShieldCheck className={size === 'small' ? 'w-3 h-3' : 'w-4 h-4'} />;
  }

  const sizeStyles = size === 'small' 
    ? 'text-[11px] px-2 py-0.5 gap-1' 
    : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border shadow-sm backdrop-blur-sm ${sizeStyles} ${colorStyles}`}
    >
      {icon}
      <span>{level}</span>
      {score !== null && (
        <span className="opacity-80 font-mono text-[10px] ml-0.5">({score}/100)</span>
      )}
    </span>
  );
};
export default RiskBadge;
