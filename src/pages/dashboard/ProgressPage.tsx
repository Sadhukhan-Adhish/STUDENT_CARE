import React from 'react';
import {
  TrendingUp,
  Flame,
  Award,
  CheckCircle2,
  Calendar,
  Zap,
  Target,
  Clock,
  Sparkles,
  Trophy,
  Code,
  Cpu,
  FileCheck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { PageHeader, StatCard, ProgressBar } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';
import {
  mockStudent,
  mockAchievements,
  mockWeeklyActivity,
  mockRecentActivities,
} from '../../data/mockData';

const badgeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Flame,
  Award,
  Cpu,
  FileCheck,
  Code,
  Trophy,
};

export const ProgressPage: React.FC = () => {
  const { user } = useAuth();
  const student = user?.studentProfile || mockStudent;

  return (
    <div className="space-y-6 pb-12 font-sans">
      <PageHeader
        title="Progress &amp; Achievements"
        subtitle="Verifiable learning telemetry, habit streaks, velocity charts, and platform accomplishment badges."
        badge="Continuous Verification"
        actions={
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-xs font-semibold">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{student.learningStreakDays}-Day Active Streak</span>
          </div>
        }
      />

      {/* Top 4 Velocity Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Platform Velocity"
          value="78.4%"
          change="+14% this month"
          changeType="positive"
          subtext="Skill & Career Calibration"
          icon={TrendingUp}
          accentColor="indigo"
        />
        <StatCard
          title="Total Hours Logged"
          value={`${student.totalHoursStudied}h`}
          change="31.8 hrs this week"
          changeType="positive"
          subtext="Avg 4.5h / day"
          icon={Clock}
          accentColor="cyan"
        />
        <StatCard
          title="Badges Unlocked"
          value={`${mockAchievements.length} / 10`}
          change="Tier: Silver Scholar"
          changeType="neutral"
          subtext="Next: Century Committer"
          icon={Trophy}
          accentColor="amber"
        />
        <StatCard
          title="Curriculum Velocity"
          value="136 Credits"
          change="On Track (24 to Grad)"
          changeType="positive"
          subtext="Sem 6 / 8 Completed"
          icon={Target}
          accentColor="emerald"
        />
      </div>

      {/* Weekly Activity Hours Chart & Heatmap Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0D111A] border border-[#1B2232] p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Effort Telemetry</span>
              <h2 className="text-lg font-bold text-white mt-0.5">Hours Studied this Week</h2>
            </div>
            <span className="text-xs font-mono text-indigo-400 font-semibold">31.8 Total Hours</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockWeeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#182234" vertical={false} />
                <XAxis dataKey="day" stroke="#64748B" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D131F',
                    borderColor: '#222C42',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#F8FAFC',
                  }}
                />
                <Bar dataKey="hours" fill="#6366F1" radius={[4, 4, 0, 0]} name="Hours Logged" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-[#182030] flex items-center justify-between text-xs text-slate-400">
            <span>Peak Day: Saturday (6.2 hours)</span>
            <span>Target: 25+ Hours/Week (Exceeded by +6.8h)</span>
          </div>
        </div>

        {/* 14-Day Streak Calendar Mini Snapshot (1 col) */}
        <div className="rounded-2xl bg-[#0D111A] border border-[#1B2232] p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Consistency</span>
                <h2 className="text-lg font-bold text-white mt-0.5">Active Streak</h2>
              </div>
              <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              You've logged code or coursework on NEXORA for <strong className="text-amber-400">14 consecutive days</strong>. Maintain this through Sunday to unlock the <strong className="text-white">Fortnight Master</strong> badge.
            </p>

            {/* Streak Grid Blocks */}
            <div className="grid grid-cols-7 gap-1.5 mb-4">
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-[10px] font-mono text-indigo-200 font-bold"
                  title={`Day ${i + 1}: Activity logged`}
                >
                  ✓
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center justify-between">
            <span>Next Goal: 21-Day Habit Milestone</span>
            <span className="font-mono font-bold">7 Days Left</span>
          </div>
        </div>
      </div>

      {/* Badges & Milestones Section */}
      <div className="rounded-2xl bg-[#0D111A] border border-[#1B2232] p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Recognitions</span>
            <h2 className="text-lg font-bold text-white mt-0.5">Unlocked Badges &amp; Credentials</h2>
          </div>
          <span className="text-xs font-mono text-indigo-400">6 Badges Earned</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockAchievements.map((badge) => {
            const Icon = badgeIcons[badge.icon] || Award;
            return (
              <div
                key={badge.id}
                className="p-4 rounded-xl bg-[#101522] border border-[#1C2538] hover:border-[#2A3752] transition-all flex items-start gap-3.5"
              >
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white truncate">{badge.title}</h3>
                    <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">{badge.unlockedAt}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-snug">{badge.description}</p>
                  <span className="inline-block mt-2 text-[10px] font-mono px-2 py-0.5 rounded bg-[#161E30] text-indigo-300 border border-[#232F4A]">
                    {badge.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Telemetry Stream */}
      <div className="rounded-2xl bg-[#0D111A] border border-[#1B2232] p-6 shadow-lg">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Audit Trail</span>
        <h2 className="text-lg font-bold text-white mt-0.5 mb-4">Complete Telemetry History</h2>

        <div className="divide-y divide-[#171F30]">
          {mockRecentActivities.map((act) => (
            <div key={act.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span className="text-slate-200">{act.text}</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
                <span className="px-2 py-0.5 rounded bg-[#131926] border border-[#1D273C] text-indigo-300">
                  {act.category}
                </span>
                <span>{act.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
