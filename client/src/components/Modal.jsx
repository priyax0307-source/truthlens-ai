import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full ${maxWidth} bg-navy-900 border border-navy-700/80 rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-navy-800 mb-4">
          <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  const items = Array.from({ length: count });

  if (type === 'table') {
    return (
      <div className="w-full space-y-3">
        {items.map((_, i) => (
          <div key={i} className="h-12 w-full bg-navy-800/50 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((_, i) => (
        <div key={i} className="h-32 bg-navy-800/50 border border-navy-750/50 rounded-xl animate-pulse p-4 flex flex-col justify-between">
          <div className="h-4 bg-navy-700/50 rounded w-1/2"></div>
          <div className="h-8 bg-navy-700/50 rounded w-3/4"></div>
          <div className="h-3 bg-navy-700/40 rounded w-full"></div>
        </div>
      ))}
    </div>
  );
};
