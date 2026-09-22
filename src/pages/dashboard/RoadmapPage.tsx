import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  CheckCircle2,
  Clock,
  Circle,
  Plus,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronUp,
  Target,
  Sparkles,
  BookOpen,
  FolderGit2,
  Award,
  Layers,
  ArrowRight,
  Info,
  Calendar,
  X,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { PageHeader } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';
import { RoadmapStage, RoadmapTask } from '../../data/mockData';

export const RoadmapPage: React.FC = () => {
  const {
    user,
    addRoadmapStage,
    updateRoadmapStage,
    deleteRoadmapStage,
    addRoadmapTask,
    updateRoadmapTask,
    deleteRoadmapTask,
    toggleRoadmapTask,
    initializeDefaultRoadmap,
  } = useAuth();
  const navigate = useNavigate();

  const student = user?.studentProfile;
  const targetCareer = student?.targetCareer?.trim() || student?.careerGoalDetails?.targetRole?.trim() || '';
  const stages: RoadmapStage[] = student?.roadmapStages || [];

  // Filter and Accordion states
  const [statusFilter, setStatusFilter] = useState<'All' | 'Not Started' | 'In Progress' | 'Completed'>('All');
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({});

  // Stage Modal states
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [stageTitle, setStageTitle] = useState('');
  const [stageDescription, setStageDescription] = useState('');
  const [stageEffort, setStageEffort] = useState('');
  const [stageSkills, setStageSkills] = useState('');
  const [stageError, setStageError] = useState('');

  // Task Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [activeStageIdForTask, setActiveStageIdForTask] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskType, setTaskType] = useState<'Course' | 'Project' | 'Skill' | 'Certification' | 'General'>('Skill');
  const [taskStatus, setTaskStatus] = useState<'Not Started' | 'In Progress' | 'Completed'>('Not Started');
  const [taskEstHours, setTaskEstHours] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskNotes, setTaskNotes] = useState('');
  const [taskError, setTaskError] = useState('');

  // Delete Confirmations
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'stage' | 'task';
    stageId: string;
    taskId?: string;
    name: string;
  } | null>(null);

  // Toggle stage expansion
  const toggleExpand = (stageId: string) => {
    setExpandedStages((prev) => ({
      ...prev,
      [stageId]: prev[stageId] === undefined ? false : !prev[stageId],
    }));
  };

  const isExpanded = (stageId: string) => {
    return expandedStages[stageId] !== false; // expanded by default
  };

  // Overall metrics calculated from actual stages & tasks
  const overallMetrics = useMemo(() => {
    const allTasks = stages.flatMap((s) => s.tasks || []);
    if (allTasks.length === 0) {
      return { totalStages: stages.length, totalTasks: 0, completedTasks: 0, inProgressTasks: 0, overallPercent: 0 };
    }
    const completedTasks = allTasks.filter((t) => t.status === 'Completed' || t.completed).length;
    const inProgressTasks = allTasks.filter((t) => t.status === 'In Progress').length;
    const overallPercent = Math.round((completedTasks / allTasks.length) * 100);
    return {
      totalStages: stages.length,
      totalTasks: allTasks.length,
      completedTasks,
      inProgressTasks,
      overallPercent,
    };
  }, [stages]);

  // Filtered stages
  const filteredStages = useMemo(() => {
    if (statusFilter === 'All') return stages;
    return stages.filter((s) => s.status === statusFilter);
  }, [stages, statusFilter]);

  // Open Stage Modal
  const openAddStageModal = () => {
    setEditingStageId(null);
    setStageTitle('');
    setStageDescription('');
    setStageEffort('');
    setStageSkills('');
    setStageError('');
    setIsStageModalOpen(true);
  };

  const openEditStageModal = (stage: RoadmapStage) => {
    setEditingStageId(stage.id);
    setStageTitle(stage.title);
    setStageDescription(stage.description);
    setStageEffort(stage.estimatedEffort || '');
    setStageSkills((stage.skills || []).join(', '));
    setStageError('');
    setIsStageModalOpen(true);
  };

  const handleSaveStage = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = stageTitle.trim();
    if (!trimmedTitle) {
      setStageError('Please enter a stage title.');
      return;
    }

    const skillsArray = stageSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingStageId) {
      updateRoadmapStage(editingStageId, {
        title: trimmedTitle,
        description: stageDescription.trim(),
        estimatedEffort: stageEffort.trim() || undefined,
        skills: skillsArray,
      });
    } else {
      addRoadmapStage({
        title: trimmedTitle,
        description: stageDescription.trim(),
        estimatedEffort: stageEffort.trim() || 'Flexible',
        skills: skillsArray,
        status: 'Not Started',
        progress: 0,
        tasks: [],
      });
    }
    setIsStageModalOpen(false);
  };

  // Open Task Modal
  const openAddTaskModal = (stageId: string) => {
    setActiveStageIdForTask(stageId);
    setEditingTaskId(null);
    setTaskTitle('');
    setTaskType('Skill');
    setTaskStatus('Not Started');
    setTaskEstHours('');
    setTaskDueDate('');
    setTaskNotes('');
    setTaskError('');
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (stageId: string, task: RoadmapTask) => {
    setActiveStageIdForTask(stageId);
    setEditingTaskId(task.id);
    setTaskTitle(task.title);
    setTaskType(task.type || 'Skill');
    setTaskStatus(task.status);
    setTaskEstHours(task.estHours ? String(task.estHours) : '');
    setTaskDueDate(task.dueDate || '');
    setTaskNotes(task.notes || '');
    setTaskError('');
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStageIdForTask) return;
    const trimmedTitle = taskTitle.trim();
    if (!trimmedTitle) {
      setTaskError('Please enter a task description or title.');
      return;
    }

    const estNum = taskEstHours.trim() ? Number(taskEstHours.trim()) : undefined;

    if (editingTaskId) {
      updateRoadmapTask(activeStageIdForTask, editingTaskId, {
        title: trimmedTitle,
        type: taskType,
        status: taskStatus,
        completed: taskStatus === 'Completed',
        estHours: estNum,
        dueDate: taskDueDate.trim() || undefined,
        notes: taskNotes.trim() || undefined,
      });
    } else {
      addRoadmapTask(activeStageIdForTask, {
        title: trimmedTitle,
        type: taskType,
        status: taskStatus,
        completed: taskStatus === 'Completed',
        estHours: estNum,
        dueDate: taskDueDate.trim() || undefined,
        notes: taskNotes.trim() || undefined,
      });
    }
    setIsTaskModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'stage') {
      deleteRoadmapStage(deleteConfirm.stageId);
    } else if (deleteConfirm.type === 'task' && deleteConfirm.taskId) {
      deleteRoadmapTask(deleteConfirm.stageId, deleteConfirm.taskId);
    }
    setDeleteConfirm(null);
  };

  const getTaskTypeBadge = (type: RoadmapTask['type']) => {
    switch (type) {
      case 'Skill':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            <BookOpen className="w-2.5 h-2.5" /> Skill
          </span>
        );
      case 'Project':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            <FolderGit2 className="w-2.5 h-2.5" /> Project
          </span>
        );
      case 'Certification':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-[#D89B5B]/15 text-[#D89B5B] border border-[#D89B5B]/30">
            <Award className="w-2.5 h-2.5" /> Milestone
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-[#67C5B8]/15 text-[#7CD4C8] border border-[#67C5B8]/30">
            Course
          </span>
        );
    }
  };

  const getStatusBadge = (status: RoadmapStage['status']) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#67C5B8]/15 text-[#7CD4C8] border border-[#67C5B8]/30 font-mono">
            <CheckCircle2 className="w-3 h-3 text-[#67C5B8]" /> Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#D89B5B]/15 text-[#D89B5B] border border-[#D89B5B]/30 font-mono">
            <Clock className="w-3 h-3 text-[#D89B5B]" /> In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0E151E] text-[#9AA5B1] border border-[#202C3B] font-mono">
            <Circle className="w-3 h-3 text-[#768393]" /> Not Started
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans" id="roadmap-page-container">
      <PageHeader
        title="Career Roadmap"
        subtitle="Step-by-step milestone progression structured for your target engineering career."
        badge={user?.isGuest ? 'Guest Exploration' : stages.length > 0 ? `${stages.length} Stages` : 'No Roadmap'}
        actions={
          <div className="flex items-center gap-2">
            {stages.length > 0 ? (
              <button
                id="add-stage-header-btn"
                onClick={openAddStageModal}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] transition-all duration-150 flex items-center gap-1.5 cursor-pointer shadow-sm hover:-translate-y-0.5 active:translate-y-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Stage</span>
              </button>
            ) : null}
          </div>
        }
      />

      {/* Target Role & Roadmap Context Banner */}
      <div className="rounded-2xl bg-[#151D26] border border-[#202C3B] p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-200 hover:border-[#27384B]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#D89B5B]/15 border border-[#D89B5B]/30 text-[#D89B5B] flex items-center justify-center flex-shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#9AA5B1]">
                Roadmap Goal Focus
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#F3F0E8] tracking-tight">
              {targetCareer ? targetCareer : 'No Career Goal Selected'}
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {targetCareer ? (
            <button
              onClick={() => navigate('/dashboard/career')}
              className="px-3 py-1.5 rounded-lg text-xs text-[#D89B5B] hover:text-[#E4AB70] hover:bg-[#D89B5B]/10 border border-[#D89B5B]/20 transition-all duration-150 flex items-center gap-1 cursor-pointer"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Change Career Goal</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/dashboard/career')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] transition-all duration-150 flex items-center gap-1.5 cursor-pointer shadow-sm hover:-translate-y-0.5 active:translate-y-0"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Set Career Goal First</span>
            </button>
          )}
        </div>
      </div>

      {/* Roadmap Metrics Strip (Only when stages exist) */}
      {stages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-xl bg-[#151D26] border border-[#202C3B]">
            <span className="text-[10px] font-mono text-[#9AA5B1] uppercase tracking-wider block">
              Overall Progress
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-bold text-[#F3F0E8] font-mono">
                {overallMetrics.overallPercent}%
              </span>
              <span className="text-xs text-[#768393]">calculated</span>
            </div>
            <div className="w-full bg-[#0E151E] h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-[#D89B5B] rounded-full transition-all duration-300"
                style={{ width: `${overallMetrics.overallPercent}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#151D26] border border-[#202C3B]">
            <span className="text-[10px] font-mono text-[#9AA5B1] uppercase tracking-wider block">
              Total Stages
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-bold text-[#F3F0E8] font-mono">
                {overallMetrics.totalStages}
              </span>
              <span className="text-xs text-[#768393]">milestones</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#151D26] border border-[#202C3B]">
            <span className="text-[10px] font-mono text-[#9AA5B1] uppercase tracking-wider block">
              Completed Tasks
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-bold text-[#67C5B8] font-mono">
                {overallMetrics.completedTasks}
              </span>
              <span className="text-xs text-[#768393]">of {overallMetrics.totalTasks}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#151D26] border border-[#202C3B]">
            <span className="text-[10px] font-mono text-[#9AA5B1] uppercase tracking-wider block">
              In Progress
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-bold text-[#D89B5B] font-mono">
                {overallMetrics.inProgressTasks}
              </span>
              <span className="text-xs text-[#768393]">tasks active</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Roadmap Content or Empty State */}
      {stages.length > 0 ? (
        <div className="space-y-4" id="stages-list-section">
          {/* Status Filter Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-1">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0E151E] border border-[#202C3B] text-xs">
              {(['All', 'In Progress', 'Completed', 'Not Started'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-150 cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#D89B5B] text-[#0B0F14] font-semibold shadow-sm'
                      : 'text-[#9AA5B1] hover:text-[#F3F0E8] hover:bg-[#1B2533]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="text-xs text-[#9AA5B1] font-mono">
              Showing {filteredStages.length} of {stages.length} stages
            </div>
          </div>

          {/* Stage Cards */}
          <div className="space-y-4">
            {filteredStages.map((stage) => {
              const expanded = isExpanded(stage.id);
              const tasks = stage.tasks || [];
              const completedCount = tasks.filter((t) => t.status === 'Completed' || t.completed).length;

              return (
                <div
                  key={stage.id}
                  id={`roadmap-stage-${stage.id}`}
                  className="rounded-2xl bg-[#151D26] border border-[#202C3B] shadow-lg overflow-hidden transition-all duration-200 hover:border-[#27384B]"
                >
                  {/* Stage Header Accordion Bar */}
                  <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#202C3B]">
                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-xl bg-[#D89B5B]/15 text-[#D89B5B] border border-[#D89B5B]/30 flex items-center justify-center font-bold font-mono text-xs flex-shrink-0 mt-0.5">
                        {stage.number}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base sm:text-lg font-bold text-[#F3F0E8] tracking-tight">
                            {stage.title}
                          </h3>
                          {getStatusBadge(stage.status)}
                        </div>
                        <p className="text-xs text-[#9AA5B1] max-w-2xl leading-relaxed">
                          {stage.description}
                        </p>

                        {/* Stage metadata chips */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {stage.estimatedEffort && (
                            <span className="text-[11px] font-mono text-[#9AA5B1] flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#768393]" />
                              <span>{stage.estimatedEffort}</span>
                            </span>
                          )}

                          {stage.skills && stage.skills.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1 pl-2">
                              {stage.skills.map((sk) => (
                                <span
                                  key={sk}
                                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0E151E] text-[#9AA5B1] border border-[#202C3B]"
                                >
                                  {sk}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar & Header Controls */}
                    <div className="flex items-center justify-between lg:justify-end gap-4 lg:w-72 flex-shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#202C3B]">
                      <div className="flex-1 text-right">
                        <div className="flex items-center justify-between text-xs font-mono mb-1">
                          <span className="text-[#9AA5B1]">{completedCount}/{tasks.length} tasks</span>
                          <span className="text-[#F3F0E8] font-bold">{stage.progress}%</span>
                        </div>
                        <div className="w-full bg-[#0E151E] h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              stage.progress === 100 ? 'bg-[#67C5B8]' : 'bg-[#D89B5B]'
                            }`}
                            style={{ width: `${stage.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditStageModal(stage)}
                          className="p-2 rounded-lg text-[#9AA5B1] hover:text-[#F3F0E8] hover:bg-[#1B2533] transition-all cursor-pointer"
                          title="Edit Stage"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              type: 'stage',
                              stageId: stage.id,
                              name: stage.title,
                            })
                          }
                          className="p-2 rounded-lg text-[#9AA5B1] hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                          title="Delete Stage"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleExpand(stage.id)}
                          className="p-2 rounded-lg text-[#9AA5B1] hover:text-[#F3F0E8] hover:bg-[#1B2533] transition-all cursor-pointer"
                          title={expanded ? 'Collapse Stage' : 'Expand Stage'}
                        >
                          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tasks Content List (Expandable) */}
                  {expanded && (
                    <div className="p-5 sm:p-6 bg-[#0E151E] space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-mono text-[#9AA5B1] uppercase tracking-wider">
                          Tasks &amp; Action Items ({tasks.length})
                        </span>
                        <button
                          id={`add-task-btn-${stage.id}`}
                          onClick={() => openAddTaskModal(stage.id)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold text-[#D89B5B] bg-[#D89B5B]/10 hover:bg-[#D89B5B]/20 border border-[#D89B5B]/20 transition-all duration-150 flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Task</span>
                        </button>
                      </div>

                      {tasks.length === 0 ? (
                        <div className="p-6 rounded-xl bg-[#151D26] border border-[#202C3B] text-center text-xs text-[#768393]">
                          <p>No tasks added to this stage yet.</p>
                          <button
                            onClick={() => openAddTaskModal(stage.id)}
                            className="mt-2 text-[#D89B5B] hover:text-[#E4AB70] font-medium inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" /> Add first task
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {tasks.map((task) => {
                            const isCompleted = task.status === 'Completed' || task.completed;
                            const isInProgress = task.status === 'In Progress';

                            return (
                              <div
                                key={task.id}
                                className={`p-3.5 rounded-xl border transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                  isCompleted
                                    ? 'bg-[#151D26]/60 border-[#67C5B8]/20 text-[#768393]'
                                    : isInProgress
                                    ? 'bg-[#151D26] border-[#D89B5B]/40 text-[#F3F0E8]'
                                    : 'bg-[#151D26] border-[#202C3B] text-[#9AA5B1]'
                                }`}
                              >
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                  {/* Task status interactive toggle button */}
                                  <button
                                    onClick={() => toggleRoadmapTask(stage.id, task.id)}
                                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-all cursor-pointer flex-shrink-0 mt-0.5 ${
                                      isCompleted
                                        ? 'bg-[#67C5B8] text-[#0B0F14] shadow-sm'
                                        : isInProgress
                                        ? 'border-2 border-[#D89B5B] text-[#D89B5B] hover:bg-[#D89B5B]/20'
                                        : 'border border-[#768393] hover:border-[#D89B5B]'
                                    }`}
                                    title={`Current: ${task.status}. Click to cycle status.`}
                                  >
                                    {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                                    {isInProgress && <div className="w-2 h-2 bg-[#D89B5B] rounded-sm" />}
                                  </button>

                                  <div className="space-y-1 min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span
                                        className={`text-xs font-medium break-words ${
                                          isCompleted ? 'line-through text-[#768393]' : 'text-[#F3F0E8]'
                                        }`}
                                      >
                                        {task.title}
                                      </span>
                                      {getTaskTypeBadge(task.type)}
                                    </div>

                                    {/* Task metadata line */}
                                    <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-mono text-[#9AA5B1]">
                                      {task.estHours && (
                                        <span>Est. {task.estHours} hrs</span>
                                      )}
                                      {task.dueDate && (
                                        <span className="flex items-center gap-1 text-[#9AA5B1]">
                                          <Calendar className="w-2.5 h-2.5" /> {task.dueDate}
                                        </span>
                                      )}
                                      {task.notes && (
                                        <span className="text-[#768393] italic max-w-md truncate">
                                          "{task.notes}"
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Status Cycle Selector & Actions */}
                                <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#202C3B]">
                                  {/* Direct Status Selector */}
                                  <select
                                    value={task.status}
                                    onChange={(e) =>
                                      toggleRoadmapTask(
                                        stage.id,
                                        task.id,
                                        e.target.value as 'Not Started' | 'In Progress' | 'Completed'
                                      )
                                    }
                                    className="px-2.5 py-1 rounded-lg bg-[#0E151E] border border-[#202C3B] text-[11px] font-mono text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B] cursor-pointer"
                                  >
                                    <option value="Not Started">Not Started</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                  </select>

                                  <button
                                    onClick={() => openEditTaskModal(stage.id, task)}
                                    className="p-1.5 rounded text-[#9AA5B1] hover:text-[#F3F0E8] hover:bg-[#1B2533] transition-all cursor-pointer"
                                    title="Edit Task"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      setDeleteConfirm({
                                        type: 'task',
                                        stageId: stage.id,
                                        taskId: task.id,
                                        name: task.title,
                                      })
                                    }
                                    className="p-1.5 rounded text-[#9AA5B1] hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                                    title="Delete Task"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Empty State when no stages exist */
        <div
          id="roadmap-empty-state"
          className="rounded-2xl bg-[#151D26] border border-[#202C3B] p-6 sm:p-10 text-center max-w-2xl mx-auto shadow-xl"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#D89B5B]/15 border border-[#D89B5B]/30 text-[#D89B5B] flex items-center justify-center mx-auto mb-4">
            <Compass className="w-7 h-7" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#F3F0E8]">
            {targetCareer ? 'Build Your Personalized Roadmap' : 'Complete your profile to build your roadmap'}
          </h2>
          <p className="text-xs sm:text-sm text-[#9AA5B1] mt-2 max-w-lg mx-auto leading-relaxed">
            UNNEXA organizes your milestone stages around your verified student inputs: target career, academic coursework, technical skills, and portfolio projects.
          </p>

          {/* Profile Inputs Connected Status */}
          <div className="mt-5 p-4 rounded-xl bg-[#0E151E] border border-[#202C3B] text-left">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#9AA5B1] block mb-2.5">
              Connected Student Profile Inputs
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#151D26] border border-[#202C3B]">
                <span className="text-[#9AA5B1]">Target Career:</span>
                <span className="font-semibold text-[#D89B5B] truncate max-w-[150px]">
                  {targetCareer || 'No career goal set'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#151D26] border border-[#202C3B]">
                <span className="text-[#9AA5B1]">Skills Added:</span>
                <span className="font-semibold text-[#F3F0E8]">
                  {(student?.skills || []).length > 0 ? `${(student?.skills || []).length} skills` : '0 skills'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#151D26] border border-[#202C3B]">
                <span className="text-[#9AA5B1]">Projects Added:</span>
                <span className="font-semibold text-[#F3F0E8]">
                  {(student?.projects || []).length > 0 ? `${(student?.projects || []).length} projects` : '0 projects'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#151D26] border border-[#202C3B]">
                <span className="text-[#9AA5B1]">Academic History:</span>
                <span className="font-semibold text-[#F3F0E8]">
                  {(student?.semesters || []).length > 0 ? `${(student?.semesters || []).length} semesters` : 'No academic data yet'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="empty-state-add-stage-btn"
              onClick={openAddStageModal}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Custom Stage</span>
            </button>

            {targetCareer ? (
              <button
                id="empty-state-template-btn"
                onClick={() => initializeDefaultRoadmap(targetCareer)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-[#F3F0E8] bg-[#0E151E] hover:bg-[#1B2533] border border-[#202C3B] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D89B5B]" />
                <span>Load Milestone Template for {targetCareer}</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/dashboard/career')}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-[#F3F0E8] bg-[#0E151E] hover:bg-[#1B2533] border border-[#202C3B] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Target className="w-3.5 h-3.5 text-[#D89B5B]" />
                <span>Set Career Goal in Career Hub</span>
              </button>
            )}
          </div>

          <p className="text-[11px] text-[#768393] font-mono mt-4">
            Custom student milestones • Fully editable • Real progress tracking
          </p>
        </div>
      )}

      {/* Stage Modal */}
      {isStageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div
            id="roadmap-stage-modal"
            className="rounded-2xl bg-[#151D26] border border-[#202C3B] w-full max-w-lg p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#202C3B]">
              <h3 className="text-base font-bold text-[#F3F0E8]">
                {editingStageId ? 'Edit Stage' : 'Add Roadmap Stage'}
              </h3>
              <button
                onClick={() => setIsStageModalOpen(false)}
                className="p-1 rounded-lg text-[#9AA5B1] hover:text-[#F3F0E8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStage} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-[#F3F0E8] mb-1">
                  Stage Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={stageTitle}
                  onChange={(e) => setStageTitle(e.target.value)}
                  placeholder="e.g., Core Programming Foundations, Advanced Systems Design"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E151E] border border-[#202C3B] text-[#F3F0E8] placeholder-[#768393] focus:outline-none focus:border-[#D89B5B] text-xs"
                  autoFocus
                />
                {stageError && <p className="text-rose-400 text-[11px] mt-1">{stageError}</p>}
              </div>

              <div>
                <label className="block font-medium text-[#F3F0E8] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={stageDescription}
                  onChange={(e) => setStageDescription(e.target.value)}
                  placeholder="Summarize the core focus of this learning stage"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0E151E] border border-[#202C3B] text-[#F3F0E8] placeholder-[#768393] focus:outline-none focus:border-[#D89B5B] text-xs resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#F3F0E8] mb-1">Estimated Effort</label>
                  <input
                    type="text"
                    value={stageEffort}
                    onChange={(e) => setStageEffort(e.target.value)}
                    placeholder="e.g., 2-3 Months, 80 Hours"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0E151E] border border-[#202C3B] text-[#F3F0E8] placeholder-[#768393] focus:outline-none focus:border-[#D89B5B] text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#F3F0E8] mb-1">Target Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={stageSkills}
                    onChange={(e) => setStageSkills(e.target.value)}
                    placeholder="e.g., Python, C++, Docker"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0E151E] border border-[#202C3B] text-[#F3F0E8] placeholder-[#768393] focus:outline-none focus:border-[#D89B5B] text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#202C3B] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsStageModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#9AA5B1] hover:bg-[#1B2533] border border-[#202C3B] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] transition-all duration-150 cursor-pointer shadow-sm"
                >
                  Save Stage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div
            id="roadmap-task-modal"
            className="rounded-2xl bg-[#151D26] border border-[#202C3B] w-full max-w-lg p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#202C3B]">
              <h3 className="text-base font-bold text-[#F3F0E8]">
                {editingTaskId ? 'Edit Action Item' : 'Add Action Item'}
              </h3>
              <button
                onClick={() => setIsTaskModalOpen(false)}
                className="p-1 rounded-lg text-[#9AA5B1] hover:text-[#F3F0E8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-[#F3F0E8] mb-1">
                  Task / Action Item Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g., Complete distributed algorithms coursework, Build end-to-end API"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E151E] border border-[#202C3B] text-[#F3F0E8] placeholder-[#768393] focus:outline-none focus:border-[#D89B5B] text-xs"
                  autoFocus
                />
                {taskError && <p className="text-rose-400 text-[11px] mt-1">{taskError}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#F3F0E8] mb-1">Task Category</label>
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0E151E] border border-[#202C3B] text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B] text-xs cursor-pointer"
                  >
                    <option value="Skill">Skill Verification</option>
                    <option value="Course">Course / Subject</option>
                    <option value="Project">Applied Project</option>
                    <option value="Certification">Milestone / Cert</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#F3F0E8] mb-1">Current Status</label>
                  <select
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0E151E] border border-[#202C3B] text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B] text-xs cursor-pointer"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#F3F0E8] mb-1">Estimated Hours</label>
                  <input
                    type="number"
                    value={taskEstHours}
                    onChange={(e) => setTaskEstHours(e.target.value)}
                    placeholder="e.g., 20"
                    min="1"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0E151E] border border-[#202C3B] text-[#F3F0E8] placeholder-[#768393] focus:outline-none focus:border-[#D89B5B] text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#F3F0E8] mb-1">Target Due Date</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0E151E] border border-[#202C3B] text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#F3F0E8] mb-1">Notes / Target Links</label>
                <textarea
                  rows={2}
                  value={taskNotes}
                  onChange={(e) => setTaskNotes(e.target.value)}
                  placeholder="Optional reference links or personal notes"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0E151E] border border-[#202C3B] text-[#F3F0E8] placeholder-[#768393] focus:outline-none focus:border-[#D89B5B] text-xs resize-none"
                />
              </div>

              <div className="pt-3 border-t border-[#202C3B] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#9AA5B1] hover:bg-[#1B2533] border border-[#202C3B] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] transition-all duration-150 cursor-pointer shadow-sm"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div
            id="roadmap-delete-modal"
            className="rounded-2xl bg-[#151D26] border border-[#202C3B] w-full max-w-md p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex-shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F3F0E8]">
                  Delete {deleteConfirm.type === 'stage' ? 'Stage' : 'Task'}?
                </h3>
                <p className="text-xs text-[#9AA5B1] mt-1 leading-relaxed">
                  Are you sure you want to remove <strong>"{deleteConfirm.name}"</strong>?
                  {deleteConfirm.type === 'stage' && ' All tasks within this stage will also be removed.'}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#202C3B] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#9AA5B1] hover:bg-[#1B2533] border border-[#202C3B] cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="confirm-delete-roadmap-btn"
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 cursor-pointer shadow-md shadow-rose-600/30"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
