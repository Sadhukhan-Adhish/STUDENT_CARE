import React, { useState } from 'react';
import {
  FolderGit2,
  ExternalLink,
  Github,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  Filter,
  Edit2,
  Trash2,
  X,
  Save,
  Search,
} from 'lucide-react';
import { PageHeader, StatCard, ProgressBar } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';
import { mockStudent, ProjectItem } from '../../data/mockData';

export const ProjectsPage: React.FC = () => {
  const { user, addProject, updateProject, deleteProject } = useAuth();
  const student = user?.studentProfile || mockStudent;
  const projects = student.projects || [];

  const [filterTab, setFilterTab] = useState<'All' | 'Recommended' | 'In Progress' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState<'Full Stack' | 'AI / ML' | 'Distributed Systems' | 'DevOps & Cloud'>('Full Stack');
  const [formDifficulty, setFormDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [formStatus, setFormStatus] = useState<'In Progress' | 'Completed' | 'Recommended'>('In Progress');
  const [formProgress, setFormProgress] = useState<number>(30);
  const [formTech, setFormTech] = useState('React, TypeScript, Node.js');
  const [formGap, setFormGap] = useState('Builds production portfolio credentials');
  const [formGithub, setFormGithub] = useState('');
  const [formDemo, setFormDemo] = useState('');

  const filteredProjects = projects.filter((p) => {
    const matchesTab = filterTab === 'All' || p.status === filterTab;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const completedCount = projects.filter((p) => p.status === 'Completed').length;
  const inProgressCount = projects.filter((p) => p.status === 'In Progress').length;
  const recommendedCount = projects.filter((p) => p.status === 'Recommended').length;

  const handleStartProject = (projectId: string) => {
    updateProject(projectId, { status: 'In Progress', progress: 15 });
  };

  const handleCompleteProject = (projectId: string) => {
    updateProject(projectId, { status: 'Completed', progress: 100 });
  };

  const openAddModal = () => {
    setFormTitle('');
    setFormTagline('');
    setFormDescription('');
    setFormCategory('Full Stack');
    setFormDifficulty('Intermediate');
    setFormStatus('In Progress');
    setFormProgress(25);
    setFormTech('React, TypeScript, Tailwind');
    setFormGap(`Resolves ${student.targetCareer} portfolio requirement`);
    setFormGithub(user?.isGuest ? 'https://github.com/sample-student' : '');
    setFormDemo('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (project: ProjectItem) => {
    setSelectedProject(project);
    setFormTitle(project.title);
    setFormTagline(project.tagline || '');
    setFormDescription(project.description);
    setFormCategory(project.category as any);
    setFormDifficulty(project.difficulty as any);
    setFormStatus(project.status as any);
    setFormProgress(project.progress ?? 0);
    setFormTech(project.technologies.join(', '));
    setFormGap(project.skillGapAddressed || '');
    setFormGithub(project.githubUrl || '');
    setFormDemo(project.demoUrl || '');
    setIsEditModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const techArray = formTech
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addProject({
      title: formTitle.trim(),
      tagline: formTagline.trim(),
      description: formDescription.trim(),
      category: formCategory,
      difficulty: formDifficulty,
      status: formStatus,
      progress: Number(formProgress),
      technologies: techArray.length > 0 ? techArray : ['TypeScript', 'React'],
      skillsCovered: techArray,
      skillGapAddressed: formGap.trim() || 'General software engineering validation',
      estimatedHours: 25,
      githubUrl: formGithub.trim() || undefined,
      demoUrl: formDemo.trim() || undefined,
    });

    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    const techArray = formTech
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    updateProject(selectedProject.id, {
      title: formTitle.trim(),
      tagline: formTagline.trim(),
      description: formDescription.trim(),
      category: formCategory,
      difficulty: formDifficulty,
      status: formStatus,
      progress: Number(formProgress),
      technologies: techArray,
      skillsCovered: techArray,
      skillGapAddressed: formGap.trim(),
      githubUrl: formGithub.trim() || undefined,
      demoUrl: formDemo.trim() || undefined,
    });

    setIsEditModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete project "${title}" from your portfolio?`)) {
      deleteProject(id);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <PageHeader
        title="Project Lab &amp; Portfolios"
        subtitle={`Proof-of-work assignments and completed implementations eliminating skill deficits for ${student.targetCareer}.`}
        badge={user?.isGuest ? 'Guest Exploration' : `Roll No: ${student.rollNumber}`}
        actions={
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/30 shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Portfolio Project</span>
          </button>
        }
      />

      {/* First-Time Student Guidance Bar */}
      <div className="p-3.5 rounded-xl bg-[#0F1424] border border-[#1B253D] flex items-center gap-3 text-xs text-slate-300">
        <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 flex-shrink-0">
          <FolderGit2 className="w-4 h-4" />
        </div>
        <p className="leading-relaxed">
          <strong className="text-white font-medium">Projects Guidance:</strong> Hands-on projects convert academic theory into verified proof-of-work. Start recommended capstones calibrated for {student.targetCareer} or log your own repository builds to address highlighted skill deficits.
        </p>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="In Progress Projects"
          value={inProgressCount}
          change="Active lab work"
          changeType="positive"
          subtext="Currently building"
          icon={FolderGit2}
          accentColor="indigo"
        />
        <StatCard
          title="Completed Projects"
          value={completedCount}
          change="Verified on GitHub"
          changeType="positive"
          subtext="Proof of competence"
          icon={CheckCircle2}
          accentColor="emerald"
        />
        <StatCard
          title="Recommended Next"
          value={recommendedCount}
          change="Gap targeted"
          changeType="neutral"
          subtext="Calibrated by AI"
          icon={Sparkles}
          accentColor="purple"
        />
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 bg-[#121826] p-1 rounded-lg border border-[#1D273C]">
          {(['All', 'In Progress', 'Recommended', 'Completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                filterTab === tab
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects or technologies..."
            className="w-full bg-[#121826] border border-[#1D273C] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          const isCompleted = project.status === 'Completed';
          const isInProgress = project.status === 'In Progress';
          const isRecommended = project.status === 'Recommended';

          return (
            <div
              key={project.id}
              className="rounded-2xl bg-[#0D111A] border border-[#1C2538] hover:border-indigo-500/40 p-6 shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {project.category}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        project.difficulty === 'Advanced'
                          ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                          : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                      }`}
                    >
                      {project.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        isCompleted
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                          : isInProgress
                          ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      }`}
                    >
                      {project.status}
                    </span>

                    <button
                      onClick={() => openEditModal(project)}
                      className="p-1 rounded text-slate-400 hover:text-indigo-300 transition-colors"
                      title="Edit Project"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id, project.title)}
                      className="p-1 rounded text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white leading-snug">{project.title}</h3>
                <p className="text-xs text-indigo-300/90 font-medium mt-1">{project.tagline}</p>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">{project.description}</p>

                {/* Skill Gap addressed callout */}
                {project.skillGapAddressed && (
                  <div className="mt-4 p-2.5 rounded-lg bg-[#121826] border border-[#1E293E] text-xs">
                    <span className="text-[10px] font-mono uppercase text-indigo-400 font-semibold block mb-0.5">
                      Skill Gap Addressed:
                    </span>
                    <span className="text-slate-300">{project.skillGapAddressed}</span>
                  </div>
                )}

                {/* Tech stack */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#141A29] text-slate-300 border border-[#20293D]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#182132]">
                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                    <span>Implementation Progress</span>
                    <span className="text-white font-bold">{project.progress}%</span>
                  </div>
                  <ProgressBar
                    progress={project.progress}
                    color={isCompleted ? 'emerald' : 'indigo'}
                  />
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Source</span>
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isRecommended && (
                      <button
                        onClick={() => handleStartProject(project.id)}
                        className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/30 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>Start Lab</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {isInProgress && (
                      <button
                        onClick={() => handleCompleteProject(project.id)}
                        className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/30 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Complete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="col-span-2 p-12 text-center text-slate-400 text-xs rounded-2xl bg-[#0D111A] border border-[#1C2538]">
            No projects found matching the filter. Click "Add Portfolio Project" to create one.
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0E131E] border border-[#1E2638] rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A2234] mb-4">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Add Portfolio Project
                </h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Distributed Key-Value Store"
                  className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Tagline / Subtitle</label>
                <input
                  type="text"
                  value={formTagline}
                  onChange={(e) => setFormTagline(e.target.value)}
                  placeholder="e.g. Raft consensus protocol with persistent log engine"
                  className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="AI / ML">AI / ML</option>
                    <option value="Distributed Systems">Distributed Systems</option>
                    <option value="DevOps & Cloud">DevOps &amp; Cloud</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Difficulty</label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value as any)}
                    className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Recommended">Recommended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Technologies (Comma separated)</label>
                <input
                  type="text"
                  value={formTech}
                  onChange={(e) => setFormTech(e.target.value)}
                  placeholder="e.g. Go, gRPC, Docker, Raft"
                  className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Skill Gap Target</label>
                <input
                  type="text"
                  value={formGap}
                  onChange={(e) => setFormGap(e.target.value)}
                  placeholder="e.g. Distributed Consensus (+25%)"
                  className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Project Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Architecture details, benchmark throughput, and technical trade-offs..."
                  className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={formGithub}
                    onChange={(e) => setFormGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    value={formDemo}
                    onChange={(e) => setFormDemo(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
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
                  <span>Save Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {isEditModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0E131E] border border-[#1E2638] rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A2234] mb-4">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Edit Project: {selectedProject.title}
                </h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Tagline</label>
                <input
                  type="text"
                  value={formTagline}
                  onChange={(e) => setFormTagline(e.target.value)}
                  className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="AI / ML">AI / ML</option>
                    <option value="Distributed Systems">Distributed Systems</option>
                    <option value="DevOps & Cloud">DevOps &amp; Cloud</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Recommended">Recommended</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Progress ({formProgress}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formProgress}
                    onChange={(e) => setFormProgress(Number(e.target.value))}
                    className="w-full accent-indigo-600 mt-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Technologies (Comma separated)</label>
                <input
                  type="text"
                  value={formTech}
                  onChange={(e) => setFormTech(e.target.value)}
                  className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Skill Gap Target</label>
                <input
                  type="text"
                  value={formGap}
                  onChange={(e) => setFormGap(e.target.value)}
                  className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Project Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={formGithub}
                    onChange={(e) => setFormGithub(e.target.value)}
                    className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    value={formDemo}
                    onChange={(e) => setFormDemo(e.target.value)}
                    className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
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
                  <span>Update Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
