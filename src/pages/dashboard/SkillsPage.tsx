import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Filter,
  RefreshCw,
  FolderGit2,
  Compass,
  Layers,
} from 'lucide-react';
import { PageHeader, StatCard, ProgressBar } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';
import { mockStudent, mockSkills, mockCareerPaths, SkillItem } from '../../data/mockData';

export const SkillsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const student = user?.studentProfile || mockStudent;

  const [selectedRole, setSelectedRole] = useState<string>(student.targetCareer);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);

  const filteredSkills = categoryFilter === 'All'
    ? mockSkills
    : mockSkills.filter((s) => s.category === categoryFilter);

  const highPriorityGaps = mockSkills.filter((s) => s.priority === 'High' && s.gap > 0);
  const masteredSkills = mockSkills.filter((s) => s.gap <= 0);

  const handleRecalculate = async () => {
    setIsRecalculating(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsRecalculating(false);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <PageHeader
        title="Skill Gap Analyzer"
        subtitle="Mathematical comparison between your verified technical competencies and industry requirements for target roles."
        badge="ML Differential Engine"
        actions={
          <div className="flex items-center gap-3">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-[#0F1420] border border-[#1E2638] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
            >
              {mockCareerPaths.map((c) => (
                <option key={c.id} value={c.title}>
                  Target: {c.title}
                </option>
              ))}
            </select>

            <button
              onClick={handleRecalculate}
              disabled={isRecalculating}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#151D2E] hover:bg-[#1D273D] text-slate-200 border border-[#24314A] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin text-indigo-400' : ''}`} />
              <span className="hidden sm:inline">Recalculate Gaps</span>
            </button>
          </div>
        }
      />

      {/* Visual Diagnostic Banner: CURRENT LEVEL → REQUIRED LEVEL → SKILL GAP → RECOMMENDED ACTION */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0F1424] via-[#0E1526] to-[#0A0D15] border border-[#1E273D] shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#1A2336] mb-5">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
              Diagnostic Framework
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
              Closed-Loop Gap Resolution Pipeline
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Target Role: {selectedRole}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293E]">
            <span className="text-[10px] font-mono uppercase text-slate-400">Step 1</span>
            <h3 className="text-sm font-bold text-white mt-1">CURRENT LEVEL</h3>
            <p className="text-xs text-slate-400 mt-1">Verified coursework, coding repo analysis, and quiz telemetry.</p>
            <div className="mt-3 text-lg font-bold text-indigo-400 font-mono">82% Avg</div>
          </div>

          <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293E]">
            <span className="text-[10px] font-mono uppercase text-slate-400">Step 2</span>
            <h3 className="text-sm font-bold text-white mt-1">REQUIRED LEVEL</h3>
            <p className="text-xs text-slate-400 mt-1">Industry job description NLP parsing and baseline standards.</p>
            <div className="mt-3 text-lg font-bold text-cyan-400 font-mono">90% Target</div>
          </div>

          <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293E]">
            <span className="text-[10px] font-mono uppercase text-slate-400">Step 3</span>
            <h3 className="text-sm font-bold text-white mt-1">SKILL GAP</h3>
            <p className="text-xs text-slate-400 mt-1">Differential deficit calculation weighted by role relevance.</p>
            <div className="mt-3 text-lg font-bold text-rose-400 font-mono">-8% Deficit</div>
          </div>

          <div className="p-4 rounded-xl bg-[#111726] border border-indigo-500/30 bg-indigo-950/20">
            <span className="text-[10px] font-mono uppercase text-indigo-300 font-bold">Step 4</span>
            <h3 className="text-sm font-bold text-white mt-1">RECOMMENDED ACTION</h3>
            <p className="text-xs text-indigo-200 mt-1">Targeted project lab assignments and learning roadmap modules.</p>
            <div className="mt-3 text-xs font-semibold text-indigo-300 flex items-center gap-1 cursor-pointer" onClick={() => navigate('/dashboard/projects')}>
              <span>View 3 Projects →</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Critical Gaps"
          value={highPriorityGaps.length}
          change="Action required"
          changeType="negative"
          subtext="PyTorch, Docker, MLOps"
          icon={AlertCircle}
          accentColor="rose"
        />
        <StatCard
          title="Mastered Thresholds"
          value={masteredSkills.length}
          change="At or above target"
          changeType="positive"
          subtext="React, SQL, Algorithms"
          icon={CheckCircle2}
          accentColor="emerald"
        />
        <StatCard
          title="Overall Skill Readiness"
          value={`${student.skillScore}%`}
          change="+6% this quarter"
          changeType="positive"
          subtext="Based on 8 core vectors"
          icon={TrendingUp}
          accentColor="indigo"
        />
      </div>

      {/* Main Skill Matrix Table */}
      <div className="rounded-xl bg-[#0D111A] border border-[#1B2232] p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Technical Competencies</span>
            <h2 className="text-lg font-bold text-white mt-0.5">Role-Specific Competency Matrix</h2>
          </div>

          <div className="flex items-center gap-1.5 bg-[#121826] p-1 rounded-lg border border-[#1D273C]">
            {['All', 'Programming', 'AI & ML', 'Databases & Web', 'DevOps & Tools'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  categoryFilter === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredSkills.map((skill) => {
            const hasDeficit = skill.gap > 0;
            return (
              <div
                key={skill.id}
                className="p-4 rounded-xl bg-[#101522] border border-[#1C2538] hover:border-[#27344E] transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Skill name & category */}
                  <div className="lg:w-1/4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{skill.name}</h3>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        skill.priority === 'High'
                          ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                          : skill.priority === 'Medium'
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                          : 'bg-slate-700/30 text-slate-300 border border-slate-700/50'
                      }`}>
                        {skill.priority} Priority
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                      {skill.category}
                    </span>
                  </div>

                  {/* Level comparison & Progress bars */}
                  <div className="lg:w-2/5">
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-slate-300">
                        Current: <strong className="text-indigo-400">{skill.currentLevel}%</strong>
                      </span>
                      <span className="text-slate-400">
                        Required: <strong className="text-white">{skill.requiredLevel}%</strong>
                      </span>
                      <span className={hasDeficit ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                        {hasDeficit ? `-${skill.gap}% Deficit` : '+ Surpassed'}
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-[#171E2D] rounded-full overflow-hidden relative">
                      {/* Required Target Tick Marker */}
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-white z-10 rounded-full shadow-sm"
                        style={{ left: `${skill.requiredLevel}%` }}
                        title={`Target: ${skill.requiredLevel}%`}
                      />
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          !hasDeficit
                            ? 'bg-emerald-500'
                            : skill.gap > 20
                            ? 'bg-rose-500'
                            : 'bg-indigo-500'
                        }`}
                        style={{ width: `${skill.currentLevel}%` }}
                      />
                    </div>
                  </div>

                  {/* Recommended Action & CTA */}
                  <div className="lg:w-1/3 flex items-center justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#182132]">
                    <p className="text-xs text-slate-300">
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Prescribed Action</span>
                      {skill.action}
                    </p>
                    <button
                      onClick={() => navigate('/dashboard/roadmap')}
                      className="p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 transition-all flex-shrink-0"
                      title="Navigate to Roadmap Task"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
