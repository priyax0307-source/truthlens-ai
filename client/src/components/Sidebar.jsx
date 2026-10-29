import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles, BarChart3, History, ShieldCheck, PlusCircle, ExternalLink, HelpCircle } from 'lucide-react';

export const Sidebar = () => {
  const menuItems = [
    { name: 'Analysis Workspace', path: '/analyze', icon: Sparkles },
    { name: 'Analytics Dashboard', path: '/dashboard', icon: BarChart3 },
    { name: 'Audit History', path: '/history', icon: History },
    { name: 'NLP Methodology', path: '/methodology', icon: ShieldCheck },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col border-r border-navy-800 bg-navy-950/60 p-4 min-h-[calc(100vh-4rem)]">
      {/* Quick Action */}
      <div className="mb-6">
        <NavLink
          to="/analyze"
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-navy-950 font-bold text-sm shadow-md shadow-brand-cyan/20 hover:brightness-110 transition-all duration-200"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Analysis</span>
        </NavLink>
      </div>

      {/* Main Nav Items */}
      <div className="space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
          Platform Navigation
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-navy-800/90 text-brand-cyan border border-navy-700/80 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-navy-850/60'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Engine Status pill & Notice */}
      <div className="mt-auto pt-6 border-t border-navy-800/80 space-y-3">
        <div className="p-3 rounded-xl bg-navy-900/70 border border-navy-800 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-slate-300">Engine Mode</span>
            <span className="flex items-center gap-1 text-[10px] text-brand-cyan font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse"></span>
              v1.0 Heuristic
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Active modular NLP analyzer running on rule-based credibility matrices.
          </p>
        </div>

        <div className="text-[11px] text-slate-400 px-2 flex items-center justify-between">
          <span>College Capstone Project</span>
          <span className="text-slate-400 font-mono text-[10px]">TruthLens v1.0</span>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
