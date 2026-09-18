import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Clock,
  Circle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Calendar,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { PageHeader, StatCard, ProgressBar } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';
import { mockStudent, mockRoadmapStages, RoadmapStage, RoadmapTask } from '../../data/mockData';

export const RoadmapPage: React.FC = () => {
  const { user } = useAuth();
  const student = user?.studentProfile || mockStudent;

  const [stages, setStages] = useState<RoadmapStage[]>(mockRoadmapStages);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({
    'stage-3': true,
    'stage-4': true,
  });

  const toggleExpand = (stageId: string) => {
    setExpandedStages((prev) => ({
      ...prev,
      [stageId]: !prev[stageId],
    }));
  };

  const handleToggleTask = (stageId: string, taskId: string) => {
    setStages((prevStages) =>
      prevStages.map((stage) => {
        if (stage.id !== stageId) return stage;
        const updatedTasks = stage.tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        const completedCount = updatedTasks.filter((t) => t.completed).length;
        const newProgress = Math.round((completedCount / updatedTasks.length) * 100);
        const newStatus =
          newProgress === 100
            ? 'Completed'
            : newProgress > 0
            ? 'In Progress'
            : 'Upcoming';

        return {
          ...stage,
          tasks: updatedTasks,
          progress: newProgress,
          status: newStatus,
        };
      })
    );
  };

  const filteredStages = statusFilter === 'All'
    ? stages
    : stages.filter((s) => s.status === statusFilter);

  const completedStages = stages.filter((s) => s.status === 'Completed').length;

  return (
    <div className="space-y-6 pb-12 font-sans">
      <PageHeader
        title="Personalized Learning Roadmap"
        subtitle="Adaptive step-by-step career path tailored for your target role as a Machine Learning Engineer."
        badge={`Milestone ${completedStages} of ${stages.length} Achieved`}
        actions={
          <div className="flex items-center gap-1.5 bg-[#121826] p-1 rounded-lg border border-[#1D273C]">
            {['All', 'In Progress', 'Completed', 'Upcoming'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  statusFilter === status
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        }
      />

      {/* Top Roadmap Progress Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Overall Roadmap Velocity"
          value="48.8%"
          change="On Track for Fall '26"
          changeType="positive"
          subtext="2 Completed, 2 Active, 2 Ahead"
          icon={Compass}
          accentColor="indigo"
        />
        <StatCard
          title="Active Stage"
          value="Stage 3: Applied ML"
          change="68% Complete"
          changeType="positive"
          subtext="Estimated 3 Weeks Remaining"
          icon={Layers}
          accentColor="cyan"
        />
        <StatCard
          title="Placement Readiness Target"
          value="Stage 6 Target"
          change="Spring 2027"
          changeType="neutral"
          subtext="180 Projected Study Hours"
          icon={Calendar}
          accentColor="emerald"
        />
      </div>

      {/* Vertical Timeline Stages */}
      <div className="relative space-y-6 before:absolute before:inset-0 before:left-6 sm:before:left-7 before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-[#1D2638] before:to-transparent">
        {filteredStages.map((stage) => {
          const isExpanded = expandedStages[stage.id] ?? false;
          const isCompleted = stage.status === 'Completed';
          const isInProgress = stage.status === 'In Progress';

          return (
            <div key={stage.id} className="relative flex items-start gap-4 sm:gap-6">
              {/* Node Icon Indicator */}
              <div
                className={`relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-mono font-bold text-sm shadow-xl flex-shrink-0 transition-all ${
                  isCompleted
                    ? 'bg-emerald-500 text-white border-2 border-emerald-400 shadow-emerald-500/20'
                    : isInProgress
                    ? 'bg-indigo-600 text-white border-2 border-indigo-400 shadow-indigo-600/30 animate-pulse'
                    : 'bg-[#101522] text-slate-400 border border-[#222D42]'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : `0${stage.number}`}
              </div>

              {/* Stage Card */}
              <div className="flex-1 rounded-2xl bg-[#0D111A] border border-[#1C2538] p-5 sm:p-6 shadow-lg hover:border-[#2C3852] transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#182132]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
                        Stage {stage.number} • {stage.estimatedEffort}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        isCompleted
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                          : isInProgress
                          ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                          : 'bg-slate-700/20 text-slate-400 border border-slate-700/40'
                      }`}>
                        {stage.status}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-white mt-1">{stage.title}</h2>
                    <p className="text-xs text-slate-400 mt-1 max-w-2xl">{stage.description}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <span className="text-xs font-mono text-slate-400">Progress</span>
                      <span className="block text-sm font-bold text-white font-mono">{stage.progress}%</span>
                    </div>
                    <button
                      onClick={() => toggleExpand(stage.id)}
                      className="p-2 rounded-lg bg-[#141B2B] hover:bg-[#1A2338] text-slate-300 border border-[#222E46] transition-colors"
                      aria-label="Toggle stage details"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <ProgressBar
                    value={stage.progress}
                    color={isCompleted ? 'bg-emerald-500' : isInProgress ? 'bg-indigo-500' : 'bg-slate-600'}
                  />
                </div>

                {/* Skills tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {stage.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#111726] text-slate-300 border border-[#1E283C]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Expandable Task Checklist */}
                {isExpanded && (
                  <div className="mt-5 pt-4 border-t border-[#182132] space-y-2.5 animate-in fade-in duration-200">
                    <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
                      Stage Milestone Tasks (Click to Toggle Completed)
                    </div>
                    {stage.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => handleToggleTask(stage.id, task.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          task.completed
                            ? 'bg-emerald-950/15 border-emerald-500/20 text-slate-300'
                            : 'bg-[#101522] border-[#1C263A] hover:bg-[#141A2B] text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => {}} // handled by parent onClick
                            className="w-4 h-4 rounded border-[#243048] bg-[#0A0E18] text-indigo-600 focus:ring-0 cursor-pointer"
                          />
                          <span className={`text-xs font-medium ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                            {task.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 font-mono text-[11px] flex-shrink-0">
                          <span className="px-2 py-0.5 rounded bg-[#161E30] text-indigo-300 border border-[#232F4A]">
                            {task.type}
                          </span>
                          <span className="text-slate-400">{task.estHours}h</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
