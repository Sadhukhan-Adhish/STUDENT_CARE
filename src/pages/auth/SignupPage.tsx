import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Hash,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, enterGuestMode } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid student email address.');
      return;
    }
    if (!rollNumber.trim()) {
      setError('Please enter your University Roll Number. This serves as your primary student login identifier.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the UNNEXA Academic Guidelines.');
      return;
    }

    try {
      setIsSubmitting(true);
      await signup({
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        universityRollNumber: rollNumber.trim().toUpperCase(),
        onboardingCompleted: false,
      });

      // Navigate to step-by-step onboarding
      navigate('/onboarding');
    } catch (err: any) {
      setError(err?.message || 'Failed to create student account. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleGuestMode = async () => {
    try {
      await enterGuestMode();
      navigate('/dashboard');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#F3F0E8] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#D89B5B]/8 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-[#67C5B8]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header / Brand */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 px-4">
        <Link to="/" className="inline-flex items-center gap-3 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-[#D89B5B] flex items-center justify-center text-[#0B0F14] font-extrabold text-lg shadow-lg shadow-[#D89B5B]/20 group-hover:scale-105 transition-transform border border-[#D89B5B]/40">
            <svg className="w-5 h-5 text-[#0B0F14]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-[#F3F0E8] font-heading">
            UNNEXA
          </span>
        </Link>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#F3F0E8] tracking-tight">
          Create Your Student Account
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#9AA5B1]">
          Sign up once to personalize your academic and career intelligence profile.
        </p>
      </div>

      {/* Main Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-[#151D26] py-8 px-6 sm:px-8 border border-[#202C3B] shadow-2xl rounded-2xl sm:rounded-3xl">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-[#9AA5B1] uppercase tracking-wider mb-1.5 font-mono">
                Full Name <span className="text-[#D89B5B]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#768393]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0B0F14] border border-[#202C3B] text-[#F3F0E8] placeholder-[#768393] text-sm focus:outline-none focus:ring-2 focus:ring-[#D89B5B]/50 focus:border-[#D89B5B] transition-all"
                  required
                />
              </div>
            </div>

            {/* University Roll Number */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#9AA5B1] uppercase tracking-wider font-mono">
                  University Roll Number <span className="text-[#D89B5B]">*</span>
                </label>
                <span className="text-[10px] font-mono text-[#D89B5B] bg-[#D89B5B]/10 px-1.5 py-0.5 rounded border border-[#D89B5B]/25">
                  Primary Login ID
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#768393]">
                  <Hash className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. 23CS105 / 1RV21CS045"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0B0F14] border border-[#202C3B] text-[#F3F0E8] placeholder-[#768393] text-sm focus:outline-none focus:ring-2 focus:ring-[#D89B5B]/50 focus:border-[#D89B5B] transition-all font-mono uppercase"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-[#9AA5B1] uppercase tracking-wider mb-1.5 font-mono">
                Student Email <span className="text-[#D89B5B]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#768393]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. student@university.edu"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0B0F14] border border-[#202C3B] text-[#F3F0E8] placeholder-[#768393] text-sm focus:outline-none focus:ring-2 focus:ring-[#D89B5B]/50 focus:border-[#D89B5B] transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#9AA5B1] uppercase tracking-wider mb-1.5 font-mono">
                Password <span className="text-[#D89B5B]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#768393]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0B0F14] border border-[#202C3B] text-[#F3F0E8] placeholder-[#768393] text-sm focus:outline-none focus:ring-2 focus:ring-[#D89B5B]/50 focus:border-[#D89B5B] transition-all"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-[#9AA5B1] uppercase tracking-wider mb-1.5 font-mono">
                Confirm Password <span className="text-[#D89B5B]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#768393]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0B0F14] border border-[#202C3B] text-[#F3F0E8] placeholder-[#768393] text-sm focus:outline-none focus:ring-2 focus:ring-[#D89B5B]/50 focus:border-[#D89B5B] transition-all"
                  required
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded bg-[#0B0F14] border-[#202C3B] text-[#D89B5B] focus:ring-[#D89B5B] cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-[#9AA5B1] cursor-pointer select-none">
                I agree to the UNNEXA Academic Guidelines &amp; Privacy Standards
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#D89B5B] hover:bg-[#E4AB70] active:scale-[0.99] text-[#0B0F14] font-semibold text-sm transition-all shadow-xl shadow-[#D89B5B]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:-translate-y-0.5"
            >
              {isSubmitting ? (
                <span>Creating Student Account...</span>
              ) : (
                <>
                  <span>Create Account &amp; Start Onboarding</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 pt-5 border-t border-[#202C3B] space-y-3 text-center">
            <p className="text-xs text-[#9AA5B1]">
              Already registered?{' '}
              <Link to="/login" className="text-[#D89B5B] hover:text-[#E4AB70] font-semibold">
                Sign in with Roll Number
              </Link>
            </p>

            <div>
              <button
                type="button"
                onClick={handleGuestMode}
                className="text-xs text-[#768393] hover:text-[#F3F0E8] font-mono transition-colors cursor-pointer"
              >
                Or explore first in Guest Workspace →
              </button>
            </div>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-[#768393] font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-[#67C5B8]" />
          <span>Local Verified Student Database • No Third-Party Data Sharing</span>
        </div>
      </div>
    </div>
  );
};
