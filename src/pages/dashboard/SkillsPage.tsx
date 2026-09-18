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
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Search,
} from 'lucide-react';
import { PageHeader, StatCard, ProgressBar } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';
import { mockStudent, mockCareerPaths, SkillItem } from '../../data/mockData';

export const SkillsPage: React.FC = () => {
  const { user, addSkill, updateSkill, deleteSkill } = useAuth();
  const navigate = useNavigate();
  const student = user?.studentProfile || mockStudent;

  const skills = student.skills || [];

  const [selectedRole, setSelectedRole] = useState<string>(student.targetCareer);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<'Programming' | 'AI & ML' | 'Databases & Web' | 'DevOps & Tools'>('Programming');
  const [formCurrentLevel, setFormCurrentLevel] = useState<number>(75);
  const [formRequiredLevel, setFormRequiredLevel] = useState<number>(85);
  const [formPriority, setFormPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [formAction, setFormAction] = useState('');

  const filteredSkills = skills.filter((s) => {
    const matchesCategory = categoryFilter === 'All' || s.category === categoryFilter;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const highPriorityGaps = skills.filter((s) => s.priority === 'High' && (s.gap ?? 0) > 0);
  const masteredSkills = skills.filter((s) => (s.gap ?? 0) <= 0);
  const averageProficiency = skills.length > 0
    ? Math.round(skills.reduce((acc, s) => acc + s.currentLevel, 0) / skills.length)
    : 0;

  const handleRecalculate = async () => {
    setIsRecalculating(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsRecalculating(false);
  };

  const openAddModal = () => {
    setFormName('');
    setFormCategory('Programming');
    setFormCurrentLevel(70);
    setFormRequiredLevel(85);
    setFormPriority('High');
    setFormAction('Complete hands-on implementation project');
    setIsAddModalOpen(true);
  };

  const openEditModal = (skill: SkillItem) => {
    setSelectedSkill(skill);
    setFormName(skill.name);
    setFormCategory(skill.category as any);
    setFormCurrentLevel(skill.currentLevel);
    setFormRequiredLevel(skill.requiredLevel ?? 80);
    setFormPriority(skill.priority ?? 'Medium');
    setFormAction(skill.action || '');
    setIsEditModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    addSkill({
      name: formName.trim(),
      category: formCategory,
      currentLevel: Number(formCurrentLevel),
      requiredLevel: Number(formRequiredLevel),
      gap: Number(formRequiredLevel) - Number(formCurrentLevel),
      priority: formPriority,
      action: formAction.trim() || 'Work through practical problems and code repos',
      proficiency: Number(formCurrentLevel) >= 80 ? 'Advanced' : Number(formCurrentLevel) >= 60 ? 'Intermediate' : 'Beginner',
      trend: 'up',
    });

    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkill) return;

    updateSkill(selectedSkill.id, {
      name: formName.trim(),
      category: formCategory,
      currentLevel: Number(formCurrentLevel),
      requiredLevel: Number(formRequiredLevel),
      priority: formPriority,
      action: formAction.trim(),
    });

    setIsEditModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Remove ${name} from your technical skills profile?`)) {
      deleteSkill(id);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <PageHeader
        title="Skill Gap Analyzer & Competency Matrix"
        subtitle={`Dynamic evaluation of technical skills against industry benchmarks for ${student.targetCareer}.`}
        badge="Adaptive Calibration"
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={openAddModal}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/30 shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Technical Skill</span>
            </button>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-[#0F1420] border border-[#1E2638] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
            >
              {mockCareerPaths.map((c) => (
                <option key={c.id} value={c.title}>
                  Benchmark: {c.title}
                </option>
              ))}
            </select>

            <button
              onClick={handleRecalculate}
              disabled={isRecalculating}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#151D2E] hover:bg-[#1D273D] text-slate-200 border border-[#24314A] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin text-indigo-400' : ''}`} />
              <span className="hidden sm:inline">Sync Gaps</span>
            </button>
          </div>
        }
      />

      {/* Visual Diagnostic Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0F1424] via-[#0E1526] to-[#0A0D15] border border-[#1E273D] shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1A2336] mb-5 gap-2">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
              Diagnostic Framework
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
              Closed-Loop Gap Resolution Pipeline
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Student Roll No: <strong className="text-indigo-300">{student.rollNumber}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative">
          <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293E]">
            <span className="text-[10px] font-mono uppercase text-slate-400">Step 1</span>
            <h3 className="text-sm font-bold text-white mt-1">CURRENT LEVEL</h3>
            <p className="text-xs text-slate-400 mt-1">Real-time student competency score based on {skills.length} tracked skills.</p>
            <div className="mt-3 text-lg font-bold text-indigo-400 font-mono">{averageProficiency}% Avg</div>
          </div>

          <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293E]">
            <span className="text-[10px] font-mono uppercase text-slate-400">Step 2</span>
            <h3 className="text-sm font-bold text-white mt-1">REQUIRED LEVEL</h3>
            <p className="text-xs text-slate-400 mt-1">Market hiring threshold for {selectedRole}.</p>
            <div className="mt-3 text-lg font-bold text-cyan-400 font-mono">88% Target</div>
          </div>

          <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293E]">
            <span className="text-[10px] font-mono uppercase text-slate-400">Step 3</span>
            <h3 className="text-sm font-bold text-white mt-1">SKILL GAP</h3>
            <p className="text-xs text-slate-400 mt-1">Differential deficit calculated across each tracked competency.</p>
            <div className="mt-3 text-lg font-bold text-rose-400 font-mono">
              {highPriorityGaps.length} Critical Gaps
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#111726] border border-indigo-500/30 bg-indigo-950/20">
            <span className="text-[10px] font-mono uppercase text-indigo-300 font-bold">Step 4</span>
            <h3 className="text-sm font-bold text-white mt-1">RECOMMENDED ACTION</h3>
            <p className="text-xs text-indigo-200 mt-1">Personalized capstones and targeted project assignments.</p>
            <div
              className="mt-3 text-xs font-semibold text-indigo-300 flex items-center gap-1 cursor-pointer hover:underline"
              onClick={() => navigate('/dashboard/projects')}
            >
              <span>Explore Projects →</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Critical Gaps"
          value={highPriorityGaps.length}
          change={highPriorityGaps.length > 0 ? 'Action required' : 'Optimal'}
          changeType={highPriorityGaps.length > 0 ? 'negative' : 'positive'}
          subtext="High-priority requirements"
          icon={AlertCircle}
          accentColor="rose"
        />
        <StatCard
          title="Mastered Competencies"
          value={masteredSkills.length}
          change="At or above target"
          changeType="positive"
          subtext="Verified production readiness"
          icon={CheckCircle2}
          accentColor="emerald"
        />
        <StatCard
          title="Overall Skill Readiness"
          value={`${averageProficiency}%`}
          change={`Calibrated for ${student.targetCareer}`}
          changeType="positive"
          subtext={`Across ${skills.length} active skills`}
          icon={TrendingUp}
          accentColor="indigo"
        />
      </div>

      {/* Main Skill Matrix Table */}
      <div className="rounded-2xl bg-[#0D111A] border border-[#1B2232] p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Technical Competencies</span>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Live Competency &amp; Gap Matrix ({filteredSkills.length} Skills)
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skill..."
                className="bg-[#121826] border border-[#1D273C] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#121826] p-1 rounded-lg border border-[#1D273C]">
              {['All', 'Programming', 'AI & ML', 'Databases & Web', 'DevOps & Tools'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
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
        </div>

        <div className="space-y-3">
          {filteredSkills.map((skill) => {
            const hasDeficit = (skill.gap ?? 0) > 0;
            return (
              <div
                key={skill.id}
                className="p-4 rounded-xl bg-[#111726] border border-[#1C263B] hover:border-indigo-500/40 transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white">{skill.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#161F33] text-indigo-300 border border-indigo-500/20">
                      {skill.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        skill.priority === 'High'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : skill.priority === 'Medium'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}
                    >
                      {skill.priority} Priority
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <div className="flex items-center gap-3 text-xs font-mono mr-2">
                      <span className="text-slate-400">
                        Current: <strong className="text-white">{skill.currentLevel}%</strong>
                      </span>
                      <span className="text-slate-500">|</span>
                      <span className="text-slate-400">
                        Required: <strong className="text-cyan-400">{skill.requiredLevel}%</strong>
                      </span>
                      <span className="text-slate-500">|</span>
                      <span className={hasDeficit ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                        {hasDeficit ? `-${skill.gap}% Deficit` : 'Target Met ✓'}
                      </span>
                    </div>

                    <button
                      onClick={() => openEditModal(skill)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors"
                      title="Edit Skill"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id, skill.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Skill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Proficiency Benchmark</span>
                    <span>{skill.currentLevel} / 100</span>
                  </div>
                  <ProgressBar
                    progress={skill.currentLevel}
                    color={hasDeficit ? (skill.priority === 'High' ? 'rose' : 'amber') : 'emerald'}
                  />
                </div>

                {skill.action && (
                  <div className="mt-3 pt-2.5 border-t border-[#182236] flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                      <Sparkles className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                      <span>{skill.action}</span>
                    </span>
                    <button
                      onClick={() => navigate('/dashboard/projects')}
                      className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Find Project</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {filteredSkills.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs rounded-xl bg-[#111624] border border-[#1C2538]">
              No skills found for this filter. Click "Add Technical Skill" to create a new one.
            </div>
          )}
        </div>
      </div>

      {/* Add Skill Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0E131E] border border-[#1E2638] rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A2234] mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Add Technical Skill
                </h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. FastAPI, Kubernetes, GraphQL"
                  className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Programming">Programming</option>
                    <option value="AI & ML">AI &amp; ML</option>
                    <option value="Databases & Web">Databases &amp; Web</option>
                    <option value="DevOps & Tools">DevOps &amp; Tools</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Priority</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Current Level (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formCurrentLevel}
                    onChange={(e) => setFormCurrentLevel(Number(e.target.value))}
                    className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Required Level (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formRequiredLevel}
                    onChange={(e) => setFormRequiredLevel(Number(e.target.value))}
                    className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Recommended Action</label>
                <input
                  type="text"
                  value={formAction}
                  onChange={(e) => setFormAction(e.target.value)}
                  placeholder="e.g. Build asynchronous event bus capstone"
                  className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1A2234]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-[#141B2B] hover:bg-[#1A2338] border border-[#232F4A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white font-semibold bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save Skill</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Skill Modal */}
      {isEditModalOpen && selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0E131E] border border-[#1E2638] rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A2234] mb-4">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Edit Skill: {selectedSkill.name}
                </h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Programming">Programming</option>
                    <option value="AI & ML">AI &amp; ML</option>
                    <option value="Databases & Web">Databases &amp; Web</option>
                    <option value="DevOps & Tools">DevOps &amp; Tools</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Priority</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Current Level (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formCurrentLevel}
                    onChange={(e) => setFormCurrentLevel(Number(e.target.value))}
                    className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Required Level (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formRequiredLevel}
                    onChange={(e) => setFormRequiredLevel(Number(e.target.value))}
                    className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Recommended Action</label>
                <input
                  type="text"
                  value={formAction}
                  onChange={(e) => setFormAction(e.target.value)}
                  className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1A2234]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-[#141B2B] hover:bg-[#1A2338] border border-[#232F4A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white font-semibold bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Skill</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
