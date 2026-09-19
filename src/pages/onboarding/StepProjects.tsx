import React, { useState } from 'react';
import { Plus, Trash2, Edit3, FolderGit2, Github, ExternalLink, X, AlertCircle } from 'lucide-react';
import { OnboardingData } from './types';
import { ProjectItem } from '../../data/mockData';

interface StepProjectsProps {
  data: OnboardingData;
  onChange: (fields: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepProjects: React.FC<StepProjectsProps> = ({
  data,
  onChange,
  onNext,
  onBack,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [status, setStatus] = useState<'Idea' | 'In Progress' | 'Completed'>('In Progress');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingProjectId(null);
    setTitle('');
    setDescription('');
    setTechnologies('');
    setStatus('In Progress');
    setGithubUrl('');
    setDemoUrl('');
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj: ProjectItem) => {
    setEditingProjectId(proj.id);
    setTitle(proj.title);
    setDescription(proj.description || '');
    setTechnologies((proj.technologies || proj.techStack || []).join(', '));
    setStatus((proj.status as any) || 'In Progress');
    setGithubUrl(proj.githubUrl || '');
    setDemoUrl(proj.demoUrl || '');
    setError(null);
    setIsModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Project Name is required.');
      return;
    }

    const techArray = technologies
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newProject: ProjectItem = {
      id: editingProjectId || 'proj-' + Date.now(),
      title: title.trim(),
      description: description.trim() || 'Student engineering project',
      technologies: techArray.length > 0 ? techArray : ['General'],
      techStack: techArray.length > 0 ? techArray : ['General'],
      status: status as any,
      githubUrl: githubUrl.trim() || undefined,
      demoUrl: demoUrl.trim() || undefined,
      category: 'Full Stack',
    };

    let updated: ProjectItem[];
    if (editingProjectId) {
      updated = (data.projects || []).map((p) => (p.id === editingProjectId ? newProject : p));
    } else {
      updated = [...(data.projects || []), newProject];
    }

    onChange({ projects: updated });
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    onChange({ projects: (data.projects || []).filter((p) => p.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Projects &amp; Practical Work
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Add coursework assignments, hackathon submissions, or personal side projects. (Optional for early-year students).
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            Added Projects ({(data.projects || []).length})
          </h3>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Projects List */}
      {(data.projects || []).length === 0 ? (
        <div className="p-8 rounded-2xl bg-[#090D15] border border-dashed border-[#1E273A] text-center">
          <FolderGit2 className="w-9 h-9 text-slate-600 mx-auto mb-2" />
          <p className="text-xs text-slate-300 font-medium">
            No projects added yet
          </p>
          <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
            1st or 2nd year students can skip this step or click &quot;Add Project&quot; to log ideas. You can always add more from your dashboard later.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.projects.map((proj) => (
            <div
              key={proj.id}
              className="p-4 rounded-xl bg-[#0B0F19] border border-[#1E273A] hover:border-[#2A3752] transition-all space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                      proj.status === 'Completed'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : proj.status === 'In Progress'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-500/15 text-slate-400 border border-slate-500/30'
                    }`}>
                      {proj.status || 'In Progress'}
                    </span>
                  </div>
                  {proj.description && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {proj.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(proj)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#1E273A]"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(proj.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Technologies and Links */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#162033]">
                <div className="flex flex-wrap gap-1">
                  {(proj.technologies || proj.techStack || []).map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono bg-[#11192A] text-slate-300 border border-[#222E47] px-2 py-0.5 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-slate-400 hover:text-indigo-400 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                  )}
                  {proj.demoUrl && (
                    <a
                      href={proj.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-slate-400 hover:text-indigo-400 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#0D121F] border border-[#222E47] rounded-2xl shadow-2xl p-5 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">
                {editingProjectId ? 'Edit Project' : 'Add Project'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 mb-3 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSaveProject} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                  Project Title <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Task Scheduler"
                  className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E273A] text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly explain what this project does and key problems solved..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E273A] text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                    Technologies Used
                  </label>
                  <input
                    type="text"
                    value={technologies}
                    onChange={(e) => setTechnologies(e.target.value)}
                    placeholder="e.g. React, Node, Redis"
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E273A] text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                  <span className="text-[10px] text-slate-500">Comma-separated</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E273A] text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option value="Idea">Idea</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                    GitHub URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E273A] text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                    Live Demo Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E273A] text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#1C263D]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 cursor-pointer"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Actions */}
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
