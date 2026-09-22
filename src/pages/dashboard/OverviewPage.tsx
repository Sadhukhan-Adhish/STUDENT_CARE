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
  FileText,
  Building,
  User,
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

  // Student specific recent activity vs demo preview
  const recentActivities = [
    ...(student.targetCareer
      ? [
          {
            id: 'act-goal',
            text: `Target career goal set to ${student.targetCareer}`,
            timestamp: 'Active Goal',
            category: 'Career',
          },
        ]
      : []),
    ...(student.semesters?.length
      ? [
          {
            id: 'act-sem',
            text: `${student.semesters.length} academic semester(s) recorded`,
            timestamp: 'Coursework',
            category: 'Academic',
          },
        ]
      : []),
    ...(student.skills?.length
      ? [
          {
            id: 'act-skills',
            text: `${student.skills.length} technical skills logged in competency profile`,
            timestamp: 'Skills',
            category: 'Skills',
          },
        ]
      : []),
    ...(student.projects?.length
      ? [
          {
            id: 'act-proj',
            text: `${student.projects.length} project(s) added to portfolio`,
            timestamp: 'Portfolio',
            category: 'Projects',
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Dynamic Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#17212D] via-[#141C26] to-[#101720] border border-[#233142] hover:border-[#2C3E54] p-6 sm:p-8 shadow-xl transition-all duration-200">
        <div className="absolute -top-12 -right-10 w-72 h-72 bg-[#D89B5B]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-20 w-48 h-48 bg-[#67C5B8]/6 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D89B5B]/12 text-[#E8B47E] border border-[#D89B5B]/25 text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-[#67C5B8] animate-pulse" />
              <span>
                {user?.isGuest ? 'Guest Workspace' : (student.college || student.university || 'Institutional Workspace')} • Semester {student.currentSemester || 1}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F3F0E8] tracking-tight font-heading">
              {user?.isGuest ? 'Welcome to UNNEXA' : `Welcome back, ${student.name}`}
            </h1>
            <p className="text-sm text-[#9AA5B1] mt-2 leading-relaxed">
              {user?.isGuest ? (
                <>
                  {student.targetCareer ? (
                    <>
                      Target Career Objective: <strong className="text-[#E8B47E]">{student.targetCareer}</strong>.
                      Track coursework, skills, and projects in this temporary session.
                    </>
                  ) : (
                    <>
                      Your student intelligence workspace. Enter coursework, evaluate your technical skills, and align your trajectory with industry standards.
                    </>
                  )}
                </>
              ) : (
                <>
                  <span className="text-[#F3F0E8] font-medium">{student.degree} {student.department} · Semester {student.currentSemester}</span>
                  <br />
                  Roll Number: <strong className="text-[#E8B47E] font-mono">{student.rollNumber}</strong> | Target Career:{' '}
                  <strong className="text-[#E8B47E]">{student.targetCareer}</strong>
                  {currentCgpa > 0 && (
                    <>
                      {' '}with CGPA of <strong className="text-[#67C5B8] font-mono">{currentCgpa.toFixed(2)}</strong>
                    </>
                  )}
                  .
                </>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#F3F0E8] bg-[#182330] hover:bg-[#202E3E] border border-[#27384B] hover:border-[#D89B5B]/40 transition-all duration-150 flex items-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
            >
              <UserCheck className="w-4 h-4 text-[#D89B5B]" />
              <span>Student Profile</span>
            </button>
            <button
              onClick={() => navigate('/dashboard/skills')}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] border border-[#E8B47E]/40 shadow-sm transition-all duration-150 flex items-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className="w-4 h-4 text-[#0B0F14]" />
              <span>Analyze Skill Gaps</span>
            </button>
          </div>
        </div>
      </div>

      {/* First-Time Student Guidance Banner */}
      {!user?.isGuest && (!hasAcademicHistory || skills.length === 0) && (
        <div className="p-4 rounded-xl bg-[#151D26] border border-[#D89B5B]/35 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#D89B5B]/15 text-[#D89B5B] mt-0.5">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F3F0E8] font-mono uppercase tracking-wider">
                Getting Started with Your Student Intelligence Dashboard
              </h3>
              <p className="text-xs text-[#9AA5B1] mt-1 leading-relaxed">
                UNNEXA connects your academic performance to career requirements. Set up your <strong>Academic</strong> courses, verify your <strong>Skills</strong>, and discover personalized <strong>Projects</strong> for {student.targetCareer || 'your career goal'}.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => navigate('/dashboard/academic')}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] transition-all duration-150 flex items-center gap-1.5 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
            >
              <span>Set Up Coursework</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Profile Summary Card */}
      <div className="rounded-2xl bg-[#151D26] border border-[#222E3C] hover:border-[#2C3D50] p-5 sm:p-6 shadow-xl transition-all duration-200">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#1E2938]">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              {student.avatar ? (
                <img
                  src={student.avatar}
                  alt={user?.isGuest ? 'Guest' : (student.name || 'Student')}
                  className="w-12 h-12 rounded-xl object-cover border border-[#D89B5B]/40"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-[#D89B5B]/10 border border-[#D89B5B]/25 text-[#D89B5B] flex items-center justify-center font-bold font-mono">
                  {(student.name || 'S').charAt(0)}
                </div>
              )}
              <span
                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#151D26] ${
                  user?.isGuest ? 'bg-[#D89B5B]' : 'bg-[#67C5B8]'
                }`}
                title={user?.isGuest ? 'Guest Workspace' : 'Active Student'}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#F3F0E8]">
                  {user?.isGuest ? (student.name && student.name !== 'Guest Student' ? student.name : 'Guest User') : (student.name || 'Not added')}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#111822] text-[#9AA5B1] border border-[#1E2A38]">
                  {user?.isGuest ? 'Guest Session' : `Roll: ${student.rollNumber || 'Not assigned'}`}
                </span>
              </div>
              <p className="text-xs text-[#9AA5B1] mt-0.5 flex items-center gap-1.5 flex-wrap">
                <Building className="w-3.5 h-3.5 text-[#768393]" />
                <span>{(student.university || student.college) || 'Not added'}</span>
                <span className="text-[#5A6778]">•</span>
                <span>{student.department || 'Not added'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              onClick={() => navigate('/profile')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#E8B47E] hover:text-[#F3F0E8] bg-[#D89B5B]/12 hover:bg-[#D89B5B]/20 border border-[#D89B5B]/30 hover:border-[#D89B5B]/50 transition-all duration-150 flex items-center gap-1.5 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
            >
              <User className="w-3.5 h-3.5" />
              <span>Edit Profile Details</span>
            </button>
          </div>
        </div>

        {/* 6 Core Profile Integration Data Points */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 text-xs">
          <div className="p-3 rounded-xl bg-[#111822] hover:bg-[#16202B] border border-[#1E2938] hover:border-[#D89B5B]/30 transition-all duration-150 hover:-translate-y-0.5">
            <span className="text-[10px] font-mono text-[#9AA5B1] uppercase tracking-wider block">Career Goal</span>
            <span className="font-semibold text-[#F3F0E8] mt-1 block truncate" title={student.targetCareer || 'No career goal set'}>
              {student.targetCareer || 'No career goal set'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#111822] hover:bg-[#16202B] border border-[#1E2938] hover:border-[#D89B5B]/30 transition-all duration-150 hover:-translate-y-0.5">
            <span className="text-[10px] font-mono text-[#9AA5B1] uppercase tracking-wider block">Semester</span>
            <span className="font-semibold text-[#F3F0E8] mt-1 block">
              {student.currentSemester ? `Semester ${student.currentSemester}` : 'Not added'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#111822] hover:bg-[#16202B] border border-[#1E2938] hover:border-[#D89B5B]/30 transition-all duration-150 hover:-translate-y-0.5">
            <span className="text-[10px] font-mono text-[#9AA5B1] uppercase tracking-wider block">Skills Logged</span>
            <span className="font-semibold text-[#F3F0E8] mt-1 block">
              {skills.length > 0 ? `${skills.length} skills` : 'No skills added yet'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#111822] hover:bg-[#16202B] border border-[#1E2938] hover:border-[#D89B5B]/30 transition-all duration-150 hover:-translate-y-0.5">
            <span className="text-[10px] font-mono text-[#9AA5B1] uppercase tracking-wider block">Projects</span>
            <span className="font-semibold text-[#F3F0E8] mt-1 block">
              {projects.length > 0 ? `${projects.length} projects` : 'No projects yet'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#111822] hover:bg-[#16202B] border border-[#1E2938] hover:border-[#D89B5B]/30 transition-all duration-150 hover:-translate-y-0.5">
            <span className="text-[10px] font-mono text-[#9AA5B1] uppercase tracking-wider block">Resume Status</span>
            <span className="font-semibold text-[#F3F0E8] mt-1 block truncate" title={student.resumeInfo?.fileName || 'No resume added'}>
              {student.resumeInfo?.fileName ? 'Resume Uploaded' : 'No resume added'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#111822] hover:bg-[#16202B] border border-[#1E2938] hover:border-[#D89B5B]/30 transition-all duration-150 hover:-translate-y-0.5">
            <span className="text-[10px] font-mono text-[#9AA5B1] uppercase tracking-wider block">Roadmap</span>
            <span className="font-semibold text-[#F3F0E8] mt-1 block truncate">
              {(student.roadmapStages?.length || 0) > 0 ? `${student.roadmapStages?.length} stages active` : 'Roadmap pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Top 5 Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Career Readiness"
          value={readiness > 0 ? `${readiness}%` : (skills.length > 0 ? 'Evaluating' : 'Pending data')}
          change={readiness > 0 ? 'Role Alignment' : (skills.length > 0 ? 'In progress' : 'Add skills')}
          changeType={readiness > 0 ? 'positive' : 'neutral'}
          subtext={student.targetCareer ? `Role: ${student.targetCareer}` : 'No career goal set'}
          icon={Briefcase}
          accentColor="amber"
        />
        <StatCard
          title="Academic CGPA"
          value={currentCgpa > 0 ? currentCgpa.toFixed(2) : (hasAcademicHistory ? 'Evaluating' : 'Not recorded')}
          change={currentCgpa > 0 ? `Target: ${student.targetCgpa || 9.0}` : (hasAcademicHistory ? 'Results pending' : 'No academic data yet')}
          changeType={currentCgpa > 0 ? 'positive' : 'neutral'}
          subtext={semesters.length > 0 ? `${semesters.length} Semesters Recorded` : 'Add semester results'}
          icon={GraduationCap}
          accentColor="cyan"
        />
        <StatCard
          title="Technical Skills"
          value={skills.length > 0 ? `${skills.length} Tracked` : '0 Added'}
          change={skills.length > 0 ? `${criticalGaps.length} Gaps Flagged` : 'No skills added yet'}
          changeType={skills.length > 0 ? (criticalGaps.length > 0 ? 'neutral' : 'positive') : 'neutral'}
          subtext={skills.length > 0 ? 'Skill-gap analysis active' : 'Add your skills'}
          icon={Sparkles}
          accentColor="purple"
        />
        <StatCard
          title="Active Projects"
          value={projects.length > 0 ? `${projects.length} Total` : '0 Added'}
          change={projects.length > 0 ? `${activeProjects.length} Active Builds` : 'No projects yet'}
          changeType={projects.length > 0 ? 'positive' : 'neutral'}
          subtext={projects.length > 0 ? 'Target role portfolio' : 'Document your projects'}
          icon={FolderGit2}
          accentColor="emerald"
        />
        <StatCard
          title="Resume Status"
          value={student.resumeInfo?.fileName ? 'Uploaded' : 'No resume added'}
          change={student.resumeInfo?.fileName ? 'Document Active' : 'PDF / DOCX'}
          changeType={student.resumeInfo?.fileName ? 'positive' : 'neutral'}
          subtext={student.resumeInfo?.fileName ? student.resumeInfo.fileName : 'Add your resume'}
          icon={FileText}
          accentColor="amber"
        />
      </div>

      {/* The UNNEXA Intelligence Loop Banner */}
      <div className="p-4 rounded-xl bg-[#121922] border border-[#1E2938] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#9AA5B1]">
          <span className="w-2 h-2 rounded-full bg-[#D89B5B]" />
          <span className="text-[#F3F0E8] font-semibold">Intelligence Loop:</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
          <span className="px-2.5 py-1 rounded bg-[#17212D] text-[#D3DCE6] border border-[#223040]">Student Profile</span>
          <span className="text-[#D89B5B]">→</span>
          <span className="px-2.5 py-1 rounded bg-[#17212D] text-[#D3DCE6] border border-[#223040]">Coursework</span>
          <span className="text-[#D89B5B]">→</span>
          <span className="px-2.5 py-1 rounded bg-[#D89B5B]/15 text-[#E8B47E] border border-[#D89B5B]/30 font-semibold">Skill Gaps</span>
          <span className="text-[#D89B5B]">→</span>
          <span className="px-2.5 py-1 rounded bg-[#17212D] text-[#D3DCE6] border border-[#223040]">Target Projects</span>
          <span className="text-[#D89B5B]">→</span>
          <span className="px-2.5 py-1 rounded bg-[#67C5B8]/15 text-[#7CD4C8] border border-[#67C5B8]/30 font-semibold">Career Roadmap</span>
        </div>
        <button
          onClick={() => navigate('/dashboard/progress')}
          className="text-xs text-[#D89B5B] hover:text-[#E8B47E] font-medium flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>Progress Log</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Recommended Next Action Callout */}
      {criticalGaps.length > 0 && (
        <div className="p-5 rounded-xl bg-[#151D26] border border-[#D89B5B]/35 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-[#D89B5B]/15 border border-[#D89B5B]/30 text-[#D89B5B] mt-0.5">
              <AlertCircle className="w-5 h-5 text-[#D89B5B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#E8B47E] font-mono">Recommended Next Action</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-500/12 text-rose-300 border border-rose-500/25">Skill Priority</span>
              </div>
              <p className="text-sm font-semibold text-[#F3F0E8] mt-1">
                Close {criticalGaps[0].name} Gap (Deficit: {criticalGaps[0].gap}%)
              </p>
              <p className="text-xs text-[#9AA5B1] mt-0.5">
                {criticalGaps[0].action || `Targeted practice will strengthen your foundation for ${student.targetCareer}.`}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard/projects')}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#D89B5B] hover:bg-[#E4AB70] text-[#0B0F14] transition-all duration-150 flex items-center gap-2 flex-shrink-0 cursor-pointer shadow-sm hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Explore Recommended Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Charts Grid: Academic Trajectory & Skill Competency */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Performance Chart (2 cols) */}
        <div className="lg:col-span-2 rounded-xl bg-[#151D26] border border-[#222E3C] p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#9AA5B1]">Academic Progression</span>
              <h2 className="text-lg font-bold text-[#F3F0E8] mt-0.5">Semester Progression Curve</h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#D89B5B]" />
                <span className="text-[#D3DCE6]">SGPA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#67C5B8]" />
                <span className="text-[#D3DCE6]">CGPA {currentCgpa > 0 ? `(${currentCgpa.toFixed(2)})` : ''}</span>
              </div>
            </div>
          </div>

          {hasAcademicHistory ? (
            <div className="h-64 w-full min-h-[256px]">
              <ResponsiveContainer width="100%" height="100%" minHeight={256} initialDimension={{ width: 600, height: 256 }}>
                <AreaChart data={semesters} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sgpaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D89B5B" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#D89B5B" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="cgpaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#67C5B8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#67C5B8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1C2633" vertical={false} />
                  <XAxis dataKey="semester" stroke="#768393" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 10]} stroke="#768393" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#151D26',
                      borderColor: '#2B394A',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#F3F0E8',
                    }}
                  />
                  <Area type="monotone" dataKey="sgpa" stroke="#D89B5B" strokeWidth={2.5} fillOpacity={1} fill="url(#sgpaGrad)" name="Semester SGPA" />
                  <Area type="monotone" dataKey="cgpa" stroke="#67C5B8" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#cgpaGrad)" name="Cumulative CGPA" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center p-6 text-center border border-dashed border-[#1E2938] rounded-xl bg-[#111822]">
              <BarChart2 className="w-10 h-10 text-[#768393] mb-2" />
              <p className="text-sm font-semibold text-[#D3DCE6]">Academic Progression Curve</p>
              <p className="text-xs text-[#9AA5B1] mt-1 max-w-sm">
                Add your completed semester grades in the Academic tab to view your progression curve.
              </p>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-[#1C2633] flex items-center justify-between text-xs text-[#9AA5B1]">
            <span>Roll No: {student.rollNumber} • {student.department}</span>
            <button
              onClick={() => navigate('/dashboard/academic')}
              className="text-[#D89B5B] hover:text-[#E8B47E] font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Manage Subjects &amp; Results</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Skill Gap Snapshot Card (1 col) */}
        <div className="rounded-xl bg-[#151D26] border border-[#222E3C] p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#9AA5B1]">Skill Alignment</span>
                <h2 className="text-lg font-bold text-[#F3F0E8] mt-0.5">Role Competency Gaps</h2>
              </div>
              <button
                onClick={() => navigate('/dashboard/skills')}
                className="text-xs text-[#D89B5B] hover:text-[#E8B47E] font-medium cursor-pointer transition-colors"
              >
                All {skills.length} Skills →
              </button>
            </div>

            {topSkills.length > 0 ? (
              <div className="space-y-3.5">
                {topSkills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-[#F3F0E8]">{skill.name}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-[#9AA5B1]">{skill.currentLevel}%</span>
                        <span className="text-[#768393]">/</span>
                        <span className="text-[#E8B47E] font-semibold">{skill.requiredLevel}% req</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-[#111822] rounded-full overflow-hidden relative">
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-white z-10 opacity-80"
                        style={{ left: `${skill.requiredLevel || 75}%` }}
                        title={`Target Level: ${skill.requiredLevel || 75}%`}
                      />
                      <div
                        className={`h-full rounded-full ${
                          skill.currentLevel >= (skill.requiredLevel || 75)
                            ? 'bg-[#67C5B8]'
                            : (skill.gap ?? 0) > 20
                            ? 'bg-rose-500/90'
                            : 'bg-[#D89B5B]'
                        }`}
                        style={{ width: `${skill.currentLevel}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#9AA5B1]">
                <p>No skills tracked yet.</p>
                <button
                  onClick={() => navigate('/dashboard/skills')}
                  className="mt-2 text-[#D89B5B] font-semibold"
                >
                  Add skills in Skills Hub →
                </button>
              </div>
            )}
          </div>

          <div className="mt-5 p-3 rounded-lg bg-[#111822] border border-[#1C2633] text-[11px] text-[#9AA5B1] flex items-center justify-between">
            <span>White markers indicate required benchmark for {student.targetCareer}.</span>
            <span
              className="text-[#D89B5B] font-semibold cursor-pointer hover:underline"
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
        <div className="lg:col-span-2 rounded-xl bg-[#151D26] border border-[#222E3C] p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#9AA5B1]">Portfolio Execution</span>
              <h2 className="text-lg font-bold text-[#F3F0E8] mt-0.5">
                Recommended &amp; Active Projects ({projects.length} Total)
              </h2>
            </div>
            <button
              onClick={() => navigate('/dashboard/projects')}
              className="text-xs text-[#D89B5B] hover:text-[#E8B47E] font-medium cursor-pointer transition-colors"
            >
              Manage Projects →
            </button>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.slice(0, 2).map((project) => (
                <div
                  key={project.id}
                  className="p-4 rounded-xl bg-[#111822] hover:bg-[#16202B] border border-[#1E2938] hover:border-[#D89B5B]/40 transition-all duration-150 flex flex-col justify-between hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D89B5B]/12 text-[#E8B47E] border border-[#D89B5B]/25">
                        {project.category}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          project.status === 'Completed'
                            ? 'bg-[#67C5B8]/15 text-[#7CD4C8] border border-[#67C5B8]/30'
                            : 'bg-[#D89B5B]/15 text-[#E8B47E] border border-[#D89B5B]/30'
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#F3F0E8]">{project.title}</h3>
                    <p className="text-xs text-[#9AA5B1] mt-1 line-clamp-2">{project.tagline}</p>

                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-[#9AA5B1] mb-1 font-mono">
                        <span>Progress</span>
                        <span className="text-[#F3F0E8]">{project.progress}%</span>
                      </div>
                      <ProgressBar
                        progress={project.progress}
                        color={project.progress === 100 ? 'teal' : 'copper'}
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1C2633] flex items-center justify-between text-xs text-[#9AA5B1]">
                    <span className="text-[11px] truncate max-w-[180px]">
                      {project.technologies.slice(0, 2).join(', ')}
                    </span>
                    <button
                      onClick={() => navigate('/dashboard/projects')}
                      className="text-[#D89B5B] hover:text-[#E8B47E] font-medium transition-colors"
                    >
                      View Project
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-[#9AA5B1]">
              <p>No projects added yet.</p>
              <button
                onClick={() => navigate('/dashboard/projects')}
                className="mt-2 text-[#D89B5B] font-semibold"
              >
                Add projects to strengthen your resume →
              </button>
            </div>
          )}
        </div>

        {/* Activity (1 col) */}
        <div className="rounded-xl bg-[#151D26] border border-[#222E3C] p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#9AA5B1]">Activity Log</span>
                <h2 className="text-lg font-bold text-[#F3F0E8] mt-0.5">Recent Milestones</h2>
              </div>
              <Clock className="w-4 h-4 text-[#9AA5B1]" />
            </div>

            {recentActivities.length > 0 ? (
              <div className="space-y-3">
                {recentActivities.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D89B5B] mt-1.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[#F3F0E8] leading-snug">{act.text}</p>
                      <span className="text-[10px] text-[#768393] font-mono">{act.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#9AA5B1]">
                <p>No activity recorded yet.</p>
                <p className="text-[11px] text-[#768393] mt-1">
                  Courses, skills, or projects added to your workspace will be tracked here.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#1C2633] text-center">
            <button
              onClick={() => navigate('/dashboard/progress')}
              className="text-xs text-[#D89B5B] hover:text-[#E8B47E] font-semibold cursor-pointer transition-colors"
            >
              View Full Progress Log →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
