import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, UserCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedRoll = rollNumber.trim();
    if (!trimmedRoll) {
      setError('Please enter your University Roll Number.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(trimmedRoll, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090D] text-slate-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden font-sans">
      {/* Subtle ambient backdrop */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[360px] bg-indigo-600/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Brand Header */}
      <div className="text-center mb-8 relative z-10">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 border border-indigo-400/40">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white font-heading">NEXORA</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mt-4 tracking-tight">Student Portal Login</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm mx-auto">
          Sign in using your verified University Roll Number to access your intelligence dashboard
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#0D121C] border border-[#1E2638] rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10">
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
            <div className="leading-relaxed">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="rollNumber" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
              University Roll Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <UserCheck className="w-4 h-4" />
              </div>
              <input
                id="rollNumber"
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="e.g. 23CS105"
                autoComplete="username"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#090D15] border border-[#1E273A] text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-mono uppercase"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
                Password
              </label>
              <button
                type="button"
                onClick={() => setError('Contact your university department administrator to reset your password.')}
                className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
              >
                Forgot Password
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#090D15] border border-[#1E273A] text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-[#090D15] border-[#1E273A] text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 focus:ring-1"
              />
              <span className="text-xs text-slate-400">Remember this device</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white transition-all shadow-lg shadow-indigo-600/25 border border-indigo-400/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 pt-6 border-t border-[#1C2436] text-center">
          <p className="text-xs text-slate-400">
            Don't have a student profile yet?{' '}
            <Link
              to="/signup"
              className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline inline-flex items-center gap-1"
            >
              Create Student Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
