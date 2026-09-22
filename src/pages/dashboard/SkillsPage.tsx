import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  Target,
  BookOpen,
  Award,
  Compass,
  ArrowUpRight,
  HelpCircle,
} from 'lucide-react';
import { PageHeader, StatCard, ProgressBar } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';
import { mockStudent, SkillItem, SkillGoal, SkillProficiency } from '../../data/mockData';

export const SkillsPage: React.FC = () => {
  const { user, addSkill, updateSkill, deleteSkill, addOwnSkillUp, updateOwnSkillUp, deleteOwnSkillUp } = useAuth();
  const navigate = useNavigate();
  const student = user?.studentProfile || mockStudent;

  const skills: SkillItem[] = student.skills || [];
  const ownSkillUp: SkillGoal[] = student.ownSkillUp || [];

  // Search and filter for Current Skills
  const [currentSkillSearch, setCurrentSkillSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modals for Current Skills
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const [isEditSkillModalOpen, setIsEditSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);

  // Skill Form State
  const [skillName, setSkillName] = useState('');
  const [skillProficiency, setSkillProficiency] = useState<SkillProficiency>('Intermediate');
  const [skillCategory, setSkillCategory] = useState<string>('Programming');

  // Modals for Own Skill Up
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [isEditGoalModalOpen, setIsEditGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SkillGoal | null>(null);

  // Own Skill Up Form State
  const [goalName, setGoalName] = useState('');
  const [goalCurrentLevel, setGoalCurrentLevel] = useState<SkillProficiency>('Beginner');
  const [goalTargetLevel, setGoalTargetLevel] = useState<SkillProficiency>('Advanced');
  const [goalReason, setGoalReason] = useState('');

  // Filter current skills
  const filteredSkills = skills.filter((s) => {
    const matchesCategory = categoryFilter === 'All' || s.category === categoryFilter;
    const matchesSearch = s.name.toLowerCase().includes(currentSkillSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate proficiency mapping helper
  const getProficiencyScore = (prof?: SkillProficiency | string): number => {
    switch (prof) {
      case 'Expert':
        return 95;
      case 'Advanced':
        return 80;
      case 'Intermediate':
        return 60;
      case 'Beginner':
      default:
        return 35;
    }
  };

  const getProficiencyColor = (prof?: SkillProficiency | string) => {
    switch (prof) {
      case 'Expert':
        return 'bg-[#67C5B8]/15 text-[#7CD4C8] border-[#67C5B8]/30';
      case 'Advanced':
        return 'bg-[#D89B5B]/15 text-[#E4AB70] border-[#D89B5B]/30';
      case 'Intermediate':
        return 'bg-[#67C5B8]/10 text-[#67C5B8] border-[#67C5B8]/25';
      case 'Beginner':
      default:
        return 'bg-[#202C3B] text-[#9AA5B1] border-[#27384B]';
    }
  };

  // Handlers for Current Skills
  const handleOpenAddSkill = () => {
    setSkillName('');
    setSkillProficiency('Intermediate');
    setSkillCategory('Programming');
    setIsAddSkillModalOpen(true);
  };

  const handleOpenEditSkill = (skill: SkillItem) => {
    setEditingSkill(skill);
    setSkillName(skill.name);
    setSkillProficiency(skill.proficiency || (skill.currentLevel >= 80 ? 'Advanced' : skill.currentLevel >= 55 ? 'Intermediate' : 'Beginner'));
    setSkillCategory(skill.category || 'Programming');
    setIsEditSkillModalOpen(true);
  };

  const handleSaveAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    const score = getProficiencyScore(skillProficiency);

    addSkill({
      name: skillName.trim(),
      proficiency: skillProficiency,
      category: skillCategory,
      currentLevel: score,
      requiredLevel: 85,
      gap: 85 - score,
      priority: skillProficiency === 'Beginner' ? 'High' : 'Medium',
      action: `Build hands-on projects applying ${skillName.trim()}`,
      trend: 'up',
    });

    setIsAddSkillModalOpen(false);
  };

  const handleSaveEditSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill || !skillName.trim()) return;

    const score = getProficiencyScore(skillProficiency);

    updateSkill(editingSkill.id, {
      name: skillName.trim(),
      proficiency: skillProficiency,
      category: skillCategory,
      currentLevel: score,
      gap: (editingSkill.requiredLevel || 85) - score,
    });

    setIsEditSkillModalOpen(false);
  };

  const handleDeleteSkill = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from your current skills?`)) {
      deleteSkill(id);
    }
  };

  // Handlers for Own Skill Up
  const handleOpenAddGoal = () => {
    setGoalName('');
    setGoalCurrentLevel('Beginner');
    setGoalTargetLevel('Advanced');
    setGoalReason('');
    setIsAddGoalModalOpen(true);
  };

  const handleOpenEditGoal = (goal: SkillGoal) => {
    setEditingGoal(goal);
    setGoalName(goal.skill || goal.name || '');
    setGoalCurrentLevel(goal.currentLevel || 'Beginner');
    setGoalTargetLevel(goal.targetLevel || 'Advanced');
    setGoalReason(goal.reason || '');
    setIsEditGoalModalOpen(true);
  };

  const handleSaveAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalName.trim()) return;

    addOwnSkillUp({
      skill: goalName.trim(),
      name: goalName.trim(),
      currentLevel: goalCurrentLevel,
      targetLevel: goalTargetLevel,
      reason: goalReason.trim() || undefined,
    });

    setIsAddGoalModalOpen(false);
  };

  const handleSaveEditGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal || !goalName.trim()) return;

    updateOwnSkillUp(editingGoal.id, {
      skill: goalName.trim(),
      name: goalName.trim(),
      currentLevel: goalCurrentLevel,
      targetLevel: goalTargetLevel,
      reason: goalReason.trim() || undefined,
    });

    setIsEditGoalModalOpen(false);
  };

  const handleDeleteGoal = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove the skill goal "${name}"?`)) {
      deleteOwnSkillUp(id);
    }
  };

  // Derived stats
  const expertCount = skills.filter((s) => s.proficiency === 'Expert' || s.currentLevel >= 90).length;
  const advancedCount = skills.filter((s) => s.proficiency === 'Advanced' || (s.currentLevel >= 75 && s.currentLevel < 90)).length;
  const activeGoalsCount = ownSkillUp.length;

  return (
    <div className="space-y-8 pb-16 font-sans">
      <PageHeader
        title="Technical Skills & Competency Matrix"
        subtitle="Manage the capabilities you currently possess and establish independent learning roadmaps."
        badge={user?.isGuest ? 'Guest Session' : 'Student Portfolio'}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleOpenAddSkill}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] transition-all duration-150 flex items-center gap-1.5 cursor-pointer shadow-sm hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Current Skill</span>
            </button>
            <button
              onClick={handleOpenAddGoal}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#7CD4C8] bg-[#67C5B8]/15 hover:bg-[#67C5B8]/25 border border-[#67C5B8]/30 transition-all duration-150 flex items-center gap-1.5 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Add Skill Up Goal</span>
            </button>
          </div>
        }
      />

      {/* Concept Clarification & Distinction Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#151D26] border border-[#202C3B] flex items-start gap-3 transition-all duration-200 hover:border-[#27384B]">
          <div className="p-2 rounded-lg bg-[#D89B5B]/15 text-[#D89B5B] flex-shrink-0 mt-0.5">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-[#F3F0E8] uppercase tracking-wider">Current Skills</h3>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#D89B5B]/15 text-[#E4AB70]">Existing Capability</span>
            </div>
            <p className="text-xs text-[#9AA5B1] mt-1 leading-relaxed">
              Skills you <strong>already possess and can actively use</strong> in coursework and projects right now. You can edit your proficiency as you grow.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#151D26] border border-[#202C3B] flex items-start gap-3 transition-all duration-200 hover:border-[#27384B]">
          <div className="p-2 rounded-lg bg-[#67C5B8]/15 text-[#67C5B8] flex-shrink-0 mt-0.5">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-[#F3F0E8] uppercase tracking-wider">Own Skill Up</h3>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#67C5B8]/15 text-[#7CD4C8]">Future Growth</span>
            </div>
            <p className="text-xs text-[#9AA5B1] mt-1 leading-relaxed">
              Skills you <strong>plan to learn or level up independently</strong> outside standard college coursework to match career aspirations.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Current Skills Tracked"
          value={skills.length}
          change={skills.length > 0 ? `${expertCount + advancedCount} Advanced/Expert` : 'None logged yet'}
          changeType={skills.length > 0 ? 'positive' : 'neutral'}
          subtext="Verified in your technical profile"
          icon={Award}
          accentColor="amber"
        />
        <StatCard
          title="Own Skill Up Goals"
          value={activeGoalsCount}
          change={activeGoalsCount > 0 ? 'Target learning active' : 'No active targets'}
          changeType={activeGoalsCount > 0 ? 'positive' : 'neutral'}
          subtext="Independent learning trajectories"
          icon={Target}
          accentColor="teal"
        />
        <StatCard
          title="Target Role Calibration"
          value={student.targetCareer || 'Engineering Specialization'}
          change={student.targetCareer ? 'Active focus' : 'No target set'}
          changeType={student.targetCareer ? 'positive' : 'neutral'}
          subtext="Skill gap comparison baseline"
          icon={TrendingUp}
          accentColor="copper"
        />
      </div>

      {/* ========================================================== */}
      {/* PART 1 — CURRENT SKILLS SECTION */}
      {/* ========================================================== */}
      <section className="rounded-2xl bg-[#151D26] border border-[#202C3B] p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1E2938]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#D89B5B] font-semibold">
                Part 1 — Active Capabilities
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#D89B5B]/15 text-[#E4AB70] border border-[#D89B5B]/30">
                {skills.length} Total
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#F3F0E8] mt-1">Current Technical Skills</h2>
            <p className="text-xs text-[#9AA5B1] mt-0.5">
              Programming languages, frameworks, libraries, and engineering tools you already know.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#9AA5B1] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={currentSkillSearch}
                onChange={(e) => setCurrentSkillSearch(e.target.value)}
                placeholder="Search skills..."
                className="bg-[#0E151E] border border-[#202C3B] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#F3F0E8] placeholder-[#768393] focus:outline-none focus:border-[#D89B5B]"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#0E151E] p-1 rounded-lg border border-[#202C3B] overflow-x-auto">
              {['All', 'Programming', 'AI & ML', 'Databases & Web', 'DevOps & Tools'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all duration-150 cursor-pointer whitespace-nowrap ${
                    categoryFilter === cat
                      ? 'bg-[#D89B5B] text-[#0B0F14] font-semibold shadow-sm'
                      : 'text-[#9AA5B1] hover:text-[#F3F0E8]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={handleOpenAddSkill}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] transition-all duration-150 flex items-center gap-1 cursor-pointer shadow-sm hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </div>
        </div>

        {/* Current Skills List */}
        {skills.length === 0 ? (
          /* EMPTY STATE FOR REGISTERED STUDENT */
          <div className="p-8 sm:p-12 text-center rounded-2xl bg-[#0E151E] border border-dashed border-[#202C3B] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D89B5B]/15 border border-[#D89B5B]/30 text-[#D89B5B] mx-auto flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-base font-bold text-[#F3F0E8]">No Current Skills Added Yet</h3>
              <p className="text-xs text-[#9AA5B1] mt-2 leading-relaxed">
                <strong>Current Skills</strong> are the technical abilities, languages, and tools you already know and can apply in projects (e.g. Python, SQL, React, Git). Add your existing skills to start profiling your capabilities.
              </p>
            </div>
            <button
              onClick={handleOpenAddSkill}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] transition-all duration-150 cursor-pointer shadow-sm hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Skill</span>
            </button>
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="p-8 text-center text-[#9AA5B1] text-xs rounded-xl bg-[#0E151E] border border-[#202C3B]">
            No skills matched your search criteria. Try a different search term or category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map((skill) => {
              const prof = skill.proficiency || (skill.currentLevel >= 85 ? 'Expert' : skill.currentLevel >= 70 ? 'Advanced' : skill.currentLevel >= 50 ? 'Intermediate' : 'Beginner');
              const profScore = getProficiencyScore(prof);

              return (
                <div
                  key={skill.id}
                  className="p-4 rounded-xl bg-[#0E151E] border border-[#202C3B] hover:border-[#D89B5B]/40 hover:-translate-y-0.5 transition-all duration-150 flex flex-col justify-between group relative"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-[#F3F0E8] group-hover:text-[#D89B5B] transition-colors">
                          {skill.name}
                        </h4>
                        <span className="text-[11px] font-mono text-[#9AA5B1] block mt-0.5">
                          {skill.category || 'General Skill'}
                        </span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getProficiencyColor(prof)}`}>
                        {prof}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-[#9AA5B1] font-mono">
                        <span>Proficiency Index</span>
                        <span className="text-[#F3F0E8] font-semibold">{profScore}%</span>
                      </div>
                      <ProgressBar
                        progress={profScore}
                        color={prof === 'Expert' ? 'emerald' : prof === 'Advanced' ? 'copper' : prof === 'Intermediate' ? 'teal' : 'slate'}
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1E2938] flex items-center justify-between text-xs">
                    <button
                      onClick={() => navigate('/dashboard/projects')}
                      className="text-[11px] text-[#9AA5B1] hover:text-[#D89B5B] flex items-center gap-1 cursor-pointer transition-colors"
                      title="Apply in projects"
                    >
                      <span>Apply in Project</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditSkill(skill)}
                        className="p-1.5 rounded-lg text-[#9AA5B1] hover:text-[#D89B5B] hover:bg-[#D89B5B]/10 transition-colors cursor-pointer"
                        title="Edit Skill"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill.id, skill.name)}
                        className="p-1.5 rounded-lg text-[#9AA5B1] hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete Skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ========================================================== */}
      {/* PART 2 — OWN SKILL UP SECTION */}
      {/* ========================================================== */}
      <section className="rounded-2xl bg-[#151D26] border border-[#202C3B] p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1E2938]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#67C5B8]/15 border border-[#67C5B8]/30 flex items-center justify-center text-[#67C5B8] flex-shrink-0 mt-0.5">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#67C5B8] font-semibold">
                  Part 2 — Independent Learning Roadmap
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#67C5B8]/15 text-[#7CD4C8] border border-[#67C5B8]/30">
                  {ownSkillUp.length} Active Goals
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#F3F0E8] mt-0.5">Own Skill Up Goals</h2>
              <p className="text-xs text-[#9AA5B1] mt-0.5 max-w-xl">
                Skills you want to learn or advance independently beyond college requirements, along with your personal motivation.
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAddGoal}
            className="self-start md:self-center px-4 py-2 rounded-xl text-xs font-semibold text-[#7CD4C8] bg-[#67C5B8]/15 hover:bg-[#67C5B8]/25 border border-[#67C5B8]/30 transition-all duration-150 flex items-center gap-1.5 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill Up Goal</span>
          </button>
        </div>

        {/* Own Skill Up List */}
        {ownSkillUp.length === 0 ? (
          /* EMPTY STATE FOR OWN SKILL UP */
          <div className="p-8 sm:p-12 text-center rounded-2xl bg-[#0E151E] border border-dashed border-[#202C3B] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#67C5B8]/15 border border-[#67C5B8]/30 text-[#67C5B8] mx-auto flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-base font-bold text-[#F3F0E8]">No Own Skill Up Goals Set Yet</h3>
              <p className="text-xs text-[#9AA5B1] mt-2 leading-relaxed">
                <strong>Own Skill Up</strong> tracks independent learning ambitions. Set targeted competencies (e.g. Deep Learning, Kubernetes, Next.js) you want to learn, from your current level to target level, plus why you want to learn it.
              </p>
            </div>
            <button
              onClick={handleOpenAddGoal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#7CD4C8] bg-[#67C5B8]/15 hover:bg-[#67C5B8]/25 border border-[#67C5B8]/30 transition-all duration-150 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-4 h-4" />
              <span>Set Your First Goal</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ownSkillUp.map((goal) => {
              const skillTitle = goal.skill || goal.name || 'Untitled Skill Goal';
              return (
                <div
                  key={goal.id}
                  className="p-4 rounded-xl bg-[#0E151E] border border-[#202C3B] hover:border-[#67C5B8]/40 hover:-translate-y-0.5 transition-all duration-150 flex flex-col justify-between group relative"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-[#F3F0E8] group-hover:text-[#67C5B8] transition-colors">
                        {skillTitle}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#67C5B8]/15 text-[#7CD4C8] border border-[#67C5B8]/30 font-semibold whitespace-nowrap">
                        Target: {goal.targetLevel}
                      </span>
                    </div>

                    {/* Progression visual */}
                    <div className="p-2.5 rounded-lg bg-[#151D26] border border-[#202C3B] flex items-center justify-between text-xs font-mono">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#9AA5B1] uppercase">Current</span>
                        <span className="text-[#F3F0E8] font-semibold">{goal.currentLevel}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#67C5B8]">
                        <span className="text-xs">➔</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-[#9AA5B1] uppercase">Target</span>
                        <span className="text-[#67C5B8] font-semibold">{goal.targetLevel}</span>
                      </div>
                    </div>

                    {/* Reason / Motivation */}
                    {goal.reason ? (
                      <div className="p-2.5 rounded-lg bg-[#151D26]/70 border border-[#202C3B]">
                        <span className="text-[10px] font-mono uppercase text-[#9AA5B1] block mb-1">
                          Why I want to learn this:
                        </span>
                        <p className="text-xs text-[#9AA5B1] italic leading-relaxed">
                          &ldquo;{goal.reason}&rdquo;
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-[#768393] italic">No specific motivation logged.</p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1E2938] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#67C5B8] font-mono">Self-Directed</span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditGoal(goal)}
                        className="p-1.5 rounded-lg text-[#9AA5B1] hover:text-[#67C5B8] hover:bg-[#67C5B8]/10 transition-colors cursor-pointer"
                        title="Edit Skill Up Goal"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id, skillTitle)}
                        className="p-1.5 rounded-lg text-[#9AA5B1] hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete Goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ========================================================== */}
      {/* MODALS FOR CURRENT SKILLS */}
      {/* ========================================================== */}
      {/* Add Current Skill Modal */}
      {isAddSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#151D26] border border-[#202C3B] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2938]">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#D89B5B]" />
                <h3 className="text-sm font-bold text-[#F3F0E8] uppercase tracking-wider">
                  Add Current Skill
                </h3>
              </div>
              <button
                onClick={() => setIsAddSkillModalOpen(false)}
                className="text-[#9AA5B1] hover:text-[#F3F0E8] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#9AA5B1]">
              Add a skill or technology you <strong>already know and can use</strong>. You can enter any custom skill name.
            </p>

            <form onSubmit={handleSaveAddSkill} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#9AA5B1] font-medium mb-1">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="e.g. Python, React, PostgreSQL, Docker, Git"
                  className="w-full bg-[#0E151E] border border-[#202C3B] rounded-lg px-3 py-2 text-[#F3F0E8] placeholder-[#768393] focus:outline-none focus:border-[#D89B5B]"
                />
                <span className="text-[10px] text-[#768393] mt-1 block">
                  You can type any custom programming language, framework, or tool.
                </span>
              </div>

              <div>
                <label className="block text-[#9AA5B1] font-medium mb-1">Proficiency Level *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced', 'Expert'] as SkillProficiency[]).map((level) => (
                    <button
                      type="button"
                      key={level}
                      onClick={() => setSkillProficiency(level)}
                      className={`py-2 px-2 rounded-lg text-center font-medium transition-all duration-150 cursor-pointer text-xs border ${
                        skillProficiency === level
                          ? 'bg-[#D89B5B] border-[#D89B5B] text-[#0B0F14] font-bold shadow-sm'
                          : 'bg-[#0E151E] border-[#202C3B] text-[#9AA5B1] hover:text-[#F3F0E8]'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#9AA5B1] font-medium mb-1">Category</label>
                <select
                  value={skillCategory}
                  onChange={(e) => setSkillCategory(e.target.value)}
                  className="w-full bg-[#0E151E] border border-[#202C3B] rounded-lg px-3 py-2 text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B]"
                >
                  <option value="Programming">Programming</option>
                  <option value="AI & ML">AI &amp; ML</option>
                  <option value="Databases & Web">Databases &amp; Web</option>
                  <option value="DevOps & Tools">DevOps &amp; Tools</option>
                  <option value="Systems & Cloud">Systems &amp; Cloud</option>
                  <option value="Soft Skills & Core">Soft Skills &amp; Core</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#1E2938] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSkillModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg bg-[#202C3B] text-[#9AA5B1] hover:text-[#F3F0E8] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#D89B5B] hover:bg-[#E4AB70] text-[#0B0F14] font-semibold cursor-pointer shadow-sm"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Current Skill Modal */}
      {isEditSkillModalOpen && editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#151D26] border border-[#202C3B] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2938]">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#D89B5B]" />
                <h3 className="text-sm font-bold text-[#F3F0E8] uppercase tracking-wider">
                  Edit Current Skill
                </h3>
              </div>
              <button
                onClick={() => setIsEditSkillModalOpen(false)}
                className="text-[#9AA5B1] hover:text-[#F3F0E8] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSkill} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#9AA5B1] font-medium mb-1">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  className="w-full bg-[#0E151E] border border-[#202C3B] rounded-lg px-3 py-2 text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B]"
                />
              </div>

              <div>
                <label className="block text-[#9AA5B1] font-medium mb-1">Proficiency Level *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced', 'Expert'] as SkillProficiency[]).map((level) => (
                    <button
                      type="button"
                      key={level}
                      onClick={() => setSkillProficiency(level)}
                      className={`py-2 px-2 rounded-lg text-center font-medium transition-all duration-150 cursor-pointer text-xs border ${
                        skillProficiency === level
                          ? 'bg-[#D89B5B] border-[#D89B5B] text-[#0B0F14] font-bold shadow-sm'
                          : 'bg-[#0E151E] border-[#202C3B] text-[#9AA5B1] hover:text-[#F3F0E8]'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#9AA5B1] font-medium mb-1">Category</label>
                <select
                  value={skillCategory}
                  onChange={(e) => setSkillCategory(e.target.value)}
                  className="w-full bg-[#0E151E] border border-[#202C3B] rounded-lg px-3 py-2 text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B]"
                >
                  <option value="Programming">Programming</option>
                  <option value="AI & ML">AI &amp; ML</option>
                  <option value="Databases & Web">Databases &amp; Web</option>
                  <option value="DevOps & Tools">DevOps &amp; Tools</option>
                  <option value="Systems & Cloud">Systems &amp; Cloud</option>
                  <option value="Soft Skills & Core">Soft Skills &amp; Core</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#1E2938] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditSkillModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg bg-[#202C3B] text-[#9AA5B1] hover:text-[#F3F0E8] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#D89B5B] hover:bg-[#E4AB70] text-[#0B0F14] font-semibold cursor-pointer shadow-sm"
                >
                  Update Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODALS FOR OWN SKILL UP */}
      {/* ========================================================== */}
      {/* Add Own Skill Up Modal */}
      {isAddGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#151D26] border border-[#202C3B] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2938]">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#67C5B8]" />
                <h3 className="text-sm font-bold text-[#F3F0E8] uppercase tracking-wider">
                  Add Own Skill Up Goal
                </h3>
              </div>
              <button
                onClick={() => setIsAddGoalModalOpen(false)}
                className="text-[#9AA5B1] hover:text-[#F3F0E8] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#9AA5B1]">
              Define a technical competency you want to develop independently, your target milestone, and your motivation.
            </p>

            <form onSubmit={handleSaveAddGoal} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#9AA5B1] font-medium mb-1">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="e.g. Machine Learning, Deep Learning, Docker, Kubernetes"
                  className="w-full bg-[#0E151E] border border-[#202C3B] rounded-lg px-3 py-2 text-[#F3F0E8] placeholder-[#768393] focus:outline-none focus:border-[#67C5B8]"
                />
                <span className="text-[10px] text-[#768393] mt-1 block">
                  Any skill you want to learn or advance independently.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9AA5B1] font-medium mb-1">Current Level</label>
                  <select
                    value={goalCurrentLevel}
                    onChange={(e) => setGoalCurrentLevel(e.target.value as SkillProficiency)}
                    className="w-full bg-[#0E151E] border border-[#202C3B] rounded-lg px-3 py-2 text-[#F3F0E8] focus:outline-none focus:border-[#67C5B8]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#9AA5B1] font-medium mb-1">Target Level</label>
                  <select
                    value={goalTargetLevel}
                    onChange={(e) => setGoalTargetLevel(e.target.value as SkillProficiency)}
                    className="w-full bg-[#0E151E] border border-[#202C3B] rounded-lg px-3 py-2 text-[#F3F0E8] focus:outline-none focus:border-[#67C5B8]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#9AA5B1] font-medium mb-1">
                  Reason / Learning Motivation
                </label>
                <textarea
                  rows={3}
                  value={goalReason}
                  onChange={(e) => setGoalReason(e.target.value)}
                  placeholder="e.g. I want to improve my ML skills and build real-world models for internships."
                  className="w-full bg-[#0E151E] border border-[#202C3B] rounded-lg px-3 py-2 text-[#F3F0E8] placeholder-[#768393] focus:outline-none focus:border-[#67C5B8] leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-[#1E2938] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddGoalModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg bg-[#202C3B] text-[#9AA5B1] hover:text-[#F3F0E8] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#67C5B8] hover:bg-[#7CD4C8] text-[#0B0F14] font-semibold cursor-pointer shadow-sm"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Own Skill Up Modal */}
      {isEditGoalModalOpen && editingGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#151D26] border border-[#202C3B] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2938]">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#67C5B8]" />
                <h3 className="text-sm font-bold text-[#F3F0E8] uppercase tracking-wider">
                  Edit Skill Up Goal
                </h3>
              </div>
              <button
                onClick={() => setIsEditGoalModalOpen(false)}
                className="text-[#9AA5B1] hover:text-[#F3F0E8] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditGoal} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#9AA5B1] font-medium mb-1">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  className="w-full bg-[#0E151E] border border-[#202C3B] rounded-lg px-3 py-2 text-[#F3F0E8] focus:outline-none focus:border-[#67C5B8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9AA5B1] font-medium mb-1">Current Level</label>
                  <select
                    value={goalCurrentLevel}
                    onChange={(e) => setGoalCurrentLevel(e.target.value as SkillProficiency)}
                    className="w-full bg-[#0E151E] border border-[#202C3B] rounded-lg px-3 py-2 text-[#F3F0E8] focus:outline-none focus:border-[#67C5B8]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#9AA5B1] font-medium mb-1">Target Level</label>
                  <select
                    value={goalTargetLevel}
                    onChange={(e) => setGoalTargetLevel(e.target.value as SkillProficiency)}
                    className="w-full bg-[#0E151E] border border-[#202C3B] rounded-lg px-3 py-2 text-[#F3F0E8] focus:outline-none focus:border-[#67C5B8]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#9AA5B1] font-medium mb-1">
                  Reason / Learning Motivation
                </label>
                <textarea
                  rows={3}
                  value={goalReason}
                  onChange={(e) => setGoalReason(e.target.value)}
                  className="w-full bg-[#0E151E] border border-[#202C3B] rounded-lg px-3 py-2 text-[#F3F0E8] focus:outline-none focus:border-[#67C5B8] leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-[#1E2938] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditGoalModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg bg-[#202C3B] text-[#9AA5B1] hover:text-[#F3F0E8] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#67C5B8] hover:bg-[#7CD4C8] text-[#0B0F14] font-semibold cursor-pointer shadow-sm"
                >
                  Update Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default SkillsPage;
