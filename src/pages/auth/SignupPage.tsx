import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Phone,
  Building,
  GraduationCap,
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Code,
  Briefcase,
  Layers,
  FolderGit2,
  ExternalLink,
  Award,
  Compass,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SubjectPerformance, SkillItem, ProjectItem } from '../../data/mockData';

export const SignupPage: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // STEP 1: Personal Information
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedAvatarSeed, setSelectedAvatarSeed] = useState('Atlas');

  // STEP 2: Institution
  const [collegeName, setCollegeName] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [degree, setDegree] = useState('Bachelor of Technology (B.Tech)');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [currentYear, setCurrentYear] = useState('2nd Year');
  const [currentSemester, setCurrentSemester] = useState<number>(3);
  // Optional institution fields
  const [collegeStudentId, setCollegeStudentId] = useState('');
  const [universityRegNumber, setUniversityRegNumber] = useState('');
  const [admissionYear, setAdmissionYear] = useState('2023');
  const [expectedGraduationYear, setExpectedGraduationYear] = useState('2027');

  // STEP 3: Academic Information
  const [totalSemesters, setTotalSemesters] = useState<number>(8);
  const [activeSemTab, setActiveSemTab] = useState<number>(3);
  const [subjects, setSubjects] = useState<SubjectPerformance[]>([
    {
      code: 'CS301',
      name: 'Data Structures & Algorithms',
      credits: 4,
      semester: 3,
      category: 'Core',
      grade: 'A',
      score: 85,
      attendance: 92,
      status: 'Strong',
    },
    {
      code: 'CS302',
      name: 'Database Management Systems',
      credits: 4,
      semester: 3,
      category: 'Core',
      grade: 'B+',
      score: 78,
      attendance: 88,
      status: 'Average',
    },
  ]);

  // Subject Modal/Form state
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubjectIndex, setEditingSubjectIndex] = useState<number | null>(null);
  const [subName, setSubName] = useState('');
  const [subCode, setSubCode] = useState('');
  const [subCredits, setSubCredits] = useState<number>(3);
  const [subSem, setSubSem] = useState<number>(3);
  const [subGrade, setSubGrade] = useState('');
  const [subScore, setSubScore] = useState<string>('');
  const [subAttendance, setSubAttendance] = useState<string>('');
  const [subCategory, setSubCategory] = useState<'Core' | 'Elective' | 'Lab' | 'Math'>('Core');

  // STEP 4: Skills
  const [skills, setSkills] = useState<SkillItem[]>([
    {
      id: 'skill-1',
      name: 'Python',
      proficiency: 'Intermediate',
      currentLevel: 75,
      requiredLevel: 85,
      gap: 10,
      priority: 'High',
      action: 'Async programming & data structures',
      trend: 'up',
      category: 'Programming',
    },
    {
      id: 'skill-2',
      name: 'SQL',
      proficiency: 'Intermediate',
      currentLevel: 70,
      requiredLevel: 80,
      gap: 10,
      priority: 'Medium',
      action: 'Query optimization & indexing',
      trend: 'stable',
      category: 'Databases & Web',
    },
  ]);

  // Skill Form State
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [skillName, setSkillName] = useState('');
  const [skillProficiency, setSkillProficiency] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');
  const [skillCertification, setSkillCertification] = useState('');
  const [skillExperience, setSkillExperience] = useState('');

  // STEP 5: Projects
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  // Project Form State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projName, setProjName] = useState('');
  const [projDescription, setProjDescription] = useState('');
  const [projTech, setProjTech] = useState('');
  const [projSkillsUsed, setProjSkillsUsed] = useState('');
  const [projStatus, setProjStatus] = useState<'Planned' | 'In Progress' | 'Completed'>('In Progress');
  const [projGithub, setProjGithub] = useState('');
  const [projLiveLink, setProjLiveLink] = useState('');

  // STEP 6: Career Goal
  const careerOptions = [
    'Software Engineer',
    'Machine Learning Engineer',
    'AI Engineer',
    'Data Scientist',
    'Data Analyst',
    'Web Developer',
    'Cybersecurity Engineer',
    'Cloud Engineer',
    'UI/UX Designer',
    'Other',
  ];
  const [selectedCareer, setSelectedCareer] = useState<string>('Software Engineer');
  const [customCareer, setCustomCareer] = useState<string>('');

  const { signup } = useAuth();
  const navigate = useNavigate();

  // Progress steps list
  const stepsList = [
    { num: 1, label: 'Personal' },
    { num: 2, label: 'Institution' },
    { num: 3, label: 'Academics' },
    { num: 4, label: 'Skills' },
    { num: 5, label: 'Projects' },
    { num: 6, label: 'Career' },
    { num: 7, label: 'Summary' },
  ];

  // Avatar options
  const avatarPresets = ['Atlas', 'Luna', 'Orion', 'Nova', 'Echo', 'Phoenix'];

  // Subject Form Handlers
  const handleOpenSubjectModal = (index?: number) => {
    if (typeof index === 'number') {
      const s = subjects[index];
      setEditingSubjectIndex(index);
      setSubName(s.name);
      setSubCode(s.code);
      setSubCredits(s.credits);
      setSubSem(typeof s.semester === 'number' ? s.semester : activeSemTab);
      setSubGrade(s.grade || '');
      setSubScore(s.score ? String(s.score) : '');
      setSubAttendance(s.attendance ? String(s.attendance) : '');
      setSubCategory((s.category as any) || 'Core');
    } else {
      setEditingSubjectIndex(null);
      setSubName('');
      setSubCode('');
      setSubCredits(3);
      setSubSem(activeSemTab);
      setSubGrade('');
      setSubScore('');
      setSubAttendance('');
      setSubCategory('Core');
    }
    setIsSubjectModalOpen(true);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim() || !subCode.trim()) return;

    const newSub: SubjectPerformance = {
      code: subCode.trim().toUpperCase(),
      name: subName.trim(),
      credits: Number(subCredits) || 3,
      semester: subSem,
      category: subCategory,
      grade: subGrade.trim().toUpperCase() || undefined,
      score: subScore ? Number(subScore) : undefined,
      attendance: subAttendance ? Number(subAttendance) : undefined,
      status: subGrade === 'A' || subGrade === 'A+' || subGrade === 'O' ? 'Strong' : 'Average',
    };

    if (editingSubjectIndex !== null) {
      const updated = [...subjects];
      updated[editingSubjectIndex] = newSub;
      setSubjects(updated);
    } else {
      setSubjects([...subjects, newSub]);
    }
    setIsSubjectModalOpen(false);
  };

  const handleDeleteSubject = (idx: number) => {
    setSubjects(subjects.filter((_, i) => i !== idx));
  };

  // Skill Form Handlers
  const handleOpenSkillModal = (skill?: SkillItem) => {
    if (skill) {
      setEditingSkillId(skill.id);
      setSkillName(skill.name);
      setSkillProficiency(skill.proficiency || 'Intermediate');
      setSkillCertification(skill.certification || '');
      setSkillExperience(skill.experience || '');
    } else {
      setEditingSkillId(null);
      setSkillName('');
      setSkillProficiency('Intermediate');
      setSkillCertification('');
      setSkillExperience('');
    }
    setIsSkillModalOpen(true);
  };

  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    const levelMap = {
      Beginner: 40,
      Intermediate: 65,
      Advanced: 85,
      Expert: 95,
    };
    const currentLvl = levelMap[skillProficiency] || 60;

    if (editingSkillId) {
      setSkills(
        skills.map((s) =>
          s.id === editingSkillId
            ? {
                ...s,
                name: skillName.trim(),
                proficiency: skillProficiency,
                currentLevel: currentLvl,
                gap: Math.max(0, (s.requiredLevel || 75) - currentLvl),
                certification: skillCertification.trim() || undefined,
                experience: skillExperience.trim() || undefined,
              }
            : s
        )
      );
    } else {
      const newSk: SkillItem = {
        id: 'sk-' + Date.now(),
        name: skillName.trim(),
        proficiency: skillProficiency,
        currentLevel: currentLvl,
        requiredLevel: 80,
        gap: Math.max(0, 80 - currentLvl),
        priority: currentLvl < 60 ? 'High' : 'Medium',
        action: `Practice and build projects in ${skillName.trim()}`,
        trend: 'up',
        category: 'Programming',
        certification: skillCertification.trim() || undefined,
        experience: skillExperience.trim() || undefined,
      };
      setSkills([...skills, newSk]);
    }
    setIsSkillModalOpen(false);
  };

  const handleDeleteSkill = (id: string) => {
    setSkills(skills.filter((s) => s.id !== id));
  };

  // Project Form Handlers
  const handleOpenProjectModal = (proj?: ProjectItem) => {
    if (proj) {
      setEditingProjectId(proj.id);
      setProjName(proj.title);
      setProjDescription(proj.description);
      setProjTech(proj.technologies.join(', '));
      setProjSkillsUsed(proj.skillsCovered ? proj.skillsCovered.join(', ') : '');
      setProjStatus(proj.status as any);
      setProjGithub(proj.githubUrl || proj.githubLink || '');
      setProjLiveLink(proj.demoUrl || proj.projectLink || '');
    } else {
      setEditingProjectId(null);
      setProjName('');
      setProjDescription('');
      setProjTech('');
      setProjSkillsUsed('');
      setProjStatus('In Progress');
      setProjGithub('');
      setProjLiveLink('');
    }
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName.trim()) return;

    const techArray = projTech
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const skillsArray = projSkillsUsed
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const projectObj: ProjectItem = {
      id: editingProjectId || 'proj-' + Date.now(),
      title: projName.trim(),
      name: projName.trim(),
      tagline: projDescription.slice(0, 80),
      description: projDescription.trim() || 'Student portfolio engineering project.',
      technologies: techArray.length ? techArray : ['Full Stack'],
      skillsCovered: skillsArray.length ? skillsArray : techArray,
      skillGapAddressed: `Builds competence in ${techArray[0] || 'Modern Engineering'}`,
      status: projStatus,
      difficulty: 'Intermediate',
      progress: projStatus === 'Completed' ? 100 : projStatus === 'In Progress' ? 50 : 10,
      estimatedHours: 25,
      githubLink: projGithub.trim() || undefined,
      githubUrl: projGithub.trim() || undefined,
      projectLink: projLiveLink.trim() || undefined,
      demoUrl: projLiveLink.trim() || undefined,
      category: 'Full Stack',
    };

    if (editingProjectId) {
      setProjects(projects.map((p) => (p.id === editingProjectId ? projectObj : p)));
    } else {
      setProjects([...projects, projectObj]);
    }
    setIsProjectModalOpen(false);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  // Step Validation & Navigation
  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Please provide a valid student email address.');
        return;
      }
      if (!password || password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please re-enter.');
        return;
      }
    } else if (step === 2) {
      if (!collegeName.trim()) {
        setError('Please enter your college name.');
        return;
      }
      if (!universityName.trim()) {
        setError('Please enter your university name.');
        return;
      }
      if (!rollNumber.trim()) {
        setError('University Roll Number is required (it is your primary login identifier).');
        return;
      }
      if (!degree.trim()) {
        setError('Please enter your degree/course.');
        return;
      }
      if (!department.trim()) {
        setError('Please enter your branch/department.');
        return;
      }
    } else if (step === 6) {
      if (selectedCareer === 'Other' && !customCareer.trim()) {
        setError('Please specify your target career goal.');
        return;
      }
    }

    setStep((prev) => Math.min(prev + 1, 7));
  };

  const handleBack = () => {
    setError(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  // Final Submission
  const handleCompleteRegistration = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const finalCareerGoal = selectedCareer === 'Other' ? customCareer.trim() : selectedCareer;
      const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(selectedAvatarSeed + '-' + rollNumber)}`;

      await signup({
        name: fullName.trim(),
        email: email.trim(),
        password: password,
        phone: phone.trim() || undefined,
        avatar: avatarUrl,
        collegeName: collegeName.trim(),
        universityName: universityName.trim(),
        universityRollNumber: rollNumber.trim().toUpperCase(),
        courseDegree: degree.trim(),
        branchDepartment: department.trim(),
        currentYear: currentYear,
        currentSemester: Number(currentSemester) || 1,
        totalSemesters: totalSemesters,
        collegeStudentId: collegeStudentId.trim() || undefined,
        universityRegistrationNumber: universityRegNumber.trim() || undefined,
        admissionYear: admissionYear.trim() || undefined,
        expectedGraduationYear: expectedGraduationYear.trim() || undefined,
        subjects: subjects,
        skills: skills,
        projects: projects,
        targetCareer: finalCareerGoal,
        customCareerGoal: selectedCareer === 'Other' ? customCareer.trim() : undefined,
      });

      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Failed to complete registration. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090D] text-slate-100 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Top Navbar Header */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between relative z-10 mb-6">
        <Link to="/" className="inline-flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 border border-indigo-400/40">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white font-heading">NEXORA</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden sm:inline">Already registered?</span>
          <Link
            to="/login"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#111724] border border-[#1E2638] text-indigo-300 hover:text-white hover:bg-[#161F32] transition-colors"
          >
            Sign In with Roll No
          </Link>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl w-full mx-auto bg-[#0D121C] border border-[#1E2638] rounded-2xl shadow-2xl p-6 sm:p-8 relative z-10">
        {/* Progress Indicator */}
        <div className="mb-8 pb-6 border-b border-[#1A2234]">
          <div className="flex items-center justify-between overflow-x-auto pb-2 scrollbar-none gap-2">
            {stepsList.map((s, idx) => {
              const isActive = s.num === step;
              const isCompleted = s.num < step;
              return (
                <div key={s.num} className="flex items-center gap-2 flex-shrink-0">
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : isCompleted
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-[#101522] text-slate-400 border border-[#1C2538]'
                    }`}
                  >
                    <span>{isCompleted ? '✓' : s.num}</span>
                    <span>{s.label}</span>
                  </div>
                  {idx < stepsList.length - 1 && <div className="w-3 h-0.5 bg-[#1C2538]" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: PERSONAL INFORMATION */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-400" />
                <span>Step 1: Personal Information</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Provide your basic contact details and security credentials.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Adhish Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D15] border border-[#1E273A] text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                  Student Email <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. adhish@university.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D15] border border-[#1E273A] text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                  Password <span className="text-rose-400">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D15] border border-[#1E273A] text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                  Confirm Password <span className="text-rose-400">*</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D15] border border-[#1E273A] text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D15] border border-[#1E273A] text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                  Choose Avatar Style (Optional)
                </label>
                <div className="flex items-center gap-2">
                  {avatarPresets.map((seed) => (
                    <button
                      key={seed}
                      type="button"
                      onClick={() => setSelectedAvatarSeed(seed)}
                      className={`w-9 h-9 rounded-lg overflow-hidden border-2 transition-all p-0.5 cursor-pointer ${
                        selectedAvatarSeed === seed ? 'border-indigo-500 bg-indigo-500/20 scale-105' : 'border-[#1E273A] bg-[#090D15] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={`https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`}
                        alt={seed}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: INSTITUTION */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Building className="w-5 h-5 text-indigo-400" />
                <span>Step 2: Institution &amp; Enrolment</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Your University Roll Number is your primary student identifier on NEXORA.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                  College Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="e.g. Pacific Institute of Technology"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D15] border border-[#1E273A] text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                  University Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={universityName}
                  onChange={(e) => setUniversityName(e.target.value)}
                  placeholder="e.g. State Technological University"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D15] border border-[#1E273A] text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1.5 font-mono">
                  University Roll Number <span className="text-rose-400">*</span> (Primary Login ID)
                </label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="e.g. 23CS105"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D15] border border-amber-500/40 text-amber-300 placeholder-slate-600 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1">You will use this Roll Number to log in.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                  Course / Degree <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. Bachelor of Technology (B.Tech)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D15] border border-[#1E273A] text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                  Branch / Department <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science &amp; Engineering"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D15] border border-[#1E273A] text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                    Current Year <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={currentYear}
                    onChange={(e) => setCurrentYear(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#090D15] border border-[#1E273A] text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                    Current Sem <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={currentSemester}
                    onChange={(e) => {
                      const sem = Number(e.target.value);
                      setCurrentSemester(sem);
                      setActiveSemTab(sem);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#090D15] border border-[#1E273A] text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Optional Enrolment Details */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                  College Student ID (Optional)
                </label>
                <input
                  type="text"
                  value={collegeStudentId}
                  onChange={(e) => setCollegeStudentId(e.target.value)}
                  placeholder="e.g. PIT-2023-CS-042"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D15] border border-[#1E273A] text-slate-100 placeholder-slate-600 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                  University Reg. No (Optional)
                </label>
                <input
                  type="text"
                  value={universityRegNumber}
                  onChange={(e) => setUniversityRegNumber(e.target.value)}
                  placeholder="e.g. REG-8899201"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D15] border border-[#1E273A] text-slate-100 placeholder-slate-600 text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: ACADEMICS & SUBJECT MANAGEMENT */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  <span>Step 3: Academic Information &amp; Subjects</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Add your own subjects for your degree. You can add more later in the dashboard.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenSubjectModal()}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 self-start cursor-pointer shadow-md shadow-indigo-600/30"
              >
                <Plus className="w-4 h-4" />
                <span>Add Subject</span>
              </button>
            </div>

            {/* Degree Semesters Configuration */}
            <div className="p-4 rounded-xl bg-[#090D15] border border-[#182030] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-400 uppercase">Degree Semesters:</span>
                <select
                  value={totalSemesters}
                  onChange={(e) => setTotalSemesters(Number(e.target.value))}
                  className="px-3 py-1.5 rounded-lg bg-[#111724] border border-[#1E273A] text-xs text-slate-200 font-semibold"
                >
                  <option value={4}>4 Semesters (e.g. M.Tech / MCA)</option>
                  <option value={6}>6 Semesters (e.g. BCA / B.Sc)</option>
                  <option value={8}>8 Semesters (e.g. B.Tech / B.E)</option>
                  <option value={10}>10 Semesters (Dual Degree)</option>
                </select>
              </div>

              <div className="text-xs text-indigo-300 font-mono">
                Current: <strong className="text-white">Semester {currentSemester}</strong>
              </div>
            </div>

            {/* Semester Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-[#1C2538]">
              {Array.from({ length: totalSemesters }, (_, i) => i + 1).map((semNum) => {
                const count = subjects.filter((s) => s.semester === semNum || s.semester === `Semester ${semNum}`).length;
                const isSelected = activeSemTab === semNum;
                return (
                  <button
                    key={semNum}
                    type="button"
                    onClick={() => setActiveSemTab(semNum)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-[#101522] text-slate-400 hover:text-white border border-[#1A2234]'
                    }`}
                  >
                    Sem {semNum} {count > 0 ? `(${count})` : ''}
                  </button>
                );
              })}
            </div>

            {/* Subjects Table / List for Active Semester */}
            {(() => {
              const activeSubjects = subjects.filter(
                (s) => s.semester === activeSemTab || s.semester === `Semester ${activeSemTab}`
              );

              if (activeSubjects.length === 0) {
                return (
                  <div className="text-center py-10 px-4 rounded-xl bg-[#090D15] border border-dashed border-[#1E2638]">
                    <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-300">No subjects added for Semester {activeSemTab} yet</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Add the courses you are enrolled in or already completed for this semester.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleOpenSubjectModal()}
                      className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold bg-[#121826] hover:bg-[#1A2234] text-indigo-400 border border-indigo-500/30 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Subject to Sem {activeSemTab}</span>
                    </button>
                  </div>
                );
              }

              return (
                <div className="space-y-2.5">
                  {activeSubjects.map((sub) => {
                    const originalIdx = subjects.findIndex((s) => s.code === sub.code);
                    return (
                      <div
                        key={sub.code}
                        className="p-3.5 rounded-xl bg-[#090D15] border border-[#1A2234] hover:border-indigo-500/30 flex items-center justify-between gap-4 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-xs font-bold">
                            {sub.credits}C
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-indigo-400 font-semibold">{sub.code}</span>
                              <span className="text-xs px-2 py-0.5 rounded bg-[#131B2A] text-slate-400 font-mono text-[10px]">
                                {sub.category || 'Core'}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-white mt-0.5">{sub.name}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right hidden sm:block">
                            <span className="text-xs font-mono text-slate-400">Grade: </span>
                            <strong className="text-xs font-mono text-emerald-400">{sub.grade || 'Pending'}</strong>
                            {sub.attendance && (
                              <span className="text-[11px] text-slate-400 ml-3">Att: {sub.attendance}%</span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenSubjectModal(originalIdx)}
                              className="p-1.5 rounded-lg hover:bg-[#1A2338] text-slate-400 hover:text-white transition-colors cursor-pointer"
                              title="Edit Subject"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSubject(originalIdx)}
                              className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                              title="Delete Subject"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* STEP 4: SKILL ONBOARDING */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Code className="w-5 h-5 text-indigo-400" />
                  <span>Step 4: Technical Skills</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Add the programming languages, tools, and technical competencies you know.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenSkillModal()}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 self-start cursor-pointer shadow-md shadow-indigo-600/30"
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill</span>
              </button>
            </div>

            {skills.length === 0 ? (
              <div className="text-center py-10 px-4 rounded-xl bg-[#090D15] border border-dashed border-[#1E2638]">
                <Code className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-300">No skills added yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Add your skills so NEXORA can calculate your real skill-gap and readiness score.
                </p>
                <button
                  type="button"
                  onClick={() => handleOpenSkillModal()}
                  className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold bg-[#121826] hover:bg-[#1A2234] text-indigo-400 border border-indigo-500/30 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Skill</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skills.map((sk) => (
                  <div
                    key={sk.id}
                    className="p-3.5 rounded-xl bg-[#090D15] border border-[#1A2234] hover:border-indigo-500/30 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{sk.name}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                            sk.proficiency === 'Expert'
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                              : sk.proficiency === 'Advanced'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : sk.proficiency === 'Intermediate'
                              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                              : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                          }`}
                        >
                          {sk.proficiency}
                        </span>
                      </div>
                      {sk.certification && (
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate">Cert: {sk.certification}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenSkillModal(sk)}
                        className="p-1.5 rounded-lg hover:bg-[#1A2338] text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSkill(sk.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 5: PROJECT ONBOARDING */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <FolderGit2 className="w-5 h-5 text-indigo-400" />
                  <span>Step 5: Project Onboarding</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Add projects you have built or planned. You can also skip this step and add them later.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenProjectModal()}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 self-start cursor-pointer shadow-md shadow-indigo-600/30"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-10 px-4 rounded-xl bg-[#090D15] border border-dashed border-[#1E2638]">
                <FolderGit2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-300">No projects added yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Showcase projects with code repositories or live deployments to enhance your portfolio.
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleOpenProjectModal()}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#121826] hover:bg-[#1A2234] text-indigo-400 border border-indigo-500/30 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                  >
                    Skip this step →
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-xl bg-[#090D15] border border-[#1A2234] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{proj.title}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                            proj.status === 'Completed'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : proj.status === 'In Progress'
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-slate-500/10 text-slate-400'
                          }`}
                        >
                          {proj.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{proj.description}</p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {proj.technologies.map((t) => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-[#121826] text-slate-300 font-mono">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleOpenProjectModal(proj)}
                        className="p-2 rounded-lg hover:bg-[#1A2338] text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-2 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 6: CAREER GOAL */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Compass className="w-5 h-5 text-indigo-400" />
                <span>Step 6: Target Career Goal</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Choose the engineering or technological career role you want NEXORA to optimize for.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {careerOptions.map((role) => {
                const isSelected = selectedCareer === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedCareer(role)}
                    className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                        : 'bg-[#090D15] border-[#1E273A] text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs sm:text-sm">{role}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedCareer === 'Other' && (
              <div className="mt-4 p-4 rounded-xl bg-[#090D15] border border-indigo-500/30">
                <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-1.5 font-mono">
                  Specify Custom Target Career Role <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={customCareer}
                  onChange={(e) => setCustomCareer(e.target.value)}
                  placeholder="e.g. Embedded Firmware Engineer / Robotics Specialist"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D121C] border border-[#1E273A] text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>
            )}
          </div>
        )}

        {/* STEP 7: FINAL PROFILE SUMMARY */}
        {step === 7 && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <h3 className="text-base font-bold text-white">Your NEXORA profile is ready.</h3>
                <p className="text-xs text-emerald-300/80">
                  Review your personalized profile details below before launching your student dashboard.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#090D15] border border-[#182030] space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-[#1A2234]">
                <img
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(selectedAvatarSeed + '-' + rollNumber)}`}
                  alt="Avatar"
                  className="w-14 h-14 rounded-xl bg-indigo-950/50 border border-indigo-500/30 p-1"
                />
                <div>
                  <h3 className="text-lg font-bold text-white">{fullName}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      Roll No: {rollNumber.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{email}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 uppercase font-mono text-[10px]">College:</span>
                  <p className="text-white font-medium mt-0.5">{collegeName}</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-mono text-[10px]">University:</span>
                  <p className="text-white font-medium mt-0.5">{universityName}</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-mono text-[10px]">Degree &amp; Branch:</span>
                  <p className="text-white font-medium mt-0.5">
                    {degree} • {department}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-mono text-[10px]">Current Academic Standing:</span>
                  <p className="text-white font-medium mt-0.5">
                    {currentYear} • Semester {currentSemester}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-mono text-[10px]">Target Career:</span>
                  <p className="text-indigo-300 font-bold mt-0.5">
                    {selectedCareer === 'Other' ? customCareer : selectedCareer}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-mono text-[10px]">Onboarded Assets:</span>
                  <p className="text-slate-200 mt-0.5">
                    {subjects.length} Subjects • {skills.length} Skills • {projects.length} Projects
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-[#1C2538] flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-[#101522] border border-[#1E273A] hover:bg-[#161F32] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 7 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 border border-indigo-400/30 flex items-center gap-2 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCompleteRegistration}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 border border-emerald-400/30 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Enter NEXORA Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* MODAL: ADD / EDIT SUBJECT */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0D121C] border border-[#1E2638] rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">
              {editingSubjectIndex !== null ? 'Edit Subject' : 'Add New Subject'}
            </h3>

            <form onSubmit={handleSaveSubject} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Subject Name *</label>
                <input
                  type="text"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  placeholder="e.g. Operating Systems"
                  className="w-full px-3 py-2 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Subject Code *</label>
                  <input
                    type="text"
                    value={subCode}
                    onChange={(e) => setSubCode(e.target.value)}
                    placeholder="e.g. CS303"
                    className="w-full px-3 py-2 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white font-mono uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Credits *</label>
                  <input
                    type="number"
                    value={subCredits}
                    onChange={(e) => setSubCredits(Number(e.target.value))}
                    min={1}
                    max={6}
                    className="w-full px-3 py-2 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Semester</label>
                  <select
                    value={subSem}
                    onChange={(e) => setSubSem(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white"
                  >
                    {Array.from({ length: totalSemesters }, (_, i) => i + 1).map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Category</label>
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white"
                  >
                    <option value="Core">Core</option>
                    <option value="Elective">Elective</option>
                    <option value="Lab">Lab</option>
                    <option value="Math">Math</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Grade (Opt)</label>
                  <input
                    type="text"
                    value={subGrade}
                    onChange={(e) => setSubGrade(e.target.value)}
                    placeholder="e.g. A+"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Score % (Opt)</label>
                  <input
                    type="number"
                    value={subScore}
                    onChange={(e) => setSubScore(e.target.value)}
                    placeholder="e.g. 88"
                    min={0}
                    max={100}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Att % (Opt)</label>
                  <input
                    type="number"
                    value={subAttendance}
                    onChange={(e) => setSubAttendance(e.target.value)}
                    placeholder="e.g. 95"
                    min={0}
                    max={100}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubjectModalOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT SKILL */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0D121C] border border-[#1E2638] rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">
              {editingSkillId ? 'Edit Skill' : 'Add New Skill'}
            </h3>

            <form onSubmit={handleSaveSkill} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Skill Name *</label>
                <input
                  type="text"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="e.g. Docker / Kubernetes"
                  className="w-full px-3 py-2 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Proficiency Level *</label>
                <select
                  value={skillProficiency}
                  onChange={(e) => setSkillProficiency(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Certification (Optional)</label>
                <input
                  type="text"
                  value={skillCertification}
                  onChange={(e) => setSkillCertification(e.target.value)}
                  placeholder="e.g. AWS Certified Solutions Architect"
                  className="w-full px-3 py-2 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Experience / Projects (Optional)</label>
                <input
                  type="text"
                  value={skillExperience}
                  onChange={(e) => setSkillExperience(e.target.value)}
                  placeholder="e.g. 1 year building distributed microservices"
                  className="w-full px-3 py-2 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSkillModalOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PROJECT */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0D121C] border border-[#1E2638] rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">
              {editingProjectId ? 'Edit Project' : 'Add New Project'}
            </h3>

            <form onSubmit={handleSaveProject} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Project Name *</label>
                <input
                  type="text"
                  value={projName}
                  onChange={(e) => setProjName(e.target.value)}
                  placeholder="e.g. Distributed Task Queue"
                  className="w-full px-3 py-2 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Description *</label>
                <textarea
                  value={projDescription}
                  onChange={(e) => setProjDescription(e.target.value)}
                  placeholder="Describe what you built, architecture, or problems solved..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Technologies (comma separated)</label>
                  <input
                    type="text"
                    value={projTech}
                    onChange={(e) => setProjTech(e.target.value)}
                    placeholder="e.g. React, Node.js, Redis"
                    className="w-full px-3 py-2 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Project Status</label>
                  <select
                    value={projStatus}
                    onChange={(e) => setProjStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white"
                  >
                    <option value="Planned">Planned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">GitHub Link (Optional)</label>
                  <input
                    type="url"
                    value={projGithub}
                    onChange={(e) => setProjGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Project / Live Link (Optional)</label>
                  <input
                    type="url"
                    value={projLiveLink}
                    onChange={(e) => setProjLiveLink(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
