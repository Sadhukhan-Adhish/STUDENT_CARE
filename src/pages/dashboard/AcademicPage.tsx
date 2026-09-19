import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  BookOpen,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  AlertCircle,
  BarChart2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { PageHeader, StatCard } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';
import {
  mockStudent,
  SubjectPerformance,
  AcademicSemester,
  calculateSGPA,
  calculateCGPA,
  hasEnoughDataForSGPA,
  hasEnoughDataForCGPA,
} from '../../data/mockData';

export const AcademicPage: React.FC = () => {
  const { user, addSubject, updateSubject, deleteSubject, addSemester } = useAuth();
  const student = user?.studentProfile || mockStudent;

  const subjects = student.subjects || [];
  const semesters = student.semesters || [];
  const totalSemesters = student.totalSemesters || 8;

  // Selected semester tab for viewing
  const [selectedSemesterTab, setSelectedSemesterTab] = useState<number | 'All'>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddSemesterOpen, setIsAddSemesterOpen] = useState(false);
  const [deleteConfirmCode, setDeleteConfirmCode] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<SubjectPerformance | null>(null);

  // Form states for Add / Edit Subject
  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<'Core' | 'Elective' | 'Math' | 'Lab'>('Core');
  const [formCredits, setFormCredits] = useState<number>(3);
  const [formSemester, setFormSemester] = useState<number>(student.currentSemester || 3);
  const [formInternalMarks, setFormInternalMarks] = useState<string>('');
  const [formExternalMarks, setFormExternalMarks] = useState<string>('');
  const [formTotalMarks, setFormTotalMarks] = useState<string>('');
  const [formGrade, setFormGrade] = useState('');
  const [formScore, setFormScore] = useState<string>('');
  const [formAttendance, setFormAttendance] = useState<string>('');

  // Form state for Add Semester
  const [semName, setSemName] = useState(`Semester ${(semesters.length || 0) + 1}`);
  const [semSgpa, setSemSgpa] = useState<string>('8.5');
  const [semCredits, setSemCredits] = useState<number>(20);

  // Real academic calculations
  const hasSgpaData = hasEnoughDataForSGPA(subjects);
  const currentSgpa = calculateSGPA(subjects);

  const hasCgpaData = hasEnoughDataForCGPA(semesters) || (student.cgpa !== undefined && student.cgpa > 0);
  const calculatedCgpa = calculateCGPA(semesters) ?? student.cgpa;

  const currentCredits = subjects.reduce((sum, s) => sum + (s.credits || 3), 0);

  const subjectsWithAttendance = subjects.filter((s) => typeof s.attendance === 'number' && !isNaN(s.attendance));
  const avgAttendance =
    subjectsWithAttendance.length > 0
      ? Math.round(subjectsWithAttendance.reduce((sum, s) => sum + (s.attendance || 0), 0) / subjectsWithAttendance.length)
      : null;

  const strongSubjects = subjects.filter(
    (s) => s.grade === 'A+' || s.grade === 'O' || s.grade === 'A' || (s.score && s.score >= 80)
  );
  const improvementSubjects = subjects.filter(
    (s) =>
      s.grade === 'C' ||
      s.grade === 'D' ||
      s.grade === 'F' ||
      (typeof s.score === 'number' && s.score < 70) ||
      (typeof s.attendance === 'number' && s.attendance < 75)
  );

  // Filtered subjects list
  const filteredSubjects = subjects.filter((s) => {
    const semNumber = typeof s.semester === 'number' ? s.semester : Number(String(s.semester).replace(/[^0-9]/g, '')) || 0;
    const matchesSemester = selectedSemesterTab === 'All' || semNumber === selectedSemesterTab;
    const matchesCategory = filterCategory === 'All' || s.category === filterCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSemester && matchesCategory && matchesSearch;
  });

  const openAddModal = () => {
    setFormCode('');
    setFormName('');
    setFormCategory('Core');
    setFormCredits(3);
    setFormSemester(selectedSemesterTab === 'All' ? student.currentSemester || 3 : selectedSemesterTab);
    setFormInternalMarks('');
    setFormExternalMarks('');
    setFormTotalMarks('');
    setFormGrade('');
    setFormScore('');
    setFormAttendance('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (sub: SubjectPerformance) => {
    setSelectedSubject(sub);
    setFormCode(sub.code);
    setFormName(sub.name);
    setFormCategory((sub.category as any) || 'Core');
    setFormCredits(sub.credits || 3);
    setFormSemester(typeof sub.semester === 'number' ? sub.semester : Number(String(sub.semester).replace(/[^0-9]/g, '')) || student.currentSemester || 3);
    setFormInternalMarks(sub.internalMarks !== undefined ? String(sub.internalMarks) : '');
    setFormExternalMarks(sub.externalMarks !== undefined ? String(sub.externalMarks) : '');
    setFormTotalMarks(sub.totalMarks !== undefined ? String(sub.totalMarks) : '');
    setFormGrade(sub.grade || '');
    setFormScore(sub.score !== undefined ? String(sub.score) : '');
    setFormAttendance(sub.attendance !== undefined ? String(sub.attendance) : '');
    setIsEditModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode.trim() || !formName.trim()) return;

    const scoreNum = formScore ? Number(formScore) : formTotalMarks ? Number(formTotalMarks) : undefined;
    const attNum = formAttendance ? Number(formAttendance) : undefined;
    const gradeVal = formGrade.trim().toUpperCase() || undefined;

    let status: 'Strong' | 'Average' | 'Needs Improvement' = 'Average';
    if ((scoreNum && scoreNum >= 80) || gradeVal === 'O' || gradeVal === 'A+' || gradeVal === 'A') {
      status = 'Strong';
    } else if ((scoreNum && scoreNum < 70) || (attNum && attNum < 75) || gradeVal === 'C' || gradeVal === 'D' || gradeVal === 'F') {
      status = 'Needs Improvement';
    }

    addSubject({
      code: formCode.trim().toUpperCase(),
      name: formName.trim(),
      category: formCategory,
      credits: Number(formCredits) || 3,
      semester: formSemester,
      internalMarks: formInternalMarks ? Number(formInternalMarks) : undefined,
      externalMarks: formExternalMarks ? Number(formExternalMarks) : undefined,
      totalMarks: formTotalMarks ? Number(formTotalMarks) : undefined,
      grade: gradeVal,
      score: scoreNum,
      attendance: attNum,
      status,
    });

    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject) return;

    const scoreNum = formScore ? Number(formScore) : formTotalMarks ? Number(formTotalMarks) : undefined;
    const attNum = formAttendance ? Number(formAttendance) : undefined;
    const gradeVal = formGrade.trim().toUpperCase() || undefined;

    let status: 'Strong' | 'Average' | 'Needs Improvement' = 'Average';
    if ((scoreNum && scoreNum >= 80) || gradeVal === 'O' || gradeVal === 'A+' || gradeVal === 'A') {
      status = 'Strong';
    } else if ((scoreNum && scoreNum < 70) || (attNum && attNum < 75) || gradeVal === 'C' || gradeVal === 'D' || gradeVal === 'F') {
      status = 'Needs Improvement';
    }

    updateSubject(selectedSubject.code, {
      code: formCode.trim().toUpperCase(),
      name: formName.trim(),
      category: formCategory,
      credits: Number(formCredits) || 3,
      semester: formSemester,
      internalMarks: formInternalMarks ? Number(formInternalMarks) : undefined,
      externalMarks: formExternalMarks ? Number(formExternalMarks) : undefined,
      totalMarks: formTotalMarks ? Number(formTotalMarks) : undefined,
      grade: gradeVal,
      score: scoreNum,
      attendance: attNum,
      status,
    });

    setIsEditModalOpen(false);
  };

  const handleDelete = (code: string) => {
    deleteSubject(code);
    setDeleteConfirmCode(null);
  };

  const handleAddSemester = (e: React.FormEvent) => {
    e.preventDefault();
    const sgpaVal = semSgpa ? Number(semSgpa) : undefined;
    addSemester({
      semester: semName.trim(),
      sgpa: sgpaVal,
      cgpa: calculatedCgpa,
      credits: Number(semCredits) || 20,
    });
    setIsAddSemesterOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <PageHeader
        title="Academic Performance & Coursework"
        subtitle={
          user?.isGuest
            ? 'Preview transcript analysis, semester SGPA telemetry, and coursework management in Guest Mode.'
            : `Live transcript analysis, semester SGPA telemetry, and coursework management for Roll Number ${student.rollNumber}.`
        }
        badge={user?.isGuest ? 'Guest Exploration' : `Semester ${student.currentSemester} Active`}
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={openAddModal}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/30 shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subject</span>
            </button>
            <button
              onClick={() => setIsAddSemesterOpen(true)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-[#141A28] hover:bg-[#1A2234] border border-[#212C42] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Add Semester</span>
            </button>
          </div>
        }
      />

      {/* First-Time Student Guidance Bar */}
      <div className="p-3.5 rounded-xl bg-[#0F1424] border border-[#1B253D] flex items-center gap-3 text-xs text-slate-300">
        <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 flex-shrink-0">
          <BookOpen className="w-4 h-4" />
        </div>
        <p className="leading-relaxed">
          <strong className="text-white font-medium">Academic Guidance:</strong> Your coursework records power NEXORA's skill-gap engine. Log your current courses, internal marks, and semester SGPA to automatically unlock personalized project suggestions and career roadmap stages.
        </p>
      </div>

      {/* Top Academic Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cumulative CGPA */}
        <StatCard
          title="Cumulative CGPA"
          value={hasCgpaData && calculatedCgpa ? calculatedCgpa.toFixed(2) : 'Pending'}
          change={hasCgpaData ? `Target: ${student.targetCgpa || 9.0}` : 'No SGPA recorded'}
          changeType={hasCgpaData ? 'positive' : 'neutral'}
          subtext={
            hasCgpaData
              ? `${semesters.length} Semesters Recorded`
              : 'Add your semester results to calculate CGPA.'
          }
          icon={GraduationCap}
          accentColor="indigo"
        />

        {/* Current SGPA */}
        <StatCard
          title={`Semester ${student.currentSemester} SGPA`}
          value={hasSgpaData && currentSgpa !== null ? currentSgpa.toFixed(2) : 'Pending'}
          change={hasSgpaData ? `${currentCredits} Credits Computed` : 'Awaiting Grades'}
          changeType={hasSgpaData ? 'positive' : 'neutral'}
          subtext={
            hasSgpaData
              ? `${subjects.length} registered courses`
              : 'Add your semester results to calculate SGPA.'
          }
          icon={Award}
          accentColor="cyan"
        />

        {/* Attendance */}
        <StatCard
          title="Curriculum Attendance"
          value={avgAttendance !== null ? `${avgAttendance}%` : 'Not Logged'}
          change={
            avgAttendance !== null
              ? avgAttendance >= 75
                ? 'Exam Eligible (≥75%)'
                : 'Warning: Below 75%'
              : 'Add subject attendance'
          }
          changeType={avgAttendance !== null && avgAttendance >= 75 ? 'positive' : 'neutral'}
          subtext={avgAttendance !== null ? 'Institutional threshold: 75%' : 'No attendance data recorded yet'}
          icon={Calendar}
          accentColor="emerald"
        />

        {/* Course Competency */}
        <StatCard
          title="Competency Status"
          value={`${strongSubjects.length} Strong / ${improvementSubjects.length} Focus`}
          change={subjects.length > 0 ? `${subjects.length} Enrolled` : 'No Subjects'}
          changeType="positive"
          subtext={
            subjects.length > 0
              ? `${strongSubjects.length} courses in Strong tier`
              : 'Add subjects to evaluate competency'
          }
          icon={Sparkles}
          accentColor="purple"
        />
      </div>

      {/* Dynamic Diagnostic Notice */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/30 via-[#0E1424] to-[#0A0D16] border border-indigo-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              {user?.isGuest ? 'Guest Demonstration Curriculum' : `Academic Record for ${student.name} (${student.department || student.degree})`}
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {user?.isGuest ? (
                <>Sample engineering coursework shown in Guest Mode. Explore courses, add custom subjects, or create your permanent student profile.</>
              ) : (
                <>Enrolled in <strong className="text-white">{student.college || student.university}</strong>. Currently in Semester {student.currentSemester} with {subjects.length} tracked subjects. Target Career: <span className="text-indigo-300 font-semibold">{student.targetCareer}</span>.</>
              )}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-[#141B2B] border border-[#212C42] text-xs font-mono text-amber-300">
          Roll No: {user?.isGuest ? 'GUEST-DEMO' : student.rollNumber}
        </div>
      </div>

      {/* Semester Progression Chart & Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progression Curve */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0D111A] border border-[#1B2232] p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Progression Curve</span>
              <h2 className="text-lg font-bold text-white mt-0.5">Semester Grade Point Averages</h2>
            </div>
            <span className="text-xs font-mono text-indigo-400 font-semibold">
              {semesters.length} Semesters Logged
            </span>
          </div>

          {semesters.length > 0 && semesters.some((s) => typeof s.sgpa === 'number' && s.sgpa > 0) ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={semesters} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#182234" vertical={false} />
                  <XAxis dataKey="semester" stroke="#64748B" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 10]} stroke="#64748B" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D131F',
                      borderColor: '#222C42',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#F8FAFC',
                    }}
                  />
                  <Bar dataKey="sgpa" fill="#6366F1" radius={[4, 4, 0, 0]} name="Semester SGPA" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center p-6 text-center border border-dashed border-[#1E2638] rounded-xl bg-[#090D15]">
              <BarChart2 className="w-10 h-10 text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-300">No Semester SGPA History Recorded Yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Add your completed semester SGPA using the "Add Semester" button above to visualize your academic progression curve.
              </p>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-[#182030] grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-[#101522] border border-[#192233]">
              <span className="text-slate-400 block text-[10px]">Registered Courses</span>
              <span className="font-mono font-bold text-slate-200">{subjects.length} Subjects</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#101522] border border-[#192233]">
              <span className="text-slate-400 block text-[10px]">Semester Credits</span>
              <span className="font-mono font-bold text-indigo-400">{currentCredits} Credits</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#101522] border border-[#192233]">
              <span className="text-slate-400 block text-[10px]">Calculated SGPA</span>
              <span className="font-mono font-bold text-emerald-400">
                {currentSgpa !== null ? currentSgpa.toFixed(2) : 'Awaiting Grades'}
              </span>
            </div>
          </div>
        </div>

        {/* Strong vs Improvement Subjects */}
        <div className="rounded-2xl bg-[#0D111A] border border-[#1B2232] p-6 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Diagnostic Summary</span>
            <h2 className="text-lg font-bold text-white mt-0.5">Subject Health Status</h2>

            <div className="mt-4 space-y-4">
              {/* Strong Subjects */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Strong Competencies ({strongSubjects.length})</span>
                </div>
                <div className="space-y-1.5">
                  {strongSubjects.slice(0, 3).map((s) => (
                    <div key={s.code} className="p-2.5 rounded-xl bg-[#111726] border border-[#1B263B] text-xs flex justify-between items-center">
                      <div>
                        <span className="font-medium text-slate-200">{s.name}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {s.code} • {s.credits} Credits {s.semester ? `• Sem ${s.semester}` : ''}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        {s.grade || 'Strong'} {s.score ? `(${s.score}%)` : ''}
                      </span>
                    </div>
                  ))}
                  {strongSubjects.length === 0 && (
                    <p className="text-xs text-slate-400 italic">No strong subjects logged yet.</p>
                  )}
                </div>
              </div>

              {/* Needs Improvement */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Attendance &amp; Score Focus ({improvementSubjects.length})</span>
                </div>
                <div className="space-y-1.5">
                  {improvementSubjects.slice(0, 3).map((s) => (
                    <div key={s.code} className="p-2.5 rounded-xl bg-[#111726] border border-[#1B263B] text-xs flex justify-between items-center">
                      <div>
                        <span className="font-medium text-slate-200">{s.name}</span>
                        <span className={`text-[10px] block font-mono ${typeof s.attendance === 'number' && s.attendance < 75 ? 'text-rose-400 font-bold' : 'text-amber-400/80'}`}>
                          {s.attendance !== undefined ? `Att: ${s.attendance}%` : ''} {typeof s.attendance === 'number' && s.attendance < 75 ? '⚠ Below 75%' : ''}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {s.grade || 'Review'} {s.score ? `(${s.score}%)` : ''}
                      </span>
                    </div>
                  ))}
                  {improvementSubjects.length === 0 && (
                    <p className="text-xs text-emerald-400/80">No subjects currently require critical remediation.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#182030] text-[11px] text-slate-400">
            Attendance threshold for university exam eligibility is 75%.
          </div>
        </div>
      </div>

      {/* Course Curriculum & Subject Management */}
      <div className="rounded-2xl bg-[#0D111A] border border-[#1B2232] p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Coursework Management</span>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Subject Portfolio ({filteredSubjects.length} of {subjects.length})
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subject or code..."
                className="bg-[#121826] border border-[#1D273C] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Filter Category Chips */}
            <div className="flex items-center gap-1 bg-[#121826] p-1 rounded-lg border border-[#1D273C]">
              {['All', 'Core', 'Elective', 'Math', 'Lab'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                    filterCategory === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Organize Subjects by Semester Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none border-b border-[#1A2234]">
          <button
            onClick={() => setSelectedSemesterTab('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedSemesterTab === 'All'
                ? 'bg-indigo-600 text-white font-bold'
                : 'bg-[#101522] text-slate-400 hover:text-white border border-[#1A2234]'
            }`}
          >
            All Semesters ({subjects.length})
          </button>
          {Array.from({ length: totalSemesters }, (_, i) => i + 1).map((semNum) => {
            const count = subjects.filter((s) => {
              const num = typeof s.semester === 'number' ? s.semester : Number(String(s.semester).replace(/[^0-9]/g, ''));
              return num === semNum;
            }).length;
            const isSelected = selectedSemesterTab === semNum;
            return (
              <button
                key={semNum}
                onClick={() => setSelectedSemesterTab(semNum)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer ${
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

        {filteredSubjects.length === 0 ? (
          <div className="py-12 px-4 text-center rounded-xl bg-[#090D15] border border-dashed border-[#1E2638]">
            <BookOpen className="w-9 h-9 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-200">No subjects found in this view</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Add your semester subjects to calculate SGPA and track your academic progression.
            </p>
            <button
              onClick={openAddModal}
              className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white inline-flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/30"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subject</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#1A2234] text-slate-400 font-mono text-[11px] uppercase">
                  <th className="py-3 px-3">Course Code</th>
                  <th className="py-3 px-3">Subject Name</th>
                  <th className="py-3 px-3">Semester</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Credits</th>
                  <th className="py-3 px-3">Grade</th>
                  <th className="py-3 px-3">Internal / External</th>
                  <th className="py-3 px-3">Total / Score</th>
                  <th className="py-3 px-3">Attendance</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151D2C]">
                {filteredSubjects.map((sub) => (
                  <tr key={sub.code} className="hover:bg-[#121828] transition-colors group">
                    <td className="py-3 px-3 font-mono font-semibold text-indigo-300">{sub.code}</td>
                    <td className="py-3 px-3 font-medium text-white">{sub.name}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">
                      {sub.semester ? `Sem ${sub.semester}` : `Sem ${student.currentSemester}`}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#161D2E] text-slate-300 border border-[#212C42]">
                        {sub.category || 'Core'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">{sub.credits}</td>
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      {sub.grade || <span className="text-slate-500 font-normal italic">Pending</span>}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400">
                      {sub.internalMarks !== undefined || sub.externalMarks !== undefined
                        ? `${sub.internalMarks ?? '-'}/${sub.externalMarks ?? '-'}`
                        : '-'}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-200">
                      {sub.score !== undefined ? `${sub.score}%` : sub.totalMarks !== undefined ? `${sub.totalMarks}` : '-'}
                    </td>
                    <td className="py-3 px-3 font-mono">
                      {sub.attendance !== undefined ? (
                        <span className={sub.attendance < 75 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                          {sub.attendance}%
                        </span>
                      ) : (
                        <span className="text-slate-500 font-normal italic">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {deleteConfirmCode === sub.code ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDelete(sub.code)}
                            className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-semibold cursor-pointer"
                          >
                            Confirm Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirmCode(null)}
                            className="px-2 py-1 rounded bg-[#1C2538] text-slate-400 hover:text-white text-[10px] cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(sub)}
                            className="p-1.5 rounded hover:bg-[#1A2338] text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Edit Subject"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmCode(sub.code)}
                            className="p-1.5 rounded hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Delete Subject"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: ADD SUBJECT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0D121C] border border-[#1E2638] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2638]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Add Subject / Course</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#182030] text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Subject Code *</label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="e.g. CS301"
                    className="w-full px-3 py-2 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white font-mono uppercase focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Subject Name *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Computer Networks"
                    className="w-full px-3 py-2 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Semester</label>
                  <select
                    value={formSemester}
                    onChange={(e) => setFormSemester(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white"
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
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white"
                  >
                    <option value="Core">Core</option>
                    <option value="Elective">Elective</option>
                    <option value="Lab">Lab</option>
                    <option value="Math">Math</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Credits *</label>
                  <input
                    type="number"
                    value={formCredits}
                    onChange={(e) => setFormCredits(Number(e.target.value))}
                    min={1}
                    max={6}
                    className="w-full px-3 py-2 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#090D15] border border-[#1A2234] space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                  Performance &amp; Attendance (Optional)
                </span>
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">Grade (e.g. A+)</label>
                    <input
                      type="text"
                      value={formGrade}
                      onChange={(e) => setFormGrade(e.target.value)}
                      placeholder="e.g. A"
                      className="w-full px-2.5 py-1.5 rounded bg-[#101522] border border-[#1E273A] text-xs text-white font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">Internal Marks</label>
                    <input
                      type="number"
                      value={formInternalMarks}
                      onChange={(e) => setFormInternalMarks(e.target.value)}
                      placeholder="e.g. 28"
                      className="w-full px-2.5 py-1.5 rounded bg-[#101522] border border-[#1E273A] text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">External Marks</label>
                    <input
                      type="number"
                      value={formExternalMarks}
                      onChange={(e) => setFormExternalMarks(e.target.value)}
                      placeholder="e.g. 62"
                      className="w-full px-2.5 py-1.5 rounded bg-[#101522] border border-[#1E273A] text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">Total Score / %</label>
                    <input
                      type="number"
                      value={formScore}
                      onChange={(e) => setFormScore(e.target.value)}
                      placeholder="e.g. 88"
                      min={0}
                      max={100}
                      className="w-full px-2.5 py-1.5 rounded bg-[#101522] border border-[#1E273A] text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">Attendance %</label>
                    <input
                      type="number"
                      value={formAttendance}
                      onChange={(e) => setFormAttendance(e.target.value)}
                      placeholder="e.g. 92"
                      min={0}
                      max={100}
                      className="w-full px-2.5 py-1.5 rounded bg-[#101522] border border-[#1E273A] text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-[#101522] border border-[#1E2638] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT SUBJECT */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0D121C] border border-[#1E2638] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2638]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-indigo-400" />
                <span>Edit Subject ({selectedSubject?.code})</span>
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#182030] text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Subject Code *</label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white font-mono uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Subject Name *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Semester</label>
                  <select
                    value={formSemester}
                    onChange={(e) => setFormSemester(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white"
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
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white"
                  >
                    <option value="Core">Core</option>
                    <option value="Elective">Elective</option>
                    <option value="Lab">Lab</option>
                    <option value="Math">Math</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Credits *</label>
                  <input
                    type="number"
                    value={formCredits}
                    onChange={(e) => setFormCredits(Number(e.target.value))}
                    min={1}
                    max={6}
                    className="w-full px-3 py-2 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#090D15] border border-[#1A2234] space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                  Performance &amp; Attendance
                </span>
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">Grade</label>
                    <input
                      type="text"
                      value={formGrade}
                      onChange={(e) => setFormGrade(e.target.value)}
                      placeholder="e.g. A+"
                      className="w-full px-2.5 py-1.5 rounded bg-[#101522] border border-[#1E273A] text-xs text-white font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">Internal</label>
                    <input
                      type="number"
                      value={formInternalMarks}
                      onChange={(e) => setFormInternalMarks(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-[#101522] border border-[#1E273A] text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">External</label>
                    <input
                      type="number"
                      value={formExternalMarks}
                      onChange={(e) => setFormExternalMarks(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-[#101522] border border-[#1E273A] text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">Total Score / %</label>
                    <input
                      type="number"
                      value={formScore}
                      onChange={(e) => setFormScore(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-[#101522] border border-[#1E273A] text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">Attendance %</label>
                    <input
                      type="number"
                      value={formAttendance}
                      onChange={(e) => setFormAttendance(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-[#101522] border border-[#1E273A] text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-[#101522] border border-[#1E2638] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SEMESTER */}
      {isAddSemesterOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0D121C] border border-[#1E2638] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2638]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Add Completed Semester</span>
              </h3>
              <button
                onClick={() => setIsAddSemesterOpen(false)}
                className="p-1 rounded-lg hover:bg-[#182030] text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSemester} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Semester Name *</label>
                <input
                  type="text"
                  value={semName}
                  onChange={(e) => setSemName(e.target.value)}
                  placeholder="e.g. Semester 2"
                  className="w-full px-3 py-2 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">SGPA Obtained *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={semSgpa}
                    onChange={(e) => setSemSgpa(e.target.value)}
                    placeholder="e.g. 8.65"
                    className="w-full px-3 py-2 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Total Credits *</label>
                  <input
                    type="number"
                    min="1"
                    max="35"
                    value={semCredits}
                    onChange={(e) => setSemCredits(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-[#090D15] border border-[#1E273A] text-xs text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddSemesterOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-[#101522] border border-[#1E2638] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  Record Semester
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
