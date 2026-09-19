import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { OnboardingData } from './types';
import { StepWelcome } from './StepWelcome';
import { StepPersonal } from './StepPersonal';
import { StepInstitution } from './StepInstitution';
import { StepAcademic } from './StepAcademic';
import { StepSubjects } from './StepSubjects';
import { StepSkills } from './StepSkills';
import { StepProjects } from './StepProjects';
import { StepCareer } from './StepCareer';
import { StepSummary } from './StepSummary';
import { StepComplete } from './StepComplete';
import { Check, Compass, Sparkles, ArrowLeft } from 'lucide-react';
import { Institution, AcademicProfile, CareerGoal, Progress, StudentProfile } from '../../data/mockData';

const ONBOARDING_STEPS = [
  { id: 1, title: 'Personal', desc: 'Basic Information' },
  { id: 2, title: 'Institution', desc: 'College & University' },
  { id: 3, title: 'Academic', desc: 'Degree & Semester' },
  { id: 4, title: 'Subjects', desc: 'Curriculum Coursework' },
  { id: 5, title: 'Skills', desc: 'Current & Own Skill Up' },
  { id: 6, title: 'Projects', desc: 'Practical Experience' },
  { id: 7, title: 'Career', desc: 'Target Goal' },
];

const DRAFT_KEY = 'nexora_onboarding_draft';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isGuest, saveOnboardingStep, completeOnboarding } = useAuth();

  // Initialize data from current user or local draft
  const [data, setData] = useState<OnboardingData>(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        return JSON.parse(savedDraft);
      } catch (e) {
        console.error('Failed to parse draft', e);
      }
    }

    const p = user?.studentProfile;
    return {
      fullName: p?.name || user?.displayName || '',
      email: p?.email || user?.email || '',
      phone: p?.phone || '',
      avatar: p?.avatar || user?.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=Atlas',

      collegeName: p?.institution?.collegeName || p?.college || '',
      universityName: p?.institution?.universityName || p?.university || '',
      rollNumber: p?.institution?.universityRollNumber || p?.rollNumber || '',
      collegeStudentId: p?.institution?.collegeStudentId || '',
      universityRegNumber: p?.institution?.universityRegistrationNumber || '',

      degree: p?.institution?.courseDegree || p?.degree || 'Bachelor of Technology (B.Tech)',
      customDegree: '',
      department: p?.institution?.branchDepartment || p?.department || 'Computer Science & Engineering (CSE)',
      customDepartment: '',
      currentYear: p?.currentYear ? String(p?.currentYear) : '2nd Year',
      currentSemester: p?.currentSemester || 4,
      totalSemesters: p?.totalSemesters || 8,
      admissionYear: p?.institution?.admissionYear ? String(p?.institution?.admissionYear) : '',
      expectedGraduationYear: p?.graduationYear ? String(p?.graduationYear) : '',

      subjects: p?.subjects || [],
      syllabus: p?.syllabus || [],
      syllabusChoice: 'undecided',

      skills: p?.skills || [],
      ownSkillUp: p?.ownSkillUp || [],

      projects: p?.projects || [],

      targetCareer: p?.targetCareer || 'Full Stack Developer',
      customCareer: p?.careerGoal?.customRole || '',
    };
  });

  // Step indicator: 0 = Welcome, 1-7 = Steps, 8 = Summary, 9 = Complete
  const [currentStep, setCurrentStep] = useState<number>(() => {
    if (user?.studentProfile?.onboardingStep && user.studentProfile.onboardingStep >= 1 && user.studentProfile.onboardingStep <= 8) {
      return user.studentProfile.onboardingStep;
    }
    return 0; // Welcome by default
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Guard: if unauthenticated or guest
  useEffect(() => {
    if (!user) {
      navigate('/signup');
    } else if (isGuest) {
      navigate('/dashboard');
    }
  }, [user, isGuest, navigate]);

  // Save to draft in localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  }, [data]);

  const updateData = (fields: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const handleStepTransition = (nextStep: number) => {
    setCurrentStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Sync progress with AuthContext
    if (user) {
      saveOnboardingStep(
        {
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          avatar: data.avatar,
          rollNumber: data.rollNumber,
          college: data.collegeName,
          university: data.universityName,
          degree: data.degree === 'Other / Custom Degree' ? data.customDegree : data.degree,
          department: data.department === 'Other / Custom Program' ? data.customDepartment : data.department,
          currentSemester: data.currentSemester,
          currentYear: data.currentYear,
          subjects: data.subjects,
          skills: data.skills,
          ownSkillUp: data.ownSkillUp,
          projects: data.projects,
          syllabus: data.syllabus,
          targetCareer: data.targetCareer === 'Other / Custom Career Goal' ? data.customCareer : data.targetCareer,
        },
        nextStep
      );
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);

    const finalDegree = data.degree === 'Other / Custom Degree' ? (data.customDegree || 'Undergraduate') : data.degree;
    const finalDepartment = data.department === 'Other / Custom Program' ? (data.customDepartment || 'Engineering') : data.department;
    const finalCareer = data.targetCareer === 'Other / Custom Career Goal' ? (data.customCareer || 'Engineering') : data.targetCareer;

    const institution: Institution = {
      collegeName: data.collegeName,
      universityName: data.universityName,
      universityRollNumber: data.rollNumber,
      courseDegree: finalDegree,
      branchDepartment: finalDepartment,
      currentYear: data.currentYear,
      currentSemester: data.currentSemester,
      collegeStudentId: data.collegeStudentId || undefined,
      universityRegistrationNumber: data.universityRegNumber || undefined,
      admissionYear: data.admissionYear || undefined,
      expectedGraduationYear: data.expectedGraduationYear || undefined,
    };

    const academic: AcademicProfile = {
      currentSemester: data.currentSemester,
      totalSemesters: data.totalSemesters || 8,
      semesters: [],
      subjects: data.subjects,
      totalCredits: data.subjects.reduce((acc, s) => acc + (s.credits || 0), 0),
    };

    const careerGoal: CareerGoal = {
      targetRole: finalCareer,
      customRole: data.customCareer || undefined,
    };

    const progress: Progress = {
      learningStreakDays: 1,
      totalHoursStudied: 0,
      completedRoadmapTasks: 0,
      totalRoadmapTasks: 0,
    };

    const finalizedProfile: Partial<StudentProfile> = {
      name: data.fullName,
      email: data.email,
      phone: data.phone || undefined,
      avatar: data.avatar,
      rollNumber: data.rollNumber,
      college: data.collegeName,
      university: data.universityName,
      degree: finalDegree,
      department: finalDepartment,
      currentSemester: data.currentSemester,
      currentYear: data.currentYear,
      graduationYear: data.expectedGraduationYear ? Number(data.expectedGraduationYear) : new Date().getFullYear() + 2,

      institution,
      academic,
      careerGoal,
      progress,

      subjects: data.subjects,
      skills: data.skills,
      ownSkillUp: data.ownSkillUp,
      projects: data.projects,
      syllabus: data.syllabus,

      targetCareer: finalCareer,
      bio: `Student at ${data.collegeName}, studying ${finalDegree} (${finalDepartment}). Career focus: ${finalCareer}.`,
    };

    completeOnboarding(finalizedProfile);
    localStorage.removeItem(DRAFT_KEY);

    setIsSubmitting(false);
    setCurrentStep(9); // Success screen
  };

  const currentStepDef = ONBOARDING_STEPS.find((s) => s.id === currentStep);

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-[#151D2E] bg-[#0A0E18]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/30">
              N
            </div>
            <div>
              <span className="font-heading font-extrabold text-sm tracking-wider text-white">
                NEXORA
              </span>
              <span className="block text-[10px] font-mono text-indigo-400">
                STUDENT ONBOARDING
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentStep >= 1 && currentStep <= 7 && (
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-indigo-400">
                  STEP {currentStep} OF 7
                </span>
                <span className="hidden sm:block text-[11px] text-slate-400">
                  {currentStepDef?.title}: {currentStepDef?.desc}
                </span>
              </div>
            )}

            {user?.studentProfile?.onboardingCompleted && (
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-3 py-1.5 rounded-lg bg-[#141B2B] border border-[#222E46] text-xs text-slate-300 hover:text-white transition-colors"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar (when in steps 1 to 7) */}
        {currentStep >= 1 && currentStep <= 7 && (
          <div className="w-full bg-[#121826] h-1">
            <div
              className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-1 transition-all duration-300 ease-out"
              style={{ width: `${(currentStep / 7) * 100}%` }}
            />
          </div>
        )}
      </header>

      {/* Step Indicators Ribbon (Steps 1-7) */}
      {currentStep >= 1 && currentStep <= 7 && (
        <div className="border-b border-[#121927] bg-[#090D16]/50 py-3 hidden md:block">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-center justify-between">
              {ONBOARDING_STEPS.map((step) => {
                const isPassed = currentStep > step.id;
                const isCurrent = currentStep === step.id;

                return (
                  <button
                    key={step.id}
                    type="button"
                    disabled={!isPassed && !isCurrent}
                    onClick={() => isPassed && handleStepTransition(step.id)}
                    className={`flex items-center gap-2 text-xs transition-colors ${
                      isCurrent
                        ? 'text-indigo-400 font-bold'
                        : isPassed
                        ? 'text-slate-400 hover:text-slate-200 cursor-pointer'
                        : 'text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] font-semibold transition-all ${
                        isCurrent
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400/40'
                          : isPassed
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-[#121826] text-slate-600 border border-[#1E273A]'
                      }`}
                    >
                      {isPassed ? <Check className="w-3 h-3" /> : step.id}
                    </div>
                    <span className="font-mono">{step.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-2xl bg-[#0B0F1A] border border-[#182236] rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 relative">
          {currentStep === 0 && (
            <StepWelcome data={data} onStart={() => handleStepTransition(1)} />
          )}

          {currentStep === 1 && (
            <StepPersonal
              data={data}
              onChange={updateData}
              onNext={() => handleStepTransition(2)}
            />
          )}

          {currentStep === 2 && (
            <StepInstitution
              data={data}
              onChange={updateData}
              onNext={() => handleStepTransition(3)}
              onBack={() => handleStepTransition(1)}
            />
          )}

          {currentStep === 3 && (
            <StepAcademic
              data={data}
              onChange={updateData}
              onNext={() => handleStepTransition(4)}
              onBack={() => handleStepTransition(2)}
            />
          )}

          {currentStep === 4 && (
            <StepSubjects
              data={data}
              onChange={updateData}
              onNext={() => handleStepTransition(5)}
              onBack={() => handleStepTransition(3)}
            />
          )}

          {currentStep === 5 && (
            <StepSkills
              data={data}
              onChange={updateData}
              onNext={() => handleStepTransition(6)}
              onBack={() => handleStepTransition(4)}
            />
          )}

          {currentStep === 6 && (
            <StepProjects
              data={data}
              onChange={updateData}
              onNext={() => handleStepTransition(7)}
              onBack={() => handleStepTransition(5)}
            />
          )}

          {currentStep === 7 && (
            <StepCareer
              data={data}
              onChange={updateData}
              onNext={() => handleStepTransition(8)}
              onBack={() => handleStepTransition(6)}
            />
          )}

          {currentStep === 8 && (
            <StepSummary
              data={data}
              onGoToStep={(s) => handleStepTransition(s)}
              onComplete={handleComplete}
              isSubmitting={isSubmitting}
            />
          )}

          {currentStep === 9 && (
            <StepComplete
              data={data}
              onEnterDashboard={() => navigate('/dashboard')}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#121826] py-4 text-center text-xs text-slate-500 font-mono">
        NEXORA • Verified University Student Intelligence Architecture
      </footer>
    </div>
  );
};
