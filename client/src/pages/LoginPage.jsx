import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Lock, Mail, ArrowRight, Eye, EyeOff, Sparkles, Shield } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      showToast('success', 'Logged in successfully! Welcome back.');
      navigate('/dashboard');
    } catch (err) {
      showToast('error', err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('researcher@truthlens.ai');
    setPassword('DemoPass123!');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-navy-950 bg-radial-hero">
      <div className="mb-8">
        <Logo size="large" />
      </div>

      <div className="w-full max-w-md saas-card p-6 sm:p-8 relative">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Sign In to TruthLens
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access your private audit records, history, and intelligence metrics.
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="mb-6 p-3 rounded-xl bg-navy-950/70 border border-navy-800 flex items-center justify-between text-xs">
          <div className="text-slate-300">
            <span className="font-semibold text-brand-cyan">Quick Evaluation Demo:</span>
            <div className="text-[11px] text-slate-400">researcher@truthlens.ai</div>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="px-2.5 py-1 rounded-lg border border-brand-cyan/30 bg-brand-cyan/10 hover:bg-brand-cyan/20 text-brand-cyan font-semibold text-[11px] transition-colors"
          >
            Fill Demo
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950/80 border border-navy-750 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-brand-cyan transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-navy-950/80 border border-navy-750 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-brand-cyan transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-navy-950 font-bold text-sm shadow-md shadow-brand-cyan/20 hover:brightness-110 disabled:opacity-50 transition-all mt-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-navy-800 text-center text-xs text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-brand-cyan font-semibold hover:underline">
            Create an Account
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-xs text-slate-400 hover:text-slate-300 transition-colors">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
