import React from 'react';
import {
  X,
  BookOpen,
  Award,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Edit2,
  Trash2,
  Sparkles,
  CheckSquare,
  Square,
} from 'lucide-react';
import { SubjectPerformance, CollegeSyllabusItem } from '../../data/mockData';

interface SubjectDetailModalProps {
  subject: SubjectPerformance | null;
  syllabusItem?: CollegeSyllabusItem;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (subject: SubjectPerformance) => void;
  onDelete: (idOrCode: string) => void;
}

export const SubjectDetailModal: React.FC<SubjectDetailModalProps> = ({
  subject,
  syllabusItem,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !subject) return null;

  const topics = syllabusItem?.topics || subject.topics || [];
  const subjectIdentifier = subject.id || subject.code || subject.name;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#151D26] border border-[#27384B] rounded-2xl p-6 shadow-2xl space-y-5 my-8">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#202C3B]">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#D89B5B]/15 text-[#D89B5B] border border-[#D89B5B]/30 mt-0.5">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-[#F3F0E8]">{subject.name}</h3>
                {subject.code && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#D89B5B]/15 text-[#D89B5B] border border-[#D89B5B]/30">
                    {subject.code}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#9AA5B1] mt-0.5">
                {subject.semester ? `Semester ${subject.semester}` : 'Current Semester'}
                {subject.category ? ` • ${subject.category} Subject` : ''}
                {subject.credits !== undefined && ` • ${subject.credits} Credits`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#1B2533] text-[#9AA5B1] hover:text-[#F3F0E8] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Academic Marks & Performance Metrics */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#9AA5B1]">
            Performance Breakdown
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Grade */}
            <div className="p-3 rounded-xl bg-[#0E151E] border border-[#202C3B]">
              <span className="text-[10px] font-mono text-[#9AA5B1] block">Grade</span>
              <span className="text-sm font-mono font-bold text-[#F3F0E8] mt-0.5 block">
                {subject.grade ? subject.grade : <span className="text-[#768393] italic text-xs font-normal">Pending</span>}
              </span>
            </div>

            {/* Internal Marks */}
            <div className="p-3 rounded-xl bg-[#0E151E] border border-[#202C3B]">
              <span className="text-[10px] font-mono text-[#9AA5B1] block">Internal</span>
              <span className="text-sm font-mono text-[#F3F0E8] mt-0.5 block">
                {subject.internalMarks !== undefined ? subject.internalMarks : '-'}
              </span>
            </div>

            {/* External Marks */}
            <div className="p-3 rounded-xl bg-[#0E151E] border border-[#202C3B]">
              <span className="text-[10px] font-mono text-[#9AA5B1] block">External</span>
              <span className="text-sm font-mono text-[#F3F0E8] mt-0.5 block">
                {subject.externalMarks !== undefined ? subject.externalMarks : '-'}
              </span>
            </div>

            {/* Total Score */}
            <div className="p-3 rounded-xl bg-[#0E151E] border border-[#202C3B]">
              <span className="text-[10px] font-mono text-[#9AA5B1] block">Total / %</span>
              <span className="text-sm font-mono text-[#67C5B8] font-bold mt-0.5 block">
                {subject.score !== undefined
                  ? `${subject.score}%`
                  : subject.totalMarks !== undefined
                  ? subject.totalMarks
                  : '-'}
              </span>
            </div>
          </div>
        </div>

        {/* Attendance Status */}
        <div className="p-3.5 rounded-xl bg-[#0E151E] border border-[#202C3B] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${
              subject.attendance !== undefined && subject.attendance >= 75
                ? 'bg-[#67C5B8]/15 text-[#7CD4C8]'
                : subject.attendance !== undefined
                ? 'bg-rose-500/15 text-rose-400'
                : 'bg-[#1B2533] text-[#9AA5B1]'
            }`}>
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-medium text-[#F3F0E8] block">Class Attendance</span>
              <span className="text-[11px] text-[#9AA5B1]">
                {subject.attendance !== undefined
                  ? subject.attendance >= 75
                    ? 'Eligible for institutional final examinations'
                    : 'Below minimum 75% requirement for exams'
                  : 'Attendance records not provided'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-base font-mono font-bold ${
              subject.attendance !== undefined && subject.attendance >= 75
                ? 'text-[#67C5B8]'
                : subject.attendance !== undefined
                ? 'text-rose-400'
                : 'text-[#768393]'
            }`}>
              {subject.attendance !== undefined ? `${subject.attendance}%` : 'N/A'}
            </span>
          </div>
        </div>

        {/* Linked College Syllabus Topics */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#9AA5B1] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#67C5B8]" />
              <span>Syllabus Topics &amp; Modules ({topics.length})</span>
            </h4>
            {syllabusItem && (
              <span className="text-[10px] text-[#67C5B8] font-mono">
                Linked Syllabus
              </span>
            )}
          </div>

          {topics.length > 0 ? (
            <div className="p-3 rounded-xl bg-[#0E151E] border border-[#202C3B] max-h-48 overflow-y-auto space-y-2 divide-y divide-[#1E2938]">
              {topics.map((t, idx) => {
                const topicTitle = typeof t === 'string' ? t : ((t as unknown) as { title?: string }).title || String(t);
                return (
                  <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                    <span className="text-[#F3F0E8] font-medium">{topicTitle}</span>
                    <span className="text-[10px] font-mono text-[#9AA5B1]">Unit {idx + 1}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-[#0E151E] border border-dashed border-[#27384B] text-center">
              <p className="text-xs text-[#9AA5B1]">
                No syllabus topics linked for this subject yet.
              </p>
              <p className="text-[11px] text-[#768393] mt-0.5">
                Add syllabus topics in the College Syllabus section to track what you need to master.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#202C3B]">
          <button
            onClick={() => {
              onDelete(subjectIdentifier);
              onClose();
            }}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Subject</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#9AA5B1] hover:text-[#F3F0E8] bg-[#1B2533] border border-[#27384B] cursor-pointer transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(subject);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#D89B5B] hover:bg-[#E4AB70] text-[#0B0F14] shadow-sm flex items-center gap-1.5 cursor-pointer transition-all duration-150"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Subject</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
