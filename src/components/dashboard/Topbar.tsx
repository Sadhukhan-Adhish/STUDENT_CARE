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
  ArrowLeft,
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

const guestNotificationsStatic = [
  { id: 1, text: '[Sample Alert] New Skill Gap identified in PyTorch & MLOps', time: '10m ago', unread: true, type: 'alert' },
  { id: 2, text: '[Sample Result] Mid-term Algorithms grade uploaded: A+ (94/100)', time: '2h ago', unread: true, type: 'success' },
  { id: 3, text: '[Sample Project] Recommended Project: Computer Vision Defect Detector', time: '1d ago', unread: false, type: 'info' },
];

export const TopbarComponent: React.FC<TopbarProps> = ({ onOpenSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentInfo = pageTitles[location.pathname] || {
    title: 'Student Dashboard',
    category: 'UNNEXA Platform',
  };

  const student = user?.studentProfile || mockStudent;
  const unreadCount = 0;

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0B0F14]/92 backdrop-blur-md border-b border-[#1C2633] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu & Current Route Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg text-[#9AA5B1] hover:text-[#F3F0E8] hover:bg-[#18232F] transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-[11px] font-mono uppercase tracking-wider text-[#9AA5B1]">
              {currentInfo.category}
            </span>
            <span className="hidden sm:inline-block text-[#9AA5B1] text-xs">•</span>
            <h2 className="text-sm sm:text-base font-bold text-[#F3F0E8] truncate">
              {currentInfo.title}
            </h2>
          </div>
        </div>
      </div>

      {/* Right: Actions, Search, AI Quick Trigger & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search Bar (Desktop) */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="w-4 h-4 text-[#9AA5B1] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search skills, projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#131B24] border border-[#1E2938] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#F3F0E8] placeholder-[#768393] focus:outline-none focus:border-[#D89B5B]/60 focus:ring-1 focus:ring-[#D89B5B]/30 transition-all font-sans"
          />
        </div>

        {/* AI Quick Assistant Button */}
        <Link
          to="/dashboard/ai"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#67C5B8]/12 hover:bg-[#67C5B8]/20 text-[#7CD4C8] border border-[#67C5B8]/30 hover:border-[#67C5B8]/50 text-xs font-medium transition-all duration-150 group hover:-translate-y-0.5 active:translate-y-0"
        >
          <Bot className="w-3.5 h-3.5 text-[#67C5B8] group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Ask AI</span>
          <Sparkles className="w-3 h-3 text-[#67C5B8] animate-pulse" />
        </Link>

        {/* Notifications Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-[#9AA5B1] hover:text-[#F3F0E8] hover:bg-[#18232F] border border-transparent hover:border-[#222E3C] transition-all relative cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D89B5B] ring-2 ring-[#0B0F14]" />
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
              <div className="fixed inset-x-3 top-16 z-50 max-w-md mx-auto sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 rounded-2xl bg-[#141C25] border border-[#222E3C] shadow-2xl p-4 flex flex-col max-h-[80vh] sm:max-h-[30rem] animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-[#1E2938] flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#F3F0E8] uppercase tracking-wider font-mono">
                      Telemetry Notifications
                    </span>
                    {user?.isGuest ? (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#D89B5B]/15 text-[#E8B47E] border border-[#D89B5B]/30">
                        Sample Demo
                      </span>
                    ) : unreadCount > 0 ? (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#D89B5B]/15 text-[#E8B47E] border border-[#D89B5B]/30">
                        {unreadCount} New
                      </span>
                    ) : null}
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 rounded-lg text-[#9AA5B1] hover:text-[#F3F0E8] hover:bg-[#1E2938] transition-colors cursor-pointer"
                    aria-label="Close notifications"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Body / List */}
                <div className="my-3 space-y-2.5 flex-1 overflow-y-auto pr-1">
                  <div className="py-6 px-3 text-center flex flex-col items-center">
                    <div className="w-10 h-10 rounded-xl bg-[#D89B5B]/10 border border-[#D89B5B]/25 flex items-center justify-center text-[#D89B5B] mb-3">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-[#F3F0E8]">No new notifications yet.</p>
                    <p className="text-[11px] text-[#9AA5B1] mt-1 max-w-[240px] leading-relaxed">
                      {user?.isGuest
                        ? 'Add coursework, skills, or projects in your guest workspace to see activity and telemetry here.'
                        : 'Complete your profile and add academic records to start receiving personalized insights.'}
                    </p>
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/profile');
                      }}
                      className="mt-3.5 px-3 py-1.5 rounded-lg bg-[#D89B5B] hover:bg-[#E4AB70] text-[#0B0F14] text-xs font-semibold cursor-pointer transition-all duration-150 shadow-sm hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {user?.isGuest ? 'View Profile Details →' : 'Complete Your Profile →'}
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1E2938] text-center flex-shrink-0">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/dashboard/progress');
                    }}
                    className="text-[11px] font-semibold text-[#D89B5B] hover:text-[#E8B47E] cursor-pointer transition-colors"
                  >
                    View All Telemetry & Logged Activity →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Exit Dashboard Navigation Option */}
        <Link
          to="/"
          id="exit-dashboard-link"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#9AA5B1] hover:text-[#F3F0E8] hover:bg-[#18232F] border border-[#1E2938] hover:border-[#D89B5B]/40 transition-all duration-150 min-h-[36px]"
          title="Exit Dashboard & Return to Home"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#D89B5B]" />
          <span className="hidden md:inline">Exit Dashboard</span>
        </Link>

        {/* Student Profile Quick Chip - Navigates to /profile */}
        <Link
          to="/profile"
          className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-[#131B24] hover:bg-[#18232F] border border-[#1E2938] hover:border-[#D89B5B]/40 transition-all duration-150 group min-h-[36px] hover:-translate-y-0.5"
          title="View Student Profile"
        >
          <img
            src={student.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Guest'}
            alt={user?.isGuest ? 'Guest' : student.name}
            className="w-6 h-6 rounded-full object-cover border border-[#D89B5B]/40 flex-shrink-0"
          />
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-semibold text-[#F3F0E8] group-hover:text-[#E8B47E] leading-tight transition-colors">
              {user?.isGuest ? (student.name && student.name !== 'Guest Student' ? student.name : 'Guest User') : student.name}
            </span>
            <span className="block text-[10px] font-mono leading-none text-[#D89B5B]">
              {user?.isGuest ? 'Guest' : (student.targetCareer || 'Student')}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
};

export const Topbar = React.memo(TopbarComponent);

