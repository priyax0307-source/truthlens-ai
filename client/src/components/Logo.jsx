import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({ size = 'default', showBadge = true, linkTo = '/' }) => {
  const iconSizes = {
    small: 'w-7 h-7',
    default: 'w-9 h-9',
    large: 'w-11 h-11',
  };

  const textSizes = {
    small: 'text-lg',
    default: 'text-xl',
    large: 'text-2xl',
  };

  const content = (
    <div className="flex items-center gap-2.5 group cursor-pointer select-none">
      <div className={`relative flex items-center justify-center ${iconSizes[size]}`}>
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-brand-cyan/25 blur-md rounded-full group-hover:bg-brand-cyan/40 transition-all duration-300"></div>
        {/* SVG Shield / Lens Symbol */}
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-full h-full drop-shadow-[0_0_12px_rgba(6,182,212,0.5)] transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            <linearGradient id="shieldGradC" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#06B6D4" />
              <stop offset="50%" stop-color="#3B82F6" />
              <stop offset="100%" stop-color="#6366F1" />
            </linearGradient>
            <linearGradient id="lensGradC" x1="16" y1="16" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#00E5FF" />
              <stop offset="100%" stop-color="#3B82F6" />
            </linearGradient>
          </defs>
          <path
            d="M24 4L7 11V23C7 33.5 14.3 43.1 24 46C33.7 43.1 41 33.5 41 23V11L24 4Z"
            stroke="url(#shieldGradC)"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#090E1A"
            fillOpacity="0.85"
          />
          <circle cx="24" cy="22" r="10" stroke="url(#lensGradC)" strokeWidth="1.8" strokeDasharray="3 3" opacity="0.75" />
          <circle cx="24" cy="22" r="7" stroke="url(#shieldGradC)" strokeWidth="2.2" />
          <circle cx="24" cy="22" r="3" fill="#00E5FF" />
          <path d="M24 11V14M24 30V33M13 22H16M32 22H35" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        </svg>
      </div>

      <div className="flex items-center gap-1.5">
        <span className={`font-bold tracking-tight text-white ${textSizes[size]}`}>
          Truth<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">Lens</span>
        </span>
        {showBadge && (
          <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded border border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan">
            AI
          </span>
        )}
      </div>
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo}>{content}</Link>;
  }

  return content;
};
export default Logo;
