import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  TrendingUp,
  DollarSign,
  Building,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Target,
  Layers,
  FolderGit2,
} from 'lucide-react';
import { PageHeader, StatCard, ProgressBar } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';
import { mockStudent, mockCareerPaths, CareerPath } from '../../data/mockData';

export const CareerPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const student = user?.studentProfile || mockStudent;

  const [selectedPathId, setSelectedPathId] = useState<string>(mockCareerPaths[0].id);
  const selectedPath = mockCareerPaths.find((c) => c.id === selectedPathId) || mockCareerPaths[0];

  const handleSetPrimaryTarget = (careerTitle: string) => {
    updateProfile({ targetCareer: careerTitle });
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <PageHeader
        title="Career Intelligence"
        subtitle="Market-calibrated career trajectory recommendations based on your verified coursework and technical skill matrix."
        badge="Market Data Engine"
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Primary Target:</span>
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
              {student.targetCareer}
            </span>
          </div>
        }
      />

      {/* Demo Disclaimer Notice */}
      <div className="p-4 rounded-xl bg-[#0F1422] border border-[#1F293D] flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <span>
            Prototype career insights grounded in live Q3 2026 tech hiring compensation benchmarks and skill frequency distributions.
          </span>
        </div>
        <span className="font-mono text-indigo-400 font-semibold hidden sm:inline">NEXORA ML 2.4</span>
      </div>

      {/* 3 Career Paths Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {mockCareerPaths.map((career) => {
          const isSelected = career.id === selectedPath.id;
          const isPrimary = student.targetCareer === career.title;

          return (
            <div
              key={career.id}
              onClick={() => setSelectedPathId(career.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-[#111728] to-[#0D121F] border-indigo-500 shadow-xl shadow-indigo-500/10'
                  : 'bg-[#0D111A] border-[#1C2436] hover:border-[#2C3852]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                    career.matchScore >= 80 ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                  }`}>
                    {career.matchScore}% Profile Match
                  </span>
                  {isPrimary && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-600 text-white font-bold">
                      Primary Target
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white leading-tight">{career.title}</h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {career.description}
                </p>

                <div className="mt-4 pt-3 border-t border-[#182132] space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400 font-sans">Avg Comp:</span>
                    <span>{career.avgSalaryRange}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400 font-sans">Market Growth:</span>
                    <span className="text-emerald-400">{career.openingsGrowth}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#182132] flex items-center justify-between text-xs">
                <span className="text-indigo-400 font-semibold">
                  {isSelected ? 'Viewing Breakdown ✓' : 'Inspect Trajectory →'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Career In-Depth Dossier */}
      <div className="rounded-2xl bg-[#0D111A] border border-[#1C2538] p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#1A2234]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
                Trajectory Deep Dive
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs font-mono text-emerald-400">{selectedPath.matchScore}% Match Index</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">{selectedPath.title}</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">{selectedPath.description}</p>
          </div>

          <div className="flex items-center gap-3">
            {student.targetCareer !== selectedPath.title ? (
              <button
                onClick={() => handleSetPrimaryTarget(selectedPath.title)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-600/30"
              >
                <Target className="w-4 h-4" />
                <span>Set as Primary Target</span>
              </button>
            ) : (
              <div className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Active Target Role</span>
              </div>
            )}
          </div>
        </div>

        {/* 2 Column Comparison: Verified Strengths vs Missing Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="p-5 rounded-xl bg-[#101522] border border-[#1B2538]">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 mb-3">
              <CheckCircle2 className="w-4 h-4" />
              <span>Current Verified Strengths ({selectedPath.userStrengths.length})</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Competencies you currently have that give you an advantage in this role:
            </p>
            <div className="space-y-2">
              {selectedPath.userStrengths.map((str, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-[#141B2B] border border-[#1E293E] text-xs font-medium text-slate-200 flex items-center justify-between">
                  <span>{str}</span>
                  <span className="text-[10px] font-mono text-emerald-400">Validated ✓</span>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="p-5 rounded-xl bg-[#101522] border border-[#1B2538]">
            <div className="flex items-center gap-2 text-sm font-bold text-rose-400 mb-3">
              <AlertCircle className="w-4 h-4" />
              <span>Missing Critical Skills ({selectedPath.missingSkills.length})</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Core technical gaps required to achieve 90%+ readiness benchmark:
            </p>
            <div className="space-y-2">
              {selectedPath.missingSkills.map((gap, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-[#141B2B] border border-[#1E293E] text-xs font-medium text-slate-200 flex items-center justify-between">
                  <span>{gap}</span>
                  <button
                    onClick={() => navigate('/dashboard/roadmap')}
                    className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    Add to Roadmap →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Suggested Targeted Projects & Target Employers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#182132]">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <FolderGit2 className="w-4 h-4 text-indigo-400" />
              <span>Recommended Portfolio Builds for this Role</span>
            </h3>
            <div className="space-y-2">
              {selectedPath.suggestedProjects.map((p, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#111726] border border-[#1E283C] text-xs text-slate-300 flex items-center justify-between">
                  <span>{p}</span>
                  <button
                    onClick={() => navigate('/dashboard/projects')}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    View Spec →
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Building className="w-4 h-4 text-cyan-400" />
              <span>Target Hiring Companies</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedPath.targetCompanies.map((c, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-[#121828] border border-[#202C42] text-xs font-medium text-slate-200"
                >
                  {c}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-3">
              Companies actively hiring for this role with on-campus or early-career university tracks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
