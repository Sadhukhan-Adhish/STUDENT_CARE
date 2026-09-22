import React, { useState } from 'react';
import { Compass, Sparkles, Check, AlertCircle } from 'lucide-react';
import { OnboardingData } from './types';

interface StepCareerProps {
  data: OnboardingData;
  onChange: (fields: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const CAREER_OPTIONS = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'AI / ML Engineer',
  'Data Scientist',
  'Data Analyst',
  'Cybersecurity Engineer',
  'Cloud / DevOps Engineer',
  'UI / UX Designer',
  'Mobile App Developer',
  'Product Manager',
  'Other / Custom Career Goal',
];

export const StepCareer: React.FC<StepCareerProps> = ({
  data,
  onChange,
  onNext,
  onBack,
}) => {
  const [error, setError] = useState<string | null>(null);
  const isOther = data.targetCareer === 'Other / Custom Career Goal';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!data.targetCareer) {
      setError('Please select a target career path.');
      return;
    }
    if (isOther && !data.customCareer.trim()) {
      setError('Please specify your custom career goal.');
      return;
    }

    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-2">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Career Direction &amp; Goals
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          What career path are you currently preparing for? UNNEXA will tailor recommendations and roadmap milestones to this role.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid of Career Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {CAREER_OPTIONS.map((career) => {
          const isSelected = data.targetCareer === career;
          return (
            <button
              key={career}
              type="button"
              onClick={() => onChange({ targetCareer: career })}
              className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-600/15 ring-1 ring-indigo-500/30'
                  : 'bg-[#090D15] border-[#1E273A] text-slate-300 hover:border-slate-600 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-indigo-400' : 'bg-slate-600'}`} />
                <span className="text-xs font-semibold">{career}</span>
              </div>
              {isSelected && (
                <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Custom Career Input */}
      {isOther && (
        <div className="p-4 rounded-xl bg-[#090D15] border border-indigo-500/40 space-y-2 animate-in fade-in duration-200">
          <label className="block text-xs font-semibold text-indigo-300 uppercase tracking-wider font-mono">
            Specify Your Career Goal <span className="text-indigo-400">*</span>
          </label>
          <input
            type="text"
            value={data.customCareer}
            onChange={(e) => onChange({ customCareer: e.target.value })}
            placeholder="e.g. Robotics Engineer, Quantitative Analyst, VLSI Design, GATE / PSU"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080E] border border-[#222E47] text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            required
            autoFocus
          />
          <p className="text-[11px] text-slate-400">
            UNNEXA supports engineering, science, business, design, and competitive exam tracks.
          </p>
        </div>
      )}

      {/* Reassurance note */}
      <div className="p-3 rounded-xl bg-[#0C121E] border border-[#1A2338] flex items-start gap-2.5 text-xs text-slate-400">
        <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-200">You can change your target role anytime:</strong> Your career goal adapts as you explore internships, discover new interests, or change domains.
        </p>
      </div>

      {/* Navigation Actions */}
      <div className="pt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-[#141B2A] hover:bg-[#1E273D] text-slate-300 hover:text-white border border-[#232F4A] transition-colors text-sm font-medium cursor-pointer"
        >
          ← Back
        </button>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2 cursor-pointer"
        >
          <span>Review Profile Summary</span>
          <span>→</span>
        </button>
      </div>
    </form>
  );
};
