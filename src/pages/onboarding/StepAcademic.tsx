import React, { useState } from 'react';
import { GraduationCap, BookOpen, Calendar, AlertCircle } from 'lucide-react';
import { OnboardingData } from './types';

interface StepAcademicProps {
  data: OnboardingData;
  onChange: (fields: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const DEGREE_OPTIONS = [
  'Bachelor of Technology (B.Tech)',
  'Bachelor of Engineering (B.E.)',
  'Bachelor of Computer Applications (BCA)',
  'Bachelor of Science (B.Sc)',
  'Master of Technology (M.Tech)',
  'Master of Computer Applications (MCA)',
  'Bachelor of Business Administration (BBA)',
  'Other / Custom Degree',
];

const BRANCH_OPTIONS = [
  'Computer Science & Engineering (CSE)',
  'CSE (Artificial Intelligence & Machine Learning)',
  'CSE (Data Science)',
  'CSE (Cybersecurity & IoT)',
  'Information Technology (IT)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'Chemical Engineering',
  'Biotechnology',
  'Other / Custom Program',
];

const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];

export const StepAcademic: React.FC<StepAcademicProps> = ({
  data,
  onChange,
  onNext,
  onBack,
}) => {
  const [error, setError] = useState<string | null>(null);

  const isCustomDegree = data.degree === 'Other / Custom Degree';
  const isCustomBranch = data.department === 'Other / Custom Program';

  const handleSemesterChange = (sem: number) => {
    // Auto sync current year if appropriate
    const calculatedYear = `${Math.ceil(sem / 2)}${
      Math.ceil(sem / 2) === 1
        ? 'st Year'
        : Math.ceil(sem / 2) === 2
        ? 'nd Year'
        : Math.ceil(sem / 2) === 3
        ? 'rd Year'
        : 'th Year'
    }`;

    onChange({
      currentSemester: sem,
      currentYear: data.currentYear || calculatedYear,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const effectiveDegree = isCustomDegree ? (data.customDegree || '').trim() : data.degree;
    const effectiveBranch = isCustomBranch ? (data.customDepartment || '').trim() : data.department;

    if (!effectiveDegree) {
      setError('Please select or enter your Degree program.');
      return;
    }
    if (!effectiveBranch) {
      setError('Please select or enter your Branch or Department.');
      return;
    }
    if (!data.currentYear) {
      setError('Please select your Current Academic Year.');
      return;
    }
    if (!data.currentSemester) {
      setError('Please select your Current Semester.');
      return;
    }

    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-2">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Academic Program &amp; Semester
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Specify your degree curriculum and current semester standing.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Degree */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
          Degree Program <span className="text-indigo-400">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <GraduationCap className="w-4 h-4" />
          </div>
          <select
            value={data.degree}
            onChange={(e) => onChange({ degree: e.target.value })}
            className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-[#090D15] border border-[#1E273A] text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer appearance-none"
            required
          >
            <option value="">-- Select Degree --</option>
            {DEGREE_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-[#0B0F19] text-white">
                {opt}
              </option>
            ))}
          </select>
        </div>

        {isCustomDegree && (
          <div className="mt-2.5 animate-in fade-in duration-200">
            <input
              type="text"
              value={data.customDegree || ''}
              onChange={(e) => onChange({ customDegree: e.target.value })}
              placeholder="Type your custom degree name (e.g. Integrated M.Sc Data Science)"
              className="w-full px-3.5 py-2 rounded-xl bg-[#090D15] border border-indigo-500/40 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              required
            />
          </div>
        )}
      </div>

      {/* Branch / Department */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
          Branch / Program <span className="text-indigo-400">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <BookOpen className="w-4 h-4" />
          </div>
          <select
            value={data.department}
            onChange={(e) => onChange({ department: e.target.value })}
            className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-[#090D15] border border-[#1E273A] text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer appearance-none"
            required
          >
            <option value="">-- Select Branch / Specialization --</option>
            {BRANCH_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-[#0B0F19] text-white">
                {opt}
              </option>
            ))}
          </select>
        </div>

        {isCustomBranch && (
          <div className="mt-2.5 animate-in fade-in duration-200">
            <input
              type="text"
              value={data.customDepartment || ''}
              onChange={(e) => onChange({ customDepartment: e.target.value })}
              placeholder="Type your custom department/specialization name"
              className="w-full px-3.5 py-2 rounded-xl bg-[#090D15] border border-indigo-500/40 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              required
            />
          </div>
        )}
      </div>

      {/* Current Year & Current Semester */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
            Current Academic Year <span className="text-indigo-400">*</span>
          </label>
          <select
            value={data.currentYear}
            onChange={(e) => onChange({ currentYear: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D15] border border-[#1E273A] text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer"
            required
          >
            <option value="">-- Select Year --</option>
            {YEAR_OPTIONS.map((yr) => (
              <option key={yr} value={yr} className="bg-[#0B0F19] text-white">
                {yr}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
            Current Semester <span className="text-indigo-400">*</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
              const isSelected = data.currentSemester === sem;
              return (
                <button
                  key={sem}
                  type="button"
                  onClick={() => handleSemesterChange(sem)}
                  className={`py-2 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                      : 'bg-[#090D15] text-slate-400 border border-[#1E273A] hover:text-slate-200 hover:border-slate-600'
                  }`}
                >
                  Sem {sem}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Admission Year & Expected Graduation Year (Optional) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              Admission Year
            </label>
            <span className="text-[11px] text-slate-500 font-mono">Optional</span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Calendar className="w-4 h-4" />
            </div>
            <input
              type="number"
              min="2015"
              max="2035"
              value={data.admissionYear}
              onChange={(e) => onChange({ admissionYear: e.target.value })}
              placeholder="e.g. 2023"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#090D15] border border-[#1E273A] text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-mono"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              Expected Graduation Year
            </label>
            <span className="text-[11px] text-slate-500 font-mono">Optional</span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Calendar className="w-4 h-4" />
            </div>
            <input
              type="number"
              min="2020"
              max="2038"
              value={data.expectedGraduationYear}
              onChange={(e) => onChange({ expectedGraduationYear: e.target.value })}
              placeholder="e.g. 2027"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#090D15] border border-[#1E273A] text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-mono"
            />
          </div>
        </div>
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
