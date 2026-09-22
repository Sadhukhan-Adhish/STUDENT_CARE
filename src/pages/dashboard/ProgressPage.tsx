import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Award,
  BookOpen,
  FolderGit2,
  Cpu,
  Target,
  FileText,
  Compass,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  Sparkles,
  Info,
  Calendar,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { PageHeader } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';

export const ProgressPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const student = user?.studentProfile;

  // Real data calculations
  const stats = useMemo(() => {
    // 1. Academic
    const semesters = student?.semesters || [];
    const subjects = student?.subjects || [];
    const completedSubjects = subjects.filter((s) => (s.grade && s.grade.toUpperCase() !== 'F') || s.status === 'Strong' || s.status === 'Average').length;
    const currentCgpa = student?.cgpa;

    // 2. Skills
    const skills = student?.skills || [];
    const verifiedSkills = skills.filter((s) => (s.currentLevel ?? 0) >= 75 || Boolean(s.certification)).length;
    const ownSkills = student?.ownSkillUp || [];
    const completedOwnSkills = ownSkills.filter((s) => s.currentLevel === s.targetLevel).length;

    // 3. Projects
    const projects = student?.projects || [];
    const liveProjects = projects.filter((p) => p.demoUrl || p.projectLink).length;
    const repoProjects = projects.filter((p) => p.githubUrl || p.githubLink).length;

    // 4. Career Goal
    const hasCareerGoal = Boolean(student?.targetCareer?.trim() || student?.careerGoalDetails?.targetRole?.trim());

    // 5. Resume
    const hasResume = Boolean(student?.resumeInfo?.fileName);

    // 6. Roadmap
    const stages = student?.roadmapStages || [];
    const allTasks = stages.flatMap((s) => s.tasks || []);
    const completedTasks = allTasks.filter((t) => t.status === 'Completed' || t.completed).length;
    const roadmapPercent = allTasks.length > 0 ? Math.round((completedTasks / allTasks.length) * 100) : 0;

    // Profile Completion Checklist (6 core pillars)
    const checklist = [
      {
        id: 'academic',
        title: 'Academic Records',
        desc: semesters.length > 0 ? `${semesters.length} semesters recorded` : 'No semesters recorded yet',
        isComplete: semesters.length > 0,
        path: '/dashboard/academic',
        actionLabel: semesters.length > 0 ? 'View Academic' : 'Record Semesters',
      },
      {
        id: 'skills',
        title: 'Current Skills',
        desc: skills.length > 0 ? `${skills.length} technical skills logged` : 'No skills documented yet',
        isComplete: skills.length > 0,
        path: '/dashboard/skills',
        actionLabel: skills.length > 0 ? 'Manage Skills' : 'Add Current Skills',
      },
      {
        id: 'projects',
        title: 'Applied Projects',
        desc: projects.length > 0 ? `${projects.length} engineering projects logged` : 'No projects documented yet',
        isComplete: projects.length > 0,
        path: '/dashboard/projects',
        actionLabel: projects.length > 0 ? 'Manage Projects' : 'Add Projects',
      },
      {
        id: 'career',
        title: 'Career Direction',
        desc: hasCareerGoal ? `Target: ${student?.targetCareer}` : 'No career goal defined yet',
        isComplete: hasCareerGoal,
        path: '/dashboard/career',
        actionLabel: hasCareerGoal ? 'View Career Goal' : 'Set Career Goal',
      },
      {
        id: 'resume',
        title: 'Career Resume',
        desc: hasResume ? student?.resumeInfo?.fileName : 'No resume uploaded yet',
        isComplete: hasResume,
        path: '/dashboard/resume',
        actionLabel: hasResume ? 'Manage Resume' : 'Upload Resume',
      },
      {
        id: 'roadmap',
        title: 'Roadmap Milestones',
        desc: stages.length > 0 ? `${stages.length} stages (${completedTasks}/${allTasks.length} tasks done)` : 'No roadmap active yet',
        isComplete: stages.length > 0,
        path: '/dashboard/roadmap',
        actionLabel: stages.length > 0 ? 'View Roadmap' : 'Initialize Roadmap',
      },
    ];

    const completedChecklistCount = checklist.filter((item) => item.isComplete).length;
    const completenessPercentage = Math.round((completedChecklistCount / checklist.length) * 100);

    return {
      semestersCount: semesters.length,
      subjectsCount: subjects.length,
      completedSubjects,
      currentCgpa,
      skillsCount: skills.length,
      verifiedSkills,
      ownSkillsCount: ownSkills.length,
      completedOwnSkills,
      projectsCount: projects.length,
      liveProjects,
      repoProjects,
      hasCareerGoal,
      hasResume,
      stagesCount: stages.length,
      totalTasksCount: allTasks.length,
      completedTasks,
      roadmapPercent,
      checklist,
      completedChecklistCount,
      completenessPercentage,
    };
  }, [student]);

  return (
    <div className="space-y-6 pb-12 font-sans" id="progress-page-container">
      <PageHeader
        title="Student Progress &amp; Activity"
        subtitle="Transparent audit of your verified academic performance, logged skills, projects, and career milestones."
        badge={user?.isGuest ? 'Guest Exploration' : `${stats.completenessPercentage}% Profile Complete`}
      />

      {/* Honest Data Integrity Disclaimer */}
      <div className="p-3.5 rounded-xl bg-[#151D26] border border-[#202C3B] flex items-center gap-3 text-xs text-[#9AA5B1]" id="progress-integrity-bar">
        <div className="p-1.5 rounded-lg bg-[#D89B5B]/15 text-[#D89B5B] flex-shrink-0">
          <Info className="w-4 h-4" />
        </div>
        <p className="leading-relaxed">
          <strong className="text-[#F3F0E8] font-medium">Real Activity Only:</strong> UNNEXA presents genuine metrics derived solely from what you have recorded. No artificial streaks, simulated scores, or fake achievements are displayed.
        </p>
      </div>

      {/* Primary Profile Completeness Hero Card */}
      <div className="rounded-2xl bg-[#151D26] border border-[#202C3B] p-6 sm:p-8 shadow-xl relative overflow-hidden transition-all duration-200 hover:border-[#27384B]" id="profile-completeness-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#9AA5B1]">
              UNNEXA Profile Foundation
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F3F0E8] tracking-tight">
              {stats.completenessPercentage === 100
                ? 'All Profile Sections Complete'
                : `${stats.completedChecklistCount} of 6 Sections Documented`}
            </h2>
            <p className="text-xs text-[#9AA5B1] leading-relaxed">
              Completing each pillar connects your coursework, verified competencies, and practical builds to your target career objective.
            </p>
          </div>

          <div className="flex items-center gap-5 p-4 rounded-2xl bg-[#0E151E] border border-[#202C3B] flex-shrink-0">
            <div className="text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#D89B5B] font-mono">
                {stats.completenessPercentage}%
              </span>
              <span className="block text-[10px] font-mono text-[#9AA5B1] uppercase tracking-wider mt-0.5">
                Profile Completeness
              </span>
            </div>
            <div className="w-20 sm:w-28 bg-[#1B2533] h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 bg-[#D89B5B]"
                style={{ width: `${stats.completenessPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* 6-Pillar Detailed Checklist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-6 mt-6 border-t border-[#202C3B]">
          {stats.checklist.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 group ${
                item.isComplete
                  ? 'bg-[#0E151E] border-[#202C3B] hover:border-[#67C5B8]/40'
                  : 'bg-[#0B0F14] border-[#202C3B] hover:border-[#27384B]'
              }`}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="mt-0.5 flex-shrink-0">
                  {item.isComplete ? (
                    <CheckCircle2 className="w-4 h-4 text-[#67C5B8]" />
                  ) : (
                    <Circle className="w-4 h-4 text-[#768393] group-hover:text-[#D89B5B] transition-colors" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#F3F0E8] group-hover:text-[#D89B5B] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#9AA5B1] truncate mt-0.5">{item.desc}</p>
                </div>
              </div>

              <span className="text-[10px] font-mono text-[#D89B5B] group-hover:translate-x-0.5 transition-transform flex-shrink-0 mt-0.5 flex items-center gap-0.5">
                <span>{item.actionLabel.split(' ')[0]}</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Real Metrics Breakdown By Core Modules */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#F3F0E8] tracking-tight">Verified Academic &amp; Technical Activity</h3>
            <p className="text-xs text-[#9AA5B1]">Concrete totals from your recorded coursework, skills, repositories, and roadmap.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Academic */}
          <div
            onClick={() => navigate('/dashboard/academic')}
            className="p-5 rounded-2xl bg-[#151D26] border border-[#202C3B] hover:border-[#27384B] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#D89B5B]/15 text-[#D89B5B] flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                {stats.currentCgpa !== undefined && (
                  <span className="text-xs font-mono font-bold text-[#F3F0E8] px-2 py-0.5 rounded bg-[#0E151E] border border-[#202C3B]">
                    CGPA: {stats.currentCgpa.toFixed(2)}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#9AA5B1] block">
                Academic Records
              </span>
              <div className="text-2xl font-bold text-[#F3F0E8] font-mono mt-1">
                {stats.semestersCount} <span className="text-xs text-[#9AA5B1] font-sans font-normal">semesters</span>
              </div>
              <p className="text-xs text-[#9AA5B1] mt-1">
                {stats.completedSubjects} subjects passed of {stats.subjectsCount} total registered.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#202C3B] text-xs text-[#D89B5B] font-medium flex items-center justify-between">
              <span>View Academic</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Current Skills */}
          <div
            onClick={() => navigate('/dashboard/skills')}
            className="p-5 rounded-2xl bg-[#151D26] border border-[#202C3B] hover:border-[#27384B] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#67C5B8]/15 text-[#67C5B8] flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                {stats.verifiedSkills > 0 && (
                  <span className="text-xs font-mono font-bold text-[#7CD4C8] px-2 py-0.5 rounded bg-[#67C5B8]/15 border border-[#67C5B8]/30">
                    {stats.verifiedSkills} verified
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#9AA5B1] block">
                Technical Skills
              </span>
              <div className="text-2xl font-bold text-[#F3F0E8] font-mono mt-1">
                {stats.skillsCount} <span className="text-xs text-[#9AA5B1] font-sans font-normal">skills logged</span>
              </div>
              <p className="text-xs text-[#9AA5B1] mt-1">
                {stats.ownSkillsCount > 0
                  ? `${stats.completedOwnSkills} of ${stats.ownSkillsCount} Own Skill Up goals achieved.`
                  : 'No independent skill goals set yet.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#202C3B] text-xs text-[#67C5B8] font-medium flex items-center justify-between">
              <span>Manage Skills</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Applied Projects */}
          <div
            onClick={() => navigate('/dashboard/projects')}
            className="p-5 rounded-2xl bg-[#151D26] border border-[#202C3B] hover:border-[#27384B] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#D89B5B]/15 text-[#D89B5B] flex items-center justify-center">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                {stats.liveProjects > 0 && (
                  <span className="text-xs font-mono font-bold text-[#D89B5B] px-2 py-0.5 rounded bg-[#D89B5B]/15 border border-[#D89B5B]/30">
                    {stats.liveProjects} live
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#9AA5B1] block">
                Engineering Projects
              </span>
              <div className="text-2xl font-bold text-[#F3F0E8] font-mono mt-1">
                {stats.projectsCount} <span className="text-xs text-[#9AA5B1] font-sans font-normal">repositories</span>
              </div>
              <p className="text-xs text-[#9AA5B1] mt-1">
                {stats.repoProjects} linked with public GitHub repositories.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#202C3B] text-xs text-[#D89B5B] font-medium flex items-center justify-between">
              <span>Manage Projects</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Roadmap Milestones */}
          <div
            onClick={() => navigate('/dashboard/roadmap')}
            className="p-5 rounded-2xl bg-[#151D26] border border-[#202C3B] hover:border-[#27384B] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#67C5B8]/15 text-[#67C5B8] flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono font-bold text-[#7CD4C8] px-2 py-0.5 rounded bg-[#67C5B8]/15 border border-[#67C5B8]/30">
                  {stats.roadmapPercent}%
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#9AA5B1] block">
                Roadmap Milestones
              </span>
              <div className="text-2xl font-bold text-[#F3F0E8] font-mono mt-1">
                {stats.completedTasks} <span className="text-xs text-[#9AA5B1] font-sans font-normal">tasks completed</span>
              </div>
              <p className="text-xs text-[#9AA5B1] mt-1">
                Across {stats.stagesCount} active stages for {student?.targetCareer || 'career goal'}.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#202C3B] text-xs text-[#67C5B8] font-medium flex items-center justify-between">
              <span>View Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Immediate Action (What to do next) */}
      <div className="rounded-2xl bg-[#151D26] border border-[#202C3B] p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-[#F3F0E8] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D89B5B]" />
          <span>Recommended Next Actions</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {!stats.hasCareerGoal && (
            <div
              onClick={() => navigate('/dashboard/career')}
              className="p-4 rounded-xl bg-[#0E151E] border border-[#D89B5B]/30 hover:border-[#D89B5B] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-[#D89B5B] font-bold uppercase tracking-wider">Priority 1</span>
                <h4 className="text-[#F3F0E8] font-bold mt-1">Set Your Target Career Goal</h4>
                <p className="text-[#9AA5B1] mt-1">Define your target role to anchor your milestone roadmap.</p>
              </div>
              <span className="text-[#D89B5B] font-medium flex items-center gap-1 mt-3">
                <span>Set Goal</span> <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          )}

          {!stats.hasResume && (
            <div
              onClick={() => navigate('/dashboard/resume')}
              className="p-4 rounded-xl bg-[#0E151E] border border-[#202C3B] hover:border-[#D89B5B] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-[#9AA5B1] uppercase tracking-wider">Profile Document</span>
                <h4 className="text-[#F3F0E8] font-bold mt-1">Attach Your Resume</h4>
                <p className="text-[#9AA5B1] mt-1">Upload your resume (PDF or DOCX) to complete your career dossier.</p>
              </div>
              <span className="text-[#D89B5B] font-medium flex items-center gap-1 mt-3">
                <span>Upload Resume</span> <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          )}

          {stats.stagesCount === 0 && (
            <div
              onClick={() => navigate('/dashboard/roadmap')}
              className="p-4 rounded-xl bg-[#0E151E] border border-[#202C3B] hover:border-[#D89B5B] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-[#9AA5B1] uppercase tracking-wider">Learning Plan</span>
                <h4 className="text-[#F3F0E8] font-bold mt-1">Initialize Career Roadmap</h4>
                <p className="text-[#9AA5B1] mt-1">Create stages or load a customized engineering template.</p>
              </div>
              <span className="text-[#D89B5B] font-medium flex items-center gap-1 mt-3">
                <span>Setup Roadmap</span> <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          )}

          {stats.projectsCount === 0 && (
            <div
              onClick={() => navigate('/dashboard/projects')}
              className="p-4 rounded-xl bg-[#0E151E] border border-[#202C3B] hover:border-[#D89B5B] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-[#9AA5B1] uppercase tracking-wider">Portfolio</span>
                <h4 className="text-[#F3F0E8] font-bold mt-1">Document Your First Project</h4>
                <p className="text-[#9AA5B1] mt-1">Log an engineering project with technologies and live repository.</p>
              </div>
              <span className="text-[#D89B5B] font-medium flex items-center gap-1 mt-3">
                <span>Add Project</span> <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          )}

          {/* If all foundations are set */}
          {stats.hasCareerGoal && stats.hasResume && stats.stagesCount > 0 && stats.projectsCount > 0 && (
            <div
              onClick={() => navigate('/dashboard/roadmap')}
              className="p-4 rounded-xl bg-[#0E151E] border border-[#67C5B8]/30 hover:border-[#67C5B8] transition-all cursor-pointer flex flex-col justify-between md:col-span-3"
            >
              <div>
                <span className="text-[10px] font-mono text-[#67C5B8] font-bold uppercase tracking-wider">All Pillars Active</span>
                <h4 className="text-[#F3F0E8] font-bold mt-1">Continue Active Roadmap Tasks</h4>
                <p className="text-[#9AA5B1] mt-1">
                  You have established all foundational sections. Advance your active roadmap tasks and complete semester coursework to elevate your placement readiness.
                </p>
              </div>
              <span className="text-[#67C5B8] font-medium flex items-center gap-1 mt-3">
                <span>Go to Active Tasks</span> <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
