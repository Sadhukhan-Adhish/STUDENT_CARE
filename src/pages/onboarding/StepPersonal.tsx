import React, { useState } from 'react';
import { User, Mail, Phone, Image, Check, Info } from 'lucide-react';
import { OnboardingData } from './types';

interface StepPersonalProps {
  data: OnboardingData;
  onChange: (fields: Partial<OnboardingData>) => void;
  onNext: () => void;
}

export const StepPersonal: React.FC<StepPersonalProps> = ({ data, onChange, onNext }) => {
  const [error, setError] = useState<string | null>(null);

  // Avatar presets
  const presets = ['Atlas', 'Luna', 'Nova', 'Orion', 'Echo', 'Phoenix'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!data.fullName.trim()) {
      setError('Please enter your Full Name.');
      return;
    }
    if (!data.email.trim() || !data.email.includes('@')) {
      setError('Please provide a valid student Email address.');
      return;
    }

    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-2">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Let&apos;s start with the basics
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Tell us your name and how to reach you. We keep your contact information private.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
          {error}
        </div>
      )}

      {/* Full Name */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
          Full Name <span className="text-indigo-400">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <User className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => onChange({ fullName: e.target.value })}
            placeholder="e.g. Alex Johnson"
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#090D15] border border-[#1E273A] text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            required
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
          Student Email Address <span className="text-indigo-400">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Mail className="w-4 h-4" />
          </div>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="e.g. alex.johnson@university.edu"
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#090D15] border border-[#1E273A] text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            required
          />
        </div>
      </div>

      {/* Phone (Optional) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            Phone Number
          </label>
          <span className="text-[11px] text-slate-500 font-mono">Optional</span>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Phone className="w-4 h-4" />
          </div>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="e.g. +91 98765 43210"
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#090D15] border border-[#1E273A] text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Profile Photo / Avatar (Optional) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            Profile Avatar
          </label>
          <span className="text-[11px] text-slate-500 font-mono">Optional</span>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          Select an avatar identity for your student profile card:
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {presets.map((preset) => {
            const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${preset}`;
            const isSelected = data.avatar === avatarUrl || (!data.avatar && preset === 'Atlas');
            return (
              <button
                key={preset}
                type="button"
                onClick={() => onChange({ avatar: avatarUrl })}
                className={`relative p-1.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-600/20 ring-2 ring-indigo-500/30'
                    : 'border-[#1E273A] bg-[#090D15] hover:border-slate-600'
                }`}
              >
                <img
                  src={avatarUrl}
                  alt={preset}
                  className="w-10 h-10 rounded-lg bg-slate-900"
                  referrerPolicy="no-referrer"
                />
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                )}
                <span className="block text-[10px] font-mono text-center text-slate-400 mt-1">
                  {preset}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Why do we ask this note */}
      <div className="p-3 rounded-xl bg-[#0C121E] border border-[#1A2338] flex items-start gap-2.5 text-xs text-slate-400">
        <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-200">Why do we ask this?</strong> Used to personalize your academic dashboard, display your credentials on generated resumes, and secure your student account.
        </p>
      </div>

      {/* Form Action */}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2 cursor-pointer"
        >
          <span>Continue</span>
          <span>→</span>
        </button>
      </div>
    </form>
  );
};
