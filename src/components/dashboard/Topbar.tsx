import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  Bot,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockStudent } from '../../data/mockData';

interface TopbarProps {
  onOpenSidebar: () => void;
}

const pageTitles: Record<string, { title: string; category: string }> = {
  '/dashboard': { title: 'Overview & Intelligence Pulse', category: 'Executive Dashboard' },
  '/dashboard/academic': { title: 'Academic Intelligence', category: 'Performance & Curriculum' },
  '/dashboard/skills': { title: 'Skill Gap Analyzer', category: 'Technical Competence' },
  '/dashboard/career': { title: 'Career Intelligence', category: 'Market & Trajectory' },
  '/dashboard/roadmap': { title: 'Personalized Roadmap', category: 'Execution Plan' },
  '/dashboard/resume': { title: 'Resume Intelligence (ATS)', category: 'Profile Optimization' },
  '/dashboard/projects': { title: 'Project Lab', category: 'Hands-on Portfolios' },
  '/dashboard/progress': { title: 'Progress & Milestones', category: 'Telemetry & Badges' },
  '/dashboard/ai': { title: 'AI Student Assistant', category: 'Adaptive Guidance' },
  '/dashboard/settings': { title: 'Platform Settings', category: 'Preferences & Account' },
  '/dashboard/profile': { title: 'Student Profile & Identification', category: 'Student Identification' },
  '/profile': { title: 'Student Profile & Identification', category: 'Student Identification' },
};

export const Topbar: React.FC<TopbarProps> = ({ onOpenSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentInfo = pageTitles[location.pathname] || {
    title: 'Student Dashboard',
    category: 'NEXORA Platform',
  };

  const student = user?.studentProfile || mockStudent;

  const guestNotifications = [
    { id: 1, text: '[Sample Alert] New Skill Gap identified in PyTorch & MLOps', time: '10m ago', unread: true, type: 'alert' },
    { id: 2, text: '[Sample Result] Mid-term Algorithms grade uploaded: A+ (94/100)', time: '2h ago', unread: true, type: 'success' },
    { id: 3, text: '[Sample Project] Recommended Project: Computer Vision Defect Detector', time: '1d ago', unread: false, type: 'info' },
  ];

  const unreadCount = user?.isGuest ? 2 : 0;

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#08090D]/90 backdrop-blur-md border-b border-[#18202F] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu & Current Route Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#141A28] transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-[11px] font-mono uppercase tracking-wider text-slate-400">
              {currentInfo.category}
            </span>
            <span className="hidden sm:inline-block text-slate-400 text-xs">•</span>
            <h2 className="text-sm sm:text-base font-bold text-white truncate">
              {currentInfo.title}
            </h2>
          </div>
        </div>
      </div>

      {/* Right: Actions, Search, AI Quick Trigger & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search Bar (Desktop) */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search skills, projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0F1420] border border-[#1E2638] rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all font-sans"
          />
        </div>

        {/* AI Quick Assistant Button */}
        <Link
          to="/dashboard/ai"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-all group"
        >
          <Bot className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Ask AI</span>
          <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
        </Link>

        {/* Notifications Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#141A28] border border-transparent hover:border-[#1E2638] transition-all relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-[#08090D]" />
            )}
          </button>

          {showNotifications && (
            <>
              {/* Mobile backdrop to dismiss when tapping outside */}
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 sm:hidden"
                onClick={() => setShowNotifications(false)}
              />

              {/* Notification Popover/Drawer */}
              <div className="fixed inset-x-3 top-16 z-50 max-w-md mx-auto sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 rounded-2xl bg-[#0E131E] border border-[#1E2638] shadow-2xl p-4 flex flex-col max-h-[80vh] sm:max-h-[30rem] animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-[#1A2234] flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Telemetry Notifications
                    </span>
                    {user?.isGuest ? (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Sample Demo
                      </span>
                    ) : unreadCount > 0 ? (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                        {unreadCount} New
                      </span>
                    ) : null}
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1A2234] transition-colors cursor-pointer"
                    aria-label="Close notifications"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Body / List */}
                <div className="my-3 space-y-2.5 flex-1 overflow-y-auto pr-1">
                  {user?.isGuest ? (
                    guestNotifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl text-xs border transition-colors flex items-start gap-2.5 ${
                          n.unread
                            ? 'bg-indigo-950/25 border-indigo-500/25 text-slate-200'
                            : 'bg-[#121826] border-[#1C2538] text-slate-400'
                        }`}
                      >
                        {n.type === 'alert' && <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />}
                        {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />}
                        {n.type === 'info' && <Bot className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-200 break-words">{n.text}</p>
                          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">{n.time}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 px-3 text-center flex flex-col items-center">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-semibold text-white">No new notifications yet.</p>
                      <p className="text-[11px] text-slate-400 mt-1 max-w-[240px] leading-relaxed">
                        Complete your profile and add academic records to start receiving personalized insights.
                      </p>
                      <button
                        onClick={() => {
                          setShowNotifications(false);
                          navigate('/profile');
                        }}
                        className="mt-3.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer transition-colors shadow-sm"
                      >
                        Complete Your Profile →
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[#1A2234] text-center flex-shrink-0">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/dashboard/progress');
                    }}
                    className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
                  >
                    View All Telemetry & Logged Activity →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Student Profile Quick Chip - Navigates to /profile */}
        <Link
          to="/profile"
          className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-[#111623] hover:bg-[#161D2E] border border-[#1E2638] hover:border-indigo-500/30 transition-all group min-h-[36px]"
          title="View Student Profile"
        >
          <img
            src={student.avatar}
            alt={user?.isGuest ? 'Guest Student' : student.name}
            className="w-6 h-6 rounded-full object-cover border border-indigo-500/50 flex-shrink-0"
          />
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-semibold text-slate-200 group-hover:text-white leading-tight">
              {user?.isGuest ? 'Guest Student' : student.name}
            </span>
            <span className="block text-[10px] font-mono leading-none text-indigo-400">
              {user?.isGuest ? 'GUEST MODE' : (student.targetCareer || 'Student')}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
};
