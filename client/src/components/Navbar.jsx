import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ArrowRight, User, LogOut, BarChart3, ShieldCheck, Compass, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { label: 'Analyze', href: '/analyze', icon: Sparkles },
    { label: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { label: 'History', href: '/history', icon: Compass },
    { label: 'Methodology', href: '/methodology', icon: ShieldCheck },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-navy-750/70 bg-navy-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo size="default" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20'
                      : 'text-slate-300 hover:text-white hover:bg-navy-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-70" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth / Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-850 border border-navy-750 text-xs text-slate-200">
                  <User className="w-3.5 h-3.5 text-brand-cyan" />
                  <span className="font-semibold">{user?.name || 'Researcher'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/analyze"
                  className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold rounded-lg bg-gradient-to-r from-brand-cyan to-brand-blue text-navy-950 hover:brightness-110 shadow-sm shadow-brand-cyan/30 transition-all"
                >
                  <span>Launch Engine</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-navy-800 bg-navy-900/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive
                    ? 'text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20'
                    : 'text-slate-300 hover:text-white hover:bg-navy-800'
                }`}
              >
                <Icon className="w-5 h-5 opacity-80" />
                {link.label}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-navy-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm text-slate-300 font-medium">Logged in as {user?.name}</span>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-medium rounded-lg text-slate-200 border border-navy-700 bg-navy-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold rounded-lg bg-gradient-to-r from-brand-cyan to-brand-blue text-navy-950"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
