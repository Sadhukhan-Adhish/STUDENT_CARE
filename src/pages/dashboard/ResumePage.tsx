import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Download,
  Eye,
  RefreshCw,
  FileCheck,
  Briefcase,
  Layers,
  ArrowRight,
  Info,
  ShieldCheck,
  X,
} from 'lucide-react';
import { PageHeader } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';
import { ResumeInfo } from '../../data/mockData';

export const ResumePage: React.FC = () => {
  const { user, uploadResume, removeResume } = useAuth();
  const navigate = useNavigate();

  const student = user?.studentProfile;
  const resumeInfo = student?.resumeInfo;
  const targetCareer = student?.targetCareer || '';

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewNotes, setPreviewNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleProcessFile = (file: File) => {
    setUploadError(null);

    // Accept PDF, DOC, DOCX
    const acceptedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const isAccepted = acceptedTypes.includes(file.type) || file.name.endsWith('.pdf') || file.name.endsWith('.doc') || file.name.endsWith('.docx');

    if (!isAccepted) {
      setUploadError('Unsupported file format. Please upload a PDF (.pdf) or Word document (.docx).');
      return;
    }

    // 10MB max
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds 10MB limit. Please upload a smaller document.');
      return;
    }

    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const today = new Date().toISOString().split('T')[0];

      const newResume: ResumeInfo = {
        fileName: file.name,
        fileSize: formatBytes(file.size),
        fileType: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'document'),
        uploadedAt: today,
        fileData: dataUrl,
        notes: resumeInfo?.notes || (targetCareer ? `Targeting ${targetCareer} applications` : 'Primary student career resume'),
      };

      uploadResume(newResume);
      setIsProcessing(false);
    };

    reader.onerror = () => {
      setUploadError('Error reading file. Please try uploading again.');
      setIsProcessing(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleDownload = () => {
    if (!resumeInfo) return;
    if (resumeInfo.fileData) {
      const link = document.createElement('a');
      link.href = resumeInfo.fileData;
      link.download = resumeInfo.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Fallback text file representation for sample data
      const blob = new Blob([
        `UNNEXA Student Career Resume Metadata\n` +
        `Student: ${student?.name}\n` +
        `Roll Number: ${student?.rollNumber}\n` +
        `Degree: ${student?.degree}\n` +
        `Department: ${student?.department}\n` +
        `Target Career: ${targetCareer || 'Engineering'}\n` +
        `File Name: ${resumeInfo.fileName}\n` +
        `Uploaded: ${resumeInfo.uploadedAt}\n`
      ], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = resumeInfo.fileName.replace(/\.pdf$/, '.txt');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleSaveNotes = () => {
    if (!resumeInfo) return;
    uploadResume({
      ...resumeInfo,
      notes: previewNotes.trim(),
    });
    setIsEditingNotes(false);
  };

  const hasResume = Boolean(resumeInfo && resumeInfo.fileName);

  return (
    <div className="space-y-6 pb-12 font-sans" id="resume-page-container">
      <PageHeader
        title="Career Resume"
        subtitle="Manage your primary technical resume and align your credentials with your target career role."
        badge={user?.isGuest ? 'Guest Exploration' : hasResume ? 'Resume Attached' : 'No Resume'}
        actions={
          hasResume ? (
            <div className="flex items-center gap-2">
              <button
                id="replace-resume-header-btn"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] transition-all duration-150 flex items-center gap-1.5 cursor-pointer shadow-sm hover:-translate-y-0.5 active:translate-y-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Replace Resume</span>
              </button>
              <button
                id="remove-resume-header-btn"
                onClick={() => setShowRemoveConfirm(true)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all duration-150 flex items-center gap-1 cursor-pointer"
                title="Remove resume"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Remove</span>
              </button>
            </div>
          ) : (
            <button
              id="upload-resume-header-btn"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] transition-all duration-150 flex items-center gap-1.5 cursor-pointer shadow-sm hover:-translate-y-0.5 active:translate-y-0"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload Resume</span>
            </button>
          )
        }
      />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Guidance and Architecture Transparency Notice */}
      <div className="p-3.5 rounded-xl bg-[#151D26] border border-[#202C3B] flex items-center gap-3 text-xs text-[#9AA5B1]" id="resume-guidance-bar">
        <div className="p-1.5 rounded-lg bg-[#D89B5B]/15 text-[#D89B5B] flex-shrink-0">
          <Info className="w-4 h-4" />
        </div>
        <p className="leading-relaxed">
          <strong className="text-[#F3F0E8] font-medium">Resume Management:</strong> Store and maintain your official resume for career placement. UNNEXA saves your file details in your student profile and calibrates role alignment against your target career.
        </p>
      </div>

      {/* Linked Career Goal Banner */}
      <div className="p-4 rounded-xl bg-[#151D26] border border-[#202C3B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition-all duration-200 hover:border-[#27384B]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#D89B5B]/15 text-[#D89B5B]">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[#9AA5B1] block text-[11px] font-mono uppercase tracking-wider">
              Linked Career Direction
            </span>
            <span className="text-[#F3F0E8] font-semibold text-sm">
              {targetCareer ? targetCareer : 'No career goal set yet'}
            </span>
          </div>
        </div>

        {targetCareer ? (
          <button
            onClick={() => navigate('/dashboard/career')}
            className="text-xs text-[#D89B5B] hover:text-[#E4AB70] font-medium flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Change Career Goal</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        ) : (
          <button
            onClick={() => navigate('/dashboard/career')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] transition-all duration-150 cursor-pointer shadow-sm"
          >
            Set Career Goal
          </button>
        )}
      </div>

      {/* Upload Error Banner if any */}
      {uploadError && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between text-xs text-rose-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{uploadError}</span>
          </div>
          <button
            onClick={() => setUploadError(null)}
            className="p-1 rounded text-rose-400 hover:text-rose-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main View: Active Resume or Empty State */}
      {hasResume && resumeInfo ? (
        <div className="space-y-6" id="active-resume-section">
          {/* Resume Dossier Card */}
          <div className="rounded-2xl bg-[#151D26] border border-[#202C3B] p-6 sm:p-8 shadow-xl transition-all duration-200 hover:border-[#27384B]" id="resume-dossier-card">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-[#202C3B]">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#D89B5B]/15 border border-[#D89B5B]/30 text-[#D89B5B] flex items-center justify-center flex-shrink-0">
                  <FileText className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#67C5B8]/15 text-[#7CD4C8] border border-[#67C5B8]/30 font-semibold">
                      Active Profile Resume
                    </span>
                    <span className="text-[10px] font-mono text-[#9AA5B1] uppercase tracking-wider">
                      {resumeInfo.fileType.includes('pdf') ? 'PDF Document' : 'Document'}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#F3F0E8] break-all" id="resume-file-name">
                    {resumeInfo.fileName}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#9AA5B1] font-mono">
                    <span>Size: <strong className="text-[#F3F0E8] font-normal">{resumeInfo.fileSize}</strong></span>
                    <span>•</span>
                    <span>Added: <strong className="text-[#F3F0E8] font-normal">{resumeInfo.uploadedAt}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                <button
                  id="download-resume-btn"
                  onClick={handleDownload}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#F3F0E8] bg-[#1B2533] hover:bg-[#223042] border border-[#27384B] transition-all duration-150 flex items-center gap-1.5 cursor-pointer shadow-sm flex-1 lg:flex-initial justify-center"
                >
                  <Download className="w-3.5 h-3.5 text-[#D89B5B]" />
                  <span>Download Document</span>
                </button>
                <button
                  id="replace-resume-card-btn"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] transition-all duration-150 flex items-center gap-1.5 cursor-pointer shadow-sm flex-1 lg:flex-initial justify-center hover:-translate-y-0.5 active:translate-y-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Replace</span>
                </button>
                <button
                  id="remove-resume-card-btn"
                  onClick={() => setShowRemoveConfirm(true)}
                  className="p-2.5 rounded-xl text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-all duration-150 cursor-pointer"
                  title="Remove this resume"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Resume Metadata Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6 text-xs">
              <div className="p-4 rounded-xl bg-[#0E151E] border border-[#202C3B] space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#9AA5B1]">File Type &amp; Encoding</span>
                <p className="text-[#F3F0E8] font-medium">{resumeInfo.fileType}</p>
                <span className="text-[#9AA5B1] text-[11px] block">
                  {resumeInfo.fileType.includes('pdf') || resumeInfo.fileName.endsWith('.pdf')
                    ? 'Standard Adobe Acrobat / PDF format'
                    : 'Microsoft Word / OpenDocument format'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#0E151E] border border-[#202C3B] space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#9AA5B1]">Status</span>
                <div className="flex items-center gap-1.5 text-[#67C5B8] font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ready for Student Applications</span>
                </div>
                <span className="text-[#9AA5B1] text-[11px] block">Saved to local student session</span>
              </div>

              <div className="p-4 rounded-xl bg-[#0E151E] border border-[#202C3B] space-y-1 sm:col-span-2 lg:col-span-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#9AA5B1]">Target Role Alignment</span>
                <p className="text-[#F3F0E8] font-medium">{targetCareer || 'General Engineering Track'}</p>
                <span className="text-[#9AA5B1] text-[11px] block">Aligned to student career profile</span>
              </div>
            </div>

            {/* Notes / Submission Purpose */}
            <div className="mt-6 pt-6 border-t border-[#202C3B] text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[#9AA5B1] uppercase tracking-wider text-[11px]">
                  Resume Notes / Role Targeting
                </span>
                {!isEditingNotes && (
                  <button
                    onClick={() => {
                      setPreviewNotes(resumeInfo.notes || '');
                      setIsEditingNotes(true);
                    }}
                    className="text-[#D89B5B] hover:text-[#E4AB70] cursor-pointer font-medium"
                  >
                    {resumeInfo.notes ? 'Edit Notes' : '+ Add Notes'}
                  </button>
                )}
              </div>

              {isEditingNotes ? (
                <div className="space-y-3">
                  <textarea
                    rows={2}
                    value={previewNotes}
                    onChange={(e) => setPreviewNotes(e.target.value)}
                    placeholder="e.g., Aligned for Backend & Systems engineering internships. Highlights distributed algorithms and C++."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0E151E] border border-[#202C3B] text-[#F3F0E8] text-xs placeholder-[#768393] focus:outline-none focus:border-[#D89B5B]"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setIsEditingNotes(false)}
                      className="px-3 py-1.5 rounded-lg text-xs text-[#9AA5B1] hover:bg-[#1B2533] border border-[#27384B] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveNotes}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] cursor-pointer transition-colors"
                    >
                      Save Notes
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[#9AA5B1] bg-[#0E151E] p-3.5 rounded-xl border border-[#202C3B] leading-relaxed">
                  {resumeInfo.notes || 'No specific notes recorded. Add targeting details or submission versions.'}
                </p>
              )}
            </div>
          </div>

          {/* Replace Dropzone Section */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-6 rounded-2xl border-2 border-dashed transition-all duration-200 text-center cursor-pointer ${
              isDragging
                ? 'border-[#D89B5B] bg-[#D89B5B]/10'
                : 'border-[#202C3B] bg-[#151D26] hover:border-[#D89B5B]/50 hover:bg-[#19232E]'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#0E151E] border border-[#202C3B] text-[#D89B5B] flex items-center justify-center mx-auto mb-2">
              <UploadCloud className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-[#F3F0E8]">Need to update your resume?</h4>
            <p className="text-[11px] text-[#9AA5B1] mt-1">
              Drop a newer version here or click to browse (PDF or DOCX, max 10MB).
            </p>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="space-y-6" id="resume-empty-section">
          <div
            id="resume-dropzone-empty"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-200 ${
              isDragging
                ? 'border-[#D89B5B] bg-[#D89B5B]/10'
                : 'border-[#202C3B] bg-[#151D26] hover:border-[#D89B5B]/50'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-[#D89B5B]/15 border border-[#D89B5B]/30 text-[#D89B5B] flex items-center justify-center mx-auto mb-4">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#F3F0E8]">No resume uploaded yet</h2>
            <p className="text-sm text-[#9AA5B1] mt-2 max-w-md mx-auto leading-relaxed">
              Add your resume to complete your career profile. PDF and DOCX formats are supported.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="empty-state-browse-resume-btn"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] transition-all duration-150 flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{isProcessing ? 'Processing File...' : 'Upload Resume'}</span>
              </button>
            </div>

            <p className="text-[11px] text-[#768393] font-mono mt-4">
              Supports: PDF, DOCX • Maximum file size: 10MB
            </p>
          </div>

          {/* Information Notice */}
          <div className="p-5 rounded-2xl bg-[#151D26] border border-[#202C3B] space-y-2 text-xs text-[#9AA5B1]">
            <div className="flex items-center gap-2 text-[#D89B5B] font-semibold font-mono text-[11px] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Career Target Alignment</span>
            </div>
            <p className="leading-relaxed text-[#9AA5B1]">
              UNNEXA evaluates keyword and skill coverage between your uploaded resume and your target role (<strong>{targetCareer || 'chosen career'}</strong>).
            </p>
          </div>
        </div>
      )}

      {/* Remove Confirmation Modal */}
      {showRemoveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div
            id="remove-resume-modal"
            className="rounded-2xl bg-[#151D26] border border-[#27384B] w-full max-w-md p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex-shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F3F0E8]">Remove Resume?</h3>
                <p className="text-xs text-[#9AA5B1] mt-1 leading-relaxed">
                  Are you sure you want to remove <strong>"{resumeInfo?.fileName}"</strong> from your student profile? You can upload a new version at any time.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#202C3B] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowRemoveConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#9AA5B1] hover:bg-[#1B2533] border border-[#27384B] transition-all cursor-pointer"
              >
                Keep Resume
              </button>
              <button
                id="confirm-remove-resume-btn"
                type="button"
                onClick={() => {
                  removeResume();
                  setShowRemoveConfirm(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-all cursor-pointer shadow-sm"
              >
                Yes, Remove Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
