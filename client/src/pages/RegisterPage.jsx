import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Lock, Mail, User, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      showToast('error', 'Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      showToast('error', 'Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      showToast('error', 'Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      showToast('success', 'Account created successfully! Welcome to TruthLens AI.');
      navigate('/dashboard');
    } catch (err) {
      showToast('error', err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-navy-950 bg-radial-hero">
      <div className="mb-8">
        <Logo size="large" />
      </div>

      <div className="w-full max-w-md saas-card p-6 sm:p-8 relative">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Create an Account
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Join TruthLens AI to maintain private audit logs and export intelligence reports.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Jane Doe / Student Name"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950/80 border border-navy-750 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-brand-cyan transition-colors"
              />
            </div>
          </div>

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
                placeholder="researcher@university.edu"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950/80 border border-navy-750 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-brand-cyan transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Password (min. 6 characters)
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

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950/80 border border-navy-750 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-brand-cyan transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-navy-950 font-bold text-sm shadow-md shadow-brand-cyan/20 hover:brightness-110 disabled:opacity-50 transition-all mt-2"
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Register Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-navy-800 text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-brand-cyan font-semibold hover:underline">
            Sign In Here
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
export default RegisterPage;
