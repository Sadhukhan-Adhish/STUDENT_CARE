import React from 'react';
import { Edit3, CheckCircle2, Building2, GraduationCap, BookOpen, Wrench, Target, FolderGit2, Compass, User } from 'lucide-react';
import { OnboardingData } from './types';

interface StepSummaryProps {
  data: OnboardingData;
  onGoToStep: (stepNumber: number) => void;
  onComplete: () => void;
  isSubmitting?: boolean;
}

export const StepSummary: React.FC<StepSummaryProps> = ({
  data,
  onGoToStep,
  onComplete,
  isSubmitting = false,
}) => {
  const displayCareer =
    data.targetCareer === 'Other / Custom Career Goal'
      ? data.customCareer
      : data.targetCareer || 'Undecided';

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Review Your Student Profile
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Everything look good? You can click &quot;Edit&quot; on any section to make quick adjustments.
        </p>
      </div>

      <div className="space-y-3.5">
        {/* 1. Personal Info */}
        <div className="p-4 rounded-xl bg-[#090D15] border border-[#1E273A] flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Personal Information
                </h4>
              </div>
              <p className="text-sm font-semibold text-white mt-0.5">{data.fullName}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                <span>{data.email}</span>
                {data.phone && <span>• {data.phone}</span>}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onGoToStep(1)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-[#151D2E] transition-colors flex items-center gap-1 text-xs cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        </div>

        {/* 2. Institution */}
        <div className="p-4 rounded-xl bg-[#090D15] border border-[#1E273A] flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Institution &amp; Roll Number
              </h4>
              <p className="text-sm font-semibold text-white mt-0.5">{data.collegeName}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                <span>Univ: {data.universityName}</span>
                <span>•</span>
                <span className="font-mono text-indigo-400 font-semibold bg-indigo-500/10 px-1.5 py-0.5 rounded">
                  Roll: {data.rollNumber}
                </span>
                {data.collegeStudentId && (
                  <span className="font-mono text-slate-500">ID: {data.collegeStudentId}</span>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onGoToStep(2)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-[#151D2E] transition-colors flex items-center gap-1 text-xs cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        </div>

        {/* 3. Academic Info */}
        <div className="p-4 rounded-xl bg-[#090D15] border border-[#1E273A] flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Program &amp; Semester
              </h4>
              <p className="text-sm font-semibold text-white mt-0.5">
                {data.degree === 'Other / Custom Degree' ? data.customDegree : data.degree}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                <span>
                  {data.department === 'Other / Custom Program' ? data.customDepartment : data.department}
                </span>
                <span>•</span>
                <span className="font-mono text-emerald-400 font-semibold">
                  Sem {data.currentSemester} ({data.currentYear})
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onGoToStep(3)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-[#151D2E] transition-colors flex items-center gap-1 text-xs cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        </div>

        {/* 4. Coursework & Subjects */}
        <div className="p-4 rounded-xl bg-[#090D15] border border-[#1E273A] flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Subjects &amp; Coursework ({(data.subjects || []).length})
              </h4>
              {(data.subjects || []).length === 0 ? (
                <p className="text-xs text-slate-500 mt-0.5">No subjects added yet</p>
              ) : (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-lg">
                  {data.subjects.slice(0, 6).map((sub) => (
                    <span
                      key={sub.code + sub.name}
                      className="text-[11px] font-mono bg-[#111827] text-slate-300 px-2 py-0.5 rounded border border-[#222E47]"
                    >
                      {sub.name} (S{sub.semesterNumber || 1})
                    </span>
                  ))}
                  {data.subjects.length > 6 && (
                    <span className="text-[11px] font-mono text-slate-500 self-center">
                      +{data.subjects.length - 6} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onGoToStep(4)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-[#151D2E] transition-colors flex items-center gap-1 text-xs cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        </div>

        {/* 5. Skills & Own Skill Up */}
        <div className="p-4 rounded-xl bg-[#090D15] border border-[#1E273A] flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Skills &amp; Own Skill Up
              </h4>
              <div className="flex flex-wrap gap-2 text-xs text-slate-300 mt-1">
                <span>Current Skills: <strong className="text-white">{(data.skills || []).length}</strong></span>
                <span>•</span>
                <span>Own Skill Up Goals: <strong className="text-emerald-400">{(data.ownSkillUp || []).length}</strong></span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(data.skills || []).slice(0, 5).map((s) => (
                  <span
                    key={s.id}
                    className="text-[10px] font-mono bg-[#11192B] text-slate-300 px-2 py-0.5 rounded border border-[#232F4A]"
                  >
                    {s.name}
                  </span>
                ))}
                {(data.ownSkillUp || []).slice(0, 3).map((g) => (
                  <span
                    key={g.id}
                    className="text-[10px] font-mono bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded"
                  >
                    Goal: {g.skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onGoToStep(5)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-[#151D2E] transition-colors flex items-center gap-1 text-xs cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        </div>

        {/* 6. Projects */}
        <div className="p-4 rounded-xl bg-[#090D15] border border-[#1E273A] flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Projects ({(data.projects || []).length})
              </h4>
              {(data.projects || []).length === 0 ? (
                <p className="text-xs text-slate-500 mt-0.5">None logged yet (can add anytime from dashboard)</p>
              ) : (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {data.projects.map((p) => (
                    <span
                      key={p.id}
                      className="text-[11px] font-mono bg-[#111827] text-slate-300 px-2 py-0.5 rounded border border-[#222E47]"
                    >
                      {p.title}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onGoToStep(6)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-[#151D2E] transition-colors flex items-center gap-1 text-xs cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        </div>

        {/* 7. Career Goal */}
        <div className="p-4 rounded-xl bg-[#090D15] border border-[#1E273A] flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Target Career Goal
              </h4>
              <p className="text-sm font-bold text-white mt-0.5">{displayCareer}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onGoToStep(7)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-[#151D2E] transition-colors flex items-center gap-1 text-xs cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        </div>
      </div>

      {/* Confirmation & Completion */}
      <div className="pt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onGoToStep(7)}
          className="px-5 py-2.5 rounded-xl bg-[#141B2A] hover:bg-[#1E273D] text-slate-300 hover:text-white border border-[#232F4A] transition-colors text-sm font-medium cursor-pointer"
        >
          ← Back
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={onComplete}
          className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-semibold text-sm transition-all shadow-xl shadow-indigo-600/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Activating Profile...</span>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Profile &amp; Finish</span>
              <span>→</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
