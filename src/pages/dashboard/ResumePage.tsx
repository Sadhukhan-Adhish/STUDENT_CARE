import React, { useState } from 'react';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  FileCheck,
  Eye,
  Download,
} from 'lucide-react';
import { PageHeader, StatCard, ProgressBar } from '../../components/common/UIComponents';
import { mockResumeAnalysis } from '../../data/mockData';

export const ResumePage: React.FC = () => {
  const [analysis, setAnalysis] = useState(mockResumeAnalysis);
  const [isUploading, setIsUploading] = useState(false);
  const [showAtsPreview, setShowAtsPreview] = useState(false);
  const [activeFileName, setActiveFileName] = useState(mockResumeAnalysis.fileName);

  const handleSimulateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setActiveFileName(file.name);
    setIsUploading(true);

    // Simulate AI parsing delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setAnalysis((prev) => ({
      ...prev,
      fileName: file.name,
      overallScore: 88,
      matchPercentage: 86,
      uploadedAt: 'Just now',
    }));
    setIsUploading(false);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <PageHeader
        title="Resume Intelligence &amp; ATS Optimization"
        subtitle="Automated semantic parsing, keyword gap matching, and quantifiable impact benchmarking against tier-1 job specifications."
        badge="ATS Parsing Engine"
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Target Role:</span>
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
              {analysis.targetRole}
            </span>
          </div>
        }
      />

      {/* Upload Zone & Resume Score Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Zone (1 col) */}
        <div className="rounded-2xl bg-[#0D111A] border border-[#1C2538] p-6 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Document Upload</span>
            <h2 className="text-base font-bold text-white mt-1">Upload Resume (PDF / DOCX)</h2>

            <label className="mt-4 border-2 border-dashed border-[#222E46] hover:border-indigo-500/50 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-[#090D15]/50 hover:bg-[#0E1422] block">
              <UploadCloud className="w-8 h-8 text-indigo-400 mb-2" />
              <p className="text-xs font-semibold text-white">
                {isUploading ? 'Analyzing Resume with AI...' : 'Click or Drag PDF here'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Supports PDF, DOCX up to 10MB</p>
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleSimulateUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>

          <div className="mt-4 pt-3 border-t border-[#182132] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span className="font-mono text-slate-300 truncate">{activeFileName}</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono flex-shrink-0">Parsed ✓</span>
          </div>
        </div>

        {/* ATS Score & Match Overview (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-gradient-to-r from-[#0E1322] via-[#0E1526] to-[#0A0D15] border border-[#1E273D] p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#1A2336]">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
                  ATS Score Analysis
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">Resume Calibration for {analysis.targetRole}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold">
                  Status: {analysis.atsStatus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-5">
              <div className="p-3.5 rounded-xl bg-[#111626] border border-[#1E283C]">
                <span className="text-[11px] text-slate-400 font-mono">Overall ATS Score</span>
                <div className="text-3xl font-extrabold text-white font-mono mt-1">{analysis.overallScore} / 100</div>
                <span className="text-[10px] text-emerald-400 font-semibold">Top 12% Applicant Tier</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#111626] border border-[#1E283C]">
                <span className="text-[11px] text-slate-400 font-mono">Role Match Index</span>
                <div className="text-3xl font-extrabold text-indigo-400 font-mono mt-1">{analysis.matchPercentage}%</div>
                <span className="text-[10px] text-indigo-300 font-semibold">6 Critical Keywords Found</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#111626] border border-[#1E283C]">
                <span className="text-[11px] text-slate-400 font-mono">Detected Technical Skills</span>
                <div className="text-3xl font-extrabold text-cyan-400 font-mono mt-1">{analysis.detectedSkills.length}</div>
                <span className="text-[10px] text-cyan-300 font-semibold">Extracted from Sections</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#182132] text-xs">
            <span className="text-slate-400">Architecture prepared for FastAPI &amp; Gemini Resume Ingestion</span>
            <button
              onClick={() => setShowAtsPreview(!showAtsPreview)}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>{showAtsPreview ? 'Hide Raw ATS Output' : 'Toggle ATS Simulated View'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Raw ATS Output Inspector Toggle */}
      {showAtsPreview && (
        <div className="p-5 rounded-xl bg-[#090C14] border border-[#1E2638] font-mono text-xs text-slate-300 space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-[#182132] pb-2">
            <span>// SIMULATED ATS PARSER JSON OUTPUT</span>
            <span>Target Role: Machine Learning Engineer</span>
          </div>
          <pre className="overflow-x-auto text-[11px] text-indigo-300 leading-relaxed">
{JSON.stringify(
  {
    applicant: 'Alex Chen',
    contact: { email: 'alex.chen@university.edu', phone: '+1-xxx-xxx-xxxx', status: 'VALID' },
    education: { degree: 'B.Tech CSE & AI', gpa: 8.74, university: 'Pacific Institute of Technology' },
    extractedSkills: analysis.detectedSkills,
    missingKeywordsIdentified: analysis.missingKeywords,
    atsCompatibilityRate: `${analysis.overallScore}%`,
  },
  null,
  2
)}
          </pre>
        </div>
      )}

      {/* 2 Column Breakdown: Detected Skills vs Missing Keywords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Detected Skills */}
        <div className="rounded-2xl bg-[#0D111A] border border-[#1B2232] p-6 shadow-lg">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Extracted Skills Validated by ATS ({analysis.detectedSkills.length})</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Parsed directly from your education, experience, and project descriptions:
          </p>

          <div className="flex flex-wrap gap-2">
            {analysis.detectedSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg bg-[#111726] border border-[#1E283C] text-xs font-medium text-slate-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="rounded-2xl bg-[#0D111A] border border-[#1B2232] p-6 shadow-lg">
          <div className="flex items-center gap-2 text-sm font-bold text-rose-400 mb-2">
            <AlertCircle className="w-4 h-4" />
            <span>Missing Role Keywords ({analysis.missingKeywords.length})</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Critical keywords frequent in 90%+ ML Engineer job postings missing in your resume:
          </p>

          <div className="space-y-2.5">
            {analysis.missingKeywords.map((kw, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-[#141A28] border border-rose-500/20 text-xs text-rose-200 flex items-center justify-between"
              >
                <span className="font-mono">{kw}</span>
                <span className="text-[10px] text-rose-400 font-semibold font-mono">Recommend Inserting</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths & Actionable Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-[#0D111A] border border-[#1B2232] p-6 shadow-lg">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Identified Resume Strengths</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {analysis.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span className="leading-relaxed">{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-[#0D111A] border border-[#1B2232] p-6 shadow-lg">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Actionable ATS Improvements</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {analysis.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                <span className="leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
