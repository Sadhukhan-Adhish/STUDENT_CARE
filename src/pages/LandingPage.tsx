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
  const { user, enterGuestMode } = useAuth();
  const navigate = useNavigate();

  const handleLaunchDashboard = async () => {
    if (!user) {
      await enterGuestMode();
    }
    navigate('/dashboard');
  };

  const handleNavigateModule = async (route: string) => {
    if (!user) {
      await enterGuestMode();
    }
    navigate(route);
  };

  return (
    <div id="landing-page" className="min-h-screen bg-[#0B0F14] text-[#F3F0E8] flex flex-col font-sans selection:bg-[#D89B5B]/30 selection:text-[#E8B47E]">
      {/* Navigation Header */}
      <header id="landing-header" className="sticky top-0 z-40 bg-[#0B0F14]/90 backdrop-blur-md border-b border-[#202C3B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D89B5B] flex items-center justify-center shadow-lg shadow-[#D89B5B]/20 border border-[#D89B5B]/40">
              <svg className="w-5 h-5 text-[#0B0F14]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#F3F0E8] font-heading">UNNEXA</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase tracking-widest text-[#D89B5B] bg-[#D89B5B]/10 px-2 py-0.5 rounded border border-[#D89B5B]/25">
                Student Intelligence
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#9AA5B1]">
            <a href="#pipeline" className="hover:text-[#F3F0E8] transition-colors">Platform Pipeline</a>
            <a href="#features" className="hover:text-[#F3F0E8] transition-colors">8 Pillars</a>
            <a href="#workflow" className="hover:text-[#F3F0E8] transition-colors">Intelligence Flow</a>
            <a href="#preview" className="hover:text-[#F3F0E8] transition-colors">Dashboard Preview</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              id="nav-signin-btn"
              to="/login"
              className="px-4 py-2 rounded-xl text-sm font-medium text-[#9AA5B1] hover:text-[#F3F0E8] hover:bg-[#151D26] border border-transparent hover:border-[#202C3B] transition-all"
            >
              Sign In
            </Link>

            <button
              id="nav-explore-btn"
              onClick={handleLaunchDashboard}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] shadow-md shadow-[#D89B5B]/20 border border-[#D89B5B]/40 transition-all flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
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
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-[#D89B5B]/10 via-[#67C5B8]/8 to-[#D89B5B]/5 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-[#D89B5B]/8 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151D26] border border-[#202C3B] text-xs font-medium text-[#E8B47E] mb-6 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-[#D89B5B]" />
              <span>Student Intelligence Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#F3F0E8] tracking-tight leading-[1.1] font-heading">
              Know Where You Stand. <br />
              <span className="text-[#D89B5B]">
                Know Where You're Going.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-[#9AA5B1] max-w-2xl mx-auto leading-relaxed">
              UNNEXA connects your academic performance, technical skills, projects, resume, and career goals to help you understand where you stand, identify skill gaps, and build a personalized path toward your target career.
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="hero-explore-btn"
                onClick={handleLaunchDashboard}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-bold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] shadow-xl shadow-[#D89B5B]/20 border border-[#D89B5B]/40 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>Explore Platform</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                id="hero-signup-btn"
                to="/signup"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-medium text-[#F3F0E8] bg-[#151D26] hover:bg-[#1B2533] border border-[#202C3B] flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
              >
                <span>Create Student Account</span>
                <ChevronRight className="w-4 h-4 text-[#9AA5B1]" />
              </Link>
            </div>

            {/* Platform Telemetry Highlights */}
            <div className="mt-12 pt-8 border-t border-[#1C2633] max-w-4xl mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                <div className="p-4 rounded-xl bg-[#151D26] border border-[#202C3B]">
                  <p className="text-[11px] font-mono text-[#9AA5B1] uppercase tracking-wider">Curriculum</p>
                  <p className="text-base font-bold text-[#F3F0E8] mt-1">Coursework Sync</p>
                  <p className="text-[11px] text-[#9AA5B1] mt-1 leading-normal">Maps subjects and grades to industry expectations</p>
                </div>
                <div className="p-4 rounded-xl bg-[#151D26] border border-[#202C3B]">
                  <p className="text-[11px] font-mono text-[#9AA5B1] uppercase tracking-wider">Competency</p>
                  <p className="text-base font-bold text-[#67C5B8] mt-1">Skill Gap Audit</p>
                  <p className="text-[11px] text-[#9AA5B1] mt-1 leading-normal">Pinpoints missing tools and technical deficits</p>
                </div>
                <div className="p-4 rounded-xl bg-[#151D26] border border-[#202C3B]">
                  <p className="text-[11px] font-mono text-[#9AA5B1] uppercase tracking-wider">Placement</p>
                  <p className="text-base font-bold text-[#D89B5B] mt-1">ATS Optimization</p>
                  <p className="text-[11px] text-[#9AA5B1] mt-1 leading-normal">Calibrates resume keywords against target roles</p>
                </div>
                <div className="p-4 rounded-xl bg-[#151D26] border border-[#202C3B]">
                  <p className="text-[11px] font-mono text-[#9AA5B1] uppercase tracking-wider">Trajectory</p>
                  <p className="text-base font-bold text-[#F3F0E8] mt-1">Adaptive Roadmap</p>
                  <p className="text-[11px] text-[#9AA5B1] mt-1 leading-normal">Step-by-step milestones to campus readiness</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Intelligence Hero Card Preview */}
          <div id="preview" className="mt-16 relative mx-auto max-w-5xl">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#D89B5B]/20 via-[#67C5B8]/15 to-[#D89B5B]/20 blur-xl opacity-75" />
            <div className="relative rounded-2xl bg-[#101620] border border-[#202C3B] shadow-2xl overflow-hidden">
              {/* Window chrome */}
              <div className="h-11 bg-[#0D1219] border-b border-[#1C2633] px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-3 text-xs font-mono text-[#9AA5B1]">unnexa.app/dashboard/overview</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#D89B5B]/15 text-[#E8B47E] border border-[#D89B5B]/30">
                    UNNEXA PLATFORM
                  </span>
                  <button
                    onClick={handleLaunchDashboard}
                    className="text-xs text-[#D89B5B] hover:text-[#E8B47E] flex items-center gap-1 font-medium cursor-pointer"
                  >
                    Open Live App →
                  </button>
                </div>
              </div>

              {/* Dashboard Content Mock */}
              <div className="p-6 sm:p-8 bg-[#151D26]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#202C3B]">
                  <div>
                    <span className="text-xs font-mono text-[#D89B5B] uppercase tracking-wider">Student Intelligence Suite</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#F3F0E8] mt-1">
                      Integrated Academic &amp; Career Telemetry
                    </h2>
                    <p className="text-xs text-[#9AA5B1] mt-1">
                      Connected curriculum analysis, verified skill proficiencies, and targeted industry alignment.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate('/dashboard/skills')}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#D89B5B]/15 text-[#E8B47E] border border-[#D89B5B]/30 hover:bg-[#D89B5B]/25 transition-all cursor-pointer"
                    >
                      Skill Gap Matrix
                    </button>
                    <button
                      onClick={() => navigate('/dashboard/roadmap')}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1C2633] text-[#F3F0E8] border border-[#2D3A4B] hover:bg-[#253243] transition-all cursor-pointer"
                    >
                      Career Roadmap
                    </button>
                  </div>
                </div>

                {/* 3 Column Intelligence Snapshot */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
                  {/* Card 1: Academic Performance */}
                  <div className="p-4 rounded-xl bg-[#111822] border border-[#202C3B]">
                    <div className="flex items-center justify-between text-xs text-[#9AA5B1]">
                      <span>Academic Performance</span>
                      <span className="text-[#67C5B8] font-mono font-semibold">Continuous Record</span>
                    </div>
                    <p className="text-2xl font-bold text-[#F3F0E8] font-mono mt-2">Coursework Intelligence</p>
                    <div className="mt-3 space-y-2 text-xs text-[#9AA5B1]">
                      <div className="flex justify-between">
                        <span>Semester Transcripts:</span>
                        <span className="text-[#F3F0E8] font-semibold">Logged by semester</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SGPA &amp; CGPA Engine:</span>
                        <span className="text-[#67C5B8] font-semibold font-mono">Dynamic SGPA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Core Curriculum:</span>
                        <span className="text-[#E8B47E] font-semibold">Syllabus-aligned</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Skill Gap */}
                  <div className="p-4 rounded-xl bg-[#111822] border border-[#202C3B]">
                    <div className="flex items-center justify-between text-xs text-[#9AA5B1]">
                      <span>Skill Gap Analysis</span>
                      <span className="text-[#D89B5B] font-mono font-semibold">Role Calibration</span>
                    </div>
                    <p className="text-2xl font-bold text-[#F3F0E8] font-mono mt-2">Competency Diagnostics</p>
                    <p className="text-xs text-[#9AA5B1] mt-2 leading-relaxed">
                      Evaluates your student proficiencies against target market job profiles, flagging critical gaps and missing competencies.
                    </p>
                    <div className="mt-3 p-2 rounded-lg bg-[#D89B5B]/10 border border-[#D89B5B]/20 text-[11px] text-[#E8B47E]">
                      Auto-generates recommended projects and coursework to close deficits.
                    </div>
                  </div>

                  {/* Card 3: Career Target & Resume / ATS */}
                  <div className="p-4 rounded-xl bg-[#111822] border border-[#202C3B]">
                    <div className="flex items-center justify-between text-xs text-[#9AA5B1]">
                      <span>Resume &amp; Career Target</span>
                      <span className="text-[#67C5B8] font-mono font-semibold">ATS Engine</span>
                    </div>
                    <p className="text-2xl font-bold text-[#F3F0E8] font-mono mt-2">Career Readiness</p>
                    <div className="mt-3 space-y-1.5 text-xs text-[#9AA5B1]">
                      <p className="text-[#F3F0E8]">✓ Student-chosen target specialization</p>
                      <p>✓ Technical keyword alignment check</p>
                      <p className="text-[#67C5B8]">✓ Resume format and section verification</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Product Message: The Connected Student Intelligence Pipeline */}
      <section id="pipeline" className="py-20 bg-[#0E141B] border-y border-[#1C2633] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-[#D89B5B] font-semibold">
              Connected Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F3F0E8] mt-2 font-heading">
              One Connected Student Intelligence Platform
            </h2>
            <p className="text-sm sm:text-base text-[#9AA5B1] mt-3 leading-relaxed">
              UNNEXA is designed as a unified system rather than isolated tools. Your coursework, technical competencies, portfolio projects, and resume synchronize into a continuous intelligence loop.
            </p>
          </div>

          {/* Pipeline Diagram Cards */}
          <div className="relative max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative z-10">
              {/* Input 1 */}
              <div className="p-4 rounded-xl bg-[#151D26] border border-[#202C3B] text-center flex flex-col items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#D89B5B] mb-2" />
                <h4 className="text-xs font-bold text-[#F3F0E8] uppercase tracking-wider">Academic Data</h4>
                <p className="text-[11px] text-[#9AA5B1] mt-1">Transcripts, SGPA &amp; Coursework</p>
              </div>

              {/* Input 2 */}
              <div className="p-4 rounded-xl bg-[#151D26] border border-[#202C3B] text-center flex flex-col items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#67C5B8] mb-2" />
                <h4 className="text-xs font-bold text-[#F3F0E8] uppercase tracking-wider">Skills</h4>
                <p className="text-[11px] text-[#9AA5B1] mt-1">Verified Technical Strengths</p>
              </div>

              {/* Input 3 */}
              <div className="p-4 rounded-xl bg-[#151D26] border border-[#202C3B] text-center flex flex-col items-center justify-center">
                <FolderGit2 className="w-6 h-6 text-[#D89B5B] mb-2" />
                <h4 className="text-xs font-bold text-[#F3F0E8] uppercase tracking-wider">Projects</h4>
                <p className="text-[11px] text-[#9AA5B1] mt-1">Portfolio &amp; GitHub Proofs</p>
              </div>

              {/* Input 4 */}
              <div className="p-4 rounded-xl bg-[#151D26] border border-[#202C3B] text-center flex flex-col items-center justify-center">
                <FileText className="w-6 h-6 text-[#67C5B8] mb-2" />
                <h4 className="text-xs font-bold text-[#F3F0E8] uppercase tracking-wider">Resume</h4>
                <p className="text-[11px] text-[#9AA5B1] mt-1">ATS Content &amp; Formatting</p>
              </div>

              {/* Input 5 */}
              <div className="p-4 rounded-xl bg-[#151D26] border border-[#202C3B] text-center flex flex-col items-center justify-center">
                <Target className="w-6 h-6 text-[#D89B5B] mb-2" />
                <h4 className="text-xs font-bold text-[#F3F0E8] uppercase tracking-wider">Career Goal</h4>
                <p className="text-[11px] text-[#9AA5B1] mt-1">Target Engineering Role</p>
              </div>
            </div>

            {/* Downward Connector Banner */}
            <div className="my-5 flex flex-col items-center justify-center">
              <div className="h-6 w-0.5 bg-[#D89B5B]" />
              <div className="px-6 py-2 rounded-full bg-[#151D26] border border-[#D89B5B]/40 text-xs font-bold text-[#E8B47E] shadow-lg flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#D89B5B]" />
                <span>UNNEXA Intelligence Engine</span>
              </div>
              <div className="h-6 w-0.5 bg-[#D89B5B]" />
            </div>

            {/* Output Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#151D26] border border-[#202C3B] text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-[#D89B5B] font-bold uppercase">Step 01</span>
                  <BarChart3 className="w-4 h-4 text-[#D89B5B]" />
                </div>
                <h4 className="text-sm font-bold text-[#F3F0E8]">Skill Gap Analysis</h4>
                <p className="text-xs text-[#9AA5B1] mt-1.5 leading-relaxed">
                  Calculates the exact differential between your current capabilities and target role standards.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#151D26] border border-[#202C3B] text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-[#67C5B8] font-bold uppercase">Step 02</span>
                  <Sparkles className="w-4 h-4 text-[#67C5B8]" />
                </div>
                <h4 className="text-sm font-bold text-[#F3F0E8]">Tailored Projects</h4>
                <p className="text-xs text-[#9AA5B1] mt-1.5 leading-relaxed">
                  Generates curated project topics, coursework focal points, and specific keywords to bridge deficits.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#151D26] border border-[#202C3B] text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-[#D89B5B] font-bold uppercase">Step 03</span>
                  <Compass className="w-4 h-4 text-[#D89B5B]" />
                </div>
                <h4 className="text-sm font-bold text-[#F3F0E8]">Action Roadmap</h4>
                <p className="text-xs text-[#9AA5B1] mt-1.5 leading-relaxed">
                  Structures learning into milestones with actionable tasks, project builds, and resume updates.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#151D26] border border-[#202C3B] text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-[#67C5B8] font-bold uppercase">Step 04</span>
                  <TrendingUp className="w-4 h-4 text-[#67C5B8]" />
                </div>
                <h4 className="text-sm font-bold text-[#F3F0E8]">Progress Tracking</h4>
                <p className="text-xs text-[#9AA5B1] mt-1.5 leading-relaxed">
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
          <span className="text-xs font-mono uppercase tracking-widest text-[#D89B5B] font-semibold">
            Operational Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F3F0E8] mt-2 font-heading">
            How Student Intelligence Works
          </h2>
          <p className="text-sm text-[#9AA5B1] mt-3">
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
              color: 'text-[#D89B5B] border-[#D89B5B]/30 bg-[#D89B5B]/10',
            },
            {
              step: '02',
              title: 'Intelligence',
              desc: "Analyze academic performance, technical skills and the student's current profile.",
              icon: Activity,
              color: 'text-[#67C5B8] border-[#67C5B8]/30 bg-[#67C5B8]/10',
            },
            {
              step: '03',
              title: 'Recommendation',
              desc: 'Identify skill gaps and generate relevant recommendations.',
              icon: Sparkles,
              color: 'text-[#D89B5B] border-[#D89B5B]/30 bg-[#D89B5B]/10',
            },
            {
              step: '04',
              title: 'Action',
              desc: 'Follow a personalized roadmap with projects, learning goals and resume improvements.',
              icon: Zap,
              color: 'text-[#67C5B8] border-[#67C5B8]/30 bg-[#67C5B8]/10',
            },
            {
              step: '05',
              title: 'Progress',
              desc: 'Track completed work and changes in academic and career readiness.',
              icon: Award,
              color: 'text-[#D89B5B] border-[#D89B5B]/30 bg-[#D89B5B]/10',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-xl bg-[#151D26] border border-[#202C3B] hover:border-[#D89B5B]/40 transition-all relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-[#9AA5B1]">{item.step}</span>
                    <div className={`p-2 rounded-lg border ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-[#F3F0E8] mb-2">{item.title}</h3>
                  <p className="text-xs text-[#9AA5B1] leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#202C3B] flex items-center justify-between text-[10px] font-mono text-[#9AA5B1]">
                  <span>Stage {idx + 1} of 5</span>
                  {idx < 4 ? <span>Next →</span> : <span className="text-[#D89B5B]">Loop ↺</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Closed Loop Concept Indicator */}
        <div className="mt-8 p-4 rounded-xl bg-[#151D26] border border-[#202C3B] text-center max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-[#9AA5B1]">
          <span className="text-[#E8B47E] font-semibold">Student Data</span>
          <span className="text-[#9AA5B1]">→</span>
          <span className="text-[#67C5B8] font-semibold">Intelligence</span>
          <span className="text-[#9AA5B1]">→</span>
          <span className="text-[#E8B47E] font-semibold">Recommendation</span>
          <span className="text-[#9AA5B1]">→</span>
          <span className="text-[#67C5B8] font-semibold">Action</span>
          <span className="text-[#9AA5B1]">→</span>
          <span className="text-[#E8B47E] font-semibold">Progress</span>
          <span className="text-[#9AA5B1]">→</span>
          <span className="text-[#67C5B8] font-semibold">Updated Data</span>
        </div>
      </section>

      {/* 8 Pillars Section */}
      <section id="features" className="py-24 bg-[#0E141B] border-t border-[#1C2633]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#D89B5B] font-semibold">
              Comprehensive Platform
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F3F0E8] mt-2 font-heading">
              8 Pillars of Student Career Mastery
            </h2>
            <p className="text-sm text-[#9AA5B1] mt-3">
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
                  onClick={() => handleNavigateModule(feature.route)}
                  className="p-6 rounded-2xl bg-[#151D26] border border-[#202C3B] hover:border-[#D89B5B]/50 hover:bg-[#1A2430] transition-all cursor-pointer group flex flex-col justify-between hover:-translate-y-1 shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 rounded-xl bg-[#D89B5B]/15 border border-[#D89B5B]/30 text-[#D89B5B] group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#111822] text-[#9AA5B1] border border-[#1E2938]">
                        {feature.tag}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#F3F0E8] group-hover:text-[#E8B47E] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-[#9AA5B1] mt-2 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-[#202C3B] flex items-center justify-between text-xs font-semibold text-[#D89B5B]">
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
      <section id="cta-section" className="py-20 bg-gradient-to-b from-[#0B0F14] via-[#121922] to-[#0B0F14] border-t border-[#1C2633]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D89B5B]/15 text-[#E8B47E] border border-[#D89B5B]/30 text-xs font-semibold mb-4">
            <Layers className="w-3.5 h-3.5 text-[#D89B5B]" />
            <span>Ready to explore your student intelligence?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F3F0E8] tracking-tight font-heading">
            Connect Your Data. <br />
            Chart Your Career Path.
          </h2>

          <p className="mt-4 text-base text-[#9AA5B1] max-w-xl mx-auto leading-relaxed">
            UNNEXA connects your academic performance, technical skills, projects, resume, and career goals to help you understand where you stand and build a personalized roadmap.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="cta-explore-btn"
              onClick={handleLaunchDashboard}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-bold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] shadow-xl shadow-[#D89B5B]/20 border border-[#D89B5B]/40 flex items-center justify-center gap-2 transition-all cursor-pointer hover:-translate-y-0.5"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              id="cta-signup-btn"
              to="/signup"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-medium text-[#F3F0E8] bg-[#151D26] hover:bg-[#1B2533] border border-[#202C3B] transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              <span>Create Student Account</span>
              <ChevronRight className="w-4 h-4 text-[#9AA5B1]" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="landing-footer" className="mt-auto border-t border-[#202C3B] bg-[#090D12] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#D89B5B] flex items-center justify-center">
              <svg className="w-4 h-4 text-[#0B0F14]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-[#F3F0E8] tracking-wider">UNNEXA</span>
              <p className="text-xs text-[#9AA5B1]">Student Intelligence &amp; Career Trajectory Platform</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-[#9AA5B1]">
            <a href="#pipeline" className="hover:text-[#F3F0E8] transition-colors">Pipeline</a>
            <a href="#features" className="hover:text-[#F3F0E8] transition-colors">8 Pillars</a>
            <a href="#workflow" className="hover:text-[#F3F0E8] transition-colors">Workflow</a>
            <Link to="/login" className="hover:text-[#F3F0E8] transition-colors">Sign In</Link>
            <Link to="/signup" className="hover:text-[#F3F0E8] transition-colors">Create Account</Link>
            <Link to="/dashboard" className="hover:text-[#F3F0E8] transition-colors">Dashboard</Link>
            <Link to="/dashboard/academic" className="hover:text-[#F3F0E8] transition-colors">Academics</Link>
            <Link to="/dashboard/skills" className="hover:text-[#F3F0E8] transition-colors">Skills</Link>
            <Link to="/dashboard/resume" className="hover:text-[#F3F0E8] transition-colors">Resume ATS</Link>
          </div>

          <div className="text-xs text-[#9AA5B1] text-center md:text-right">
            <p>© 2026 UNNEXA. All rights reserved.</p>
            <p className="font-mono text-[11px] text-[#768393] mt-0.5">Know Where You Stand. Know Where You're Going.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
