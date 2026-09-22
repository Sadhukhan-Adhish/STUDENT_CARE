import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  UploadCloud,
  FileText,
  Edit2,
  Trash2,
  X,
  Layers,
  ChevronRight,
  Info,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { CollegeSyllabusItem, SubjectPerformance } from '../../data/mockData';

interface CollegeSyllabusSectionProps {
  syllabusList: CollegeSyllabusItem[];
  subjects: SubjectPerformance[];
  currentSemester: number;
  degree?: string;
  department?: string;
  college?: string;
  onAddSyllabus: (item: Omit<CollegeSyllabusItem, 'id'>) => void;
  onUpdateSyllabus: (id: string, updated: Partial<CollegeSyllabusItem>) => void;
  onDeleteSyllabus: (id: string) => void;
}

export const CollegeSyllabusSection: React.FC<CollegeSyllabusSectionProps> = ({
  syllabusList,
  subjects,
  currentSemester,
  degree = 'Bachelor of Technology',
  department = 'Computer Science & Engineering',
  college = 'University',
  onAddSyllabus,
  onUpdateSyllabus,
  onDeleteSyllabus,
}) => {
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CollegeSyllabusItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter state
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState<number | 'All'>('All');

  // Form State for Add / Edit Syllabus
  const [formSemester, setFormSemester] = useState<number>(currentSemester || 1);
  const [formCourse, setFormCourse] = useState<string>(degree);
  const [formBranch, setFormBranch] = useState<string>(department);
  const [formSubjectName, setFormSubjectName] = useState<string>('');
  const [formSubjectCode, setFormSubjectCode] = useState<string>('');
  const [formTopics, setFormTopics] = useState<string[]>([]);
  const [newTopicInput, setNewTopicInput] = useState<string>('');
  const [editingTopicIndex, setEditingTopicIndex] = useState<number | null>(null);
  const [editingTopicValue, setEditingTopicValue] = useState<string>('');

  // PDF Upload Modal State
  const [uploadedPdfFile, setUploadedPdfFile] = useState<{ name: string; size: string } | null>(null);

  // Available semesters for filtering
  const availableSemesters = Array.from(
    new Set(syllabusList.map((s) => s.semester))
  ).sort((a, b) => a - b);

  const filteredSyllabus = syllabusList.filter((item) => {
    if (selectedSemesterFilter === 'All') return true;
    return item.semester === selectedSemesterFilter;
  });

  const openAddModal = (presetSemester?: number) => {
    setEditingItem(null);
    setFormSemester(presetSemester || currentSemester || 1);
    setFormCourse(degree);
    setFormBranch(department);
    setFormSubjectName('');
    setFormSubjectCode('');
    setFormTopics([]);
    setNewTopicInput('');
    setEditingTopicIndex(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (item: CollegeSyllabusItem) => {
    setEditingItem(item);
    setFormSemester(item.semester);
    setFormCourse(item.courseOrDegree || degree);
    setFormBranch(item.branchOrProgram || department);
    setFormSubjectName(item.subjectName || item.title || '');
    setFormSubjectCode(item.subjectCode || '');
    const currentTopics = (item.topics || []).map((t) =>
      typeof t === 'string' ? t : ((t as unknown) as { title?: string }).title || String(t)
    );
    setFormTopics(currentTopics);
    setNewTopicInput('');
    setEditingTopicIndex(null);
    setIsAddModalOpen(true);
  };

  const handleAddTopic = () => {
    if (!newTopicInput.trim()) return;
    setFormTopics([...formTopics, newTopicInput.trim()]);
    setNewTopicInput('');
  };

  const handleRemoveTopic = (index: number) => {
    setFormTopics(formTopics.filter((_, i) => i !== index));
  };

  const handleStartEditTopic = (index: number, val: string) => {
    setEditingTopicIndex(index);
    setEditingTopicValue(val);
  };

  const handleSaveEditTopic = (index: number) => {
    if (!editingTopicValue.trim()) {
      handleRemoveTopic(index);
    } else {
      const next = [...formTopics];
      next[index] = editingTopicValue.trim();
      setFormTopics(next);
    }
    setEditingTopicIndex(null);
    setEditingTopicValue('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubjectName.trim()) return;

    if (editingItem) {
      onUpdateSyllabus(editingItem.id, {
        semester: Number(formSemester),
        courseOrDegree: formCourse.trim(),
        branchOrProgram: formBranch.trim(),
        subjectName: formSubjectName.trim(),
        subjectCode: formSubjectCode.trim() || undefined,
        title: formSubjectName.trim(),
        topics: formTopics,
      });
    } else {
      onAddSyllabus({
        semester: Number(formSemester),
        courseOrDegree: formCourse.trim(),
        branchOrProgram: formBranch.trim(),
        subjectName: formSubjectName.trim(),
        subjectCode: formSubjectCode.trim() || undefined,
        title: formSubjectName.trim(),
        topics: formTopics,
      });
    }

    setIsAddModalOpen(false);
  };

  // Helper to prefill subject code if choosing an existing subject name
  const handleSelectSubjectChange = (name: string) => {
    setFormSubjectName(name);
    const found = subjects.find((s) => s.name.toLowerCase() === name.toLowerCase());
    if (found && found.code) {
      setFormSubjectCode(found.code);
    }
  };

  return (
    <div className="rounded-2xl bg-[#151D26] border border-[#202C3B] p-6 shadow-xl space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#202C3B]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9AA5B1]">Curriculum Structure</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#67C5B8]/15 text-[#7CD4C8] border border-[#67C5B8]/30">
              {syllabusList.length} Courses Mapped
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#F3F0E8] mt-0.5">College Syllabus</h2>
          <p className="text-xs text-[#9AA5B1] mt-1 max-w-xl">
            Add your college syllabus so UNNEXA can understand what you are expected to learn.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#9AA5B1] hover:text-[#F3F0E8] bg-[#1B2533] hover:bg-[#202C3B] border border-[#27384B] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5 text-[#67C5B8]" />
            <span>Upload Syllabus PDF</span>
          </button>
          <button
            onClick={() => openAddModal()}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] border border-[#D89B5B]/30 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Syllabus</span>
          </button>
        </div>
      </div>

      {/* Filter by Semester Tabs */}
      {availableSemesters.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedSemesterFilter('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedSemesterFilter === 'All'
                ? 'bg-[#D89B5B] text-[#0B0F14] font-bold shadow-sm'
                : 'bg-[#0E151E] text-[#9AA5B1] hover:text-[#F3F0E8] border border-[#202C3B]'
            }`}
          >
            All Semesters ({syllabusList.length})
          </button>
          {availableSemesters.map((sem) => (
            <button
              key={sem}
              onClick={() => setSelectedSemesterFilter(sem)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedSemesterFilter === sem
                  ? 'bg-[#D89B5B] text-[#0B0F14] font-bold shadow-sm'
                  : 'bg-[#0E151E] text-[#9AA5B1] hover:text-[#F3F0E8] border border-[#202C3B]'
              }`}
            >
              Semester {sem} ({syllabusList.filter((s) => s.semester === sem).length})
            </button>
          ))}
        </div>
      )}

      {/* Syllabus Content Display */}
      {filteredSyllabus.length === 0 ? (
        <div className="py-12 px-6 text-center rounded-2xl bg-[#0E151E] border border-dashed border-[#27384B] space-y-3">
          <BookOpen className="w-10 h-10 text-[#768393] mx-auto" />
          <div>
            <p className="text-sm font-semibold text-[#F3F0E8]">No college syllabus added yet</p>
            <p className="text-xs text-[#9AA5B1] mt-1 max-w-md mx-auto">
              Add syllabus topics for your semester courses to map out what you need to master.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => openAddModal()}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#D89B5B] hover:bg-[#E4AB70] text-[#0B0F14] inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Syllabus</span>
            </button>
            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#9AA5B1] hover:text-[#F3F0E8] bg-[#1B2533] border border-[#27384B] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5 text-[#67C5B8]" />
              <span>Upload Syllabus PDF</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSyllabus.map((item) => {
            const subjectTitle = item.subjectName || item.title || 'Untitled Course';
            const topics = (item.topics || []).map((t) =>
              typeof t === 'string' ? t : ((t as unknown) as { title?: string }).title || String(t)
            );

            return (
              <div
                key={item.id}
                className="rounded-xl bg-[#0E151E] border border-[#202C3B] hover:border-[#27384B] transition-all p-4.5 flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D89B5B]/15 text-[#D89B5B] border border-[#D89B5B]/30">
                        Sem {item.semester}
                      </span>
                      {item.subjectCode && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-[#9AA5B1] bg-[#151D26] border border-[#202C3B]">
                          {item.subjectCode}
                        </span>
                      )}
                    </div>
                    {deleteConfirmId === item.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            onDeleteSyllabus(item.id);
                            setDeleteConfirmId(null);
                          }}
                          className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-semibold cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-1.5 py-0.5 rounded bg-[#1B2533] text-[#9AA5B1] hover:text-[#F3F0E8] text-[10px] cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1 rounded hover:bg-[#1B2533] text-[#9AA5B1] hover:text-[#F3F0E8] cursor-pointer transition-colors"
                          title="Edit Syllabus"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-1 rounded hover:bg-rose-500/10 text-[#9AA5B1] hover:text-rose-400 cursor-pointer transition-colors"
                          title="Delete Syllabus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-[#F3F0E8] mt-2 leading-snug">
                    {subjectTitle}
                  </h3>

                  {(item.courseOrDegree || item.branchOrProgram) && (
                    <p className="text-[11px] text-[#9AA5B1] mt-0.5 font-mono">
                      {[item.courseOrDegree, item.branchOrProgram].filter(Boolean).join(' • ')}
                    </p>
                  )}

                  {/* Topics List */}
                  <div className="mt-3.5 pt-3 border-t border-[#202C3B] space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#9AA5B1] font-mono">
                      <span>Topics / Modules</span>
                      <span className="text-[#67C5B8] font-semibold">{topics.length} Units</span>
                    </div>

                    {topics.length > 0 ? (
                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {topics.map((topic, idx) => (
                          <div
                            key={idx}
                            className="px-2.5 py-1.5 rounded-lg bg-[#151D26] border border-[#202C3B] text-xs text-[#F3F0E8] flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#67C5B8] flex-shrink-0" />
                            <span className="truncate">{topic}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-[#151D26]/50 border border-dashed border-[#202C3B] text-center text-[11px] text-[#768393]">
                        No topics listed. Click edit to add topics.
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#202C3B] flex items-center justify-between text-[11px] text-[#9AA5B1]">
                  <span>{item.uploadedAt ? `Mapped ${item.uploadedAt}` : 'Manual Syllabus'}</span>
                  <button
                    onClick={() => openEditModal(item)}
                    className="text-[#D89B5B] hover:text-[#E4AB70] font-medium cursor-pointer transition-colors"
                  >
                    Manage Topics →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: ADD / EDIT SYLLABUS */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-[#151D26] border border-[#27384B] rounded-2xl p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#202C3B]">
              <h3 className="text-base font-bold text-[#F3F0E8] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#D89B5B]" />
                <span>{editingItem ? 'Edit College Syllabus' : 'Add College Syllabus'}</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#1B2533] text-[#9AA5B1] hover:text-[#F3F0E8] cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#9AA5B1] mb-1">College / University</label>
                  <input
                    type="text"
                    value={college}
                    disabled
                    className="w-full px-3 py-2 rounded-lg bg-[#0E151E] border border-[#202C3B] text-xs text-[#768393] cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#9AA5B1] mb-1">Program / Degree</label>
                  <input
                    type="text"
                    value={formCourse}
                    onChange={(e) => setFormCourse(e.target.value)}
                    placeholder="e.g. B.Tech Computer Science"
                    className="w-full px-3 py-2 rounded-lg bg-[#0E151E] border border-[#202C3B] text-xs text-[#F3F0E8] placeholder-[#768393] focus:outline-none focus:border-[#D89B5B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#9AA5B1] mb-1">Semester *</label>
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
                <div className="col-span-2">
                  <label className="block text-xs font-mono text-[#9AA5B1] mb-1">Subject Name *</label>
                  <input
                    type="text"
                    value={formSubjectName}
                    onChange={(e) => handleSelectSubjectChange(e.target.value)}
                    list="enrolled-subjects-list"
                    placeholder="e.g. Data Structures & Algorithms"
                    className="w-full px-3 py-2 rounded-lg bg-[#0E151E] border border-[#202C3B] text-xs text-[#F3F0E8] placeholder-[#768393] focus:outline-none focus:border-[#D89B5B]"
                    required
                  />
                  <datalist id="enrolled-subjects-list">
                    {subjects.map((sub, idx) => (
                      <option key={idx} value={sub.name} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#9AA5B1] mb-1">Subject Code (Optional)</label>
                <input
                  type="text"
                  value={formSubjectCode}
                  onChange={(e) => setFormSubjectCode(e.target.value)}
                  placeholder="e.g. CS301"
                  className="w-full px-3 py-2 rounded-lg bg-[#0E151E] border border-[#202C3B] text-xs text-[#F3F0E8] font-mono uppercase focus:outline-none focus:border-[#D89B5B]"
                />
              </div>

              {/* Topics / Modules Management */}
              <div className="p-3.5 rounded-xl bg-[#0E151E] border border-[#202C3B] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#F3F0E8]">
                    Syllabus Topics ({formTopics.length})
                  </span>
                  <span className="text-[11px] text-[#768393]">e.g. Arrays, Linked Lists, Trees</span>
                </div>

                {/* Add Topic Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTopicInput}
                    onChange={(e) => setNewTopicInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTopic();
                      }
                    }}
                    placeholder="Enter topic or module name..."
                    className="flex-1 px-3 py-2 rounded-lg bg-[#151D26] border border-[#202C3B] text-xs text-[#F3F0E8] placeholder-[#768393] focus:outline-none focus:border-[#D89B5B]"
                  />
                  <button
                    type="button"
                    onClick={handleAddTopic}
                    className="px-3 py-2 rounded-lg text-xs font-semibold bg-[#D89B5B] hover:bg-[#E4AB70] text-[#0B0F14] flex items-center gap-1 cursor-pointer flex-shrink-0 transition-all duration-150"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Topic</span>
                  </button>
                </div>

                {/* Topics List */}
                {formTopics.length > 0 ? (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {formTopics.map((topic, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-2 rounded-lg bg-[#151D26] border border-[#202C3B] flex items-center justify-between gap-2 text-xs"
                      >
                        {editingTopicIndex === idx ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="text"
                              value={editingTopicValue}
                              onChange={(e) => setEditingTopicValue(e.target.value)}
                              className="flex-1 px-2 py-1 rounded bg-[#0E151E] border border-[#D89B5B] text-xs text-[#F3F0E8]"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveEditTopic(idx)}
                              className="px-2 py-1 rounded bg-[#D89B5B] text-[#0B0F14] text-[10px] font-semibold cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingTopicIndex(null)}
                              className="px-2 py-1 rounded text-[#9AA5B1] hover:text-[#F3F0E8] text-[10px] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 truncate">
                              <span className="text-[10px] font-mono text-[#768393]">{idx + 1}.</span>
                              <span className="text-[#F3F0E8] truncate">{topic}</span>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => handleStartEditTopic(idx, topic)}
                                className="p-1 text-[#9AA5B1] hover:text-[#F3F0E8] cursor-pointer transition-colors"
                                title="Edit Topic"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveTopic(idx)}
                                className="p-1 text-[#9AA5B1] hover:text-rose-400 cursor-pointer transition-colors"
                                title="Remove Topic"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-xs text-[#768393] py-3 italic">
                    No topics added yet. Type a topic name and click "+ Add Topic".
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#202C3B]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#9AA5B1] hover:text-[#F3F0E8] bg-[#1B2533] border border-[#27384B] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#D89B5B] hover:bg-[#E4AB70] text-[#0B0F14] shadow-sm cursor-pointer transition-all duration-150"
                >
                  {editingItem ? 'Update Syllabus' : 'Save Syllabus'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD SYLLABUS PDF */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#151D26] border border-[#27384B] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#202C3B]">
              <h3 className="text-base font-bold text-[#F3F0E8] flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-[#D89B5B]" />
                <span>Upload Syllabus PDF</span>
              </h3>
              <button
                onClick={() => setIsPdfModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#1B2533] text-[#9AA5B1] hover:text-[#F3F0E8] cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Informational Notice */}
            <div className="p-3.5 rounded-xl bg-[#67C5B8]/10 border border-[#67C5B8]/20 text-xs text-[#7CD4C8] flex items-start gap-2.5">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="space-y-1 leading-relaxed">
                <p className="font-semibold text-[#F3F0E8]">PDF Syllabus Analysis</p>
                <p className="text-[#9AA5B1]">
                  PDF syllabus analysis will be available in a future version. Manual syllabus entry is fully functional today to map your curriculum.
                </p>
              </div>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onClick={() => {
                const input = document.getElementById('syllabus-pdf-input') as HTMLInputElement;
                input?.click();
              }}
              className="p-6 border-2 border-dashed border-[#202C3B] hover:border-[#D89B5B]/50 rounded-xl bg-[#0E151E] text-center cursor-pointer transition-colors space-y-2"
            >
              <input
                id="syllabus-pdf-input"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setUploadedPdfFile({
                      name: file.name,
                      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
                    });
                  }
                }}
              />
              <FileText className="w-8 h-8 text-[#768393] mx-auto" />
              <div>
                <p className="text-xs font-semibold text-[#F3F0E8]">
                  {uploadedPdfFile ? uploadedPdfFile.name : 'Select or drop your syllabus PDF'}
                </p>
                <p className="text-[11px] text-[#768393] mt-0.5">
                  {uploadedPdfFile ? `${uploadedPdfFile.size} • PDF Document` : 'Supports official university syllabus PDFs'}
                </p>
              </div>
            </div>

            {uploadedPdfFile && (
              <div className="p-3 rounded-xl bg-[#0E151E] border border-[#202C3B] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#67C5B8]" />
                  <span className="text-[#F3F0E8] font-medium truncate max-w-[200px]">
                    {uploadedPdfFile.name}
                  </span>
                </div>
                <span className="text-[#9AA5B1] font-mono text-[10px]">{uploadedPdfFile.size}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-[#202C3B]">
              <button
                type="button"
                onClick={() => {
                  setIsPdfModalOpen(false);
                  openAddModal();
                }}
                className="text-xs text-[#D89B5B] hover:text-[#E4AB70] font-medium cursor-pointer transition-colors"
              >
                Enter Topics Manually →
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPdfModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#9AA5B1] hover:text-[#F3F0E8] bg-[#1B2533] border border-[#27384B] cursor-pointer transition-colors"
                >
                  Close
                </button>
                {uploadedPdfFile && (
                  <button
                    type="button"
                    onClick={() => {
                      onAddSyllabus({
                        semester: currentSemester || 1,
                        subjectName: uploadedPdfFile.name.replace(/\.pdf$/i, ''),
                        title: uploadedPdfFile.name.replace(/\.pdf$/i, ''),
                        fileName: uploadedPdfFile.name,
                        fileSize: uploadedPdfFile.size,
                        topics: [],
                        notes: 'Uploaded syllabus document awaiting future AI extraction engine.',
                      });
                      setIsPdfModalOpen(false);
                      setUploadedPdfFile(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#D89B5B] hover:bg-[#E4AB70] text-[#0B0F14] shadow-sm cursor-pointer transition-all duration-150"
                  >
                    Save Reference
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
