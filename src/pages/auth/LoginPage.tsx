import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, UserCheck, ArrowRight, AlertCircle, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, enterGuestMode } = useAuth();
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

  const handleGuestAccess = async () => {
    setIsSubmitting(true);
    try {
      await enterGuestMode();
      navigate('/dashboard');
    } catch (err: any) {
      setError('Unable to enter guest workspace. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#F3F0E8] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden font-sans">
      {/* Ambient backdrop */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[360px] bg-[#D89B5B]/8 blur-[130px] pointer-events-none rounded-full" />

      {/* Brand Header */}
      <div className="text-center mb-8 relative z-10">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-[#D89B5B] flex items-center justify-center shadow-lg shadow-[#D89B5B]/20 border border-[#D89B5B]/40">
            <svg className="w-5 h-5 text-[#0B0F14]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-[#F3F0E8] font-heading">UNNEXA</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#F3F0E8] mt-4 tracking-tight">Student Portal Login</h1>
        <p className="text-xs sm:text-sm text-[#9AA5B1] mt-1 max-w-sm mx-auto">
          Sign in using your University Roll Number to access your student dashboard
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#151D26] border border-[#202C3B] rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10">
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
            <div className="leading-relaxed">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="rollNumber" className="block text-xs font-semibold uppercase tracking-wider text-[#9AA5B1] mb-1.5 font-mono">
              University Roll Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#768393]">
                <UserCheck className="w-4 h-4" />
              </div>
              <input
                id="rollNumber"
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="e.g. 23CS105"
                autoComplete="username"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0B0F14] border border-[#202C3B] text-[#F3F0E8] placeholder-[#768393] text-sm focus:outline-none focus:ring-2 focus:ring-[#D89B5B]/50 focus:border-[#D89B5B] transition-all font-mono uppercase"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-[#9AA5B1] font-mono">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-[#D89B5B] hover:text-[#E4AB70] hover:underline cursor-pointer"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#768393]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0B0F14] border border-[#202C3B] text-[#F3F0E8] placeholder-[#768393] text-sm focus:outline-none focus:ring-2 focus:ring-[#D89B5B]/50 focus:border-[#D89B5B] transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#768393] hover:text-[#F3F0E8] cursor-pointer"
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
                className="w-4 h-4 rounded bg-[#0B0F14] border-[#202C3B] text-[#D89B5B] focus:ring-[#D89B5B] focus:ring-offset-0 focus:ring-1"
              />
              <span className="text-xs text-[#9AA5B1]">Remember this device</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-semibold bg-[#D89B5B] hover:bg-[#E4AB70] active:bg-[#C98B4B] text-[#0B0F14] transition-all shadow-lg shadow-[#D89B5B]/20 border border-[#D89B5B]/40 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:-translate-y-0.5"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-[#0B0F14]/30 border-t-[#0B0F14] rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Guest Mode Divider & Button */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#202C3B]" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-mono">
            <span className="bg-[#151D26] px-3 text-[#9AA5B1]">Or explore first</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGuestAccess}
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#111822] hover:bg-[#1A2432] text-[#F3F0E8] border border-[#202C3B] hover:border-[#D89B5B]/40 transition-all flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5"
        >
          <Compass className="w-4 h-4 text-[#D89B5B]" />
          <span>Continue as Guest</span>
        </button>
        <p className="text-[11px] text-[#768393] text-center mt-2 leading-relaxed">
          Instant guest workspace starting clean from zero. Enter your own courses and test all modules.
        </p>

        {/* Footer Link */}
        <div className="mt-6 pt-6 border-t border-[#202C3B] text-center">
          <p className="text-xs text-[#9AA5B1]">
            Don't have a student profile yet?{' '}
            <Link
              to="/signup"
              className="text-[#D89B5B] hover:text-[#E4AB70] font-semibold hover:underline inline-flex items-center gap-1"
            >
              Create Student Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
