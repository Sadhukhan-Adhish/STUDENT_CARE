import React, { useState } from 'react';
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
  CheckCircle2,
  Flame,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
  Star,
  Activity,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockStudent } from '../data/mockData';

export const LandingPage: React.FC = () => {
  const { user, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'flow' | 'skills' | 'roadmap'>('flow');

  const handleLaunchDashboard = async () => {
    if (!user) {
      await demoLogin();
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#08090D] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-indigo-900/40 to-indigo-950/80 border-b border-indigo-500/20 py-2 px-4 text-center text-xs text-indigo-300 flex items-center justify-center gap-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
          NEW
        </span>
        <span>Version 2.4 Released: Skill-Gap Matrix & Automated ATS Resume Analyzer</span>
        <button
          onClick={handleLaunchDashboard}
          className="underline font-semibold hover:text-white cursor-pointer ml-1 inline-flex items-center gap-1"
        >
          Try Live Demo <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#08090D]/85 backdrop-blur-md border-b border-[#161D2B]">
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
            <a href="#features" className="hover:text-white transition-colors">Capabilities</a>
            <a href="#workflow" className="hover:text-white transition-colors">Intelligence Flow</a>
            <a href="#preview" className="hover:text-white transition-colors">Live Preview</a>
            <a href="#outcomes" className="hover:text-white transition-colors">Student Outcomes</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-[#141A28] border border-transparent hover:border-[#1E2638] transition-all"
            >
              Sign In
            </Link>

            <button
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
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-indigo-600/15 via-violet-600/10 to-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-indigo-500/10 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121724] border border-[#20293D] text-xs font-medium text-indigo-300 mb-6 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>The Next Generation Career OS for Engineering Students</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] font-heading">
              Know Where You Stand. <br />
              <span className="bg-gradient-to-r from-indigo-400 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
                Know Where You're Going.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              NEXORA synthesizes your academic performance, technical competencies, and market data
              into a predictive intelligence engine with personalized roadmaps, ATS resume optimization, and targeted projects.
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleLaunchDashboard}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 border border-indigo-400/30 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>Launch Student Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/signup"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-medium text-slate-200 bg-[#101522] hover:bg-[#161D2E] hover:text-white border border-[#20293D] flex items-center justify-center gap-2 transition-all"
              >
                <span>Create Student Account</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>

            {/* Micro stats banner */}
            <div className="mt-10 pt-8 border-t border-[#182030] grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-3xl mx-auto">
              <div className="p-3 rounded-lg bg-[#0C1018] border border-[#18202F]">
                <p className="text-[11px] font-mono text-slate-400 uppercase">Target Readiness</p>
                <p className="text-xl font-bold text-indigo-400 font-mono mt-0.5">76% Match</p>
              </div>
              <div className="p-3 rounded-lg bg-[#0C1018] border border-[#18202F]">
                <p className="text-[11px] font-mono text-slate-400 uppercase">Skill Gap Index</p>
                <p className="text-xl font-bold text-emerald-400 font-mono mt-0.5">-8% Deficit</p>
              </div>
              <div className="p-3 rounded-lg bg-[#0C1018] border border-[#18202F]">
                <p className="text-[11px] font-mono text-slate-400 uppercase">Resume ATS Score</p>
                <p className="text-xl font-bold text-cyan-400 font-mono mt-0.5">84 / 100</p>
              </div>
              <div className="p-3 rounded-lg bg-[#0C1018] border border-[#18202F]">
                <p className="text-[11px] font-mono text-slate-400 uppercase">Active Streak</p>
                <p className="text-xl font-bold text-amber-400 font-mono mt-0.5">14 Days 🔥</p>
              </div>
            </div>
          </div>

          {/* Interactive Intelligence Hero Card Preview */}
          <div id="preview" className="mt-16 relative mx-auto max-w-5xl">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500/30 via-cyan-500/20 to-indigo-600/30 blur-xl opacity-75" />
            <div className="relative rounded-2xl bg-[#0B0F19] border border-[#20293D] shadow-2xl overflow-hidden">
              {/* Fake window chrome */}
              <div className="h-11 bg-[#090C14] border-b border-[#182030] px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-3 text-xs font-mono text-slate-400">nexora.platform/student/alex-chen/overview</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Live Telemetry
                  </span>
                  <button
                    onClick={handleLaunchDashboard}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                  >
                    Enter App →
                  </button>
                </div>
              </div>

              {/* Dashboard Content Mock */}
              <div className="p-6 sm:p-8 bg-gradient-to-b from-[#0D121F] to-[#090D15]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1B2336]">
                  <div>
                    <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">Predictive Student Profile</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                      Alex Chen • Computer Science & AI (Sem 6)
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Target Role: <strong className="text-white">Machine Learning Engineer</strong> • Academic GPA: <strong className="text-indigo-300">8.74 / 10</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate('/dashboard/skills')}
                      className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20 transition-all"
                    >
                      Skill Gap Matrix
                    </button>
                    <button
                      onClick={() => navigate('/dashboard/roadmap')}
                      className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#161D2D] text-slate-200 border border-[#243048] hover:bg-[#1E273D] transition-all"
                    >
                      Roadmap Stage 3/6
                    </button>
                  </div>
                </div>

                {/* 3 Column Intelligence Snapshot */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
                  {/* Card 1 */}
                  <div className="p-4 rounded-xl bg-[#101624] border border-[#1C2538]">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Academic Velocity</span>
                      <span className="text-emerald-400 font-mono font-semibold">+0.54 GPA Trend</span>
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
                        <span className="text-slate-400">Microprocessors:</span>
                        <span className="text-amber-400 font-semibold font-mono">B (71%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="p-4 rounded-xl bg-[#101624] border border-[#1C2538]">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Top Skill Gap Alert</span>
                      <span className="text-rose-400 font-mono font-semibold">Priority: High</span>
                    </div>
                    <p className="text-2xl font-bold text-white font-mono mt-2">PyTorch &amp; MLOps</p>
                    <p className="text-xs text-slate-300 mt-1">
                      Current: <span className="font-mono text-indigo-400">52%</span> vs Required: <span className="font-mono text-white">80%</span>
                    </p>
                    <div className="mt-3 p-2 rounded bg-indigo-950/40 border border-indigo-500/20 text-[11px] text-indigo-300">
                      Action: Build Transformers &amp; MLflow tracking pipeline to close deficit.
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="p-4 rounded-xl bg-[#101624] border border-[#1C2538]">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>ATS Match Calibration</span>
                      <span className="text-cyan-400 font-mono font-semibold">Top 10% Bracket</span>
                    </div>
                    <p className="text-2xl font-bold text-white font-mono mt-2">84 / 100 Score</p>
                    <div className="mt-3 space-y-1 text-xs text-slate-400">
                      <p>✓ 24 skills indexed cleanly</p>
                      <p className="text-amber-300">⚠ Missing keyword: "Distributed Training"</p>
                      <p className="text-indigo-300">✓ Target: Machine Learning Engineer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intelligence Flow: Student Data -> Intelligence -> Recommendation -> Action -> Progress */}
      <section id="workflow" className="py-20 bg-[#06080C] border-y border-[#141A27] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
              The NEXORA Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-heading">
              How Student Intelligence Works
            </h2>
            <p className="text-sm text-slate-400 mt-3">
              Most platforms provide static courses. NEXORA constructs a closed-loop intelligence feedback cycle.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'Student Data',
                desc: 'Academics, semester transcripts, coding profiles, resume text, and active project history.',
                icon: GraduationCap,
                color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
              },
              {
                step: '02',
                title: 'Intelligence',
                desc: 'Continuous analytics map strengths, identify GPA fluctuations, and benchmark target roles.',
                icon: Activity,
                color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
              },
              {
                step: '03',
                title: 'Recommendation',
                desc: 'Algorithmic skill gap prioritization, personalized project ideas, and missing keywords.',
                icon: Sparkles,
                color: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
              },
              {
                step: '04',
                title: 'Action',
                desc: 'Execute structured roadmap modules, build recommended projects, and optimize resume.',
                icon: Zap,
                color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
              },
              {
                step: '05',
                title: 'Progress',
                desc: 'Real-time telemetry, learning streaks, verified skill badges, and career readiness scores.',
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
                  <div className="mt-4 pt-3 border-t border-[#151D2C] flex items-center text-[10px] font-mono text-slate-400">
                    <span>Stage {idx + 1} of 5</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8 Core Capabilities */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
            Unified Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-heading">
            8 Pillars of Student Career Mastery
          </h2>
          <p className="text-sm text-slate-400 mt-3">
            Every tool is interconnected. Improvements in your academic subjects reflect directly in your skill gap matrix and career readiness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Academic Intelligence',
              route: '/dashboard/academic',
              icon: GraduationCap,
              desc: 'Transcript analysis, SGPA/CGPA trends, subject strength evaluation, and attendance alerts.',
              tag: 'Curriculum',
            },
            {
              title: 'Skill Gap Analyzer',
              route: '/dashboard/skills',
              icon: Sparkles,
              desc: 'Mathematical differential between current skills and target role requirements with priority rankings.',
              tag: 'Core Matrix',
            },
            {
              title: 'Career Recommendations',
              route: '/dashboard/career',
              icon: Briefcase,
              desc: 'Real-time market matching, compensation benchmarks, hiring growth, and target company profiles.',
              tag: 'Market Fit',
            },
            {
              title: 'Personalized Roadmap',
              route: '/dashboard/roadmap',
              icon: Compass,
              desc: 'From Foundation to Placement: 6 structured milestones with verifiable tasks and estimated hours.',
              tag: 'Execution',
            },
            {
              title: 'Resume Intelligence',
              route: '/dashboard/resume',
              icon: FileText,
              desc: 'ATS match scoring, missing technical keywords, impact phrasing recommendations, and section audits.',
              tag: 'ATS Optimizer',
            },
            {
              title: 'Project Lab',
              route: '/dashboard/projects',
              icon: FolderGit2,
              desc: 'Curated high-impact project suggestions specifically engineered to bridge identified skill gaps.',
              tag: 'Portfolios',
            },
            {
              title: 'Progress & Achievements',
              route: '/dashboard/progress',
              icon: TrendingUp,
              desc: 'Continuous telemetry: 14-day streaks, weekly effort charts, mastery badges, and velocity indexes.',
              tag: 'Telemetry',
            },
            {
              title: 'AI Student Assistant',
              route: '/dashboard/ai',
              icon: Bot,
              desc: 'Context-aware conversational intelligence trained on your academic standing, projects, and target careers.',
              tag: 'Adaptive Mentor',
            },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
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
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-[#08090D] via-[#0E1320] to-[#08090D] border-t border-[#182132]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold mb-4">
            <Flame className="w-3.5 h-3.5 fill-indigo-400" />
            <span>Ready to accelerate your engineering career?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-heading">
            Stop Guessing. <br />
            Start Measuring Your Growth.
          </h2>

          <p className="mt-4 text-base text-slate-300 max-w-xl mx-auto">
            Experience the student intelligence dashboard used by top-tier students to land ML, backend, and full-stack positions.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleLaunchDashboard}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 border border-indigo-400/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Explore Platform Live</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-medium text-slate-200 bg-[#121828] hover:bg-[#182034] border border-[#222E46] transition-all"
            >
              <span>Sign In to Your Workspace</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#161D2B] bg-[#07080C] py-12 px-4 sm:px-6 lg:px-8">
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
            <a href="#features" className="hover:text-white transition-colors">Platform</a>
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
            <Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link>
            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link to="/dashboard/academic" className="hover:text-white transition-colors">Academics</Link>
            <Link to="/dashboard/skills" className="hover:text-white transition-colors">Skills</Link>
            <Link to="/dashboard/resume" className="hover:text-white transition-colors">Resume ATS</Link>
          </div>

          <div className="text-xs text-slate-400 text-center md:text-right">
            <p>© 2026 NEXORA Technologies Inc. All rights reserved.</p>
            <p className="font-mono text-[11px] text-slate-400 mt-0.5">Know Where You Stand. Know Where You're Going.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
