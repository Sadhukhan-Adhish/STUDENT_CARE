import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Target, Wrench, X, Sparkles, AlertCircle } from 'lucide-react';
import { OnboardingData } from './types';
import { SkillItem, SkillGoal } from '../../data/mockData';

interface StepSkillsProps {
  data: OnboardingData;
  onChange: (fields: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const POPULAR_CURRENT_SKILLS = [
  'Python', 'Java', 'C++', 'JavaScript', 'SQL', 'HTML / CSS', 'React', 'Data Structures', 'Git & GitHub', 'Linux'
];

const POPULAR_OWN_SKILL_UP = [
  { name: 'Web Development', cat: 'Software Engineering' },
  { name: 'Machine Learning & AI', cat: 'Artificial Intelligence' },
  { name: 'Cloud Computing & DevOps', cat: 'Infrastructure' },
  { name: 'UI / UX Design', cat: 'Product Design' },
  { name: 'Mobile App Development (Flutter/React Native)', cat: 'App Dev' },
  { name: 'Cybersecurity & Ethical Hacking', cat: 'Security' },
  { name: 'Data Science & Analytics', cat: 'Data' },
  { name: 'Game Development', cat: 'Creative Tech' },
];

export const StepSkills: React.FC<StepSkillsProps> = ({
  data,
  onChange,
  onNext,
  onBack,
}) => {
  // Current Skills modal
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [skillName, setSkillName] = useState('');
  const [proficiency, setProficiency] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);

  // Own Skill Up modal
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [currentLevel, setCurrentLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Beginner');
  const [targetLevel, setTargetLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Advanced');
  const [goalReason, setGoalReason] = useState('');
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  // Part 1: Current Skills handlers
  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    const scoreMap = { Beginner: 40, Intermediate: 65, Advanced: 85, Expert: 95 };
    const newSkill: SkillItem = {
      id: editingSkillId || 'sk-' + Date.now(),
      name: skillName.trim(),
      proficiency,
      currentLevel: scoreMap[proficiency],
      score: scoreMap[proficiency],
      category: 'Programming',
    };

    let updated: SkillItem[];
    if (editingSkillId) {
      updated = (data.skills || []).map((s) => (s.id === editingSkillId ? newSkill : s));
    } else {
      updated = [...(data.skills || []), newSkill];
    }

    onChange({ skills: updated });
    setIsSkillModalOpen(false);
  };

  const handleDeleteSkill = (id: string) => {
    onChange({ skills: (data.skills || []).filter((s) => s.id !== id) });
  };

  const handleQuickAddSkill = (name: string) => {
    if ((data.skills || []).some((s) => s.name.toLowerCase() === name.toLowerCase())) return;
    const newSkill: SkillItem = {
      id: 'sk-' + Date.now() + Math.random(),
      name,
      proficiency: 'Intermediate',
      currentLevel: 65,
      score: 65,
      category: 'Programming',
    };
    onChange({ skills: [...(data.skills || []), newSkill] });
  };

  // Part 2: Own Skill Up handlers
  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalName.trim()) return;

    const newGoal: SkillGoal = {
      id: editingGoalId || 'goal-' + Date.now(),
      skill: goalName.trim(),
      currentLevel,
      targetLevel,
      reason: goalReason.trim() || undefined,
    };

    let updated: SkillGoal[];
    if (editingGoalId) {
      updated = (data.ownSkillUp || []).map((g) => (g.id === editingGoalId ? newGoal : g));
    } else {
      updated = [...(data.ownSkillUp || []), newGoal];
    }

    onChange({ ownSkillUp: updated });
    setIsGoalModalOpen(false);
  };

  const handleDeleteGoal = (id: string) => {
    onChange({ ownSkillUp: (data.ownSkillUp || []).filter((g) => g.id !== id) });
  };

  const handleQuickAddGoal = (name: string) => {
    if ((data.ownSkillUp || []).some((g) => g.skill.toLowerCase() === name.toLowerCase())) return;
    const newGoal: SkillGoal = {
      id: 'goal-' + Date.now() + Math.random(),
      skill: name,
      currentLevel: 'Beginner',
      targetLevel: 'Advanced',
      reason: 'Self-driven career specialization',
    };
    onChange({ ownSkillUp: [...(data.ownSkillUp || []), newGoal] });
  };

  return (
    <div className="space-y-8">
      <div className="mb-2">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Skills &amp; Own Skill Up
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Capture what you currently know, plus independent skills you want to learn beyond college coursework.
        </p>
      </div>

      {/* PART 1: CURRENT SKILLS */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D15] border border-[#1E273A] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Part 1: Current Skills ({(data.skills || []).length})
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Programming languages, tools, or concepts you currently know.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingSkillId(null);
              setSkillName('');
              setProficiency('Intermediate');
              setIsSkillModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </button>
        </div>

        {/* Quick add suggestions */}
        <div>
          <span className="text-[11px] font-mono text-slate-400 block mb-1.5">
            Quick Add:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_CURRENT_SKILLS.map((item) => {
              const exists = (data.skills || []).some(
                (s) => s.name.toLowerCase() === item.toLowerCase()
              );
              return (
                <button
                  key={item}
                  type="button"
                  disabled={exists}
                  onClick={() => handleQuickAddSkill(item)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    exists
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 opacity-60 cursor-default'
                      : 'bg-[#0E1422] border-[#222E47] text-slate-300 hover:border-indigo-500/50 hover:text-white'
                  }`}
                >
                  {exists ? `✓ ${item}` : `+ ${item}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Added skills list */}
        {(data.skills || []).length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">
            No current skills added yet. Add at least 1-2 skills you know or are studying.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {data.skills.map((skill) => (
              <div
                key={skill.id}
                className="p-2.5 rounded-xl bg-[#0D121F] border border-[#1C263D] flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-semibold text-white block">
                    {skill.name}
                  </span>
                  <span className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded ${
                    skill.proficiency === 'Expert'
                      ? 'bg-purple-500/10 text-purple-300'
                      : skill.proficiency === 'Advanced'
                      ? 'bg-indigo-500/10 text-indigo-300'
                      : skill.proficiency === 'Intermediate'
                      ? 'bg-sky-500/10 text-sky-300'
                      : 'bg-slate-500/10 text-slate-300'
                  }`}>
                    {skill.proficiency}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSkillId(skill.id);
                      setSkillName(skill.name);
                      setProficiency(skill.proficiency as any);
                      setIsSkillModalOpen(true);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-slate-200"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PART 2: OWN SKILL UP */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#0F1424] to-[#090D15] border border-indigo-500/30 space-y-4 shadow-xl shadow-indigo-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Part 2: Own Skill Up ({(data.ownSkillUp || []).length})
              </h3>
              <span className="text-[10px] font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                UNNEXA Feature
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Skills you want to master independently outside your college syllabus.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingGoalId(null);
              setGoalName('');
              setCurrentLevel('Beginner');
              setTargetLevel('Advanced');
              setGoalReason('');
              setIsGoalModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill Goal</span>
          </button>
        </div>

        {/* Quick Suggestions for Own Skill Up */}
        <div>
          <span className="text-[11px] font-mono text-slate-400 block mb-1.5">
            Suggested Independent Tracks:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_OWN_SKILL_UP.map((item) => {
              const exists = (data.ownSkillUp || []).some(
                (g) => g.skill.toLowerCase() === item.name.toLowerCase()
              );
              return (
                <button
                  key={item.name}
                  type="button"
                  disabled={exists}
                  onClick={() => handleQuickAddGoal(item.name)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    exists
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 opacity-60 cursor-default'
                      : 'bg-[#121A2D] border-[#222E47] text-slate-300 hover:border-emerald-500/50 hover:text-white'
                  }`}
                >
                  {exists ? `✓ ${item.name}` : `+ ${item.name}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Added Skill Goals */}
        {(data.ownSkillUp || []).length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">
            No independent learning goals added yet. Add what you are eager to learn for internships, jobs, or personal projects!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {data.ownSkillUp.map((goal) => (
              <div
                key={goal.id}
                className="p-3 rounded-xl bg-[#0B0F19] border border-[#222E47] flex items-start justify-between group"
              >
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-white block">
                    {goal.skill}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                    <span className="text-slate-400">{goal.currentLevel}</span>
                    <span className="text-indigo-400">→</span>
                    <span className="text-emerald-400 font-semibold">{goal.targetLevel}</span>
                  </div>
                  {goal.reason && (
                    <p className="text-[10px] text-slate-400 italic">
                      &ldquo;{goal.reason}&rdquo;
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingGoalId(goal.id);
                      setGoalName(goal.skill);
                      setCurrentLevel(goal.currentLevel);
                      setTargetLevel(goal.targetLevel);
                      setGoalReason(goal.reason || '');
                      setIsGoalModalOpen(true);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-slate-200"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Current Skill Modal */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-[#0D121F] border border-[#222E47] rounded-2xl shadow-2xl p-5 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">
                {editingSkillId ? 'Edit Skill' : 'Add Current Skill'}
              </h3>
              <button
                type="button"
                onClick={() => setIsSkillModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                  Skill Name <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="e.g. Python, React, Docker, Figma"
                  className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E273A] text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                  Proficiency Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setProficiency(level)}
                      className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                        proficiency === level
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-[#080B12] text-slate-400 border border-[#1E273A] hover:text-white'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#1C263D]">
                <button
                  type="button"
                  onClick={() => setIsSkillModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Goal Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-[#0D121F] border border-[#222E47] rounded-2xl shadow-2xl p-5 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">
                {editingGoalId ? 'Edit Skill Goal' : 'Add Own Skill Up Goal'}
              </h3>
              <button
                type="button"
                onClick={() => setIsGoalModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                  Skill / Subject to Master <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="e.g. Next.js, Kubernetes, Financial Modeling"
                  className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E273A] text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase font-mono mb-1">
                    Current Level
                  </label>
                  <select
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(e.target.value as any)}
                    className="w-full px-2 py-1.5 rounded-lg bg-[#080B12] border border-[#1E273A] text-xs text-slate-200"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase font-mono mb-1">
                    Target Level
                  </label>
                  <select
                    value={targetLevel}
                    onChange={(e) => setTargetLevel(e.target.value as any)}
                    className="w-full px-2 py-1.5 rounded-lg bg-[#080B12] border border-[#1E273A] text-xs text-slate-200"
                  >
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                  Reason / Target Outcome (Optional)
                </label>
                <input
                  type="text"
                  value={goalReason}
                  onChange={(e) => setGoalReason(e.target.value)}
                  placeholder="e.g. For campus placements &amp; side projects"
                  className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E273A] text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#1C263D]">
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/25"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Navigation Actions */}
      <div className="pt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-[#141B2A] hover:bg-[#1E273D] text-slate-300 hover:text-white border border-[#232F4A] transition-colors text-sm font-medium cursor-pointer"
        >
          ← Back
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2 cursor-pointer"
        >
          <span>Continue</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
