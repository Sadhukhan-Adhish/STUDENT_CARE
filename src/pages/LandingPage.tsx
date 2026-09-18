import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  GraduationCap,
  Briefcase,
  Compass,
  FileText,
  FolderGit2,
  TrendingUp,
  Bot,
  Activity,
  Layers,
  ChevronRight,
  Zap,
  Award,
  Target,
  BarChart3,
  GitBranch,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { user, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleLaunchDashboard = async () => {
    if (!user) {
      await demoLogin();
    }
    navigate('/dashboard');
  };

  return (
    <div id="landing-page" className="min-h-screen bg-[#08090D] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Navigation Header */}
      <header id="landing-header" className="sticky top-0 z-40 bg-[#08090D]/85 backdrop-blur-md border-b border-[#161D2B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-indigo-400/40">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white font-heading">NEXORA</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                Student Intelligence
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#pipeline" className="hover:text-white transition-colors">Platform Pipeline</a>
            <a href="#features" className="hover:text-white transition-colors">8 Pillars</a>
            <a href="#workflow" className="hover:text-white transition-colors">Intelligence Flow</a>
            <a href="#preview" className="hover:text-white transition-colors">Dashboard Preview</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              id="nav-signin-btn"
              to="/login"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-[#141A28] border border-transparent hover:border-[#1E2638] transition-all"
            >
              Sign In
            </Link>

            <button
              id="nav-explore-btn"
              onClick={handleLaunchDashboard}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-md shadow-indigo-600/30 border border-indigo-400/30 transition-all flex items-center gap-2 cursor-pointer hover:shadow-indigo-600/50"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero-section" className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-indigo-600/15 via-violet-600/10 to-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-indigo-500/10 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121724] border border-[#20293D] text-xs font-medium text-indigo-300 mb-6 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Student Intelligence Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] font-heading">
              Know Where You Stand. <br />
              <span className="bg-gradient-to-r from-indigo-400 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
                Know Where You're Going.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              NEXORA connects your academic performance, technical skills, projects, resume, and career goals to help you understand where you stand, identify skill gaps, and build a personalized path toward your target career.
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="hero-explore-btn"
                onClick={handleLaunchDashboard}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 border border-indigo-400/30 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>Explore Platform</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                id="hero-signup-btn"
                to="/signup"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-medium text-slate-200 bg-[#101522] hover:bg-[#161D2E] hover:text-white border border-[#20293D] flex items-center justify-center gap-2 transition-all"
              >
                <span>Create Student Account</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>

            {/* Sample Metrics Banner */}
            <div className="mt-10 pt-8 border-t border-[#182030] max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3 text-left">
                <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-semibold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> Sample Student Profile
                </span>
                <span className="text-[11px] text-slate-400">
                  Sample data — Your metrics are calculated from your own profile.
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                <div className="p-3 rounded-lg bg-[#0C1018] border border-[#18202F]">
                  <p className="text-[11px] font-mono text-slate-400 uppercase">Target Readiness</p>
                  <p className="text-xl font-bold text-indigo-400 font-mono mt-0.5">76% Match</p>
                  <p className="text-[10px] text-slate-500 mt-1">Sample calculation</p>
                </div>
                <div className="p-3 rounded-lg bg-[#0C1018] border border-[#18202F]">
                  <p className="text-[11px] font-mono text-slate-400 uppercase">Skill Gap Index</p>
                  <p className="text-xl font-bold text-emerald-400 font-mono mt-0.5">-8% Deficit</p>
                  <p className="text-[10px] text-slate-500 mt-1">Sample calculation</p>
                </div>
                <div className="p-3 rounded-lg bg-[#0C1018] border border-[#18202F]">
                  <p className="text-[11px] font-mono text-slate-400 uppercase">Resume ATS Score</p>
                  <p className="text-xl font-bold text-cyan-400 font-mono mt-0.5">84 / 100</p>
                  <p className="text-[10px] text-slate-500 mt-1">Sample calculation</p>
                </div>
                <div className="p-3 rounded-lg bg-[#0C1018] border border-[#18202F]">
                  <p className="text-[11px] font-mono text-slate-400 uppercase">Active Streak</p>
                  <p className="text-xl font-bold text-amber-400 font-mono mt-0.5">14 Days 🔥</p>
                  <p className="text-[10px] text-slate-500 mt-1">Sample calculation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Intelligence Hero Card Preview */}
          <div id="preview" className="mt-16 relative mx-auto max-w-5xl">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500/30 via-cyan-500/20 to-indigo-600/30 blur-xl opacity-75" />
            <div className="relative rounded-2xl bg-[#0B0F19] border border-[#20293D] shadow-2xl overflow-hidden">
              {/* Window chrome */}
              <div className="h-11 bg-[#090C14] border-b border-[#182030] px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-3 text-xs font-mono text-slate-400">nexora.platform/student/sample-profile/overview</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    SAMPLE STUDENT PROFILE
                  </span>
                  <button
                    onClick={handleLaunchDashboard}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium cursor-pointer"
                  >
                    Explore Platform →
                  </button>
                </div>
              </div>

              {/* Sample Data Disclaimer Callout */}
              <div className="bg-[#0e1424] border-b border-indigo-500/20 px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold uppercase border border-indigo-400/30">
                    SAMPLE STUDENT PROFILE
                  </span>
                  <span className="text-slate-300 text-[11px] sm:text-xs">
                    Sample data — Your metrics are calculated from your own profile.
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Visual Product Demonstration</span>
              </div>

              {/* Dashboard Content Mock */}
              <div className="p-6 sm:p-8 bg-gradient-to-b from-[#0D121F] to-[#090D15]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1B2336]">
                  <div>
                    <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">SAMPLE STUDENT PROFILE</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                      Sample Student • Computer Science &amp; AI (Sem 6)
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Target Role: <strong className="text-white">Machine Learning Engineer</strong> • Academic CGPA: <strong className="text-indigo-300">8.74 / 10</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate('/dashboard/skills')}
                      className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20 transition-all cursor-pointer"
                    >
                      Skill Gap Matrix
                    </button>
                    <button
                      onClick={() => navigate('/dashboard/roadmap')}
                      className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#161D2D] text-slate-200 border border-[#243048] hover:bg-[#1E273D] transition-all cursor-pointer"
                    >
                      Roadmap Stage 3/6
                    </button>
                  </div>
                </div>

                {/* 3 Column Intelligence Snapshot */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
                  {/* Card 1: Academic Performance */}
                  <div className="p-4 rounded-xl bg-[#101624] border border-[#1C2538]">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Academic Performance</span>
                      <span className="text-emerald-400 font-mono font-semibold">+0.54 SGPA Trend</span>
                    </div>
                    <p className="text-2xl font-bold text-white font-mono mt-2">8.74 CGPA</p>
                    <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Algorithms:</span>
                        <span className="text-emerald-400 font-semibold font-mono">A+ (94%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Machine Learning:</span>
                        <span className="text-emerald-400 font-semibold font-mono">A+ (96%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Computer Networks:</span>
                        <span className="text-amber-400 font-semibold font-mono">B+ (78%)</span>
                      </div>
                    </div>
                    <p className="mt-3 text-[10px] text-slate-400 font-mono border-t border-[#1C2538] pt-2">
                      Sample academic coursework data
                    </p>
                  </div>

                  {/* Card 2: Skill Gap */}
                  <div className="p-4 rounded-xl bg-[#101624] border border-[#1C2538]">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Skill Gap Analysis</span>
                      <span className="text-rose-400 font-mono font-semibold">Priority: High</span>
                    </div>
                    <p className="text-2xl font-bold text-white font-mono mt-2">PyTorch &amp; MLOps</p>
                    <p className="text-xs text-slate-300 mt-1">
                      Current: <span className="font-mono text-indigo-400">52%</span> vs Required: <span className="font-mono text-white">80%</span>
                    </p>
                    <div className="mt-3 p-2 rounded bg-indigo-950/40 border border-indigo-500/20 text-[11px] text-indigo-300">
                      Action: Build Transformers &amp; MLflow tracking pipeline to close deficit.
                    </div>
                    <p className="mt-3 text-[10px] text-slate-400 font-mono border-t border-[#1C2538] pt-2">
                      Sample role requirement comparison
                    </p>
                  </div>

                  {/* Card 3: Career Target & Resume / ATS */}
                  <div className="p-4 rounded-xl bg-[#101624] border border-[#1C2538]">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Resume &amp; Career Target</span>
                      <span className="text-cyan-400 font-mono font-semibold">Role Alignment</span>
                    </div>
                    <p className="text-2xl font-bold text-white font-mono mt-2">84 / 100 Score</p>
                    <div className="mt-3 space-y-1 text-xs text-slate-400">
                      <p className="text-slate-300">✓ Target: Machine Learning Engineer</p>
                      <p>✓ 24 technical skills indexed</p>
                      <p className="text-amber-300">⚠ Missing keyword: "Distributed Training"</p>
                    </div>
                    <p className="mt-3 text-[10px] text-slate-400 font-mono border-t border-[#1C2538] pt-2">
                      Sample ATS keyword alignment audit
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Product Message: The Connected Student Intelligence Pipeline */}
      <section id="pipeline" className="py-20 bg-[#06080C] border-y border-[#141A27] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
              Connected Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-heading">
              One Connected Student Intelligence Platform
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
              NEXORA is designed as a unified system rather than isolated tools. Your coursework, technical competencies, portfolio projects, and resume synchronize into a continuous intelligence loop.
            </p>
          </div>

          {/* Pipeline Diagram Cards */}
          <div className="relative max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative z-10">
              {/* Input 1 */}
              <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1A2336] text-center flex flex-col items-center justify-center">
                <GraduationCap className="w-6 h-6 text-indigo-400 mb-2" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Academic Data</h4>
                <p className="text-[11px] text-slate-400 mt-1">Transcripts, SGPA &amp; Coursework</p>
              </div>

              {/* Input 2 */}
              <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1A2336] text-center flex flex-col items-center justify-center">
                <Sparkles className="w-6 h-6 text-violet-400 mb-2" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Skills</h4>
                <p className="text-[11px] text-slate-400 mt-1">Verified Technical Strengths</p>
              </div>

              {/* Input 3 */}
              <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1A2336] text-center flex flex-col items-center justify-center">
                <FolderGit2 className="w-6 h-6 text-cyan-400 mb-2" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Projects</h4>
                <p className="text-[11px] text-slate-400 mt-1">Portfolio &amp; GitHub Proofs</p>
              </div>

              {/* Input 4 */}
              <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1A2336] text-center flex flex-col items-center justify-center">
                <FileText className="w-6 h-6 text-amber-400 mb-2" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Resume</h4>
                <p className="text-[11px] text-slate-400 mt-1">ATS Content &amp; Formatting</p>
              </div>

              {/* Input 5 */}
              <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1A2336] text-center flex flex-col items-center justify-center">
                <Target className="w-6 h-6 text-emerald-400 mb-2" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Career Goal</h4>
                <p className="text-[11px] text-slate-400 mt-1">Target Engineering Role</p>
              </div>
            </div>

            {/* Downward Connector Banner */}
            <div className="my-5 flex flex-col items-center justify-center">
              <div className="h-6 w-0.5 bg-gradient-to-b from-indigo-500 to-violet-500" />
              <div className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-900/60 via-violet-900/60 to-indigo-900/60 border border-indigo-500/40 text-xs font-bold text-indigo-200 shadow-lg shadow-indigo-950/50 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-indigo-400" />
                <span>NEXORA Intelligence Engine</span>
              </div>
              <div className="h-6 w-0.5 bg-gradient-to-b from-violet-500 to-indigo-500" />
            </div>

            {/* Output Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#0A0E17] border border-indigo-500/30 text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">Step 01</span>
                  <BarChart3 className="w-4 h-4 text-indigo-400" />
                </div>
                <h4 className="text-sm font-bold text-white">Skill Gap Analysis</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Calculates the exact differential between your current capabilities and target role standards.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0A0E17] border border-violet-500/30 text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-violet-400 font-bold uppercase">Step 02</span>
                  <Sparkles className="w-4 h-4 text-violet-400" />
                </div>
                <h4 className="text-sm font-bold text-white">Personalized Recommendations</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Generates curated project topics, coursework focal points, and specific keywords to bridge deficits.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0A0E17] border border-cyan-500/30 text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Step 03</span>
                  <Compass className="w-4 h-4 text-cyan-400" />
                </div>
                <h4 className="text-sm font-bold text-white">Action Roadmap</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Structures learning into milestones with actionable tasks, project builds, and resume updates.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0A0E17] border border-emerald-500/30 text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Step 04</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="text-sm font-bold text-white">Progress Tracking</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Records completed tasks, updates your metrics, and recalculates your career readiness dynamically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intelligence Flow: Student Data -> Intelligence -> Recommendation -> Action -> Progress -> Updated Data */}
      <section id="workflow" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
            Operational Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-heading">
            How Student Intelligence Works
          </h2>
          <p className="text-sm text-slate-400 mt-3">
            A continuous closed loop that transforms your academic and technical inputs into actionable career progression.
          </p>
        </div>

        {/* 5 Steps Structure */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'Student Data',
              desc: 'Academic records, skills, projects, resume and career goals.',
              icon: GraduationCap,
              color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
            },
            {
              step: '02',
              title: 'Intelligence',
              desc: "Analyze academic performance, technical skills and the student's current profile.",
              icon: Activity,
              color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
            },
            {
              step: '03',
              title: 'Recommendation',
              desc: 'Identify skill gaps and generate relevant recommendations.',
              icon: Sparkles,
              color: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
            },
            {
              step: '04',
              title: 'Action',
              desc: 'Follow a personalized roadmap with projects, learning goals and resume improvements.',
              icon: Zap,
              color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
            },
            {
              step: '05',
              title: 'Progress',
              desc: 'Track completed work and changes in academic and career readiness.',
              icon: Award,
              color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-xl bg-[#0A0E17] border border-[#192234] hover:border-[#283550] transition-all relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-slate-400">{item.step}</span>
                    <div className={`p-2 rounded-lg border ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#151D2C] flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Stage {idx + 1} of 5</span>
                  {idx < 4 ? <span>Next →</span> : <span className="text-indigo-400">Loop ↺</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Closed Loop Concept Indicator */}
        <div className="mt-8 p-4 rounded-xl bg-[#0B0F19] border border-[#1E2638] text-center max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-slate-300">
          <span className="text-indigo-300 font-semibold">Student Data</span>
          <span className="text-slate-500">→</span>
          <span className="text-cyan-300 font-semibold">Intelligence</span>
          <span className="text-slate-500">→</span>
          <span className="text-violet-300 font-semibold">Recommendation</span>
          <span className="text-slate-500">→</span>
          <span className="text-amber-300 font-semibold">Action</span>
          <span className="text-slate-500">→</span>
          <span className="text-emerald-300 font-semibold">Progress</span>
          <span className="text-slate-500">→</span>
          <span className="text-indigo-300 font-semibold">Updated Data</span>
        </div>
      </section>

      {/* 8 Pillars Section */}
      <section id="features" className="py-24 bg-[#080B12] border-t border-[#141A27]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
              Comprehensive Platform
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-heading">
              8 Pillars of Student Career Mastery
            </h2>
            <p className="text-sm text-slate-400 mt-3">
              Each module addresses a critical stage of engineering student preparation, functioning together within one synchronized platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: 'pillar-academic',
                title: 'Academic Intelligence',
                route: '/dashboard/academic',
                icon: GraduationCap,
                desc: 'Log semester coursework, analyze SGPA and CGPA trends over time, and evaluate subject performance strengths.',
                tag: 'Curriculum',
              },
              {
                id: 'pillar-skills',
                title: 'Skill Gap Analyzer',
                route: '/dashboard/skills',
                icon: Sparkles,
                desc: 'Compare your current technical proficiencies directly against standard role requirements to identify missing skills.',
                tag: 'Competency',
              },
              {
                id: 'pillar-career',
                title: 'Career Recommendations',
                route: '/dashboard/career',
                icon: Briefcase,
                desc: 'Explore engineering tracks, view typical skill profiles for target roles, and evaluate how your profile aligns.',
                tag: 'Direction',
              },
              {
                id: 'pillar-roadmap',
                title: 'Personalized Roadmap',
                route: '/dashboard/roadmap',
                icon: Compass,
                desc: 'Follow structured milestones designed to guide you through foundational concepts, projects, and interview readiness.',
                tag: 'Milestones',
              },
              {
                id: 'pillar-resume',
                title: 'Resume Intelligence',
                route: '/dashboard/resume',
                icon: FileText,
                desc: 'Audit your resume content for technical keyword coverage, section completeness, and alignment with target engineering roles.',
                tag: 'Formatting',
              },
              {
                id: 'pillar-projects',
                title: 'Project Lab',
                route: '/dashboard/projects',
                icon: FolderGit2,
                desc: 'Discover practical portfolio project recommendations designed to help you build evidence for skills with identified deficits.',
                tag: 'Portfolio',
              },
              {
                id: 'pillar-progress',
                title: 'Progress & Achievements',
                route: '/dashboard/progress',
                icon: TrendingUp,
                desc: 'Track completed milestones, maintain study consistency streaks, and earn achievement badges as your profile develops.',
                tag: 'Tracking',
              },
              {
                id: 'pillar-ai',
                title: 'AI Student Assistant',
                route: '/dashboard/ai',
                icon: Bot,
                desc: 'Ask questions and receive guidance tailored to your coursework history, technical skills, and target engineering goals.',
                tag: 'Guidance',
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  id={feature.id}
                  onClick={() => navigate(feature.route)}
                  className="p-6 rounded-xl bg-[#0B0F19] border border-[#1A2234] hover:border-indigo-500/40 hover:bg-[#0E1422] transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#131926] text-slate-400 border border-[#1E283C]">
                        {feature.tag}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-[#161E2E] flex items-center justify-between text-xs font-semibold text-indigo-400">
                    <span>Explore Module</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Action / Getting Started Section */}
      <section id="cta-section" className="py-20 bg-gradient-to-b from-[#08090D] via-[#0E1320] to-[#08090D] border-t border-[#182132]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold mb-4">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ready to explore your student intelligence?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-heading">
            Connect Your Data. <br />
            Chart Your Career Path.
          </h2>

          <p className="mt-4 text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            NEXORA connects your academic performance, technical skills, projects, resume, and career goals to help you understand where you stand and build a personalized roadmap.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="cta-explore-btn"
              onClick={handleLaunchDashboard}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 border border-indigo-400/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              id="cta-signup-btn"
              to="/signup"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-medium text-slate-200 bg-[#121828] hover:bg-[#182034] border border-[#222E46] transition-all flex items-center justify-center gap-2"
            >
              <span>Create Student Account</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="landing-footer" className="mt-auto border-t border-[#161D2B] bg-[#07080C] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-white tracking-wider">NEXORA</span>
              <p className="text-xs text-slate-400">AI-Powered Student Intelligence &amp; Career Platform</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-400">
            <a href="#pipeline" className="hover:text-white transition-colors">Pipeline</a>
            <a href="#features" className="hover:text-white transition-colors">8 Pillars</a>
            <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/signup" className="hover:text-white transition-colors">Create Account</Link>
            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link to="/dashboard/academic" className="hover:text-white transition-colors">Academics</Link>
            <Link to="/dashboard/skills" className="hover:text-white transition-colors">Skills</Link>
            <Link to="/dashboard/resume" className="hover:text-white transition-colors">Resume ATS</Link>
          </div>

          <div className="text-xs text-slate-400 text-center md:text-right">
            <p>© 2026 NEXORA. All rights reserved.</p>
            <p className="font-mono text-[11px] text-slate-500 mt-0.5">Know Where You Stand. Know Where You're Going.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
