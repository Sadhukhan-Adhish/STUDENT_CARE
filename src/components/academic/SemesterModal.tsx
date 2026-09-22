import React, { useState, useEffect } from 'react';
import { X, Calendar, Trash2 } from 'lucide-react';
import { AcademicSemester } from '../../data/mockData';

interface SemesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (semester: AcademicSemester, isCurrent?: boolean) => void;
  onDelete?: (semesterNameOrNumber: string | number) => void;
  initialData?: AcademicSemester | null;
  currentSemesterNumber?: number;
}

export const SemesterModal: React.FC<SemesterModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
  currentSemesterNumber,
}) => {
  const [name, setName] = useState('');
  const [sgpa, setSgpa] = useState('');
  const [credits, setCredits] = useState('20');
  const [isCurrent, setIsCurrent] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.semester);
      setSgpa(initialData.sgpa !== undefined ? String(initialData.sgpa) : '');
      setCredits(initialData.credits !== undefined ? String(initialData.credits) : '20');
      const num = initialData.semesterNumber || Number(String(initialData.semester).replace(/[^0-9]/g, ''));
      setIsCurrent(num === currentSemesterNumber || initialData.semester.includes('Current'));
    } else {
      setName('');
      setSgpa('');
      setCredits('20');
      setIsCurrent(false);
    }
    setConfirmDelete(false);
  }, [initialData, currentSemesterNumber, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const numFromStr = Number(name.replace(/[^0-9]/g, ''));
    const semNum = initialData?.semesterNumber || (numFromStr > 0 ? numFromStr : undefined);

    const semData: AcademicSemester = {
      semester: name.trim(),
      semesterNumber: semNum,
      sgpa: sgpa ? Number(sgpa) : undefined,
      credits: credits ? Number(credits) : 20,
      completed: sgpa ? true : false,
    };

    onSave(semData, isCurrent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#151D26] border border-[#27384B] rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#202C3B]">
          <h3 className="text-base font-bold text-[#F3F0E8] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#D89B5B]" />
            <span>{initialData ? `Edit ${initialData.semester}` : 'Add Semester'}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#1B2533] text-[#9AA5B1] hover:text-[#F3F0E8] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#9AA5B1] mb-1">Semester Label *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Semester 3 or Sem 3"
              className="w-full px-3 py-2 rounded-lg bg-[#0E151E] border border-[#202C3B] text-xs text-[#F3F0E8] placeholder-[#768393] focus:outline-none focus:border-[#D89B5B]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-[#9AA5B1] mb-1">
                SGPA (Optional)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={sgpa}
                onChange={(e) => setSgpa(e.target.value)}
                placeholder="e.g. 8.45"
                className="w-full px-3 py-2 rounded-lg bg-[#0E151E] border border-[#202C3B] text-xs text-[#F3F0E8] font-mono focus:outline-none focus:border-[#D89B5B]"
              />
              <span className="text-[10px] text-[#768393] mt-0.5 block font-mono">
                Leave blank if ongoing
              </span>
            </div>
            <div>
              <label className="block text-xs font-mono text-[#9AA5B1] mb-1">
                Total Credits (Optional)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                placeholder="e.g. 22"
                className="w-full px-3 py-2 rounded-lg bg-[#0E151E] border border-[#202C3B] text-xs text-[#F3F0E8] font-mono focus:outline-none focus:border-[#D89B5B]"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0E151E] border border-[#202C3B]">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#F3F0E8]">
              <input
                type="checkbox"
                checked={isCurrent}
                onChange={(e) => setIsCurrent(e.target.checked)}
                className="rounded border-[#202C3B] text-[#D89B5B] focus:ring-[#D89B5B] accent-[#D89B5B]"
              />
              <span>Set as my active Current Semester</span>
            </label>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#202C3B]">
            {initialData && onDelete ? (
              confirmDelete ? (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(initialData.semester);
                      onClose();
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold cursor-pointer"
                  >
                    Confirm Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="px-2.5 py-1.5 rounded-lg text-xs text-[#9AA5B1] hover:text-[#F3F0E8] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              )
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#9AA5B1] hover:text-[#F3F0E8] bg-[#1B2533] border border-[#27384B] cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#D89B5B] hover:bg-[#E4AB70] text-[#0B0F14] shadow-sm cursor-pointer transition-all duration-150"
              >
                {initialData ? 'Update Semester' : 'Add Semester'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
