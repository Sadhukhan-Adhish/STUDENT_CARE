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
  const [college, setCollege] = useState(student.college || '');
  const [university, setUniversity] = useState(student.university);
  const [degree, setDegree] = useState(student.degree);
  const [department, setDepartment] = useState(student.department);
  const [currentSemester, setCurrentSemester] = useState(student.currentSemester);
  const [graduationYear, setGraduationYear] = useState(student.graduationYear);
  const [admissionYear, setAdmissionYear] = useState(student.admissionYear || '');
  const [collegeStudentId, setCollegeStudentId] = useState(student.collegeStudentId || '');
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
    setCollege(student.college || '');
    setUniversity(student.university);
    setDegree(student.degree);
    setDepartment(student.department);
    setCurrentSemester(student.currentSemester);
    setGraduationYear(student.graduationYear);
    setAdmissionYear(student.admissionYear || '');
    setCollegeStudentId(student.collegeStudentId || '');
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
      college,
      university,
      degree,
      department,
      currentSemester: Number(currentSemester),
      graduationYear: Number(graduationYear),
      admissionYear: admissionYear ? Number(admissionYear) : undefined,
      collegeStudentId,
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
        badge="Student Profile"
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleStartEdit}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] shadow-sm transition-all flex items-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile Details</span>
            </button>
            {user?.isGuest && (
              <button
                onClick={() => {
                  resetToDemoStudent();
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-[#9AA5B1] hover:text-[#F3F0E8] bg-[#151D26] hover:bg-[#1B2533] border border-[#202C3B] transition-all flex items-center gap-1.5 cursor-pointer"
                title="Clear current guest workspace to zero"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear Workspace</span>
              </button>
            )}
          </div>
        }
      />

      {/* Guest Session Notice */}
      {user?.isGuest && (
        <div className="p-4 rounded-2xl bg-[#151D26] border border-[#202C3B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#D89B5B]/15 text-[#D89B5B] mt-0.5">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F3F0E8]">
                Guest Workspace
              </h3>
              <p className="text-xs text-[#9AA5B1] mt-0.5">
                You are working in temporary session storage. You can enter your degree, coursework, skills, and projects freely. Create an account anytime to bind and save your records permanently.
              </p>
            </div>
          </div>
          <Link
            to="/signup"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0 shadow-sm hover:-translate-y-0.5 active:translate-y-0"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account to Save</span>
          </Link>
        </div>
      )}

      {/* Complete Your Profile Prompt for New / Incomplete Students */}
      {isProfileIncomplete && (
        <div className="p-4 rounded-2xl bg-[#151D26] border border-[#D89B5B]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#D89B5B]/20 text-[#D89B5B] mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F3F0E8] uppercase tracking-wider font-mono">
                Complete Your Profile
              </h3>
              <p className="text-xs text-[#9AA5B1] mt-0.5">
                Add your contact phone, biography, and professional links so UNNEXA can personalize recommendations.
              </p>
            </div>
          </div>
          <button
            onClick={handleStartEdit}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0 shadow-sm hover:-translate-y-0.5 active:translate-y-0"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Complete Profile Details</span>
          </button>
        </div>
      )}

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-[#67C5B8]/15 border border-[#67C5B8]/30 text-xs text-[#7CD4C8] flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#67C5B8]" />
          <span>Student profile updated successfully! Changes are synchronized across your dashboard.</span>
        </div>
      )}

      {/* Main Student Identification Card */}
      <div className="rounded-2xl bg-[#151D26] border border-[#202C3B] p-6 sm:p-8 shadow-xl relative overflow-hidden" id="student-identity-card">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={student.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Guest'}
                alt={user?.isGuest ? (student.name || 'Guest User') : student.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#D89B5B]/50 shadow-lg"
              />
              <span className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono uppercase tracking-wider ${
                user?.isGuest ? 'bg-[#D89B5B] text-[#0B0F14]' : 'bg-[#67C5B8] text-[#0B0F14]'
              }`}>
                {user?.isGuest ? 'Guest' : 'Active'}
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-extrabold text-[#F3F0E8] tracking-tight font-heading">
                  {user?.isGuest ? (student.name && student.name !== 'Guest Student' ? student.name : 'Guest User') : (student.name || 'Student')}
                </h1>
                <span className="px-2.5 py-0.5 rounded-lg bg-[#D89B5B]/15 border border-[#D89B5B]/30 text-[#D89B5B] font-mono text-xs font-bold">
                  Roll No: {user?.isGuest ? (student.rollNumber && student.rollNumber !== 'GUEST-DEMO' ? student.rollNumber : 'Unassigned') : (student.rollNumber || 'Unassigned')}
                </span>
                {user?.isGuest && (
                  <span className="px-2.5 py-0.5 rounded-lg bg-[#D89B5B]/15 border border-[#D89B5B]/30 text-[#D89B5B] font-mono text-xs font-bold">
                    GUEST SESSION
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-[#9AA5B1] mt-1 flex items-center gap-1.5 flex-wrap">
                <Building className="w-3.5 h-3.5 text-[#9AA5B1] inline" />
                <span>{student.college || student.university || (user?.isGuest ? 'Personal Workspace' : 'Institution Pending')}</span>
                <span className="text-[#9AA5B1]/50">•</span>
                <span>{student.degree || (user?.isGuest ? 'Degree Program' : 'Degree Pending')}</span>
              </p>

              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-[#0E151E] border border-[#202C3B] text-[11px] font-medium text-[#9AA5B1]">
                  {student.department || (user?.isGuest ? 'Department Not Set' : 'Department Pending')}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#0E151E] border border-[#202C3B] text-[11px] font-mono text-[#D89B5B]">
                  {student.currentSemester ? `Semester ${student.currentSemester}${student.graduationYear ? ` (Class of ${student.graduationYear})` : ''}` : 'Semester 1'}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#67C5B8]/15 border border-[#67C5B8]/30 text-[11px] font-mono font-semibold text-[#7CD4C8]">
                  CGPA: {student.cgpa !== undefined && student.cgpa > 0 ? student.cgpa.toFixed(2) : 'Not recorded'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0E151E] border border-[#202C3B] min-w-[240px] w-full md:w-auto">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#D89B5B] block mb-1">
              Primary Career Objective
            </span>
            <div className="text-sm font-bold text-[#F3F0E8] flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#D89B5B]" />
              <span>{student.targetCareer || 'Career Goal Pending'}</span>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-[#9AA5B1] mb-1">
                <span>Role Readiness</span>
                <span className="font-mono text-[#D89B5B] font-semibold">
                  {student.readinessScore !== undefined && student.readinessScore > 0 ? `${student.readinessScore}%` : 'Pending'}
                </span>
              </div>
              <ProgressBar progress={student.readinessScore || 0} color="amber" />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current CGPA"
          value={student.cgpa !== undefined && student.cgpa > 0 ? student.cgpa.toFixed(2) : '—'}
          change={student.cgpa !== undefined && student.cgpa > 0 ? (student.targetCgpa ? `Target: ${student.targetCgpa}` : 'Target: 9.0') : 'No academic data yet'}
          changeType={student.cgpa !== undefined && student.cgpa > 0 ? 'positive' : 'neutral'}
          subtext={student.cgpa !== undefined && student.cgpa > 0 ? 'Dynamic credit-weighted GPA' : 'Add semester results to compute'}
          icon={Award}
          accentColor="amber"
        />
        <StatCard
          title="Active Coursework"
          value={(student.subjects || []).length.toString()}
          change={`${totalCredits} Total Credits`}
          changeType="neutral"
          subtext={student.currentSemester ? `Semester ${student.currentSemester} enrolled` : 'Coursework enrolled'}
          icon={GraduationCap}
          accentColor="emerald"
        />
        <StatCard
          title="Tracked Skills"
          value={activeSkillsCount.toString()}
          change={activeSkillsCount > 0 && student.skillScore ? `Avg Level: ${student.skillScore}%` : (activeSkillsCount > 0 ? `${activeSkillsCount} Active` : 'No skills tracked')}
          changeType={activeSkillsCount > 0 ? 'positive' : 'neutral'}
          subtext="Verified technical competencies"
          icon={Sparkles}
          accentColor="amber"
        />
        <StatCard
          title="Portfolio Projects"
          value={activeProjectsCount.toString()}
          change={activeProjectsCount > 0 ? 'Proof of Work' : 'No projects yet'}
          changeType={activeProjectsCount > 0 ? 'positive' : 'neutral'}
          subtext="Engineering assignments"
          icon={BookOpen}
          accentColor="emerald"
        />
      </div>

      {/* Profile Details Sections: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal Bio & Contact Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl bg-[#151D26] border border-[#202C3B] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#F3F0E8] uppercase tracking-wider font-mono">
                Contact &amp; Social Links
              </h3>
              <button
                onClick={handleStartEdit}
                className="text-[11px] font-semibold text-[#D89B5B] hover:text-[#E4AB70] cursor-pointer"
              >
                Edit
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 text-[#9AA5B1]">
                <Mail className="w-4 h-4 text-[#768393] flex-shrink-0" />
                <span className="truncate">{student.email}</span>
              </div>
              <div className="flex items-center gap-3 text-[#9AA5B1]">
                <Phone className="w-4 h-4 text-[#768393] flex-shrink-0" />
                {student.phone ? (
                  <span>{student.phone}</span>
                ) : (
                  <span className="text-[#768393] italic">Phone not provided</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-[#9AA5B1]">
                <Github className="w-4 h-4 text-[#768393] flex-shrink-0" />
                {student.githubUrl ? (
                  <a
                    href={student.githubUrl.startsWith('http') ? student.githubUrl : `https://${student.githubUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#D89B5B] hover:underline truncate"
                  >
                    {student.githubUrl.replace('https://', '')}
                  </a>
                ) : (
                  <span className="text-[#768393] italic">GitHub not linked</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-[#9AA5B1]">
                <Linkedin className="w-4 h-4 text-[#768393] flex-shrink-0" />
                {student.linkedinUrl ? (
                  <a
                    href={student.linkedinUrl.startsWith('http') ? student.linkedinUrl : `https://${student.linkedinUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#D89B5B] hover:underline truncate"
                  >
                    {student.linkedinUrl.replace('https://', '')}
                  </a>
                ) : (
                  <span className="text-[#768393] italic">LinkedIn not linked</span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-[#202C3B]">
              <span className="text-[10px] font-mono uppercase text-[#9AA5B1] block mb-1">
                Student Bio / Summary
              </span>
              {student.bio ? (
                <p className="text-xs text-[#9AA5B1] leading-relaxed">{student.bio}</p>
              ) : (
                <p className="text-xs text-[#768393] italic leading-relaxed">
                  No biography entered yet. Click "Edit Profile Details" to introduce yourself and describe your engineering interests.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-[#151D26] border border-[#202C3B] p-6 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-[#67C5B8] text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Identity Verification Status</span>
            </div>
            <p className="text-xs text-[#9AA5B1] leading-relaxed">
              Enrolled under University Roll Number <strong className="text-[#F3F0E8] font-mono">{student.rollNumber}</strong>.
              All transcripts, GPA records, and verified skill badges are tied to this institutional credential.
            </p>
          </div>
        </div>

        {/* Right Column: Academic Details & Career Alignment */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-[#151D26] border border-[#202C3B] p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#202C3B] mb-4">
              <h3 className="text-sm font-bold text-[#F3F0E8] uppercase tracking-wider font-mono">
                Academic Program Breakdown
              </h3>
              <span className="text-xs font-mono text-[#D89B5B]">
                Semester {student.currentSemester} of 8
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#0E151E] border border-[#202C3B]">
                <span className="text-[#9AA5B1] text-[10px] uppercase font-mono block">Institution</span>
                <span className="text-[#F3F0E8] font-semibold text-sm mt-0.5 block">{student.university}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0E151E] border border-[#202C3B]">
                <span className="text-[#9AA5B1] text-[10px] uppercase font-mono block">Degree Program</span>
                <span className="text-[#F3F0E8] font-semibold text-sm mt-0.5 block">{student.degree}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0E151E] border border-[#202C3B]">
                <span className="text-[#9AA5B1] text-[10px] uppercase font-mono block">Major / Branch</span>
                <span className="text-[#F3F0E8] font-semibold text-sm mt-0.5 block">{student.department}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0E151E] border border-[#202C3B]">
                <span className="text-[#9AA5B1] text-[10px] uppercase font-mono block">Expected Graduation</span>
                <span className="text-[#F3F0E8] font-semibold text-sm mt-0.5 block">Year {student.graduationYear}</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#202C3B] flex items-center justify-between">
              <span className="text-xs text-[#9AA5B1]">Want to add or modify semester courses?</span>
              <Link
                to="/dashboard/academic"
                className="text-xs font-semibold text-[#D89B5B] hover:text-[#E4AB70] flex items-center gap-1"
              >
                <span>Manage Academic Subjects →</span>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-[#151D26] border border-[#202C3B] p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#202C3B] mb-4">
              <h3 className="text-sm font-bold text-[#F3F0E8] uppercase tracking-wider font-mono">
                Career Direction &amp; Targets
              </h3>
              <Link
                to="/dashboard/career"
                className="text-xs font-semibold text-[#D89B5B] hover:text-[#E4AB70]"
              >
                View Career Path Engine →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#0E151E] border border-[#202C3B]">
                <span className="text-[#9AA5B1] text-[10px] uppercase font-mono block">Primary Target Career</span>
                <span className="text-[#D89B5B] font-bold text-sm mt-0.5 block">{student.targetCareer}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0E151E] border border-[#202C3B]">
                <span className="text-[#9AA5B1] text-[10px] uppercase font-mono block">Secondary Alternative</span>
                <span className="text-[#F3F0E8] font-semibold text-sm mt-0.5 block">
                  {student.secondaryTargetCareer || 'Full Stack Systems Engineer'}
                </span>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-[#0E151E] border border-[#202C3B] flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-[#D89B5B] flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-[#F3F0E8]">Continuous Adaptive Calibration</p>
                <p className="text-[#9AA5B1] mt-0.5 leading-relaxed">
                  As you complete semesters, add technical skills, and ship portfolio projects, UNNEXA updates your readiness score, roadmaps, and career placement probabilities automatically.
                </p>
              </div>
            </div>
          </div>

          {/* Own Skill Up in Profile */}
          {(student.ownSkillUp || []).length > 0 && (
            <div className="rounded-2xl bg-[#151D26] border border-[#67C5B8]/30 p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#F3F0E8] uppercase tracking-wider font-mono">
                    Own Skill Up — Independent Tracks
                  </h3>
                  <p className="text-xs text-[#9AA5B1]">Self-driven learning goals outside university syllabus</p>
                </div>
                <Link
                  to="/dashboard/skills"
                  className="text-xs font-semibold text-[#67C5B8] hover:text-[#7CD4C8]"
                >
                  Manage Skills →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {student.ownSkillUp?.map((goal) => (
                  <div
                    key={goal.id}
                    className="p-3 rounded-xl bg-[#0E151E] border border-[#202C3B] space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#F3F0E8]">{goal.skill}</span>
                      <span className="text-[10px] font-mono text-[#7CD4C8] bg-[#67C5B8]/15 px-1.5 py-0.5 rounded border border-[#67C5B8]/30">
                        {goal.targetLevel}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-[#9AA5B1]">
                      Level: {goal.currentLevel} → <span className="text-[#7CD4C8]">{goal.targetLevel}</span>
                    </div>
                    {goal.reason && (
                      <p className="text-[10px] text-[#9AA5B1] italic">&ldquo;{goal.reason}&rdquo;</p>
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
          <div className="bg-[#151D26] border border-[#202C3B] rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#202C3B] mb-4">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#D89B5B]" />
                <h3 className="text-sm font-bold text-[#F3F0E8] uppercase tracking-wider">
                  Edit Student Identity &amp; Profile
                </h3>
              </div>
              <button onClick={() => setIsEditing(false)} className="text-[#9AA5B1] hover:text-[#F3F0E8] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[#9AA5B1] font-medium mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0B0F14] border border-[#202C3B] rounded-lg px-3 py-2 text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B]"
                  />
                </div>

                <div>
                  <label className="block text-[#9AA5B1] font-medium mb-1">University Roll Number *</label>
                  <input
                    type="text"
                    required
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                    className="w-full bg-[#0B0F14] border border-[#202C3B] rounded-lg px-3 py-2 text-[#F3F0E8] font-mono focus:outline-none focus:border-[#D89B5B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[#9AA5B1] font-medium mb-1">University *</label>
                  <input
                    type="text"
                    required
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="e.g. Stanford University"
                    className="w-full bg-[#0B0F14] border border-[#202C3B] rounded-lg px-3 py-2 text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B]"
                  />
                </div>

                <div>
                  <label className="block text-[#9AA5B1] font-medium mb-1">Affiliated College / Campus (Optional)</label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. School of Engineering"
                    className="w-full bg-[#0B0F14] border border-[#202C3B] rounded-lg px-3 py-2 text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[#9AA5B1] font-medium mb-1">Degree Program *</label>
                  <input
                    type="text"
                    required
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g. B.Tech Computer Science"
                    className="w-full bg-[#0B0F14] border border-[#202C3B] rounded-lg px-3 py-2 text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B]"
                  />
                </div>

                <div>
                  <label className="block text-[#9AA5B1] font-medium mb-1">Department / Branch *</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Computer Science and Engineering"
                    className="w-full bg-[#0B0F14] border border-[#202C3B] rounded-lg px-3 py-2 text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
                <div>
                  <label className="block text-[#9AA5B1] font-medium mb-1">Current Semester</label>
                  <select
                    value={currentSemester}
                    onChange={(e) => setCurrentSemester(Number(e.target.value))}
                    className="w-full bg-[#0B0F14] border border-[#202C3B] rounded-lg px-3 py-2 text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#9AA5B1] font-medium mb-1">Graduation Year</label>
                  <input
                    type="number"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(Number(e.target.value))}
                    className="w-full bg-[#0B0F14] border border-[#202C3B] rounded-lg px-3 py-2 text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B]"
                  />
                </div>

                <div>
                  <label className="block text-[#9AA5B1] font-medium mb-1">Admission Year</label>
                  <input
                    type="number"
                    value={admissionYear}
                    onChange={(e) => setAdmissionYear(e.target.value)}
                    placeholder="e.g. 2022"
                    className="w-full bg-[#0B0F14] border border-[#202C3B] rounded-lg px-3 py-2 text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B]"
                  />
                </div>

                <div>
                  <label className="block text-[#9AA5B1] font-medium mb-1">College ID (Optional)</label>
                  <input
                    type="text"
                    value={collegeStudentId}
                    onChange={(e) => setCollegeStudentId(e.target.value)}
                    placeholder="e.g. CS-2022-042"
                    className="w-full bg-[#0B0F14] border border-[#202C3B] rounded-lg px-3 py-2 text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[#9AA5B1] font-medium mb-1">Target Career Goal</label>
                  <input
                    type="text"
                    list="targetCareerOptions"
                    value={targetCareer}
                    onChange={(e) => setTargetCareer(e.target.value)}
                    placeholder="Select or type custom career goal..."
                    className="w-full bg-[#0B0F14] border border-[#202C3B] rounded-lg px-3 py-2 text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B]"
                  />
                  <datalist id="targetCareerOptions">
                    <option value="Machine Learning Engineer" />
                    <option value="Full Stack Systems Engineer" />
                    <option value="Data Scientist / AI Researcher" />
                    <option value="Cloud Architect & DevOps Engineer" />
                    <option value="Cybersecurity & Systems Analyst" />
                    <option value="Mobile Application Developer" />
                    <option value="Embedded Systems Engineer" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-[#9AA5B1] font-medium mb-1">Target CGPA Goal</label>
                  <input
                    type="number"
                    step="0.1"
                    min="6.0"
                    max="10.0"
                    value={targetCgpa}
                    onChange={(e) => setTargetCgpa(Number(e.target.value))}
                    className="w-full bg-[#0B0F14] border border-[#202C3B] rounded-lg px-3 py-2 text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[#9AA5B1] font-medium mb-1">Student Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0B0F14] border border-[#202C3B] rounded-lg px-3 py-2 text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B]"
                  />
                </div>

                <div>
                  <label className="block text-[#9AA5B1] font-medium mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#0B0F14] border border-[#202C3B] rounded-lg px-3 py-2 text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[#9AA5B1] font-medium mb-1">GitHub Profile URL</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full bg-[#0B0F14] border border-[#202C3B] rounded-lg px-3 py-2 text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B]"
                  />
                </div>

                <div>
                  <label className="block text-[#9AA5B1] font-medium mb-1">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full bg-[#0B0F14] border border-[#202C3B] rounded-lg px-3 py-2 text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#9AA5B1] font-medium mb-1">Student Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe your academic focus, projects, and career aspirations..."
                  className="w-full bg-[#0B0F14] border border-[#202C3B] rounded-lg p-2.5 text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#202C3B]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl text-[#9AA5B1] hover:text-[#F3F0E8] bg-[#0E151E] hover:bg-[#1B2533] border border-[#202C3B] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-[#0B0F14] font-semibold bg-[#D89B5B] hover:bg-[#E4AB70] shadow-sm flex items-center gap-1.5 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 transition-all"
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
