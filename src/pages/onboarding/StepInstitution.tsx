import React, { useState } from 'react';
import { Building2, School, Hash, IdCard, Info, AlertCircle } from 'lucide-react';
import { OnboardingData } from './types';

interface StepInstitutionProps {
  data: OnboardingData;
  onChange: (fields: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepInstitution: React.FC<StepInstitutionProps> = ({
  data,
  onChange,
  onNext,
  onBack,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!data.collegeName.trim()) {
      setError('Please enter your College or Institution name.');
      return;
    }
    if (!data.universityName.trim()) {
      setError('Please enter your University name.');
      return;
    }
    if (!data.rollNumber.trim()) {
      setError('Please enter your University Roll Number. This is your primary student identifier.');
      return;
    }

    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-2">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Institution &amp; Identity
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          NEXORA works for students from any college or university across India and internationally.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* College / Institution Name */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
          College / Institution Name <span className="text-indigo-400">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Building2 className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={data.collegeName}
            onChange={(e) => onChange({ collegeName: e.target.value })}
            placeholder="e.g. Heritage Institute of Technology / RV College of Engineering"
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#090D15] border border-[#1E273A] text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            required
          />
        </div>
      </div>

      {/* University Name */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
          Affiliated University Name <span className="text-indigo-400">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <School className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={data.universityName}
            onChange={(e) => onChange({ universityName: e.target.value })}
            placeholder="e.g. MAKAUT / VTU / Anna University / Delhi University"
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#090D15] border border-[#1E273A] text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            required
          />
        </div>
      </div>

      {/* University Roll Number (Primary ID) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            University Roll Number <span className="text-indigo-400">*</span>
          </label>
          <span className="text-[11px] font-mono text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
            Primary Login ID
          </span>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Hash className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={data.rollNumber}
            onChange={(e) => onChange({ rollNumber: e.target.value.toUpperCase() })}
            placeholder="e.g. 23CS105 / 1RV21CS045"
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#090D15] border border-[#1E273A] text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-mono uppercase"
            required
          />
        </div>
        <p className="text-[11px] text-slate-500 mt-1">
          You will use this University Roll Number to log in to NEXORA.
        </p>
      </div>

      {/* Optional: College Student ID & Registration Number */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              College Student ID
            </label>
            <span className="text-[11px] text-slate-500 font-mono">Optional</span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <IdCard className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={data.collegeStudentId}
              onChange={(e) => onChange({ collegeStudentId: e.target.value })}
              placeholder="e.g. CSE-2023-042"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#090D15] border border-[#1E273A] text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-mono"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              Registration Number
            </label>
            <span className="text-[11px] text-slate-500 font-mono">Optional</span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Hash className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={data.universityRegNumber}
              onChange={(e) => onChange({ universityRegNumber: e.target.value })}
              placeholder="e.g. 23101004928"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#090D15] border border-[#1E273A] text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-mono"
            />
          </div>
        </div>
      </div>

      {/* Explanatory Info Card */}
      <div className="p-3 rounded-xl bg-[#0C121E] border border-[#1A2338] flex items-start gap-2.5 text-xs text-slate-400">
        <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-200">Universal Academic Compatibility:</strong> NEXORA is institution-agnostic. Whether you study at an autonomous engineering college, state university, or private institute, your curriculum and performance benchmarks are tailored to your department.
        </p>
      </div>

      {/* Actions */}
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
          <span>Continue</span>
          <span>→</span>
        </button>
      </div>
    </form>
  );
};
