import React from 'react';
import { ArrowRight, CheckCircle, Sparkles, User, School, BookOpen, Compass } from 'lucide-react';
import { OnboardingData } from './types';

interface StepCompleteProps {
  data: OnboardingData;
  onEnterDashboard: () => void;
}

export const StepComplete: React.FC<StepCompleteProps> = ({ data, onEnterDashboard }) => {
  const firstName = data.fullName ? data.fullName.split(' ')[0] : 'Student';
  const displayCareer =
    data.targetCareer === 'Other / Custom Career Goal'
      ? data.customCareer
      : data.targetCareer || 'Engineering';

  return (
    <div className="text-center py-6 sm:py-10 max-w-lg mx-auto animate-in fade-in zoom-in-95 duration-300">
      {/* Animated Success Badge */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-indigo-500 p-0.5 mx-auto mb-6 shadow-2xl shadow-emerald-500/25">
        <div className="w-full h-full bg-[#0B0F19] rounded-[14px] flex items-center justify-center">
          <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-4">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Profile Initialized &amp; Calibrated</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading mb-3">
        Your NEXORA profile is ready
      </h1>

      <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto mb-6">
        Welcome aboard, {firstName}. Your real student records, enrolled subjects, and independent goals are configured and ready.
      </p>

      {/* Snapshot Card */}
      <div className="p-4 rounded-xl bg-[#090D15] border border-[#1E273A] text-left space-y-2.5 mb-8">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-[#182133]">
          <span className="text-slate-400 font-mono">University Roll:</span>
          <span className="text-indigo-400 font-mono font-bold bg-indigo-500/10 px-2 py-0.5 rounded">
            {data.rollNumber}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Program:</span>
          <span className="text-white font-medium">
            {data.degree === 'Other / Custom Degree' ? data.customDegree : data.degree} (Sem {data.currentSemester})
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Target Role:</span>
          <span className="text-emerald-400 font-medium">
            {displayCareer}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Active Coursework:</span>
          <span className="text-slate-200">
            {(data.subjects || []).length} subjects logged
          </span>
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        type="button"
        onClick={onEnterDashboard}
        className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-semibold text-sm transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>Enter My Dashboard</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
