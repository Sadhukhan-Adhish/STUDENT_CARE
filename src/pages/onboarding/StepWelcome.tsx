import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Compass, CheckCircle2 } from 'lucide-react';
import { OnboardingData } from './types';

interface StepWelcomeProps {
  data: OnboardingData;
  onStart: () => void;
}

export const StepWelcome: React.FC<StepWelcomeProps> = ({ data, onStart }) => {
  const firstName = data.fullName ? data.fullName.split(' ')[0] : 'Student';

  return (
    <div className="text-center py-4 sm:py-8 max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-300">
      {/* Visual icon badge */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-indigo-400 p-0.5 mx-auto mb-6 shadow-xl shadow-indigo-600/25">
        <div className="w-full h-full bg-[#0B0F19] rounded-[14px] flex items-center justify-center">
          <Sparkles className="w-8 h-8 sm:w-9 sm:h-9 text-indigo-400" />
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono mb-4">
        <Compass className="w-3.5 h-3.5" />
        <span>Official Student Onboarding</span>
      </div>

      <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-heading mb-3">
        Welcome to NEXORA, {firstName}
      </h1>

      <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-md mx-auto mb-8">
        Let&apos;s calibrate your verified student intelligence profile step-by-step. Designed specifically for university students from any college or curriculum.
      </p>

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left mb-8">
        <div className="p-3.5 rounded-xl bg-[#0E1422] border border-[#1C263D]">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Zero Preconceptions</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Works for any university, college, degree, or branch.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0E1422] border border-[#1C263D]">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Your Real Data</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Add only your actual coursework, skills, and projects.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0E1422] border border-[#1C263D]">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Own Skill Up</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Track extracurricular passions and future career goals.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/25 inline-flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>Begin Profile Setup</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
        <span>Takes ~3 minutes. You can always edit your profile anytime.</span>
      </div>
    </div>
  );
};
