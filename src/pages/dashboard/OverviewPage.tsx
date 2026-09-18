import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  Briefcase,
  Flame,
  ArrowRight,
  TrendingUp,
  Clock,
  Compass,
  ChevronRight,
  UserCheck,
  AlertCircle,
  FolderGit2,
  BarChart2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { StatCard, ProgressBar } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';
import {
  mockStudent,
  mockRecentActivities,
  calculateSGPA,
} from '../../data/mockData';

export const OverviewPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const student = user?.studentProfile || mockStudent;

  const semesters = student.semesters || [];
  const skills = student.skills || [];
  const projects = student.projects || [];

  const topSkills = skills.slice(0, 5);
  const activeProjects = projects.filter((p) => p.status === 'In Progress' || p.status === 'Recommended');

  // Academic metrics
  const currentSgpa = calculateSGPA(student.subjects || []);
  const criticalGaps = skills.filter((s) => s.priority === 'High' && (s.gap ?? 0) > 0);
  const hasAcademicHistory = semesters.length > 0 && semesters.some((s) => typeof s.sgpa === 'number' && s.sgpa > 0);
  const readiness = student.readinessScore ?? 0;
  const currentCgpa = student.cgpa ?? 0;

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Dynamic Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F1424] via-[#0E1528] to-[#0A0E18] border border-[#1C263C] p-6 sm:p-8 shadow-xl">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {student.college || student.university} • Semester {student.currentSemester}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
              Welcome back, {student.name}
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              <span className="text-white font-medium">{student.degree} {student.department} · Semester {student.currentSemester}</span>
              <br />
              Roll Number: <strong className="text-indigo-300 font-mono">{student.rollNumber}</strong> | Target Career:{' '}
              <strong className="text-indigo-300">{student.targetCareer}</strong>
              {currentCgpa > 0 && (
                <>
                  {' '}with CGPA of <strong className="text-emerald-400 font-mono">{currentCgpa.toFixed(2)}</strong>
                </>
              )}
              .
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/dashboard/profile')}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-[#141B2B] hover:bg-[#1A2338] border border-[#232F4A] transition-all flex items-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-indigo-400" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={() => navigate('/dashboard/skills')}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/30 shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze Skill Gaps</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 5 Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Career Readiness"
          value={readiness > 0 ? `${readiness}%` : 'Evaluating'}
          change={readiness > 0 ? 'Role Alignment' : 'Add skills'}
          changeType={readiness > 0 ? 'positive' : 'neutral'}
          subtext={`Role: ${student.targetCareer}`}
          icon={Briefcase}
          accentColor="indigo"
        />
        <StatCard
          title="Academic CGPA"
          value={currentCgpa > 0 ? currentCgpa.toFixed(2) : 'Pending'}
          change={currentCgpa > 0 ? `Target: ${student.targetCgpa || 9.0}` : 'Awaiting results'}
          changeType={currentCgpa > 0 ? 'positive' : 'neutral'}
          subtext={semesters.length > 0 ? `${semesters.length} Semesters Recorded` : 'Add semester results'}
          icon={GraduationCap}
          accentColor="cyan"
        />
        <StatCard
          title="Technical Skills"
          value={`${skills.length} Tracked`}
          change={`${criticalGaps.length} Gaps Flagged`}
          changeType={criticalGaps.length > 0 ? 'neutral' : 'positive'}
          subtext="Skill-gap analysis active"
          icon={Sparkles}
          accentColor="purple"
        />
        <StatCard
          title="Active Projects"
          value={`${projects.length} Total`}
          change={`${activeProjects.length} Active Builds`}
          changeType="positive"
          subtext="Target role portfolio"
          icon={FolderGit2}
          accentColor="emerald"
        />
        <StatCard
          title="Learning Streak"
          value={`${student.learningStreakDays || 0} Days`}
          change="Study Streak"
          changeType="positive"
          subtext="Daily platform cadence"
          icon={Flame}
          accentColor="amber"
        />
      </div>

      {/* The NEXORA Intelligence Loop Banner */}
      <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1A2234] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-indigo-400" />
          <span className="text-white font-semibold">Intelligence Loop:</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
          <span className="px-2.5 py-1 rounded bg-[#131926] text-slate-300 border border-[#1E273B]">Student Profile</span>
          <span className="text-indigo-400">→</span>
          <span className="px-2.5 py-1 rounded bg-[#131926] text-slate-300 border border-[#1E273B]">Coursework</span>
          <span className="text-indigo-400">→</span>
          <span className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">Skill Gaps</span>
          <span className="text-indigo-400">→</span>
          <span className="px-2.5 py-1 rounded bg-[#131926] text-slate-300 border border-[#1E273B]">Target Projects</span>
          <span className="text-indigo-400">→</span>
          <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold">Career Roadmap</span>
        </div>
        <button
          onClick={() => navigate('/dashboard/progress')}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
        >
          <span>Progress Log</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Recommended Next Action Callout */}
      {criticalGaps.length > 0 && (
        <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-[#0C101A] border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 mt-0.5">
              <AlertCircle className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 font-mono">Recommended Next Action</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-300 border border-rose-500/20">Skill Priority</span>
              </div>
              <p className="text-sm font-semibold text-white mt-1">
                Close {criticalGaps[0].name} Gap (Deficit: {criticalGaps[0].gap}%)
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {criticalGaps[0].action || `Targeted practice will strengthen your foundation for ${student.targetCareer}.`}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard/projects')}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer shadow-md shadow-indigo-600/30"
          >
            <span>Explore Recommended Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Charts Grid: Academic Trajectory & Skill Competency */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Performance Chart (2 cols) */}
        <div className="lg:col-span-2 rounded-xl bg-[#0D111A] border border-[#1B2232] p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Academic Progression</span>
              <h2 className="text-lg font-bold text-white mt-0.5">Semester Progression Curve</h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-slate-300">SGPA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-cyan-400" />
                <span className="text-slate-300">CGPA {currentCgpa > 0 ? `(${currentCgpa.toFixed(2)})` : ''}</span>
              </div>
            </div>
          </div>

          {hasAcademicHistory ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={semesters} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  <YAxis domain={[0, 10]} stroke="#64748B" tick={{ fontSize: 11 }} />
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
          ) : (
            <div className="h-64 flex flex-col items-center justify-center p-6 text-center border border-dashed border-[#1E2638] rounded-xl bg-[#090D15]">
              <BarChart2 className="w-10 h-10 text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-300">Academic Progression Curve</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Add your completed semester grades in the Academic tab to view your progression curve.
              </p>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-[#182030] flex items-center justify-between text-xs text-slate-400">
            <span>Roll No: {student.rollNumber} • {student.department}</span>
            <button
              onClick={() => navigate('/dashboard/academic')}
              className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Subjects &amp; Results</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Skill Gap Snapshot Card (1 col) */}
        <div className="rounded-xl bg-[#0D111A] border border-[#1B2232] p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Skill Alignment</span>
                <h2 className="text-lg font-bold text-white mt-0.5">Role Competency Gaps</h2>
              </div>
              <button
                onClick={() => navigate('/dashboard/skills')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
              >
                All {skills.length} Skills →
              </button>
            </div>

            {topSkills.length > 0 ? (
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
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-white z-10 opacity-70"
                        style={{ left: `${skill.requiredLevel || 75}%` }}
                        title={`Target Level: ${skill.requiredLevel || 75}%`}
                      />
                      <div
                        className={`h-full rounded-full ${
                          skill.currentLevel >= (skill.requiredLevel || 75)
                            ? 'bg-emerald-500'
                            : (skill.gap ?? 0) > 20
                            ? 'bg-rose-500'
                            : 'bg-indigo-500'
                        }`}
                        style={{ width: `${skill.currentLevel}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                <p>No skills tracked yet.</p>
                <button
                  onClick={() => navigate('/dashboard/skills')}
                  className="mt-2 text-indigo-400 font-semibold"
                >
                  Add skills in Skills Hub →
                </button>
              </div>
            )}
          </div>

          <div className="mt-5 p-3 rounded-lg bg-[#111726] border border-[#1E283C] text-[11px] text-slate-300 flex items-center justify-between">
            <span>White markers indicate required benchmark for {student.targetCareer}.</span>
            <span
              className="text-indigo-400 font-semibold cursor-pointer hover:underline"
              onClick={() => navigate('/dashboard/skills')}
            >
              Add / Edit Skills
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Project Progress & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects (2 cols) */}
        <div className="lg:col-span-2 rounded-xl bg-[#0D111A] border border-[#1B2232] p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Portfolio Execution</span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Recommended &amp; Active Projects ({projects.length} Total)
              </h2>
            </div>
            <button
              onClick={() => navigate('/dashboard/projects')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
            >
              Manage Projects →
            </button>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.slice(0, 2).map((project) => (
                <div
                  key={project.id}
                  className="p-4 rounded-xl bg-[#101522] border border-[#1C2538] hover:border-indigo-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {project.category}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          project.status === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
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
                      <ProgressBar
                        progress={project.progress}
                        color={project.progress === 100 ? 'emerald' : 'indigo'}
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#171F30] flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[11px] truncate max-w-[180px]">
                      {project.technologies.slice(0, 2).join(', ')}
                    </span>
                    <button
                      onClick={() => navigate('/dashboard/projects')}
                      className="text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      View Project
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              <p>No projects added yet.</p>
              <button
                onClick={() => navigate('/dashboard/projects')}
                className="mt-2 text-indigo-400 font-semibold"
              >
                Add projects to strengthen your resume →
              </button>
            </div>
          )}
        </div>

        {/* Activity (1 col) */}
        <div className="rounded-xl bg-[#0D111A] border border-[#1B2232] p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Activity Log</span>
                <h2 className="text-lg font-bold text-white mt-0.5">Recent Milestones</h2>
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
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
            >
              View Full Progress Log →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
