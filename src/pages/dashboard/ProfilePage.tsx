import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  GraduationCap,
  Building,
  Briefcase,
  Mail,
  Phone,
  Github,
  Linkedin,
  Calendar,
  Award,
  Edit3,
  CheckCircle2,
  Sparkles,
  BookOpen,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Save,
  X,
  AlertCircle,
  UserPlus,
} from 'lucide-react';
import { PageHeader, StatCard, ProgressBar } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';
import { mockStudent } from '../../data/mockData';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, resetToDemoStudent } = useAuth();
  const student = user?.studentProfile || mockStudent;

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states - initialized with actual student data, never inventing fake defaults
  const [name, setName] = useState(student.name);
  const [rollNumber, setRollNumber] = useState(student.rollNumber);
  const [university, setUniversity] = useState(student.university);
  const [degree, setDegree] = useState(student.degree);
  const [department, setDepartment] = useState(student.department);
  const [currentSemester, setCurrentSemester] = useState(student.currentSemester);
  const [graduationYear, setGraduationYear] = useState(student.graduationYear);
  const [targetCareer, setTargetCareer] = useState(student.targetCareer);
  const [secondaryCareer, setSecondaryCareer] = useState(student.secondaryTargetCareer || '');
  const [targetCgpa, setTargetCgpa] = useState(student.targetCgpa || 9.0);
  const [email, setEmail] = useState(student.email);
  const [phone, setPhone] = useState(student.phone || '');
  const [bio, setBio] = useState(student.bio || '');
  const [githubUrl, setGithubUrl] = useState(student.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(student.linkedinUrl || '');

  const handleStartEdit = () => {
    setName(student.name);
    setRollNumber(student.rollNumber);
    setUniversity(student.university);
    setDegree(student.degree);
    setDepartment(student.department);
    setCurrentSemester(student.currentSemester);
    setGraduationYear(student.graduationYear);
    setTargetCareer(student.targetCareer);
    setSecondaryCareer(student.secondaryTargetCareer || '');
    setTargetCgpa(student.targetCgpa || 9.0);
    setEmail(student.email);
    setPhone(student.phone || '');
    setBio(student.bio || '');
    setGithubUrl(student.githubUrl || '');
    setLinkedinUrl(student.linkedinUrl || '');
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      rollNumber: rollNumber.toUpperCase(),
      university,
      degree,
      department,
      currentSemester: Number(currentSemester),
      graduationYear: Number(graduationYear),
      targetCareer,
      secondaryTargetCareer: secondaryCareer,
      targetCgpa: Number(targetCgpa),
      email,
      phone,
      bio,
      githubUrl,
      linkedinUrl,
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  // Accurate credit count without arbitrary inflation
  const totalCredits = (student.subjects || []).reduce((acc, s) => acc + (s.credits || 0), 0);
  const activeSkillsCount = (student.skills || []).length;
  const activeProjectsCount = (student.projects || []).length;

  const isProfileIncomplete = !user?.isGuest && (!student.phone || !student.bio || !student.githubUrl || !student.linkedinUrl);

  return (
    <div className="space-y-6 pb-12 font-sans">
      <PageHeader
        title="Student Profile & Identification"
        subtitle="Institutional credentials, verified academic enrollment, and personalized career baseline telemetry."
        badge={user?.isGuest ? 'Guest Exploration Profile' : 'Official Student Record'}
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleStartEdit}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/30 shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile Details</span>
            </button>
            {user?.isGuest && (
              <button
                onClick={() => {
                  resetToDemoStudent();
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 bg-[#121826] hover:bg-[#182030] border border-[#1E2638] transition-all flex items-center gap-1.5 cursor-pointer"
                title="Reset to default demo data"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Demo</span>
              </button>
            )}
          </div>
        }
      />

      {/* Guest Exploration Banner */}
      {user?.isGuest && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 mt-0.5">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  GUEST MODE
                </span>
                <h3 className="text-sm font-bold text-white">
                  Exploration &amp; Demo Account
                </h3>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                You are currently exploring NEXORA in Guest Mode. Sample data is shown for preview purposes. Create a permanent student account to record your own academic trajectory.
              </p>
            </div>
          </div>
          <Link
            to="/signup"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0 shadow-md shadow-indigo-600/30"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Student Account</span>
          </Link>
        </div>
      )}

      {/* Complete Your Profile Prompt for New / Incomplete Students */}
      {isProfileIncomplete && (
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Complete Your Profile
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Add your contact phone, biography, and professional links so NEXORA can personalize recommendations.
              </p>
            </div>
          </div>
          <button
            onClick={handleStartEdit}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0 shadow-md shadow-indigo-600/30"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Complete Profile Details</span>
          </button>
        </div>
      )}

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Student profile updated successfully! Changes are synchronized across your dashboard.</span>
        </div>
      )}

      {/* Main Student Identification Card */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0F1426] via-[#0E1528] to-[#0A0E18] border border-[#1E2840] p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={student.avatar}
                alt={user?.isGuest ? 'Guest Student' : student.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-indigo-500/50 shadow-xl shadow-indigo-600/20"
              />
              <span className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono uppercase tracking-wider ${
                user?.isGuest ? 'bg-amber-400 text-slate-950' : 'bg-emerald-500 text-slate-950'
              }`}>
                {user?.isGuest ? 'Guest' : 'Active'}
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-extrabold text-white tracking-tight font-heading">
                  {user?.isGuest ? 'Guest Student' : student.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-mono text-xs font-bold">
                  Roll No: {user?.isGuest ? 'GUEST-DEMO' : student.rollNumber}
                </span>
                {user?.isGuest && (
                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 border border-amber-400/30 text-amber-300 font-mono text-xs font-bold">
                    GUEST MODE
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-1.5 flex-wrap">
                <Building className="w-3.5 h-3.5 text-slate-400 inline" />
                <span>{user?.isGuest ? 'NEXORA Exploration Platform' : student.university}</span>
                <span className="text-slate-500">•</span>
                <span>{user?.isGuest ? 'Platform Preview' : student.degree}</span>
              </p>

              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-[#131B2D] border border-[#1F2C46] text-[11px] font-medium text-slate-300">
                  {user?.isGuest ? 'Computer Science & AI (Demo)' : student.department}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#131B2D] border border-[#1F2C46] text-[11px] font-mono text-indigo-300">
                  {user?.isGuest ? 'Preview Account' : `Semester ${student.currentSemester} (Class of ${student.graduationYear})`}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono font-semibold text-emerald-400">
                  CGPA: {user?.isGuest ? 'Demo Sample' : (student.cgpa !== undefined ? student.cgpa.toFixed(2) : 'Pending')}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#090D15]/90 border border-[#1D273C] min-w-[240px] w-full md:w-auto">
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 block mb-1">
              Primary Career Objective
            </span>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span>{student.targetCareer || 'Career Goal Pending'}</span>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Role Readiness</span>
                <span className="font-mono text-indigo-300 font-semibold">
                  {student.readinessScore !== undefined ? `${student.readinessScore}%` : 'Pending'}
                </span>
              </div>
              <ProgressBar progress={student.readinessScore || 0} color="indigo" />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current CGPA"
          value={user?.isGuest ? '8.74 (Demo)' : (student.cgpa !== undefined ? student.cgpa.toFixed(2) : 'Pending')}
          change={student.targetCgpa ? `Target: ${student.targetCgpa}` : 'Target: 9.0'}
          changeType="positive"
          subtext="Dynamic credit-weighted GPA"
          icon={Award}
          accentColor="indigo"
        />
        <StatCard
          title="Active Coursework"
          value={(student.subjects || []).length.toString()}
          change={`${totalCredits} Total Credits`}
          changeType="neutral"
          subtext={user?.isGuest ? 'Sample coursework' : `Semester ${student.currentSemester} enrolled`}
          icon={GraduationCap}
          accentColor="cyan"
        />
        <StatCard
          title="Tracked Skills"
          value={activeSkillsCount.toString()}
          change={student.skillScore ? `Avg Level: ${student.skillScore}%` : 'Competency status'}
          changeType="positive"
          subtext="Verified technical competencies"
          icon={Sparkles}
          accentColor="purple"
        />
        <StatCard
          title="Portfolio Projects"
          value={activeProjectsCount.toString()}
          change="Proof of Work"
          changeType="positive"
          subtext="Engineering assignments"
          icon={BookOpen}
          accentColor="emerald"
        />
      </div>

      {/* Profile Details Sections: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal Bio & Contact Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl bg-[#0D111A] border border-[#1C2538] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Contact &amp; Social Links
              </h3>
              <button
                onClick={handleStartEdit}
                className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
              >
                Edit
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="truncate">{student.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                {student.phone ? (
                  <span>{student.phone}</span>
                ) : (
                  <span className="text-slate-500 italic">Phone not provided</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Github className="w-4 h-4 text-slate-400 flex-shrink-0" />
                {student.githubUrl ? (
                  <a
                    href={student.githubUrl.startsWith('http') ? student.githubUrl : `https://${student.githubUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:underline truncate"
                  >
                    {student.githubUrl.replace('https://', '')}
                  </a>
                ) : (
                  <span className="text-slate-500 italic">GitHub not linked</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Linkedin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                {student.linkedinUrl ? (
                  <a
                    href={student.linkedinUrl.startsWith('http') ? student.linkedinUrl : `https://${student.linkedinUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:underline truncate"
                  >
                    {student.linkedinUrl.replace('https://', '')}
                  </a>
                ) : (
                  <span className="text-slate-500 italic">LinkedIn not linked</span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-[#192233]">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Student Bio / Summary
              </span>
              {student.bio ? (
                <p className="text-xs text-slate-300 leading-relaxed">{student.bio}</p>
              ) : (
                <p className="text-xs text-slate-500 italic leading-relaxed">
                  No biography entered yet. Click "Edit Profile Details" to introduce yourself and describe your engineering interests.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-[#0D111A] border border-[#1C2538] p-6 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Identity Verification Status</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enrolled under University Roll Number <strong className="text-white font-mono">{student.rollNumber}</strong>.
              All transcripts, GPA records, and verified skill badges are tied to this institutional credential.
            </p>
          </div>
        </div>

        {/* Right Column: Academic Details & Career Alignment */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-[#0D111A] border border-[#1C2538] p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A2234] mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Academic Program Breakdown
              </h3>
              <span className="text-xs font-mono text-indigo-400">
                Semester {student.currentSemester} of 8
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#111624] border border-[#1D273C]">
                <span className="text-slate-400 text-[10px] uppercase font-mono block">Institution</span>
                <span className="text-slate-200 font-semibold text-sm mt-0.5 block">{student.university}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#111624] border border-[#1D273C]">
                <span className="text-slate-400 text-[10px] uppercase font-mono block">Degree Program</span>
                <span className="text-slate-200 font-semibold text-sm mt-0.5 block">{student.degree}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#111624] border border-[#1D273C]">
                <span className="text-slate-400 text-[10px] uppercase font-mono block">Major / Branch</span>
                <span className="text-slate-200 font-semibold text-sm mt-0.5 block">{student.department}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#111624] border border-[#1D273C]">
                <span className="text-slate-400 text-[10px] uppercase font-mono block">Expected Graduation</span>
                <span className="text-slate-200 font-semibold text-sm mt-0.5 block">Year {student.graduationYear}</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#1A2234] flex items-center justify-between">
              <span className="text-xs text-slate-400">Want to add or modify semester courses?</span>
              <Link
                to="/dashboard/academic"
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>Manage Academic Subjects →</span>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-[#0D111A] border border-[#1C2538] p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A2234] mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Career Direction &amp; Targets
              </h3>
              <Link
                to="/dashboard/career"
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                View Career Path Engine →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#111624] border border-[#1D273C]">
                <span className="text-slate-400 text-[10px] uppercase font-mono block">Primary Target Career</span>
                <span className="text-indigo-300 font-bold text-sm mt-0.5 block">{student.targetCareer}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#111624] border border-[#1D273C]">
                <span className="text-slate-400 text-[10px] uppercase font-mono block">Secondary Alternative</span>
                <span className="text-slate-200 font-semibold text-sm mt-0.5 block">
                  {student.secondaryTargetCareer || 'Full Stack Systems Engineer'}
                </span>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-white">Continuous Adaptive Calibration</p>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  As you complete semesters, add technical skills, and ship portfolio projects, NEXORA updates your readiness score, roadmaps, and career placement probabilities automatically.
                </p>
              </div>
            </div>
          </div>

          {/* Own Skill Up in Profile */}
          {(student.ownSkillUp || []).length > 0 && (
            <div className="rounded-2xl bg-[#0D111A] border border-emerald-500/25 p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Own Skill Up — Independent Tracks
                  </h3>
                  <p className="text-xs text-slate-400">Self-driven learning goals outside university syllabus</p>
                </div>
                <Link
                  to="/dashboard/skills"
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  Manage Skills →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {student.ownSkillUp?.map((goal) => (
                  <div
                    key={goal.id}
                    className="p-3 rounded-xl bg-[#111624] border border-[#1D273C] space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{goal.skill}</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        {goal.targetLevel}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Level: {goal.currentLevel} → <span className="text-emerald-300">{goal.targetLevel}</span>
                    </div>
                    {goal.reason && (
                      <p className="text-[10px] text-slate-400 italic">&ldquo;{goal.reason}&rdquo;</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0E131E] border border-[#1E2638] rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A2234] mb-4">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Edit Student Identity &amp; Profile
                </h3>
              </div>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">University Roll Number *</label>
                  <input
                    type="text"
                    required
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                    className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">University / College *</label>
                  <input
                    type="text"
                    required
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Degree Program *</label>
                  <input
                    type="text"
                    required
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Department / Major</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Current Semester</label>
                  <select
                    value={currentSemester}
                    onChange={(e) => setCurrentSemester(Number(e.target.value))}
                    className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Graduation Year</label>
                  <input
                    type="number"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(Number(e.target.value))}
                    className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Primary Target Career</label>
                  <select
                    value={targetCareer}
                    onChange={(e) => setTargetCareer(e.target.value)}
                    className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                    <option value="Full Stack Systems Engineer">Full Stack Systems Engineer</option>
                    <option value="Data Scientist / AI Researcher">Data Scientist / AI Researcher</option>
                    <option value="Cloud Architect & DevOps Engineer">Cloud Architect & DevOps Engineer</option>
                    <option value="Cybersecurity & Systems Analyst">Cybersecurity & Systems Analyst</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Target CGPA Goal</label>
                  <input
                    type="number"
                    step="0.1"
                    min="6.0"
                    max="10.0"
                    value={targetCgpa}
                    onChange={(e) => setTargetCgpa(Number(e.target.value))}
                    className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Student Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">GitHub Profile URL</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Student Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe your academic focus, projects, and career aspirations..."
                  className="w-full bg-[#090D15] border border-[#1E2638] rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1A2234]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-[#141B2B] hover:bg-[#1A2338] border border-[#232F4A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white font-semibold bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
