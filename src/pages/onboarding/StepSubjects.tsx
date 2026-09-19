import React, { useState } from 'react';
import { Plus, Trash2, Edit3, BookOpen, FileText, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';
import { OnboardingData } from './types';
import { SubjectPerformance, CollegeSyllabusItem } from '../../data/mockData';

interface StepSubjectsProps {
  data: OnboardingData;
  onChange: (fields: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepSubjects: React.FC<StepSubjectsProps> = ({
  data,
  onChange,
  onNext,
  onBack,
}) => {
  const [selectedSemester, setSelectedSemester] = useState<number>(data.currentSemester || 1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSubjectCode, setEditingSubjectCode] = useState<string | null>(null);

  // Subject Form State
  const [subName, setSubName] = useState<string>('');
  const [subCode, setSubCode] = useState<string>('');
  const [credits, setCredits] = useState<string>('3');
  const [marks, setMarks] = useState<string>('');
  const [grade, setGrade] = useState<string>('');
  const [attendance, setAttendance] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  // Syllabus Modal / Input state
  const [showSyllabusModal, setShowSyllabusModal] = useState<boolean>(false);
  const [syllabusTitle, setSyllabusTitle] = useState<string>('');
  const [syllabusNotes, setSyllabusNotes] = useState<string>('');

  const currentSemesterSubjects = (data.subjects || []).filter(
    (s) => (s.semesterNumber || 1) === selectedSemester
  );

  const openAddModal = () => {
    setEditingSubjectCode(null);
    setSubName('');
    setSubCode('');
    setCredits('3');
    setMarks('');
    setGrade('');
    setAttendance('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (sub: SubjectPerformance) => {
    setEditingSubjectCode(sub.code);
    setSubName(sub.name);
    setSubCode(sub.code);
    setCredits(sub.credits ? String(sub.credits) : '');
    setMarks(sub.marks ? String(sub.marks) : '');
    setGrade(sub.grade || '');
    setAttendance(sub.attendance ? String(sub.attendance) : '');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim()) {
      setFormError('Subject Name is required.');
      return;
    }

    const finalCode = subCode.trim() || `SUB-${Date.now().toString().slice(-4)}`;
    const parsedCredits = credits.trim() ? Number(credits) : 3;
    const parsedMarks = marks.trim() ? Number(marks) : undefined;
    const parsedAttendance = attendance.trim() ? Number(attendance) : undefined;

    const newSub: SubjectPerformance = {
      name: subName.trim(),
      code: finalCode,
      credits: parsedCredits,
      marks: parsedMarks,
      grade: grade.trim() || undefined,
      attendance: parsedAttendance,
      semesterNumber: selectedSemester,
      category: 'Core',
    };

    let updated: SubjectPerformance[];
    if (editingSubjectCode) {
      updated = (data.subjects || []).map((s) =>
        s.code === editingSubjectCode && (s.semesterNumber || 1) === selectedSemester ? newSub : s
      );
    } else {
      updated = [...(data.subjects || []), newSub];
    }

    onChange({ subjects: updated });
    setIsModalOpen(false);
  };

  const handleDeleteSubject = (code: string) => {
    const updated = (data.subjects || []).filter(
      (s) => !(s.code === code && (s.semesterNumber || 1) === selectedSemester)
    );
    onChange({ subjects: updated });
  };

  // Quick suggestion subjects
  const quickSuggestions: Record<number, string[]> = {
    1: ['Engineering Mathematics I', 'Physics', 'Basic Electrical', 'Programming in C', 'Engineering Graphics'],
    2: ['Engineering Mathematics II', 'Chemistry', 'Data Structures', 'Digital Logic Design', 'English Communication'],
    3: ['Object Oriented Programming', 'Discrete Mathematics', 'Computer Organization', 'Data Structures & Algorithms'],
    4: ['Design & Analysis of Algorithms', 'Operating Systems', 'Database Management Systems', 'Formal Language & Automata'],
    5: ['Computer Networks', 'Software Engineering', 'Artificial Intelligence', 'Compiler Design'],
    6: ['Machine Learning', 'Cloud Computing', 'Web Technologies', 'Information Security'],
    7: ['Deep Learning', 'Distributed Systems', 'Big Data Analytics', 'Mobile Computing'],
    8: ['Major Project', 'Industrial Internship', 'Ethics & Professional Practice'],
  };

  const currentSuggestions = quickSuggestions[selectedSemester] || ['Core Course I', 'Core Course II', 'Elective I'];

  const handleAddSuggested = (name: string) => {
    const existing = (data.subjects || []).some(
      (s) => s.name.toLowerCase() === name.toLowerCase() && (s.semesterNumber || 1) === selectedSemester
    );
    if (existing) return;

    const newSub: SubjectPerformance = {
      name,
      code: `CS${selectedSemester}0${(currentSemesterSubjects.length + 1)}`,
      credits: 3,
      semesterNumber: selectedSemester,
      category: 'Core',
    };
    onChange({ subjects: [...(data.subjects || []), newSub] });
  };

  // Syllabus handler
  const handleSaveSyllabus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!syllabusTitle.trim()) return;

    const item: CollegeSyllabusItem = {
      id: 'syl-' + Date.now(),
      semester: selectedSemester,
      title: syllabusTitle.trim(),
      notes: syllabusNotes.trim() || undefined,
      uploadedAt: new Date().toLocaleDateString(),
    };

    const existingSyllabus = (data.syllabus || []).filter((s) => s.semester !== selectedSemester);
    onChange({
      syllabus: [...existingSyllabus, item],
      syllabusChoice: 'added',
    });
    setShowSyllabusModal(false);
  };

  const currentSyllabus = (data.syllabus || []).find((s) => s.semester === selectedSemester);

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Coursework &amp; Subjects
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Add subjects for your current or previous semesters. Only <strong className="text-slate-200">Subject Name</strong> is required.
        </p>
      </div>

      {/* Semester Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
          const count = (data.subjects || []).filter((s) => (s.semesterNumber || 1) === sem).length;
          const isSelected = selectedSemester === sem;
          const isCurrent = (data.currentSemester || 1) === sem;

          return (
            <button
              key={sem}
              type="button"
              onClick={() => setSelectedSemester(sem)}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-[#090D15] text-slate-400 border border-[#1E273A] hover:text-slate-200 hover:border-slate-600'
              }`}
            >
              <span>Sem {sem}</span>
              {isCurrent && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              )}
              {count > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isSelected ? 'bg-indigo-800 text-indigo-200' : 'bg-slate-800 text-slate-300'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Add Suggestions */}
      <div className="p-3 rounded-xl bg-[#090D15] border border-[#1E273A]">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Quick Add Common Subjects for Semester {selectedSemester}:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {currentSuggestions.map((suggestion) => {
            const alreadyAdded = currentSemesterSubjects.some(
              (s) => s.name.toLowerCase() === suggestion.toLowerCase()
            );
            return (
              <button
                key={suggestion}
                type="button"
                disabled={alreadyAdded}
                onClick={() => handleAddSuggested(suggestion)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  alreadyAdded
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 opacity-60 cursor-default'
                    : 'bg-[#101726] border-[#222E47] text-slate-300 hover:border-indigo-500/50 hover:text-white'
                }`}
              >
                {alreadyAdded ? `✓ ${suggestion}` : `+ ${suggestion}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Subjects Added for Selected Semester */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            Semester {selectedSemester} Subjects ({currentSemesterSubjects.length})
          </h3>
          <button
            type="button"
            onClick={openAddModal}
            className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Subject Manually</span>
          </button>
        </div>

        {currentSemesterSubjects.length === 0 ? (
          <div className="p-6 rounded-xl bg-[#090D15] border border-dashed border-[#1E273A] text-center">
            <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">
              No subjects added for Semester {selectedSemester} yet.
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Click &quot;Add Subject Manually&quot; or select from the quick-add suggestions above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentSemesterSubjects.map((sub) => (
              <div
                key={sub.code + sub.name}
                className="p-3 rounded-xl bg-[#0B0F19] border border-[#1E273A] flex items-center justify-between group hover:border-[#2C3B59] transition-all"
              >
                <div className="min-w-0 flex-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-white truncate">
                      {sub.name}
                    </span>
                    {sub.code && (
                      <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                        {sub.code}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-1">
                    <span>{sub.credits || 3} Credits</span>
                    {sub.marks !== undefined && (
                      <span>Marks: <strong className="text-slate-200">{sub.marks}</strong></span>
                    )}
                    {sub.grade && (
                      <span className="text-emerald-400 font-semibold">{sub.grade}</span>
                    )}
                    {sub.attendance !== undefined && (
                      <span>{sub.attendance}% Attd</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(sub)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#1E273A] transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteSubject(sub.code)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* College Syllabus Section */}
      <div className="p-4 rounded-xl bg-[#090D15] border border-[#1E273A]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-200 font-mono">
                College Syllabus (Semester {selectedSemester})
              </h4>
              <p className="text-[11px] text-slate-400">
                Do you want to add your official college syllabus for this semester?
              </p>
            </div>
          </div>

          {currentSyllabus ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Syllabus Linked</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  const remaining = (data.syllabus || []).filter((s) => s.semester !== selectedSemester);
                  onChange({ syllabus: remaining });
                }}
                className="text-[11px] text-slate-500 hover:text-rose-400 cursor-pointer"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onChange({ syllabusChoice: 'later' })}
                className="px-2.5 py-1 rounded-lg text-slate-400 hover:text-slate-200 text-xs font-medium cursor-pointer"
              >
                Add Later
              </button>
              <button
                type="button"
                onClick={() => {
                  setSyllabusTitle(`${data.degree || 'B.Tech'} Sem ${selectedSemester} Official Curriculum`);
                  setSyllabusNotes('');
                  setShowSyllabusModal(true);
                }}
                className="px-3 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-colors cursor-pointer"
              >
                Add Syllabus
              </button>
            </div>
          )}
        </div>

        {currentSyllabus && (
          <div className="mt-3 pt-3 border-t border-[#1C263D] text-xs text-slate-300">
            <span className="font-semibold text-white">{currentSyllabus.title}</span>
            {currentSyllabus.notes && (
              <p className="text-slate-400 text-[11px] mt-0.5">{currentSyllabus.notes}</p>
            )}
          </div>
        )}
      </div>

      {/* Add / Edit Subject Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#0D121F] border border-[#222E47] rounded-2xl shadow-2xl p-5 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">
                {editingSubjectCode ? 'Edit Subject' : `Add Subject (Semester ${selectedSemester})`}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                  Subject Name <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  placeholder="e.g. Design & Analysis of Algorithms"
                  className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E273A] text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    value={subCode}
                    onChange={(e) => setSubCode(e.target.value.toUpperCase())}
                    placeholder="e.g. CS501"
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E273A] text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                    Credits
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                    placeholder="3"
                    className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E273A] text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                    Marks
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    placeholder="e.g. 88"
                    className="w-full px-2.5 py-2 rounded-xl bg-[#080B12] border border-[#1E273A] text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                    Grade
                  </label>
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value.toUpperCase())}
                    placeholder="e.g. A+"
                    className="w-full px-2.5 py-2 rounded-xl bg-[#080B12] border border-[#1E273A] text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                    Attendance %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={attendance}
                    onChange={(e) => setAttendance(e.target.value)}
                    placeholder="85"
                    className="w-full px-2.5 py-2 rounded-xl bg-[#080B12] border border-[#1E273A] text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#1C263D]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 cursor-pointer"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Syllabus Modal */}
      {showSyllabusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#0D121F] border border-[#222E47] rounded-2xl shadow-2xl p-5 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">
                Add Semester {selectedSemester} Syllabus
              </h3>
              <button
                type="button"
                onClick={() => setShowSyllabusModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSyllabus} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                  Syllabus Title / Document Name
                </label>
                <input
                  type="text"
                  value={syllabusTitle}
                  onChange={(e) => setSyllabusTitle(e.target.value)}
                  placeholder="e.g. MAKAUT CSE 5th Semester Scheme"
                  className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E273A] text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                  Key Topics or Modules
                </label>
                <textarea
                  value={syllabusNotes}
                  onChange={(e) => setSyllabusNotes(e.target.value)}
                  placeholder="List major subject modules, prescribed text books, or syllabus link..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-[#080B12] border border-[#1E273A] text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#1C263D]">
                <button
                  type="button"
                  onClick={() => setShowSyllabusModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 cursor-pointer"
                >
                  Link Syllabus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Navigation Actions */}
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
