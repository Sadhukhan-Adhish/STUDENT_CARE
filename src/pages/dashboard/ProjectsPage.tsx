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
} from 'lucide-react';
import { PageHeader, StatCard, ProgressBar } from '../../components/common/UIComponents';
import { mockProjects, ProjectItem } from '../../data/mockData';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>(mockProjects);
  const [filterTab, setFilterTab] = useState<'All' | 'Recommended' | 'In Progress' | 'Completed'>('All');
  const [showIdeaModal, setShowIdeaModal] = useState(false);

  const filteredProjects = filterTab === 'All'
    ? projects
    : projects.filter((p) => p.status === filterTab);

  const handleStartProject = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, status: 'In Progress', progress: 10 }
          : p
      )
    );
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <PageHeader
        title="Project Lab &amp; Portfolios"
        subtitle="Engineered project assignments designed to systematically eliminate your identified skill deficits and demonstrate production competence."
        badge="Proof of Work"
        actions={
          <button
            onClick={() => setShowIdeaModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/30 shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Gap-Aligned Project</span>
          </button>
        }
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 bg-[#121826] p-1 rounded-lg border border-[#1D273C]">
          {(['All', 'In Progress', 'Recommended', 'Completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                filterTab === tab
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-slate-400">
          Showing {filteredProjects.length} Portfolio Projects
        </span>
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
              className="rounded-2xl bg-[#0D111A] border border-[#1C2538] hover:border-[#2B3852] p-6 shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {project.category}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      project.difficulty === 'Advanced'
                        ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                        : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                    }`}>
                      {project.difficulty}
                    </span>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                    isCompleted
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      : isInProgress
                      ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                      : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                  }`}>
                    {project.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white leading-snug">{project.title}</h3>
                <p className="text-xs text-indigo-300/90 font-medium mt-1">{project.tagline}</p>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">{project.description}</p>

                {/* Skill Gap addressed callout */}
                <div className="mt-4 p-2.5 rounded-lg bg-[#121826] border border-[#1E293E] text-xs">
                  <span className="text-[10px] font-mono uppercase text-indigo-400 font-semibold block mb-0.5">
                    Skill Gap Target:
                  </span>
                  <span className="text-slate-300">{project.skillGapAddressed}</span>
                </div>

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
                    value={project.progress}
                    color={isCompleted ? 'bg-emerald-500' : 'bg-indigo-500'}
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

                  {isRecommended && (
                    <button
                      onClick={() => handleStartProject(project.id)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-600/30"
                    >
                      <span>Start Building</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {isInProgress && (
                    <span className="text-[11px] font-mono text-indigo-400 font-semibold">
                      Est. {project.estimatedHours}h Total
                    </span>
                  )}
                  {isCompleted && (
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ready for Resume</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Idea Generator Modal */}
      {showIdeaModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#0E131E] border border-[#20293D] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A2234]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="text-base font-bold text-white">AI Project Recommendation</h3>
              </div>
              <button
                onClick={() => setShowIdeaModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Based on your target role as <strong className="text-white">Machine Learning Engineer</strong> and your current gap in <strong className="text-rose-400">Docker &amp; MLOps (-28% deficit)</strong>, NEXORA recommends:
            </p>

            <div className="p-4 rounded-xl bg-[#121826] border border-indigo-500/20 text-xs space-y-2">
              <h4 className="font-bold text-white text-sm">Distributed LLM Inference Gateway</h4>
              <p className="text-slate-400">
                A containerized microservice that orchestrates quantized model inference across Docker nodes using Redis queue and FastAPI.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded bg-[#182132] text-indigo-300 font-mono text-[10px]">Docker Compose</span>
                <span className="px-2 py-0.5 rounded bg-[#182132] text-indigo-300 font-mono text-[10px]">FastAPI</span>
                <span className="px-2 py-0.5 rounded bg-[#182132] text-indigo-300 font-mono text-[10px]">Redis Streams</span>
                <span className="px-2 py-0.5 rounded bg-[#182132] text-indigo-300 font-mono text-[10px]">vLLM</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowIdeaModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowIdeaModal(false);
                  setFilterTab('Recommended');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
              >
                Add to Recommended Lab
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
