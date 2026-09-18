import React, { useState } from 'react';
import {
  GraduationCap,
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  BookOpen,
  Sparkles,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { PageHeader, StatCard, ProgressBar } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';
import {
  mockStudent,
  mockAcademicSemesters,
  mockSubjectPerformances,
  SubjectPerformance,
} from '../../data/mockData';

export const AcademicPage: React.FC = () => {
  const { user } = useAuth();
  const student = user?.studentProfile || mockStudent;
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const filteredSubjects = filterCategory === 'All'
    ? mockSubjectPerformances
    : mockSubjectPerformances.filter((s) => s.category === filterCategory);

  const strongSubjects = mockSubjectPerformances.filter((s) => s.status === 'Strong');
  const improvementSubjects = mockSubjectPerformances.filter((s) => s.status === 'Needs Improvement' || s.status === 'Average');

  return (
    <div className="space-y-6 pb-12 font-sans">
      <PageHeader
        title="Academic Intelligence"
        subtitle="Comprehensive transcript analytics, curriculum grade distribution, attendance telemetry, and GPA forecasting."
        badge="Official Transcript Verified"
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Current Standing:</span>
            <span className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-mono font-semibold">
              Semester 6 • 136 Credits Earned
            </span>
          </div>
        }
      />

      {/* Top Academic Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Cumulative CGPA"
          value={student.cgpa.toFixed(2)}
          change="+0.54 from Sem 1"
          changeType="positive"
          subtext="Target: 9.00 GPA"
          icon={GraduationCap}
          accentColor="indigo"
        />
        <StatCard
          title="Current SGPA (Sem 6)"
          value="9.25"
          change="Rank #3 in AI Dept"
          changeType="positive"
          subtext="24 Credits Registered"
          icon={Award}
          accentColor="cyan"
        />
        <StatCard
          title="Curriculum Attendance"
          value="91.4%"
          change="Compliant (>75%)"
          changeType="positive"
          subtext="Lowest: Microprocessors (74%)"
          icon={Calendar}
          accentColor="emerald"
        />
        <StatCard
          title="ML Forecast CGPA"
          value="8.88"
          change="Predictive AI Model"
          changeType="positive"
          subtext="Projected Graduation Standing"
          icon={Sparkles}
          accentColor="purple"
        />
      </div>

      {/* Academic Insights & Forecast Box */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-950/30 via-[#0E1424] to-[#0A0D16] border border-indigo-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">NEXORA Academic Intelligence Forecast</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Your strong performance in CS301 (Algorithms 94%) and CS303 (ML 96%) places you in the top 3% percentile for computational courses.
              However, raising <span className="text-amber-300 font-semibold">CS305 Embedded Systems (71%)</span> and attending remaining lab sessions will elevate your cumulative GPA to the 8.90 tier before placements.
            </p>
          </div>
        </div>
        <div className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-[#141B2B] border border-[#212C42] text-xs font-mono text-indigo-300">
          Confidence: 94.2% (Historical Model)
        </div>
      </div>

      {/* Semester Trend Chart & Strong/Weak Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Semester Progression Chart (2 cols) */}
        <div className="lg:col-span-2 rounded-xl bg-[#0D111A] border border-[#1B2232] p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Progression Curve</span>
              <h2 className="text-lg font-bold text-white mt-0.5">Semester Grade Point Averages</h2>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-indigo-400 font-semibold">SGPA Progression</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockAcademicSemesters} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#182234" vertical={false} />
                <XAxis dataKey="semester" stroke="#64748B" tick={{ fontSize: 11 }} />
                <YAxis domain={[7, 10]} stroke="#64748B" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D131F',
                    borderColor: '#222C42',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#F8FAFC',
                  }}
                />
                <Bar dataKey="sgpa" fill="#6366F1" radius={[4, 4, 0, 0]} name="Semester SGPA" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-[#182030] grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded bg-[#101522]">
              <span className="text-slate-400 block text-[10px]">Lowest Semester</span>
              <span className="font-mono font-bold text-slate-200">Sem 1 (8.20)</span>
            </div>
            <div className="p-2 rounded bg-[#101522]">
              <span className="text-slate-400 block text-[10px]">Highest Semester</span>
              <span className="font-mono font-bold text-emerald-400">Sem 6 (9.25)</span>
            </div>
            <div className="p-2 rounded bg-[#101522]">
              <span className="text-slate-400 block text-[10px]">Net Velocity</span>
              <span className="font-mono font-bold text-indigo-400">+12.8% Growth</span>
            </div>
          </div>
        </div>

        {/* Strong vs Improvement Subjects (1 col) */}
        <div className="rounded-xl bg-[#0D111A] border border-[#1B2232] p-5 shadow-lg flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Diagnostic Summary</span>
            <h2 className="text-lg font-bold text-white mt-0.5">Key Subject Pillars</h2>

            <div className="mt-4 space-y-4">
              {/* Strong Subjects */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Strong Competencies ({strongSubjects.length})</span>
                </div>
                <div className="space-y-1.5">
                  {strongSubjects.slice(0, 3).map((s) => (
                    <div key={s.code} className="p-2 rounded bg-[#111726] border border-[#1B263B] text-xs flex justify-between items-center">
                      <div>
                        <span className="font-medium text-slate-200">{s.name}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{s.code} • {s.credits} Credits</span>
                      </div>
                      <span className="px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        {s.grade} ({s.score}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Needs Improvement */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Recommended Focus ({improvementSubjects.length})</span>
                </div>
                <div className="space-y-1.5">
                  {improvementSubjects.map((s) => (
                    <div key={s.code} className="p-2 rounded bg-[#111726] border border-[#1B263B] text-xs flex justify-between items-center">
                      <div>
                        <span className="font-medium text-slate-200">{s.name}</span>
                        <span className="text-[10px] text-amber-400/80 block font-mono">
                          Attendance: {s.attendance}% {s.attendance < 75 && '⚠ Below Threshold'}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {s.grade} ({s.score}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#182030] text-xs text-slate-400">
            Attendance threshold for university exam eligibility is 75%.
          </div>
        </div>
      </div>

      {/* Comprehensive Current Semester Subject Performance Table */}
      <div className="rounded-xl bg-[#0D111A] border border-[#1B2232] p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Coursework Breakdown</span>
            <h2 className="text-lg font-bold text-white mt-0.5">Semester 6 Subject Portfolio</h2>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 bg-[#121826] p-1 rounded-lg border border-[#1D273C]">
            {['All', 'Core', 'Elective', 'Math'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  filterCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1A2234] text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-3 px-3">Course Code</th>
                <th className="py-3 px-3">Subject Name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Credits</th>
                <th className="py-3 px-3">Current Grade</th>
                <th className="py-3 px-3">Score</th>
                <th className="py-3 px-3">Attendance</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151D2C]">
              {filteredSubjects.map((sub) => (
                <tr key={sub.code} className="hover:bg-[#121828] transition-colors">
                  <td className="py-3 px-3 font-mono font-semibold text-indigo-300">{sub.code}</td>
                  <td className="py-3 px-3 font-medium text-white">{sub.name}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#161D2E] text-slate-300 border border-[#212C42]">
                      {sub.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">{sub.credits}</td>
                  <td className="py-3 px-3 font-mono font-bold text-white">{sub.grade}</td>
                  <td className="py-3 px-3 font-mono text-slate-200">{sub.score}%</td>
                  <td className="py-3 px-3 font-mono">
                    <span className={sub.attendance < 75 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                      {sub.attendance}%
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        sub.status === 'Strong'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : sub.status === 'Needs Improvement'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
