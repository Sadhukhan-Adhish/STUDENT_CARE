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

  const notifications = [
    { id: 1, text: 'New Skill Gap identified in PyTorch & MLOps', time: '10m ago', unread: true, type: 'alert' },
    { id: 2, text: 'Mid-term Algorithms grade uploaded: A+ (94/100)', time: '2h ago', unread: true, type: 'success' },
    { id: 3, text: 'Recommended Project: Computer Vision Defect Detector', time: '1d ago', unread: false, type: 'info' },
  ];

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
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#141A28] border border-transparent hover:border-[#1E2638] transition-all relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-[#08090D]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-[#0E131E] border border-[#1E2638] shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#1A2234]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Telemetry Notifications</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">2 New</span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 space-y-2.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-lg text-xs border transition-colors flex items-start gap-2.5 ${
                      n.unread
                        ? 'bg-indigo-950/20 border-indigo-500/20 text-slate-200'
                        : 'bg-[#121826] border-[#1C2538] text-slate-400'
                    }`}
                  >
                    {n.type === 'alert' && <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />}
                    {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />}
                    {n.type === 'info' && <Bot className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-200">{n.text}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-2 border-t border-[#1A2234] text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/dashboard/progress');
                  }}
                  className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  View All Telemetry & Logged Activity →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Student Profile Quick Chip */}
        <Link
          to="/dashboard/settings"
          className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-[#111623] hover:bg-[#161D2E] border border-[#1E2638] transition-all group"
        >
          <img
            src={student.avatar}
            alt={student.name}
            className="w-6 h-6 rounded-full object-cover border border-indigo-500/50"
          />
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-semibold text-slate-200 group-hover:text-white leading-tight">
              {student.name}
            </span>
            <span className="block text-[10px] text-indigo-400 font-mono leading-none">
              {student.targetCareer}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
};
