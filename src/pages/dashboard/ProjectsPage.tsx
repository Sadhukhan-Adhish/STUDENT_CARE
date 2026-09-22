import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Search,
  Code2,
  Lightbulb,
  Link as LinkIcon,
  Tag,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { PageHeader, StatCard, ProgressBar } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';
import { mockStudent, ProjectItem, ProjectStatus, SkillItem } from '../../data/mockData';

export const ProjectsPage: React.FC = () => {
  const { user, addProject, updateProject, deleteProject } = useAuth();
  const navigate = useNavigate();
  const student = user?.studentProfile || mockStudent;

  const projects: ProjectItem[] = student.projects || [];
  const currentSkills: SkillItem[] = student.skills || [];

  // Filter tabs
  const [filterTab, setFilterTab] = useState<'All' | ProjectStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<ProjectStatus>('In Progress');
  const [formTechInput, setFormTechInput] = useState('');
  const [formSelectedSkills, setFormSelectedSkills] = useState<string[]>([]);
  const [formCustomSkillInput, setFormCustomSkillInput] = useState('');
  const [formGithubUrl, setFormGithubUrl] = useState('');
  const [formDemoUrl, setFormDemoUrl] = useState('');

  // Lock body scroll when Add or Edit project modal is open
  useEffect(() => {
    if (isAddModalOpen || isEditModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isAddModalOpen, isEditModalOpen]);

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const projectTitle = p.name || p.title || '';
    const matchesTab = filterTab === 'All' || p.status === filterTab;
    const matchesSearch =
      projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.technologies && p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (p.skillsUsed && p.skillsUsed.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesTab && matchesSearch;
  });

  // Metrics
  const completedCount = projects.filter((p) => p.status === 'Completed').length;
  const inProgressCount = projects.filter((p) => p.status === 'In Progress').length;
  const ideaCount = projects.filter((p) => p.status === 'Idea' || p.status === 'Planned').length;

  // Status helper colors
  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/12 text-emerald-400 border-emerald-500/25';
      case 'In Progress':
        return 'bg-[#D89B5B]/12 text-[#E8B47E] border-[#D89B5B]/30';
      case 'Idea':
        return 'bg-[#67C5B8]/12 text-[#7CD4C8] border-[#67C5B8]/30';
      case 'Planned':
        return 'bg-[#1E2838] text-[#9AA5B1] border-[#2B394E]';
      case 'Recommended':
      default:
        return 'bg-[#D89B5B]/12 text-[#E8B47E] border-[#D89B5B]/25';
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    setFormName('');
    setFormDescription('');
    setFormStatus('In Progress');
    setFormTechInput('');
    setFormSelectedSkills([]);
    setFormCustomSkillInput('');
    setFormGithubUrl(user?.isGuest ? 'https://github.com/sample-student/new-project' : '');
    setFormDemoUrl('');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (project: ProjectItem) => {
    setSelectedProject(project);
    setFormName(project.name || project.title || '');
    setFormDescription(project.description || '');
    setFormStatus(project.status || 'In Progress');
    setFormTechInput((project.technologies || project.techStack || []).join(', '));
    setFormSelectedSkills(project.skillsUsed || project.skillsCovered || []);
    setFormCustomSkillInput('');
    setFormGithubUrl(project.githubUrl || project.githubLink || '');
    setFormDemoUrl(project.demoUrl || project.projectLink || '');
    setIsEditModalOpen(true);
  };

  // Toggle skill selection in form
  const toggleSkillSelection = (skillName: string) => {
    if (formSelectedSkills.includes(skillName)) {
      setFormSelectedSkills(formSelectedSkills.filter((s) => s !== skillName));
    } else {
      setFormSelectedSkills([...formSelectedSkills, skillName]);
    }
  };

  // Add custom skill to skills used
  const handleAddCustomSkill = () => {
    const trimmed = formCustomSkillInput.trim();
    if (trimmed && !formSelectedSkills.includes(trimmed)) {
      setFormSelectedSkills([...formSelectedSkills, trimmed]);
      setFormCustomSkillInput('');
    }
  };

  // Save Add
  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const techArray = formTechInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addProject({
      title: formName.trim(),
      name: formName.trim(),
      description: formDescription.trim(),
      status: formStatus,
      technologies: techArray.length > 0 ? techArray : formSelectedSkills,
      techStack: techArray.length > 0 ? techArray : formSelectedSkills,
      skillsUsed: formSelectedSkills,
      skillsCovered: formSelectedSkills,
      githubUrl: formGithubUrl.trim() || undefined,
      githubLink: formGithubUrl.trim() || undefined,
      demoUrl: formDemoUrl.trim() || undefined,
      projectLink: formDemoUrl.trim() || undefined,
      progress: formStatus === 'Completed' ? 100 : formStatus === 'In Progress' ? 50 : 0,
    });

    setIsAddModalOpen(false);
  };

  // Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !formName.trim()) return;

    const techArray = formTechInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    updateProject(selectedProject.id, {
      title: formName.trim(),
      name: formName.trim(),
      description: formDescription.trim(),
      status: formStatus,
      technologies: techArray.length > 0 ? techArray : formSelectedSkills,
      techStack: techArray.length > 0 ? techArray : formSelectedSkills,
      skillsUsed: formSelectedSkills,
      skillsCovered: formSelectedSkills,
      githubUrl: formGithubUrl.trim() || undefined,
      githubLink: formGithubUrl.trim() || undefined,
      demoUrl: formDemoUrl.trim() || undefined,
      projectLink: formDemoUrl.trim() || undefined,
      progress: formStatus === 'Completed' ? 100 : selectedProject.progress ?? (formStatus === 'In Progress' ? 50 : 0),
    });

    setIsEditModalOpen(false);
  };

  // Quick Status change
  const handleQuickStatusChange = (projectId: string, newStatus: ProjectStatus) => {
    updateProject(projectId, {
      status: newStatus,
      progress: newStatus === 'Completed' ? 100 : newStatus === 'In Progress' ? 50 : 0,
    });
  };

  // Delete project
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete project "${name}" from your portfolio?`)) {
      deleteProject(id);
    }
  };

  return (
    <div className="space-y-8 pb-16 font-sans">
      <PageHeader
        title="Project Showcase & Applied Experience"
        subtitle="Tangible software projects demonstrating practical mastery of your technical skills."
        badge={user?.isGuest ? 'Guest Showcase' : 'Verified Student Portfolio'}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={openAddModal}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] border border-[#E8B47E]/40 shadow-sm transition-all duration-150 flex items-center gap-1.5 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-3.5 h-3.5 text-[#0B0F14]" />
              <span>Add Project</span>
            </button>
          </div>
        }
      />

      {/* Project ↔ Skill Connection Explanatory Banner */}
      <div className="p-4 rounded-xl bg-[#151D26] border border-[#222E3C] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#D89B5B]/15 text-[#D89B5B] flex-shrink-0 mt-0.5">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-[#F3F0E8] uppercase tracking-wider">
                Skill Application Bridge
              </h3>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#D89B5B]/15 text-[#E8B47E] border border-[#D89B5B]/25">
                UNNEXA Connected
              </span>
            </div>
            <p className="text-xs text-[#9AA5B1] mt-1 leading-relaxed">
              Every project links directly to your <strong>Current Skills</strong>. Linking skills shows hiring reviewers how and where you applied each competency in production code.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/dashboard/skills')}
          className="self-start sm:self-center px-3 py-1.5 rounded-lg text-xs font-medium text-[#D89B5B] hover:text-[#F3F0E8] bg-[#D89B5B]/10 hover:bg-[#D89B5B]/20 border border-[#D89B5B]/30 flex items-center gap-1.5 cursor-pointer transition-all duration-150 whitespace-nowrap hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>View Skills Matrix</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Projects"
          value={projects.length}
          change={projects.length > 0 ? `${completedCount} Completed` : 'None logged yet'}
          changeType={projects.length > 0 ? 'positive' : 'neutral'}
          subtext="In your personal showcase"
          icon={FolderGit2}
          accentColor="copper"
        />
        <StatCard
          title="In Active Development"
          value={inProgressCount}
          change={inProgressCount > 0 ? 'Active builds' : 'Ready to start'}
          changeType={inProgressCount > 0 ? 'positive' : 'neutral'}
          subtext="Currently progressing"
          icon={Clock}
          accentColor="teal"
        />
        <StatCard
          title="Project Ideas & Planned"
          value={ideaCount}
          change={ideaCount > 0 ? 'Upcoming pipeline' : 'Add ideas'}
          changeType="neutral"
          subtext="Future technical builds"
          icon={Lightbulb}
          accentColor="copper"
        />
      </div>

      {/* Project Filter & List Container */}
      <div className="rounded-2xl bg-[#151D26] border border-[#222E3C] p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1E2938]">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#9AA5B1]">
              Student Portfolio
            </span>
            <h2 className="text-lg font-bold text-[#F3F0E8] mt-0.5">
              Project Showcase ({filteredProjects.length} Projects)
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#9AA5B1] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, tech, or skills..."
                className="bg-[#0E151E] border border-[#202C3B] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#F3F0E8] placeholder-[#768393] focus:outline-none focus:border-[#D89B5B] transition-colors"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#0E151E] p-1 rounded-lg border border-[#202C3B] overflow-x-auto">
              {(['All', 'In Progress', 'Completed', 'Idea', 'Planned'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all duration-150 cursor-pointer whitespace-nowrap ${
                    filterTab === tab
                      ? 'bg-[#D89B5B] text-[#0B0F14] font-semibold shadow-sm'
                      : 'text-[#9AA5B1] hover:text-[#F3F0E8]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              onClick={openAddModal}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] transition-all duration-150 flex items-center gap-1 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-[#0B0F14]" />
              <span>Add Project</span>
            </button>
          </div>
        </div>

        {/* Empty State for registered student with no projects */}
        {projects.length === 0 ? (
          <div className="p-8 sm:p-12 text-center rounded-2xl bg-[#121922] border border-dashed border-[#222E3C] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D89B5B]/10 border border-[#D89B5B]/25 text-[#D89B5B] mx-auto flex items-center justify-center">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-base font-bold text-[#F3F0E8]">No Projects in Your Portfolio Yet</h3>
              <p className="text-xs text-[#9AA5B1] mt-2 leading-relaxed">
                Projects demonstrate how you practically apply your technical skills in real applications. Add your semester capstones, personal experiments, or hackathon builds, and tag the skills you used to build a compelling developer profile.
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] border border-[#E8B47E]/40 shadow-sm transition-all duration-150 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-4 h-4 text-[#0B0F14]" />
              <span>Add Your First Project</span>
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-8 text-center text-[#9AA5B1] text-xs rounded-xl bg-[#121922] border border-[#222E3C]">
            No projects found matching &ldquo;{searchQuery || filterTab}&rdquo;. Try another filter or search term.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredProjects.map((project) => {
              const title = project.name || project.title || 'Untitled Project';
              const techList = project.technologies || project.techStack || [];
              const skillsList = project.skillsUsed || project.skillsCovered || [];
              const github = project.githubUrl || project.githubLink;
              const demo = project.demoUrl || project.projectLink;

              return (
                <div
                  key={project.id}
                  className="p-5 rounded-xl bg-[#121922] border border-[#1E2A38] hover:border-[#D89B5B]/40 transition-all duration-150 hover:-translate-y-0.5 flex flex-col justify-between space-y-4 group shadow-sm hover:shadow-md"
                >
                  <div className="space-y-3">
                    {/* Header: Title + Status + Quick status selector */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-[#F3F0E8] group-hover:text-[#D89B5B] transition-colors duration-150">
                          {title}
                        </h3>
                        {project.tagline && (
                          <p className="text-xs text-[#9AA5B1] mt-0.5">{project.tagline}</p>
                        )}
                      </div>

                      {/* Status Dropdown/Badge */}
                      <div className="flex items-center gap-2">
                        <select
                          value={project.status}
                          onChange={(e) => handleQuickStatusChange(project.id, e.target.value as ProjectStatus)}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border focus:outline-none cursor-pointer bg-[#0E151E] ${getStatusBadge(
                            project.status
                          )}`}
                        >
                          <option value="Idea">Idea</option>
                          <option value="Planned">Planned</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>

                    {/* Description */}
                    {project.description && (
                      <p className="text-xs text-[#9AA5B1] leading-relaxed">
                        {project.description}
                      </p>
                    )}

                    {/* Technologies Used */}
                    {techList.length > 0 && (
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#768393] block mb-1.5">
                          Technologies Used:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {techList.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#16202B] text-[#D89B5B] border border-[#D89B5B]/20"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills Used (Connected with Skills section) */}
                    {skillsList.length > 0 && (
                      <div className="p-3 rounded-lg bg-[#0E151E] border border-[#1E2A38] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase text-[#D89B5B] font-semibold flex items-center gap-1">
                            <LinkIcon className="w-3 h-3" />
                            <span>Skills Applied in this Project:</span>
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {skillsList.map((skillName, idx) => {
                            const isTracked = currentSkills.some(
                              (s) => s.name.toLowerCase() === skillName.toLowerCase()
                            );
                            return (
                              <span
                                key={idx}
                                className={`px-2 py-0.5 rounded-full text-[10px] font-mono flex items-center gap-1 border ${
                                  isTracked
                                    ? 'bg-[#67C5B8]/12 text-[#7CD4C8] border-[#67C5B8]/30'
                                    : 'bg-[#182330] text-[#9AA5B1] border-[#27384B]'
                                }`}
                                title={isTracked ? 'Matched in your Current Skills' : 'Skill specified for this project'}
                              >
                                {isTracked && <span className="w-1.5 h-1.5 rounded-full bg-[#67C5B8]" />}
                                <span>{skillName}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Links + Edit/Delete Actions */}
                  <div className="pt-3 border-t border-[#1E2938] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      {github && (
                        <a
                          href={github}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[#9AA5B1] hover:text-[#F3F0E8] transition-colors"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Repository</span>
                        </a>
                      )}
                      {demo && (
                        <a
                          href={demo}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[#67C5B8] hover:text-[#7CD4C8] transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Live Demo</span>
                        </a>
                      )}
                      {!github && !demo && (
                        <span className="text-[11px] text-[#768393] italic">No links attached</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(project)}
                        className="p-1.5 rounded-lg text-[#9AA5B1] hover:text-[#D89B5B] hover:bg-[#D89B5B]/10 transition-colors cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id, title)}
                        className="p-1.5 rounded-lg text-[#9AA5B1] hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete Project"
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
      </div>

      {/* ========================================================== */}
      {/* MODALS: ADD / EDIT PROJECT */}
      {/* ========================================================== */}

      {/* Add Project Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddModalOpen(false);
          }}
        >
          <div
            className="bg-[#151D26] border border-[#27384B] rounded-2xl w-full max-w-[calc(100vw-1.5rem)] sm:max-w-xl md:max-w-2xl max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-3rem)] shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#1E2938] flex-shrink-0 bg-[#151D26]">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div className="w-7 h-7 rounded-lg bg-[#D89B5B]/15 border border-[#D89B5B]/30 text-[#D89B5B] flex items-center justify-center flex-shrink-0">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-[#F3F0E8] uppercase tracking-wider truncate">
                  Add New Project
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#9AA5B1] hover:text-[#F3F0E8] p-1.5 rounded-lg hover:bg-[#1E2A38] transition-colors cursor-pointer flex-shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <form onSubmit={handleSaveAdd} className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-4 space-y-4 text-xs overscroll-contain">
                <div>
                  <label className="block text-[#9AA5B1] font-medium mb-1.5">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. AI Study Assistant, Autonomous Delivery Drone, Smart Finance Dashboard"
                    className="w-full bg-[#0E151E] border border-[#202C3B] rounded-lg px-3 py-2.5 text-[#F3F0E8] placeholder-[#768393] text-xs focus:outline-none focus:border-[#D89B5B] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[#9AA5B1] font-medium mb-1.5">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Explain what the project does, key features, architecture, and what challenges you solved..."
                    className="w-full bg-[#0E151E] border border-[#202C3B] rounded-lg px-3 py-2.5 text-[#F3F0E8] placeholder-[#768393] text-xs focus:outline-none focus:border-[#D89B5B] leading-relaxed transition-colors min-h-[72px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[#9AA5B1] font-medium mb-1.5">Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as ProjectStatus)}
                      className="w-full bg-[#0E151E] border border-[#202C3B] rounded-lg px-3 py-2.5 text-[#F3F0E8] text-xs focus:outline-none focus:border-[#D89B5B] transition-colors cursor-pointer"
                    >
                      <option value="Idea">Idea</option>
                      <option value="Planned">Planned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#9AA5B1] font-medium mb-1.5">
                      Technologies Used (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formTechInput}
                      onChange={(e) => setFormTechInput(e.target.value)}
                      placeholder="React, TypeScript, FastAPI, PostgreSQL"
                      className="w-full bg-[#0E151E] border border-[#202C3B] rounded-lg px-3 py-2.5 text-[#F3F0E8] placeholder-[#768393] text-xs focus:outline-none focus:border-[#D89B5B] transition-colors"
                    />
                  </div>
                </div>

                {/* Skills Used (Connected to student's current skills + custom skill) */}
                <div className="p-3.5 rounded-xl bg-[#0E151E] border border-[#202C3B] space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <label className="block text-[#F3F0E8] font-semibold text-xs">
                      Skills Used (Connected to Skills)
                    </label>
                    <span className="text-[10px] text-[#9AA5B1] font-mono px-2 py-0.5 rounded bg-[#151D26] border border-[#222E3C]">
                      {formSelectedSkills.length} selected
                    </span>
                  </div>

                  {/* Quick toggle chips from Current Skills */}
                  {currentSkills.length > 0 && (
                    <div>
                      <span className="text-[10px] text-[#9AA5B1] block mb-2">
                        Select from your Current Skills:
                      </span>
                      <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                        {currentSkills.map((skill) => {
                          const isSelected = formSelectedSkills.includes(skill.name);
                          return (
                            <button
                              type="button"
                              key={skill.id}
                              onClick={() => toggleSkillSelection(skill.name)}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-all duration-150 cursor-pointer break-words text-left max-w-full ${
                                isSelected
                                  ? 'bg-[#D89B5B] border-[#D89B5B] text-[#0B0F14] font-semibold shadow-sm'
                                  : 'bg-[#151D26] border-[#222E3C] text-[#9AA5B1] hover:text-[#F3F0E8] hover:border-[#2F3F52]'
                              }`}
                            >
                              {isSelected ? '✓ ' : '+ '}
                              {skill.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Custom Skill Input */}
                  <div className="pt-2 border-t border-[#1C2634]">
                    <span className="text-[10px] text-[#9AA5B1] block mb-1.5">
                      Or add any custom skill manually:
                    </span>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        value={formCustomSkillInput}
                        onChange={(e) => setFormCustomSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomSkill();
                          }
                        }}
                        placeholder="e.g. Prompt Engineering, WebSockets"
                        className="w-full flex-1 bg-[#151D26] border border-[#222E3C] rounded-lg px-3 py-2 text-[#F3F0E8] placeholder-[#768393] text-xs focus:outline-none focus:border-[#D89B5B]"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomSkill}
                        className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#D89B5B] hover:bg-[#E4AB70] text-[#0B0F14] font-semibold text-xs cursor-pointer flex-shrink-0 transition-colors text-center"
                      >
                        Add Skill
                      </button>
                    </div>
                  </div>

                  {/* Selected Skills Chips */}
                  {formSelectedSkills.length > 0 && (
                    <div className="pt-2 border-t border-[#1C2634] flex flex-wrap gap-1.5">
                      {formSelectedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-[#67C5B8]/12 text-[#7CD4C8] border border-[#67C5B8]/30 flex items-center gap-1.5 max-w-full"
                        >
                          <span className="truncate max-w-[200px]">{skill}</span>
                          <button
                            type="button"
                            onClick={() => toggleSkillSelection(skill)}
                            className="hover:text-white p-0.5 -mr-0.5 rounded cursor-pointer"
                            aria-label={`Remove ${skill}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Links (Optional) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[#9AA5B1] font-medium mb-1.5">
                      GitHub Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={formGithubUrl}
                      onChange={(e) => setFormGithubUrl(e.target.value)}
                      placeholder="https://github.com/username/project"
                      className="w-full bg-[#0E151E] border border-[#202C3B] rounded-lg px-3 py-2.5 text-[#F3F0E8] placeholder-[#768393] text-xs focus:outline-none focus:border-[#D89B5B] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[#9AA5B1] font-medium mb-1.5">
                      Live Demo Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={formDemoUrl}
                      onChange={(e) => setFormDemoUrl(e.target.value)}
                      placeholder="https://my-project.preview.app"
                      className="w-full bg-[#0E151E] border border-[#202C3B] rounded-lg px-3 py-2.5 text-[#F3F0E8] placeholder-[#768393] text-xs focus:outline-none focus:border-[#D89B5B] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons Pinned at Bottom */}
              <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-t border-[#1E2938] bg-[#121922] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-full sm:w-auto min-h-[40px] px-4 py-2.5 rounded-xl bg-[#1A2430] hover:bg-[#223040] text-[#9AA5B1] hover:text-[#F3F0E8] font-medium text-xs transition-colors cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto min-h-[40px] px-5 py-2.5 rounded-xl bg-[#D89B5B] hover:bg-[#E4AB70] text-[#0B0F14] font-semibold text-xs cursor-pointer shadow-sm transition-all duration-150 text-center hover:-translate-y-0.5 active:translate-y-0"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {isEditModalOpen && selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsEditModalOpen(false);
          }}
        >
          <div
            className="bg-[#151D26] border border-[#27384B] rounded-2xl w-full max-w-[calc(100vw-1.5rem)] sm:max-w-xl md:max-w-2xl max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-3rem)] shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#1E2938] flex-shrink-0 bg-[#151D26]">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div className="w-7 h-7 rounded-lg bg-[#D89B5B]/15 border border-[#D89B5B]/30 text-[#D89B5B] flex items-center justify-center flex-shrink-0">
                  <Edit2 className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-[#F3F0E8] uppercase tracking-wider truncate">
                  Edit Project
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-[#9AA5B1] hover:text-[#F3F0E8] p-1.5 rounded-lg hover:bg-[#1E2A38] transition-colors cursor-pointer flex-shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <form onSubmit={handleSaveEdit} className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-4 space-y-4 text-xs overscroll-contain">
                <div>
                  <label className="block text-[#9AA5B1] font-medium mb-1.5">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-[#0E151E] border border-[#202C3B] rounded-lg px-3 py-2.5 text-[#F3F0E8] text-xs focus:outline-none focus:border-[#D89B5B] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[#9AA5B1] font-medium mb-1.5">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full bg-[#0E151E] border border-[#202C3B] rounded-lg px-3 py-2.5 text-[#F3F0E8] text-xs focus:outline-none focus:border-[#D89B5B] leading-relaxed transition-colors min-h-[72px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[#9AA5B1] font-medium mb-1.5">Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as ProjectStatus)}
                      className="w-full bg-[#0E151E] border border-[#202C3B] rounded-lg px-3 py-2.5 text-[#F3F0E8] text-xs focus:outline-none focus:border-[#D89B5B] transition-colors cursor-pointer"
                    >
                      <option value="Idea">Idea</option>
                      <option value="Planned">Planned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#9AA5B1] font-medium mb-1.5">
                      Technologies Used (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formTechInput}
                      onChange={(e) => setFormTechInput(e.target.value)}
                      className="w-full bg-[#0E151E] border border-[#202C3B] rounded-lg px-3 py-2.5 text-[#F3F0E8] text-xs focus:outline-none focus:border-[#D89B5B] transition-colors"
                    />
                  </div>
                </div>

                {/* Skills Used (Connected to student's current skills + custom skill) */}
                <div className="p-3.5 rounded-xl bg-[#0E151E] border border-[#202C3B] space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <label className="block text-[#F3F0E8] font-semibold text-xs">
                      Skills Used (Connected to Skills)
                    </label>
                    <span className="text-[10px] text-[#9AA5B1] font-mono px-2 py-0.5 rounded bg-[#151D26] border border-[#222E3C]">
                      {formSelectedSkills.length} selected
                    </span>
                  </div>

                  {/* Quick toggle chips from Current Skills */}
                  {currentSkills.length > 0 && (
                    <div>
                      <span className="text-[10px] text-[#9AA5B1] block mb-2">
                        Select from your Current Skills:
                      </span>
                      <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                        {currentSkills.map((skill) => {
                          const isSelected = formSelectedSkills.includes(skill.name);
                          return (
                            <button
                              type="button"
                              key={skill.id}
                              onClick={() => toggleSkillSelection(skill.name)}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-all duration-150 cursor-pointer break-words text-left max-w-full ${
                                isSelected
                                  ? 'bg-[#D89B5B] border-[#D89B5B] text-[#0B0F14] font-semibold shadow-sm'
                                  : 'bg-[#151D26] border-[#222E3C] text-[#9AA5B1] hover:text-[#F3F0E8] hover:border-[#2F3F52]'
                              }`}
                            >
                              {isSelected ? '✓ ' : '+ '}
                              {skill.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Custom Skill Input */}
                  <div className="pt-2 border-t border-[#1C2634]">
                    <span className="text-[10px] text-[#9AA5B1] block mb-1.5">
                      Or add any custom skill manually:
                    </span>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        value={formCustomSkillInput}
                        onChange={(e) => setFormCustomSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomSkill();
                          }
                        }}
                        placeholder="e.g. Prompt Engineering, WebSockets"
                        className="w-full flex-1 bg-[#151D26] border border-[#222E3C] rounded-lg px-3 py-2 text-[#F3F0E8] placeholder-[#768393] text-xs focus:outline-none focus:border-[#D89B5B]"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomSkill}
                        className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#D89B5B] hover:bg-[#E4AB70] text-[#0B0F14] font-semibold text-xs cursor-pointer flex-shrink-0 transition-colors text-center"
                      >
                        Add Skill
                      </button>
                    </div>
                  </div>

                  {/* Selected Skills Chips */}
                  {formSelectedSkills.length > 0 && (
                    <div className="pt-2 border-t border-[#1C2634] flex flex-wrap gap-1.5">
                      {formSelectedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-[#67C5B8]/12 text-[#7CD4C8] border border-[#67C5B8]/30 flex items-center gap-1.5 max-w-full"
                        >
                          <span className="truncate max-w-[200px]">{skill}</span>
                          <button
                            type="button"
                            onClick={() => toggleSkillSelection(skill)}
                            className="hover:text-white p-0.5 -mr-0.5 rounded cursor-pointer"
                            aria-label={`Remove ${skill}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Links (Optional) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[#9AA5B1] font-medium mb-1.5">
                      GitHub Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={formGithubUrl}
                      onChange={(e) => setFormGithubUrl(e.target.value)}
                      className="w-full bg-[#0E151E] border border-[#202C3B] rounded-lg px-3 py-2.5 text-[#F3F0E8] text-xs focus:outline-none focus:border-[#D89B5B] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[#9AA5B1] font-medium mb-1.5">
                      Live Demo Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={formDemoUrl}
                      onChange={(e) => setFormDemoUrl(e.target.value)}
                      className="w-full bg-[#0E151E] border border-[#202C3B] rounded-lg px-3 py-2.5 text-[#F3F0E8] text-xs focus:outline-none focus:border-[#D89B5B] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons Pinned at Bottom */}
              <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-t border-[#1E2938] bg-[#121922] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-full sm:w-auto min-h-[40px] px-4 py-2.5 rounded-xl bg-[#1A2430] hover:bg-[#223040] text-[#9AA5B1] hover:text-[#F3F0E8] font-medium text-xs transition-colors cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto min-h-[40px] px-5 py-2.5 rounded-xl bg-[#D89B5B] hover:bg-[#E4AB70] text-[#0B0F14] font-semibold text-xs cursor-pointer shadow-sm transition-all duration-150 text-center hover:-translate-y-0.5 active:translate-y-0"
                >
                  Update Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProjectsPage;
