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
  ChevronRight,
  Eye,
  Layers,
  Check,
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
  CollegeSyllabusItem,
  calculateSGPA,
  calculateCGPA,
  hasEnoughDataForSGPA,
  hasEnoughDataForCGPA,
} from '../../data/mockData';
import { SubjectDetailModal } from '../../components/academic/SubjectDetailModal';
import { SemesterModal } from '../../components/academic/SemesterModal';
import { CollegeSyllabusSection } from '../../components/academic/CollegeSyllabusSection';

export const AcademicPage: React.FC = () => {
  const {
    user,
    addSubject,
    updateSubject,
    deleteSubject,
    addSemester,
    updateSemester,
    deleteSemester,
    setCurrentSemester,
    addSyllabusItem,
    updateSyllabusItem,
    deleteSyllabusItem,
  } = useAuth();

  const student = user?.studentProfile || mockStudent;
  const subjects = student.subjects || [];
  const semesters = student.semesters || [];
  const syllabusList = student.syllabus || [];
  const activeCurrentSemester = student.currentSemester || 1;

  // Selected semester tab for viewing subjects
  const [selectedSemesterTab, setSelectedSemesterTab] = useState<number | 'All'>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isEditSubjectOpen, setIsEditSubjectOpen] = useState(false);
  const [isSemesterModalOpen, setIsSemesterModalOpen] = useState(false);
  const [editingSemesterData, setEditingSemesterData] = useState<AcademicSemester | null>(null);
  const [detailModalSubject, setDetailModalSubject] = useState<SubjectPerformance | null>(null);
  const [selectedSubjectToEdit, setSelectedSubjectToEdit] = useState<SubjectPerformance | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Subject Form States (Only Subject Name * is required!)
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formSemester, setFormSemester] = useState<number>(activeCurrentSemester);
  const [formCategory, setFormCategory] = useState<'Core' | 'Elective' | 'Math' | 'Lab' | string>('Core');
  const [formCredits, setFormCredits] = useState<string>('3');
  const [formInternalMarks, setFormInternalMarks] = useState<string>('');
  const [formExternalMarks, setFormExternalMarks] = useState<string>('');
  const [formTotalMarks, setFormTotalMarks] = useState<string>('');
  const [formGrade, setFormGrade] = useState('');
  const [formScore, setFormScore] = useState<string>('');
  const [formAttendance, setFormAttendance] = useState<string>('');

  // Real academic calculations
  const hasSgpaData = hasEnoughDataForSGPA(subjects);
  const currentSgpa = calculateSGPA(subjects);

  const hasCgpaData = hasEnoughDataForCGPA(semesters) || (student.cgpa !== undefined && student.cgpa > 0);
  const calculatedCgpa = calculateCGPA(semesters) ?? student.cgpa;

  // Credits computed only from entered numbers
  const subjectsWithCredits = subjects.filter((s) => typeof s.credits === 'number');
  const currentCredits = subjectsWithCredits.reduce((sum, s) => sum + (s.credits || 0), 0);

  const subjectsWithAttendance = subjects.filter((s) => typeof s.attendance === 'number' && !isNaN(s.attendance));
  const avgAttendance =
    subjectsWithAttendance.length > 0
      ? Math.round(
          subjectsWithAttendance.reduce((sum, s) => sum + (s.attendance || 0), 0) / subjectsWithAttendance.length
        )
      : null;

  const strongSubjects = subjects.filter(
    (s) =>
      s.grade === 'A+' ||
      s.grade === 'O' ||
      s.grade === 'A' ||
      (typeof s.score === 'number' && s.score >= 80) ||
      (typeof s.totalMarks === 'number' && s.totalMarks >= 80)
  );

  const improvementSubjects = subjects.filter(
    (s) =>
      s.grade === 'C' ||
      s.grade === 'D' ||
      s.grade === 'F' ||
      (typeof s.score === 'number' && s.score < 70) ||
      (typeof s.attendance === 'number' && s.attendance < 75)
  );

  // Compute available semester tabs (use student semesters + distinct from subjects + up to course total)
  const maxSemInUse = Math.max(
    activeCurrentSemester,
    semesters.length,
    ...subjects.map((s) => (typeof s.semester === 'number' ? s.semester : Number(String(s.semester).replace(/[^0-9]/g, '')) || 1)),
    ...syllabusList.map((s) => s.semester || 1),
    6
  );
  const totalSemestersToOffer = Math.min(Math.max(maxSemInUse, 8), 10);

  // Filtered subjects list
  const filteredSubjects = subjects.filter((s) => {
    const semNumber =
      typeof s.semester === 'number'
        ? s.semester
        : Number(String(s.semester).replace(/[^0-9]/g, '')) || s.semesterNumber || activeCurrentSemester;
    const matchesSemester = selectedSemesterTab === 'All' || semNumber === selectedSemesterTab;
    const matchesCategory = filterCategory === 'All' || s.category === filterCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.code && s.code.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSemester && matchesCategory && matchesSearch;
  });

  const isCompletelyEmpty = subjects.length === 0 && semesters.length === 0;

  // Open Add Subject Modal
  const openAddSubjectModal = (presetSemester?: number) => {
    setSelectedSubjectToEdit(null);
    setFormName('');
    setFormCode('');
    setFormSemester(
      presetSemester || (selectedSemesterTab === 'All' ? activeCurrentSemester : selectedSemesterTab)
    );
    setFormCategory('Core');
    setFormCredits('3');
    setFormInternalMarks('');
    setFormExternalMarks('');
    setFormTotalMarks('');
    setFormGrade('');
    setFormScore('');
    setFormAttendance('');
    setIsAddSubjectOpen(true);
  };

  // Open Edit Subject Modal
  const openEditSubjectModal = (sub: SubjectPerformance) => {
    setSelectedSubjectToEdit(sub);
    setFormName(sub.name);
    setFormCode(sub.code || '');
    const sem =
      typeof sub.semester === 'number'
        ? sub.semester
        : Number(String(sub.semester).replace(/[^0-9]/g, '')) || sub.semesterNumber || activeCurrentSemester;
    setFormSemester(sem);
    setFormCategory(sub.category || 'Core');
    setFormCredits(sub.credits !== undefined ? String(sub.credits) : '');
    setFormInternalMarks(sub.internalMarks !== undefined ? String(sub.internalMarks) : '');
    setFormExternalMarks(sub.externalMarks !== undefined ? String(sub.externalMarks) : '');
    setFormTotalMarks(sub.totalMarks !== undefined ? String(sub.totalMarks) : '');
    setFormGrade(sub.grade || '');
    setFormScore(sub.score !== undefined ? String(sub.score) : '');
    setFormAttendance(sub.attendance !== undefined ? String(sub.attendance) : '');
    setIsEditSubjectOpen(true);
  };

  const handleSaveAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

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
      name: formName.trim(),
      code: formCode.trim().toUpperCase() || undefined,
      category: formCategory || undefined,
      credits: formCredits ? Number(formCredits) : undefined,
      semester: formSemester,
      semesterNumber: formSemester,
      internalMarks: formInternalMarks ? Number(formInternalMarks) : undefined,
      externalMarks: formExternalMarks ? Number(formExternalMarks) : undefined,
      totalMarks: formTotalMarks ? Number(formTotalMarks) : undefined,
      grade: gradeVal,
      score: scoreNum,
      attendance: attNum,
      status,
    });

    setIsAddSubjectOpen(false);
  };

  const handleSaveEditSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectToEdit || !formName.trim()) return;

    const scoreNum = formScore ? Number(formScore) : formTotalMarks ? Number(formTotalMarks) : undefined;
    const attNum = formAttendance ? Number(formAttendance) : undefined;
    const gradeVal = formGrade.trim().toUpperCase() || undefined;

    let status: 'Strong' | 'Average' | 'Needs Improvement' = 'Average';
    if ((scoreNum && scoreNum >= 80) || gradeVal === 'O' || gradeVal === 'A+' || gradeVal === 'A') {
      status = 'Strong';
    } else if ((scoreNum && scoreNum < 70) || (attNum && attNum < 75) || gradeVal === 'C' || gradeVal === 'D' || gradeVal === 'F') {
      status = 'Needs Improvement';
    }

    const idOrCode = selectedSubjectToEdit.id || selectedSubjectToEdit.code || selectedSubjectToEdit.name;

    updateSubject(idOrCode, {
      name: formName.trim(),
      code: formCode.trim().toUpperCase() || undefined,
      category: formCategory || undefined,
      credits: formCredits ? Number(formCredits) : undefined,
      semester: formSemester,
      semesterNumber: formSemester,
      internalMarks: formInternalMarks ? Number(formInternalMarks) : undefined,
      externalMarks: formExternalMarks ? Number(formExternalMarks) : undefined,
      totalMarks: formTotalMarks ? Number(formTotalMarks) : undefined,
      grade: gradeVal,
      score: scoreNum,
      attendance: attNum,
      status,
    });

    setIsEditSubjectOpen(false);
  };

  const handleDeleteSubject = (idOrCode: string) => {
    deleteSubject(idOrCode);
    setDeleteConfirmId(null);
  };

  const handleOpenSemesterModal = (sem?: AcademicSemester) => {
    setEditingSemesterData(sem || null);
    setIsSemesterModalOpen(true);
  };

  const handleSaveSemester = (sem: AcademicSemester, isCurrent?: boolean) => {
    if (editingSemesterData) {
      updateSemester(editingSemesterData.semester, sem);
    } else {
      addSemester(sem);
    }
    if (isCurrent && sem.semesterNumber) {
      setCurrentSemester(sem.semesterNumber);
    }
  };

  const handleDeleteSemester = (semIdentifier: string | number) => {
    deleteSemester(semIdentifier);
  };

  // Find linked syllabus item for subject detail modal if any
  const getLinkedSyllabusItem = (sub: SubjectPerformance | null): CollegeSyllabusItem | undefined => {
    if (!sub) return undefined;
    return syllabusList.find(
      (s) =>
        (sub.code && s.subjectCode && s.subjectCode.toUpperCase() === sub.code.toUpperCase()) ||
        (s.subjectName && s.subjectName.toLowerCase() === sub.name.toLowerCase())
    );
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Page Header */}
      <PageHeader
        title="Academic Performance & Coursework"
        subtitle={
          user?.isGuest
            ? 'Manage your coursework, semester performance, and syllabus tracking in your guest session.'
            : `Coursework, semester performance, and syllabus management for ${student.name || 'Student'}${student.rollNumber ? ` (${student.rollNumber})` : ''}.`
        }
        badge={user?.isGuest ? 'Guest Session' : `Semester ${activeCurrentSemester} Active`}
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => openAddSubjectModal()}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] transition-all duration-150 flex items-center gap-1.5 cursor-pointer shadow-sm hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subject</span>
            </button>
            <button
              onClick={() => handleOpenSemesterModal()}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-[#F3F0E8] bg-[#1B2533] hover:bg-[#223042] border border-[#27384B] transition-all duration-150 flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#D89B5B]" />
              <span>Add Semester</span>
            </button>
          </div>
        }
      />

      {/* Academic Identity & Current Semester Banner */}
      <div className="p-4 rounded-2xl bg-[#151D26] border border-[#202C3B] hover:border-[#27384B] transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#D89B5B]/15 border border-[#D89B5B]/30 text-[#D89B5B] mt-0.5">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-[#F3F0E8] font-heading">
                {student.college || student.university || 'University'}
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1B2533] text-[#D89B5B] border border-[#27384B]">
                {student.degree || 'Undergraduate'} • {student.department || 'General'}
              </span>
            </div>
            <p className="text-xs text-[#9AA5B1] mt-0.5">
              Roll No: <span className="font-mono text-[#F3F0E8]">{student.rollNumber}</span>
              {student.graduationYear ? ` • Graduating Class of ${student.graduationYear}` : ''}
            </p>
          </div>
        </div>

        {/* Current Semester Selector / Indicator */}
        <div className="flex items-center gap-2.5 flex-shrink-0 bg-[#0E151E] p-1.5 rounded-xl border border-[#202C3B]">
          <span className="text-[11px] font-mono text-[#9AA5B1] pl-2">Current Semester:</span>
          <select
            value={activeCurrentSemester}
            onChange={(e) => setCurrentSemester(Number(e.target.value))}
            className="px-2.5 py-1 rounded-lg bg-[#1B2533] text-[#F3F0E8] border border-[#27384B] text-xs font-mono font-bold focus:outline-none focus:border-[#D89B5B] cursor-pointer"
          >
            {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => (
              <option key={s} value={s} className="bg-[#151D26] text-[#F3F0E8]">
                Semester {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* EMPTY STATE HERO FOR NEW STUDENT WITHOUT ACADEMIC RECORDS */}
      {isCompletelyEmpty && !user?.isGuest && (
        <div className="p-8 rounded-2xl bg-[#151D26] border border-dashed border-[#27384B] text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D89B5B]/15 border border-[#D89B5B]/30 flex items-center justify-center mx-auto text-[#D89B5B]">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-[#F3F0E8]">Your Academic Profile</h3>
            <p className="text-xs text-[#9AA5B1] mt-1.5 leading-relaxed">
              Add your semester subjects and academic records to start tracking your academic progress.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => openAddSubjectModal()}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] transition-all duration-150 inline-flex items-center gap-1.5 cursor-pointer shadow-sm hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subject</span>
            </button>
            <button
              onClick={() => handleOpenSemesterModal()}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#F3F0E8] bg-[#1B2533] hover:bg-[#223042] border border-[#27384B] transition-all duration-150 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#D89B5B]" />
              <span>Add Semester Data</span>
            </button>
            <button
              onClick={() => {
                const sylSection = document.getElementById('college-syllabus-section');
                sylSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#F3F0E8] bg-[#1B2533] hover:bg-[#223042] border border-[#27384B] transition-all duration-150 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-[#67C5B8]" />
              <span>Add College Syllabus</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Academic Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cumulative CGPA */}
        <StatCard
          title="Cumulative CGPA"
          value={hasCgpaData && calculatedCgpa && calculatedCgpa > 0 ? calculatedCgpa.toFixed(2) : '—'}
          change={hasCgpaData && calculatedCgpa && calculatedCgpa > 0 ? `Target: ${student.targetCgpa || 9.0}` : 'No academic data yet'}
          changeType={hasCgpaData && calculatedCgpa && calculatedCgpa > 0 ? 'positive' : 'neutral'}
          subtext={
            hasCgpaData && calculatedCgpa && calculatedCgpa > 0
              ? `${semesters.length} Semesters Recorded`
              : 'Add semester results to compute'
          }
          icon={GraduationCap}
          accentColor="copper"
        />

        {/* Current SGPA */}
        <StatCard
          title={`Semester ${activeCurrentSemester} SGPA`}
          value={hasSgpaData && currentSgpa !== null && currentSgpa > 0 ? currentSgpa.toFixed(2) : '—'}
          change={hasSgpaData && currentSgpa !== null && currentSgpa > 0 ? `${currentCredits} Credits Computed` : 'Awaiting grades'}
          changeType={hasSgpaData && currentSgpa !== null && currentSgpa > 0 ? 'positive' : 'neutral'}
          subtext={
            hasSgpaData && currentSgpa !== null && currentSgpa > 0
              ? `${subjects.length} registered courses`
              : 'Add marks and credits to compute'
          }
          icon={Award}
          accentColor="teal"
        />

        {/* Attendance */}
        <StatCard
          title="Curriculum Attendance"
          value={avgAttendance !== null ? `${avgAttendance}%` : 'Not recorded'}
          change={
            avgAttendance !== null
              ? avgAttendance >= 75
                ? 'Exam Eligible (≥75%)'
                : 'Warning: Below 75%'
              : 'No attendance data yet'
          }
          changeType={avgAttendance !== null && avgAttendance >= 75 ? 'positive' : 'neutral'}
          subtext={
            avgAttendance !== null
              ? 'Institutional threshold: 75%'
              : 'Add subject attendance to evaluate'
          }
          icon={Calendar}
          accentColor="teal"
        />

        {/* Course Competency */}
        <StatCard
          title="Course Competencies"
          value={subjects.length > 0 ? `${strongSubjects.length} Strong / ${improvementSubjects.length} Focus` : 'No subjects'}
          change={subjects.length > 0 ? `${subjects.length} Courses Enrolled` : 'No courses enrolled'}
          changeType={subjects.length > 0 ? 'positive' : 'neutral'}
          subtext={
            subjects.length > 0
              ? `${strongSubjects.length} courses in Strong tier`
              : 'Add subjects to evaluate competency'
          }
          icon={Sparkles}
          accentColor="copper"
        />
      </div>

      {/* Semester Progression Chart & Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progression Curve */}
        <div className="lg:col-span-2 rounded-2xl bg-[#151D26] border border-[#202C3B] p-6 shadow-xl transition-all duration-200 hover:border-[#27384B] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#9AA5B1]">Progression Curve</span>
                <h2 className="text-lg font-bold text-[#F3F0E8] mt-0.5">Semester Grade Point Averages</h2>
              </div>
              <button
                onClick={() => handleOpenSemesterModal()}
                className="text-xs font-mono text-[#D89B5B] hover:text-[#E4AB70] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add / Edit Semester</span>
              </button>
            </div>

            {semesters.length > 0 && semesters.some((s) => typeof s.sgpa === 'number' && s.sgpa > 0) ? (
              <div className="h-60 w-full min-h-[240px]">
                <ResponsiveContainer width="100%" height="100%" minHeight={240} initialDimension={{ width: 600, height: 240 }}>
                  <BarChart data={semesters} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#202C3B" vertical={false} />
                    <XAxis dataKey="semester" stroke="#768393" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 10]} stroke="#768393" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#151D26',
                        borderColor: '#27384B',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#F3F0E8',
                      }}
                    />
                    <Bar dataKey="sgpa" fill="#D89B5B" radius={[4, 4, 0, 0]} name="Semester SGPA" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-60 flex flex-col items-center justify-center p-6 text-center border border-dashed border-[#27384B] rounded-xl bg-[#0E151E]">
                <BarChart2 className="w-10 h-10 text-[#768393] mb-2" />
                <p className="text-sm font-semibold text-[#F3F0E8]">No Semester SGPA History Recorded</p>
                <p className="text-xs text-[#9AA5B1] mt-1 max-w-sm">
                  Add your completed semester SGPA using the "Add Semester" button to visualize your academic progression curve.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#1E2938] grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-[#0E151E] border border-[#202C3B]">
              <span className="text-[#9AA5B1] block text-[10px]">Registered Courses</span>
              <span className="font-mono font-bold text-[#F3F0E8]">{subjects.length} Subjects</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0E151E] border border-[#202C3B]">
              <span className="text-[#9AA5B1] block text-[10px]">Total Credits</span>
              <span className="font-mono font-bold text-[#D89B5B]">{currentCredits} Credits</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0E151E] border border-[#202C3B]">
              <span className="text-[#9AA5B1] block text-[10px]">Calculated SGPA</span>
              <span className="font-mono font-bold text-[#67C5B8]">
                {currentSgpa !== null ? currentSgpa.toFixed(2) : 'Awaiting Grades'}
              </span>
            </div>
          </div>
        </div>

        {/* Strong vs Focus Remediation Card */}
        <div className="rounded-2xl bg-[#151D26] border border-[#202C3B] p-6 shadow-xl transition-all duration-200 hover:border-[#27384B] flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#9AA5B1]">Diagnostic Summary</span>
            <h2 className="text-lg font-bold text-[#F3F0E8] mt-0.5">Subject Health Status</h2>

            <div className="mt-4 space-y-4">
              {/* Strong Subjects */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#67C5B8] mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Strong Competencies ({strongSubjects.length})</span>
                </div>
                <div className="space-y-1.5">
                  {strongSubjects.slice(0, 3).map((s, idx) => (
                    <div
                      key={s.id || s.code || idx}
                      onClick={() => setDetailModalSubject(s)}
                      className="p-2.5 rounded-xl bg-[#0E151E] border border-[#202C3B] text-xs flex justify-between items-center cursor-pointer hover:border-[#67C5B8]/40 transition-all duration-150"
                    >
                      <div>
                        <span className="font-medium text-[#F3F0E8]">{s.name}</span>
                        <span className="text-[10px] text-[#9AA5B1] block font-mono">
                          {s.code || 'Core Course'} {s.credits ? `• ${s.credits} Credits` : ''}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded font-mono font-bold bg-[#67C5B8]/15 text-[#7CD4C8] border border-[#67C5B8]/30">
                        {s.grade || 'Strong'}
                      </span>
                    </div>
                  ))}
                  {strongSubjects.length === 0 && (
                    <p className="text-xs text-[#768393] italic">No strong subjects logged yet.</p>
                  )}
                </div>
              </div>

              {/* Needs Improvement */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#D89B5B] mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Attendance &amp; Score Focus ({improvementSubjects.length})</span>
                </div>
                <div className="space-y-1.5">
                  {improvementSubjects.slice(0, 3).map((s, idx) => (
                    <div
                      key={s.id || s.code || idx}
                      onClick={() => setDetailModalSubject(s)}
                      className="p-2.5 rounded-xl bg-[#0E151E] border border-[#202C3B] text-xs flex justify-between items-center cursor-pointer hover:border-[#D89B5B]/40 transition-all duration-150"
                    >
                      <div>
                        <span className="font-medium text-[#F3F0E8]">{s.name}</span>
                        <span className={`text-[10px] block font-mono ${typeof s.attendance === 'number' && s.attendance < 75 ? 'text-rose-400 font-bold' : 'text-[#D89B5B]/90'}`}>
                          {s.attendance !== undefined ? `Att: ${s.attendance}%` : 'Review Marks'}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded font-mono font-bold bg-[#D89B5B]/15 text-[#E8B47E] border border-[#D89B5B]/30">
                        {s.grade || 'Review'}
                      </span>
                    </div>
                  ))}
                  {improvementSubjects.length === 0 && (
                    <p className="text-xs text-[#768393] italic">No remediation needed at this time.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1E2938] text-[11px] text-[#9AA5B1]">
            Attendance threshold for university exam eligibility is typically 75%.
          </div>
        </div>
      </div>

      {/* Course Curriculum & Subject Management */}
      <div className="rounded-2xl bg-[#151D26] border border-[#202C3B] p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#9AA5B1]">Coursework Portfolio</span>
            <h2 className="text-lg font-bold text-[#F3F0E8] mt-0.5">
              Subject List ({filteredSubjects.length} of {subjects.length})
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#9AA5B1] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subject or code..."
                className="bg-[#0E151E] border border-[#202C3B] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#F3F0E8] placeholder-[#768393] focus:outline-none focus:border-[#D89B5B]"
              />
            </div>

            {/* Filter Category Chips */}
            <div className="flex items-center gap-1 bg-[#0E151E] p-1 rounded-lg border border-[#202C3B]">
              {['All', 'Core', 'Elective', 'Math', 'Lab'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                    filterCategory === cat
                      ? 'bg-[#D89B5B] text-[#0B0F14] font-semibold shadow-sm'
                      : 'text-[#9AA5B1] hover:text-[#F3F0E8]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => openAddSubjectModal()}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#D89B5B] hover:bg-[#E4AB70] text-[#0B0F14] inline-flex items-center gap-1.5 cursor-pointer shadow-sm transition-all duration-150"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subject</span>
            </button>
          </div>
        </div>

        {/* Semester Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-[#202C3B]">
          <button
            onClick={() => setSelectedSemesterTab('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedSemesterTab === 'All'
                ? 'bg-[#D89B5B] text-[#0B0F14] font-bold shadow-sm'
                : 'bg-[#0E151E] text-[#9AA5B1] hover:text-[#F3F0E8] border border-[#202C3B]'
            }`}
          >
            All Semesters ({subjects.length})
          </button>
          {Array.from({ length: totalSemestersToOffer }, (_, i) => i + 1).map((semNum) => {
            const count = subjects.filter((s) => {
              const num =
                typeof s.semester === 'number'
                  ? s.semester
                  : Number(String(s.semester).replace(/[^0-9]/g, '')) || s.semesterNumber;
              return num === semNum;
            }).length;
            const isSelected = selectedSemesterTab === semNum;
            const isCurrent = activeCurrentSemester === semNum;

            return (
              <button
                key={semNum}
                onClick={() => setSelectedSemesterTab(semNum)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#D89B5B] text-[#0B0F14] font-bold shadow-sm'
                    : isCurrent
                    ? 'bg-[#1B2533] text-[#7CD4C8] border border-[#67C5B8]/30'
                    : 'bg-[#0E151E] text-[#9AA5B1] hover:text-[#F3F0E8] border border-[#202C3B]'
                }`}
              >
                <span>Sem {semNum} {count > 0 ? `(${count})` : ''}</span>
                {isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#67C5B8]" title="Active Current Semester" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Semester Quick Header (when viewing a specific semester) */}
        {selectedSemesterTab !== 'All' && (
          <div className="p-3.5 rounded-xl bg-[#0E151E] border border-[#202C3B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#F3F0E8] font-mono">Semester {selectedSemesterTab}</span>
              {activeCurrentSemester === selectedSemesterTab ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#67C5B8]/15 text-[#7CD4C8] border border-[#67C5B8]/30">
                  Current Active Semester
                </span>
              ) : (
                <button
                  onClick={() => setCurrentSemester(selectedSemesterTab)}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1B2533] text-[#9AA5B1] hover:text-[#F3F0E8] border border-[#27384B] cursor-pointer"
                >
                  Set as Current Semester
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAddSubjectModal(selectedSemesterTab)}
                className="text-xs font-semibold text-[#D89B5B] hover:text-[#E4AB70] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Subject to Sem {selectedSemesterTab}</span>
              </button>
            </div>
          </div>
        )}

        {/* Subjects List or Empty State */}
        {filteredSubjects.length === 0 ? (
          <div className="py-12 px-4 text-center rounded-xl bg-[#0E151E] border border-dashed border-[#27384B]">
            <BookOpen className="w-9 h-9 text-[#768393] mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#F3F0E8]">No subjects found in this view</p>
            <p className="text-xs text-[#9AA5B1] mt-1 max-w-sm mx-auto">
              Add your subjects to calculate your SGPA and track coursework topics. Only Subject Name is required.
            </p>
            <button
              onClick={() => openAddSubjectModal(selectedSemesterTab === 'All' ? activeCurrentSemester : selectedSemesterTab)}
              className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold bg-[#D89B5B] hover:bg-[#E4AB70] text-[#0B0F14] inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subject</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#202C3B] text-[#9AA5B1] font-mono text-[11px] uppercase">
                  <th className="py-3 px-3">Subject Name</th>
                  <th className="py-3 px-3">Code</th>
                  <th className="py-3 px-3">Semester</th>
                  <th className="py-3 px-3">Credits</th>
                  <th className="py-3 px-3">Grade</th>
                  <th className="py-3 px-3">Marks</th>
                  <th className="py-3 px-3">Attendance</th>
                  <th className="py-3 px-3">Syllabus</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2938]">
                {filteredSubjects.map((sub, idx) => {
                  const subId = sub.id || sub.code || `sub-${idx}`;
                  const linkedSyllabus = getLinkedSyllabusItem(sub);
                  const topicCount = linkedSyllabus?.topics?.length || sub.topics?.length || 0;

                  return (
                    <tr
                      key={subId}
                      className="hover:bg-[#1B2533]/50 transition-colors group cursor-pointer"
                      onClick={() => setDetailModalSubject(sub)}
                    >
                      <td className="py-3 px-3 font-medium text-[#F3F0E8]">
                        <div className="flex items-center gap-2">
                          <span>{sub.name}</span>
                          {sub.category && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#0E151E] text-[#9AA5B1] border border-[#202C3B]">
                              {sub.category}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-[#D89B5B]">
                        {sub.code || <span className="text-[#768393] italic font-normal">-</span>}
                      </td>
                      <td className="py-3 px-3 font-mono text-[#9AA5B1]">
                        Sem {sub.semester || sub.semesterNumber || activeCurrentSemester}
                      </td>
                      <td className="py-3 px-3 font-mono text-[#F3F0E8]">
                        {sub.credits !== undefined ? sub.credits : '-'}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-[#F3F0E8]">
                        {sub.grade || <span className="text-[#768393] font-normal italic">Pending</span>}
                      </td>
                      <td className="py-3 px-3 font-mono text-[#F3F0E8]">
                        {sub.internalMarks !== undefined || sub.externalMarks !== undefined ? (
                          <span>
                            {sub.internalMarks ?? '-'}/{sub.externalMarks ?? '-'}
                          </span>
                        ) : sub.score !== undefined ? (
                          `${sub.score}%`
                        ) : sub.totalMarks !== undefined ? (
                          sub.totalMarks
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono">
                        {sub.attendance !== undefined ? (
                          <span className={sub.attendance < 75 ? 'text-rose-400 font-bold' : 'text-[#67C5B8]'}>
                            {sub.attendance}%
                          </span>
                        ) : (
                          <span className="text-[#768393] font-normal italic">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-[#9AA5B1]">
                        {topicCount > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[#67C5B8] text-[11px]">
                            <Layers className="w-3 h-3 text-[#67C5B8]" />
                            <span>{topicCount} Units</span>
                          </span>
                        ) : (
                          <span className="text-[#768393] italic text-[11px]">-</span>
                        )}
                      </td>
                      <td
                        className="py-3 px-3 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {deleteConfirmId === subId ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleDeleteSubject(subId)}
                              className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-semibold cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1 rounded bg-[#1B2533] text-[#9AA5B1] hover:text-[#F3F0E8] text-[10px] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setDetailModalSubject(sub)}
                              className="p-1.5 rounded hover:bg-[#1B2533] text-[#9AA5B1] hover:text-[#F3F0E8] transition-colors cursor-pointer"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openEditSubjectModal(sub)}
                              className="p-1.5 rounded hover:bg-[#1B2533] text-[#9AA5B1] hover:text-[#F3F0E8] transition-colors cursor-pointer"
                              title="Edit Subject"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(subId)}
                              className="p-1.5 rounded hover:bg-rose-500/10 text-[#9AA5B1] hover:text-rose-400 transition-colors cursor-pointer"
                              title="Delete Subject"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* COLLEGE SYLLABUS SECTION */}
      <div id="college-syllabus-section">
        <CollegeSyllabusSection
          syllabusList={syllabusList}
          subjects={subjects}
          currentSemester={activeCurrentSemester}
          degree={student.degree}
          department={student.department}
          college={student.college || student.university}
          onAddSyllabus={addSyllabusItem}
          onUpdateSyllabus={updateSyllabusItem}
          onDeleteSyllabus={deleteSyllabusItem}
        />
      </div>

      {/* MODAL: ADD SUBJECT */}
      {isAddSubjectOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-[#151D26] border border-[#27384B] rounded-2xl p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#202C3B]">
              <h3 className="text-base font-bold text-[#F3F0E8] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#D89B5B]" />
                <span>Add Subject</span>
              </h3>
              <button
                onClick={() => setIsAddSubjectOpen(false)}
                className="p-1 rounded-lg hover:bg-[#1B2533] text-[#9AA5B1] hover:text-[#F3F0E8] cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAddSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#9AA5B1] mb-1">
                  Subject Name <span className="text-rose-400 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Data Structures, Applied Calculus, Operating Systems"
                  className="w-full px-3 py-2 rounded-lg bg-[#0E151E] border border-[#202C3B] text-xs text-[#F3F0E8] placeholder-[#768393] focus:outline-none focus:border-[#D89B5B]"
                  required
                />
                <span className="text-[11px] text-[#768393] mt-0.5 block font-mono">
                  Only Subject Name is required. All other fields below are optional.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#9AA5B1] mb-1">
                    Subject Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="e.g. CS201"
                    className="w-full px-3 py-2 rounded-lg bg-[#0E151E] border border-[#202C3B] text-xs text-[#F3F0E8] font-mono uppercase focus:outline-none focus:border-[#D89B5B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#9AA5B1] mb-1">Semester</label>
                  <select
                    value={formSemester}
                    onChange={(e) => setFormSemester(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-lg bg-[#0E151E] border border-[#202C3B] text-xs text-[#F3F0E8] focus:border-[#D89B5B]"
                  >
                    {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => (
                      <option key={s} value={s} className="bg-[#151D26] text-[#F3F0E8]">
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#9AA5B1] mb-1">Credits (Optional)</label>
                  <input
                    type="number"
                    value={formCredits}
                    onChange={(e) => setFormCredits(e.target.value)}
                    placeholder="e.g. 3 or 4"
                    min={0}
                    max={10}
                    className="w-full px-3 py-2 rounded-lg bg-[#0E151E] border border-[#202C3B] text-xs text-[#F3F0E8] font-mono focus:outline-none focus:border-[#D89B5B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#9AA5B1] mb-1">Category (Optional)</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg bg-[#0E151E] border border-[#202C3B] text-xs text-[#F3F0E8] focus:border-[#D89B5B]"
                  >
                    <option value="Core" className="bg-[#151D26] text-[#F3F0E8]">Core</option>
                    <option value="Elective" className="bg-[#151D26] text-[#F3F0E8]">Elective</option>
                    <option value="Lab" className="bg-[#151D26] text-[#F3F0E8]">Lab</option>
                    <option value="Math" className="bg-[#151D26] text-[#F3F0E8]">Math</option>
                    <option value="Humanities" className="bg-[#151D26] text-[#F3F0E8]">Humanities</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0E151E] border border-[#202C3B] space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#9AA5B1] block">
                  Performance &amp; Attendance (Optional)
                </span>
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-mono text-[#9AA5B1] mb-1">Grade</label>
                    <input
                      type="text"
                      value={formGrade}
                      onChange={(e) => setFormGrade(e.target.value)}
                      placeholder="e.g. A+"
                      className="w-full px-2.5 py-1.5 rounded bg-[#151D26] border border-[#202C3B] text-xs text-[#F3F0E8] font-mono uppercase focus:outline-none focus:border-[#D89B5B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#9AA5B1] mb-1">Internal Marks</label>
                    <input
                      type="number"
                      value={formInternalMarks}
                      onChange={(e) => setFormInternalMarks(e.target.value)}
                      placeholder="e.g. 28"
                      className="w-full px-2.5 py-1.5 rounded bg-[#151D26] border border-[#202C3B] text-xs text-[#F3F0E8] font-mono focus:outline-none focus:border-[#D89B5B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#9AA5B1] mb-1">External Marks</label>
                    <input
                      type="number"
                      value={formExternalMarks}
                      onChange={(e) => setFormExternalMarks(e.target.value)}
                      placeholder="e.g. 64"
                      className="w-full px-2.5 py-1.5 rounded bg-[#151D26] border border-[#202C3B] text-xs text-[#F3F0E8] font-mono focus:outline-none focus:border-[#D89B5B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-mono text-[#9AA5B1] mb-1">Total Score / %</label>
                    <input
                      type="number"
                      value={formScore}
                      onChange={(e) => setFormScore(e.target.value)}
                      placeholder="e.g. 88"
                      min={0}
                      max={100}
                      className="w-full px-2.5 py-1.5 rounded bg-[#151D26] border border-[#202C3B] text-xs text-[#F3F0E8] font-mono focus:outline-none focus:border-[#D89B5B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#9AA5B1] mb-1">Attendance %</label>
                    <input
                      type="number"
                      value={formAttendance}
                      onChange={(e) => setFormAttendance(e.target.value)}
                      placeholder="e.g. 92"
                      min={0}
                      max={100}
                      className="w-full px-2.5 py-1.5 rounded bg-[#151D26] border border-[#202C3B] text-xs text-[#F3F0E8] font-mono focus:outline-none focus:border-[#D89B5B]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#202C3B]">
                <button
                  type="button"
                  onClick={() => setIsAddSubjectOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#9AA5B1] hover:text-[#F3F0E8] bg-[#1B2533] border border-[#27384B] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#D89B5B] hover:bg-[#E4AB70] text-[#0B0F14] shadow-sm cursor-pointer transition-all duration-150"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT SUBJECT */}
      {isEditSubjectOpen && selectedSubjectToEdit && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-[#151D26] border border-[#27384B] rounded-2xl p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#202C3B]">
              <h3 className="text-base font-bold text-[#F3F0E8] flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#D89B5B]" />
                <span>Edit Subject</span>
              </h3>
              <button
                onClick={() => setIsEditSubjectOpen(false)}
                className="p-1 rounded-lg hover:bg-[#1B2533] text-[#9AA5B1] hover:text-[#F3F0E8] cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#9AA5B1] mb-1">
                  Subject Name <span className="text-rose-400 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0E151E] border border-[#202C3B] text-xs text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#9AA5B1] mb-1">
                    Subject Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0E151E] border border-[#202C3B] text-xs text-[#F3F0E8] font-mono uppercase focus:outline-none focus:border-[#D89B5B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#9AA5B1] mb-1">Semester</label>
                  <select
                    value={formSemester}
                    onChange={(e) => setFormSemester(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-lg bg-[#0E151E] border border-[#202C3B] text-xs text-[#F3F0E8] focus:border-[#D89B5B]"
                  >
                    {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => (
                      <option key={s} value={s} className="bg-[#151D26] text-[#F3F0E8]">
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#9AA5B1] mb-1">Credits (Optional)</label>
                  <input
                    type="number"
                    value={formCredits}
                    onChange={(e) => setFormCredits(e.target.value)}
                    min={0}
                    max={10}
                    className="w-full px-3 py-2 rounded-lg bg-[#0E151E] border border-[#202C3B] text-xs text-[#F3F0E8] font-mono focus:outline-none focus:border-[#D89B5B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#9AA5B1] mb-1">Category (Optional)</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg bg-[#0E151E] border border-[#202C3B] text-xs text-[#F3F0E8] focus:border-[#D89B5B]"
                  >
                    <option value="Core" className="bg-[#151D26] text-[#F3F0E8]">Core</option>
                    <option value="Elective" className="bg-[#151D26] text-[#F3F0E8]">Elective</option>
                    <option value="Lab" className="bg-[#151D26] text-[#F3F0E8]">Lab</option>
                    <option value="Math" className="bg-[#151D26] text-[#F3F0E8]">Math</option>
                    <option value="Humanities" className="bg-[#151D26] text-[#F3F0E8]">Humanities</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0E151E] border border-[#202C3B] space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#9AA5B1] block">
                  Performance &amp; Attendance (Optional)
                </span>
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-mono text-[#9AA5B1] mb-1">Grade</label>
                    <input
                      type="text"
                      value={formGrade}
                      onChange={(e) => setFormGrade(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-[#151D26] border border-[#202C3B] text-xs text-[#F3F0E8] font-mono uppercase focus:outline-none focus:border-[#D89B5B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#9AA5B1] mb-1">Internal Marks</label>
                    <input
                      type="number"
                      value={formInternalMarks}
                      onChange={(e) => setFormInternalMarks(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-[#151D26] border border-[#202C3B] text-xs text-[#F3F0E8] font-mono focus:outline-none focus:border-[#D89B5B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#9AA5B1] mb-1">External Marks</label>
                    <input
                      type="number"
                      value={formExternalMarks}
                      onChange={(e) => setFormExternalMarks(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-[#151D26] border border-[#202C3B] text-xs text-[#F3F0E8] font-mono focus:outline-none focus:border-[#D89B5B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-mono text-[#9AA5B1] mb-1">Total Score / %</label>
                    <input
                      type="number"
                      value={formScore}
                      onChange={(e) => setFormScore(e.target.value)}
                      min={0}
                      max={100}
                      className="w-full px-2.5 py-1.5 rounded bg-[#151D26] border border-[#202C3B] text-xs text-[#F3F0E8] font-mono focus:outline-none focus:border-[#D89B5B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#9AA5B1] mb-1">Attendance %</label>
                    <input
                      type="number"
                      value={formAttendance}
                      onChange={(e) => setFormAttendance(e.target.value)}
                      min={0}
                      max={100}
                      className="w-full px-2.5 py-1.5 rounded bg-[#151D26] border border-[#202C3B] text-xs text-[#F3F0E8] font-mono focus:outline-none focus:border-[#D89B5B]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#202C3B]">
                <button
                  type="button"
                  onClick={() => setIsEditSubjectOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#9AA5B1] hover:text-[#F3F0E8] bg-[#1B2533] border border-[#27384B] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#D89B5B] hover:bg-[#E4AB70] text-[#0B0F14] shadow-sm cursor-pointer transition-all duration-150"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SUBJECT DETAILS */}
      <SubjectDetailModal
        subject={detailModalSubject}
        syllabusItem={getLinkedSyllabusItem(detailModalSubject)}
        isOpen={Boolean(detailModalSubject)}
        onClose={() => setDetailModalSubject(null)}
        onEdit={(sub) => openEditSubjectModal(sub)}
        onDelete={(idOrCode) => handleDeleteSubject(idOrCode)}
      />

      {/* MODAL: SEMESTER MANAGEMENT */}
      <SemesterModal
        isOpen={isSemesterModalOpen}
        onClose={() => setIsSemesterModalOpen(false)}
        onSave={handleSaveSemester}
        onDelete={handleDeleteSemester}
        initialData={editingSemesterData}
        currentSemesterNumber={activeCurrentSemester}
      />
    </div>
  );
};
