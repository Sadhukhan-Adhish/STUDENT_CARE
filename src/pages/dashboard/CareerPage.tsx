import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Target,
  Clock,
  Compass,
  FileText,
  FolderGit2,
  Cpu,
  Edit3,
  Trash2,
  Plus,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Info,
  X,
} from 'lucide-react';
import { PageHeader } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';

const POPULAR_CAREER_SUGGESTIONS = [
  'Machine Learning Engineer',
  'Full Stack Developer',
  'Data Engineer',
  'DevOps & Cloud Engineer',
  'Cybersecurity Analyst',
  'Backend Systems Engineer',
  'Embedded Systems Engineer',
  'Mobile Application Engineer',
];

const POPULAR_DOMAINS = [
  'Artificial Intelligence & Robotics',
  'FinTech & Banking',
  'Healthcare & Biotechnology',
  'Cloud Platforms & SaaS',
  'Cybersecurity & Network Defense',
  'Autonomous Systems & IoT',
  'E-Commerce & Digital Services',
];

const TIMELINE_PRESETS = [
  'Summer 2026 Internship',
  'Campus Placement 2027',
  'Next 6 Months',
  'Post-Graduation Entry Role',
  'Immediate Job Search',
];

export const CareerPage: React.FC = () => {
  const { user, setCareerGoal, clearCareerGoal } = useAuth();
  const navigate = useNavigate();

  const student = user?.studentProfile;
  const currentRole = student?.targetCareer?.trim() || student?.careerGoalDetails?.targetRole?.trim() || '';
  const goalDetails = student?.careerGoalDetails;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Form state
  const [roleInput, setRoleInput] = useState('');
  const [domainInput, setDomainInput] = useState('');
  const [timelineInput, setTimelineInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [validationError, setValidationError] = useState('');

  const openSetOrEditModal = () => {
    setRoleInput(currentRole);
    setDomainInput(goalDetails?.industryDomain || '');
    setTimelineInput(goalDetails?.timeline || '');
    setNotesInput(goalDetails?.notes || '');
    setValidationError('');
    setIsModalOpen(true);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = roleInput.trim();
    if (!trimmed) {
      setValidationError('Please enter a target career or role title.');
      return;
    }

    setCareerGoal({
      targetRole: trimmed,
      industryDomain: domainInput.trim(),
      timeline: timelineInput.trim(),
      notes: notesInput.trim(),
    });

    setIsModalOpen(false);
  };

  const handleClearGoal = () => {
    clearCareerGoal();
    setShowClearConfirm(false);
  };

  const hasCareerGoal = Boolean(currentRole);

  return (
    <div className="space-y-6 pb-12 font-sans" id="career-page-container">
      <PageHeader
        title="Career Objective"
        subtitle="Define your target engineering direction to anchor your personalized roadmap, coursework, and technical skills."
        badge={user?.isGuest ? 'Guest Exploration' : hasCareerGoal ? 'Goal Active' : 'No Goal Set'}
        actions={
          hasCareerGoal ? (
            <div className="flex items-center gap-2">
              <button
                id="edit-career-goal-btn"
                onClick={openSetOrEditModal}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] transition-all duration-150 flex items-center gap-1.5 cursor-pointer shadow-sm hover:-translate-y-0.5 active:translate-y-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Goal</span>
              </button>
              <button
                id="clear-career-goal-btn"
                onClick={() => setShowClearConfirm(true)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all duration-150 flex items-center gap-1 cursor-pointer"
                title="Remove career goal"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </div>
          ) : (
            <button
              id="set-career-goal-header-btn"
              onClick={openSetOrEditModal}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] transition-all duration-150 flex items-center gap-1.5 cursor-pointer shadow-sm hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Set Career Goal</span>
            </button>
          )
        }
      />

      {/* Student Guidance Bar */}
      <div className="p-3.5 rounded-xl bg-[#151D26] border border-[#202C3B] flex items-center gap-3 text-xs text-[#9AA5B1]" id="career-guidance-bar">
        <div className="p-1.5 rounded-lg bg-[#D89B5B]/15 text-[#D89B5B] flex-shrink-0">
          <Info className="w-4 h-4" />
        </div>
        <p className="leading-relaxed">
          <strong className="text-[#F3F0E8] font-medium">Student Direction:</strong> You choose your own career goal. UNNEXA never prescribes or forces a fixed career track on you. Enter any custom role or engineering specialization you aspire toward.
        </p>
      </div>

      {/* Active Goal View or Empty State */}
      {hasCareerGoal ? (
        <div className="space-y-6" id="active-career-goal-section">
          {/* Main Primary Goal Dossier */}
          <div className="rounded-2xl bg-[#151D26] border border-[#202C3B] p-6 sm:p-8 shadow-xl transition-all duration-200 hover:border-[#27384B]" id="primary-career-card">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#67C5B8]/15 text-[#7CD4C8] border border-[#67C5B8]/30 text-xs font-semibold font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#67C5B8]" />
                  <span>Target Career Goal Defined</span>
                </div>

                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#9AA5B1]">Target Role</span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F3F0E8] mt-1 tracking-tight" id="active-target-role-heading">
                    {currentRole}
                  </h1>
                </div>

                {/* Metadata badges */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {goalDetails?.industryDomain && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E151E] border border-[#202C3B] text-xs text-[#9AA5B1]">
                      <Briefcase className="w-3.5 h-3.5 text-[#D89B5B]" />
                      <span className="text-[#9AA5B1]">Domain:</span>
                      <span className="text-[#F3F0E8] font-medium">{goalDetails.industryDomain}</span>
                    </div>
                  )}

                  {goalDetails?.timeline && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E151E] border border-[#202C3B] text-xs text-[#9AA5B1]">
                      <Calendar className="w-3.5 h-3.5 text-[#67C5B8]" />
                      <span className="text-[#9AA5B1]">Timeline:</span>
                      <span className="text-[#F3F0E8] font-medium">{goalDetails.timeline}</span>
                    </div>
                  )}

                  {goalDetails?.updatedAt && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E151E] border border-[#202C3B] text-xs text-[#9AA5B1]">
                      <Clock className="w-3.5 h-3.5 text-[#768393]" />
                      <span>Updated {goalDetails.updatedAt}</span>
                    </div>
                  )}
                </div>

                {/* Optional Student Notes */}
                {goalDetails?.notes ? (
                  <div className="p-4 rounded-xl bg-[#0E151E] border border-[#202C3B] text-xs text-[#9AA5B1] leading-relaxed mt-3">
                    <span className="text-[11px] font-mono text-[#D89B5B] uppercase tracking-wider block mb-1">
                      Personal Direction &amp; Focus Area
                    </span>
                    <p className="whitespace-pre-wrap text-[#F3F0E8]">{goalDetails.notes}</p>
                  </div>
                ) : (
                  <div className="text-xs text-[#768393] italic">
                    No additional notes provided. Click "Edit Goal" to record specific focus topics or target company preferences.
                  </div>
                )}
              </div>

              {/* Action Sidebar inside Dossier */}
              <div className="lg:w-72 flex flex-col gap-3 p-4 rounded-xl bg-[#0E151E] border border-[#202C3B] flex-shrink-0">
                <span className="text-xs font-mono uppercase tracking-wider text-[#9AA5B1] font-semibold">
                  Goal Management
                </span>
                <p className="text-xs text-[#768393] leading-relaxed">
                  Your career goal serves as the foundation for your learning roadmap, project discovery, and skill verifications.
                </p>
                <div className="pt-2 border-t border-[#202C3B] flex flex-col gap-2">
                  <button
                    onClick={openSetOrEditModal}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Update Career Goal</span>
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Goal</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Integration & Next Steps Across UNNEXA Modules */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-[#F3F0E8] tracking-tight">Connected Career Actions</h2>
                <p className="text-xs text-[#9AA5B1]">
                  How your career goal connects to roadmap milestones, skill building, projects, and resume.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Roadmap */}
              <div
                onClick={() => navigate('/dashboard/roadmap')}
                className="p-5 rounded-2xl bg-[#151D26] border border-[#202C3B] hover:border-[#27384B] hover:bg-[#19232E] transition-all duration-150 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-[#D89B5B]/15 text-[#D89B5B] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Compass className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-[#F3F0E8]">Learning Roadmap</h3>
                  <p className="text-xs text-[#9AA5B1] mt-1 leading-relaxed">
                    Track sequential stages and action items specifically designed for {currentRole}.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#202C3B] flex items-center justify-between text-xs text-[#D89B5B] font-semibold">
                  <span>View Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 2: Current Skills */}
              <div
                onClick={() => navigate('/dashboard/skills')}
                className="p-5 rounded-2xl bg-[#151D26] border border-[#202C3B] hover:border-[#27384B] hover:bg-[#19232E] transition-all duration-150 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-[#67C5B8]/15 text-[#67C5B8] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-[#F3F0E8]">Technical Skills</h3>
                  <p className="text-xs text-[#9AA5B1] mt-1 leading-relaxed">
                    Verify competencies and set independent "Own Skill Up" goals required for your role.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#202C3B] flex items-center justify-between text-xs text-[#67C5B8] font-semibold">
                  <span>Verify Skills</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 3: Projects */}
              <div
                onClick={() => navigate('/dashboard/projects')}
                className="p-5 rounded-2xl bg-[#151D26] border border-[#202C3B] hover:border-[#27384B] hover:bg-[#19232E] transition-all duration-150 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-[#D89B5B]/15 text-[#D89B5B] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <FolderGit2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-[#F3F0E8]">Applied Projects</h3>
                  <p className="text-xs text-[#9AA5B1] mt-1 leading-relaxed">
                    Document real software repositories and link demonstrable skills to your portfolio.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#202C3B] flex items-center justify-between text-xs text-[#D89B5B] font-semibold">
                  <span>Manage Projects</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 4: Resume */}
              <div
                onClick={() => navigate('/dashboard/resume')}
                className="p-5 rounded-2xl bg-[#151D26] border border-[#202C3B] hover:border-[#27384B] hover:bg-[#19232E] transition-all duration-150 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-[#67C5B8]/15 text-[#67C5B8] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-[#F3F0E8]">Career Resume</h3>
                  <p className="text-xs text-[#9AA5B1] mt-1 leading-relaxed">
                    Attach and manage your resume aligned with {currentRole}.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#202C3B] flex items-center justify-between text-xs text-[#67C5B8] font-semibold">
                  <span>Manage Resume</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div
          id="career-empty-state"
          className="rounded-2xl bg-[#151D26] border border-[#202C3B] p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#D89B5B]/15 border border-[#D89B5B]/30 text-[#D89B5B] flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F3F0E8]">No career goal set yet.</h2>
          <p className="text-sm text-[#9AA5B1] mt-2 leading-relaxed">
            Set the career direction you want to work toward. Setting your career goal establishes the anchor for your learning roadmap, project discovery, and skill priorities.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="empty-state-set-goal-btn"
              onClick={openSetOrEditModal}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] transition-all duration-150 flex items-center gap-2 cursor-pointer shadow-sm hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-4 h-4" />
              <span>Set Your Career Goal</span>
            </button>
          </div>

          {/* Quick suggestions */}
          <div className="mt-8 pt-6 border-t border-[#202C3B] text-left">
            <span className="text-[11px] font-mono text-[#9AA5B1] uppercase tracking-wider block mb-3 text-center sm:text-left">
              Common Technical Roles to Consider
            </span>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {POPULAR_CAREER_SUGGESTIONS.slice(0, 6).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    setRoleInput(role);
                    setIsModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#0E151E] hover:bg-[#1B2533] border border-[#202C3B] hover:border-[#27384B] text-xs text-[#9AA5B1] hover:text-[#F3F0E8] transition-all cursor-pointer"
                >
                  + {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Set / Edit Career Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div
            id="career-goal-modal"
            className="rounded-2xl bg-[#151D26] border border-[#27384B] w-full max-w-xl p-6 sm:p-7 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#202C3B]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#D89B5B]/15 text-[#D89B5B] border border-[#D89B5B]/30">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#F3F0E8]">
                    {currentRole ? 'Update Career Goal' : 'Set Career Goal'}
                  </h3>
                  <p className="text-xs text-[#9AA5B1]">
                    Enter the engineering or technical role you want to work toward.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[#9AA5B1] hover:text-[#F3F0E8] hover:bg-[#1B2533] transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-4 text-xs">
              {/* Target Role input */}
              <div>
                <label className="block font-medium text-[#F3F0E8] mb-1.5">
                  Target Career / Role <span className="text-rose-400">*</span>
                </label>
                <input
                  id="target-career-input"
                  type="text"
                  value={roleInput}
                  onChange={(e) => {
                    setRoleInput(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                  placeholder="e.g., Machine Learning Engineer, Frontend Developer, Robotics Specialist"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E151E] border border-[#202C3B] text-[#F3F0E8] placeholder-[#768393] focus:outline-none focus:border-[#D89B5B] text-xs transition-all"
                  autoFocus
                />
                {validationError && (
                  <p className="text-rose-400 text-[11px] mt-1 font-medium">{validationError}</p>
                )}

                {/* Popular chips for quick filling */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-mono text-[#9AA5B1] py-0.5">Quick fill:</span>
                  {POPULAR_CAREER_SUGGESTIONS.slice(0, 4).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => {
                        setRoleInput(role);
                        if (validationError) setValidationError('');
                      }}
                      className="px-2 py-0.5 rounded text-[10px] bg-[#0E151E] hover:bg-[#1B2533] text-[#9AA5B1] hover:text-[#F3F0E8] border border-[#202C3B] transition-all cursor-pointer"
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Industry / Domain */}
              <div>
                <label className="block font-medium text-[#F3F0E8] mb-1.5">
                  Industry / Domain <span className="text-[#768393] font-normal">(Optional)</span>
                </label>
                <input
                  id="career-domain-input"
                  type="text"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  placeholder="e.g., FinTech, Healthcare, Autonomous Vehicles, Cloud SaaS"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E151E] border border-[#202C3B] text-[#F3F0E8] placeholder-[#768393] focus:outline-none focus:border-[#D89B5B] text-xs transition-all"
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-mono text-[#9AA5B1] py-0.5">Suggestions:</span>
                  {POPULAR_DOMAINS.slice(0, 3).map((dom) => (
                    <button
                      key={dom}
                      type="button"
                      onClick={() => setDomainInput(dom)}
                      className="px-2 py-0.5 rounded text-[10px] bg-[#0E151E] hover:bg-[#1B2533] text-[#9AA5B1] hover:text-[#F3F0E8] border border-[#202C3B] transition-all cursor-pointer"
                    >
                      {dom}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Target Timeline */}
              <div>
                <label className="block font-medium text-[#F3F0E8] mb-1.5">
                  Target Timeline <span className="text-[#768393] font-normal">(Optional)</span>
                </label>
                <input
                  id="career-timeline-input"
                  type="text"
                  value={timelineInput}
                  onChange={(e) => setTimelineInput(e.target.value)}
                  placeholder="e.g., Summer 2026 Internship, Campus Placement 2027, Next 6 Months"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E151E] border border-[#202C3B] text-[#F3F0E8] placeholder-[#768393] focus:outline-none focus:border-[#D89B5B] text-xs transition-all"
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-mono text-[#9AA5B1] py-0.5">Presets:</span>
                  {TIMELINE_PRESETS.slice(0, 3).map((tm) => (
                    <button
                      key={tm}
                      type="button"
                      onClick={() => setTimelineInput(tm)}
                      className="px-2 py-0.5 rounded text-[10px] bg-[#0E151E] hover:bg-[#1B2533] text-[#9AA5B1] hover:text-[#F3F0E8] border border-[#202C3B] transition-all cursor-pointer"
                    >
                      {tm}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block font-medium text-[#F3F0E8] mb-1.5">
                  Personal Direction &amp; Notes <span className="text-[#768393] font-normal">(Optional)</span>
                </label>
                <textarea
                  id="career-notes-input"
                  rows={3}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="e.g., Focusing on low-latency inference, distributed pipelines, and open-source contributions. Targeting mid-to-large product engineering teams."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E151E] border border-[#202C3B] text-[#F3F0E8] placeholder-[#768393] focus:outline-none focus:border-[#D89B5B] text-xs transition-all resize-none"
                />
              </div>

              <div className="pt-3 border-t border-[#202C3B] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#9AA5B1] hover:text-[#F3F0E8] hover:bg-[#1B2533] border border-[#27384B] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="save-career-goal-btn"
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] transition-all duration-150 flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save Career Goal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div
            id="clear-career-goal-modal"
            className="rounded-2xl bg-[#151D26] border border-[#27384B] w-full max-w-md p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex-shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F3F0E8]">Clear Career Goal?</h3>
                <p className="text-xs text-[#9AA5B1] mt-1 leading-relaxed">
                  Are you sure you want to remove your target role <strong>"{currentRole}"</strong>? You can set a new career goal at any time.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#202C3B] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#9AA5B1] hover:text-[#F3F0E8] hover:bg-[#1B2533] border border-[#27384B] transition-all cursor-pointer"
              >
                Keep Goal
              </button>
              <button
                id="confirm-clear-career-btn"
                type="button"
                onClick={handleClearGoal}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-all cursor-pointer shadow-sm"
              >
                Yes, Clear Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
