import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  Briefcase,
  Flame,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  Compass,
  FileText,
  Bot,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { StatCard, PageHeader, ProgressBar } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';
import {
  mockStudent,
  mockAcademicSemesters,
  mockSkills,
  mockProjects,
  mockRecentActivities,
} from '../../data/mockData';

export const OverviewPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const student = user?.studentProfile || mockStudent;

  const topSkills = mockSkills.slice(0, 5);

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F1424] via-[#0E1528] to-[#0A0E18] border border-[#1C263C] p-6 sm:p-8 shadow-xl">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Fall 2026 Telemetry Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
              Welcome back, {student.name}
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              You are currently tracked for <strong className="text-indigo-300">{student.targetCareer}</strong>.
              Your academic velocity is up <strong className="text-emerald-400">+0.54 GPA</strong> and your ATS resume score reached <strong className="text-cyan-300">84/100</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/dashboard/skills')}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/30 shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze Skill Gaps</span>
            </button>
            <button
              onClick={() => navigate('/dashboard/ai')}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-[#141B2B] hover:bg-[#1A2338] border border-[#232F4A] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>Ask AI Mentor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 5 Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Career Readiness"
          value={`${student.readinessScore}%`}
          change="+4% this month"
          changeType="positive"
          subtext="Target: ML Engineer"
          icon={Briefcase}
          accentColor="indigo"
        />
        <StatCard
          title="Academic CGPA"
          value={student.cgpa.toFixed(2)}
          change="Top 5% in Dept"
          changeType="positive"
          subtext="Target: 9.00 GPA"
          icon={GraduationCap}
          accentColor="cyan"
        />
        <StatCard
          title="Technical Skills"
          value={`${student.skillScore}/100`}
          change="8 Verified"
          changeType="neutral"
          subtext="2 Gaps Alerted"
          icon={Sparkles}
          accentColor="purple"
        />
        <StatCard
          title="Learning Streak"
          value={`${student.learningStreakDays} Days`}
          change="Personal Best!"
          changeType="positive"
          subtext="184 Total Hours"
          icon={Flame}
          accentColor="amber"
        />
        <StatCard
          title="Roadmap Stage"
          value="Stage 3/6"
          change="68% Finished"
          changeType="positive"
          subtext="Specialized AI"
          icon={Compass}
          accentColor="emerald"
        />
      </div>

      {/* The NEXORA Intelligence Flow Banner */}
      <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1A2234] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-indigo-400" />
          <span className="text-white font-semibold">Intelligence Loop:</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
          <span className="px-2.5 py-1 rounded bg-[#131926] text-slate-300 border border-[#1E273B]">Student Data</span>
          <span className="text-indigo-400">→</span>
          <span className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">Intelligence</span>
          <span className="text-indigo-400">→</span>
          <span className="px-2.5 py-1 rounded bg-[#131926] text-slate-300 border border-[#1E273B]">Recommendation</span>
          <span className="text-indigo-400">→</span>
          <span className="px-2.5 py-1 rounded bg-[#131926] text-slate-300 border border-[#1E273B]">Action</span>
          <span className="text-indigo-400">→</span>
          <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold">Progress</span>
        </div>
        <button
          onClick={() => navigate('/dashboard/progress')}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
        >
          <span>View Flow Metrics</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Recommended Next High-Yield Action Callout */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-[#0C101A] border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 mt-0.5">
            <AlertCircle className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 font-mono">Recommended Next Action</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-300 border border-rose-500/20">High Priority</span>
            </div>
            <p className="text-sm font-semibold text-white mt-1">
              Close PyTorch &amp; Deep Learning Transformer Gap (Deficit: 28%)
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Identified by Skill Gap Analyzer: Building a Transformer Attention module will raise your ML Engineer match to 84%.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/dashboard/roadmap')}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer shadow-md shadow-indigo-600/30"
        >
          <span>Start Task in Roadmap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Charts Grid: Academic Trajectory & Skill Competency */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Performance Chart (2 cols) */}
        <div className="lg:col-span-2 rounded-xl bg-[#0D111A] border border-[#1B2232] p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Academic Progression</span>
              <h2 className="text-lg font-bold text-white mt-0.5">Semester GPA &amp; Cumulative Trend</h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-slate-300">SGPA (Semester)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-cyan-400" />
                <span className="text-slate-300">CGPA (Overall)</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockAcademicSemesters} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="sgpaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="cgpaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#182234" vertical={false} />
                <XAxis dataKey="semester" stroke="#64748B" tick={{ fontSize: 11 }} />
                <YAxis domain={[7.5, 10]} stroke="#64748B" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D131F',
                    borderColor: '#222C42',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#F8FAFC',
                  }}
                />
                <Area type="monotone" dataKey="sgpa" stroke="#6366F1" strokeWidth={2.5} fillOpacity={1} fill="url(#sgpaGrad)" name="Semester SGPA" />
                <Area type="monotone" dataKey="cgpa" stroke="#06B6D4" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#cgpaGrad)" name="Cumulative CGPA" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-[#182030] flex items-center justify-between text-xs text-slate-400">
            <span>Strongest: Sem 6 (9.25 SGPA)</span>
            <button
              onClick={() => navigate('/dashboard/academic')}
              className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <span>Full Transcript Analysis</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Skill Gap Snapshot Card (1 col) */}
        <div className="rounded-xl bg-[#0D111A] border border-[#1B2232] p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Skill Competency</span>
                <h2 className="text-lg font-bold text-white mt-0.5">Top Required Skills</h2>
              </div>
              <button
                onClick={() => navigate('/dashboard/skills')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                All 8 Skills →
              </button>
            </div>

            <div className="space-y-3.5">
              {topSkills.map((skill) => (
                <div key={skill.id}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-slate-200">{skill.name}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-400">{skill.currentLevel}%</span>
                      <span className="text-slate-400">/</span>
                      <span className="text-indigo-300 font-semibold">{skill.requiredLevel}% req</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-[#161D2C] rounded-full overflow-hidden relative">
                    {/* Required marker */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-white z-10 opacity-70"
                      style={{ left: `${skill.requiredLevel}%` }}
                      title={`Target Level: ${skill.requiredLevel}%`}
                    />
                    <div
                      className={`h-full rounded-full ${
                        skill.currentLevel >= skill.requiredLevel
                          ? 'bg-emerald-500'
                          : skill.gap > 20
                          ? 'bg-rose-500'
                          : 'bg-indigo-500'
                      }`}
                      style={{ width: `${skill.currentLevel}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 p-3 rounded-lg bg-[#111726] border border-[#1E283C] text-[11px] text-slate-300 flex items-center justify-between">
            <span>White tick marks indicate target role threshold.</span>
            <span className="text-indigo-400 font-semibold cursor-pointer" onClick={() => navigate('/dashboard/skills')}>
              View Matrix
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Project Progress & Recent Telemetry Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects (2 cols) */}
        <div className="lg:col-span-2 rounded-xl bg-[#0D111A] border border-[#1B2232] p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Portfolio Execution</span>
              <h2 className="text-lg font-bold text-white mt-0.5">Active Project Lab Builds</h2>
            </div>
            <button
              onClick={() => navigate('/dashboard/projects')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Explore Project Lab →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockProjects.slice(0, 2).map((project) => (
              <div
                key={project.id}
                className="p-4 rounded-xl bg-[#101522] border border-[#1C2538] hover:border-[#2A3752] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {project.category}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      project.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{project.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{project.tagline}</p>

                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
                      <span>Progress</span>
                      <span className="text-white">{project.progress}%</span>
                    </div>
                    <ProgressBar value={project.progress} color={project.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'} />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#171F30] flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[11px] truncate max-w-[180px]">Addresses: {project.skillsCovered[0]}</span>
                  <button
                    onClick={() => navigate('/dashboard/projects')}
                    className="text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Telemetry Activity (1 col) */}
        <div className="rounded-xl bg-[#0D111A] border border-[#1B2232] p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Activity Telemetry</span>
                <h2 className="text-lg font-bold text-white mt-0.5">Recent Activity</h2>
              </div>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3">
              {mockRecentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 leading-snug">{act.text}</p>
                    <span className="text-[10px] text-slate-400 font-mono">{act.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#182030] text-center">
            <button
              onClick={() => navigate('/dashboard/progress')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              View Full Progress Log &amp; Badges →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
