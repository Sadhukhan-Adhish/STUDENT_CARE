import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Sparkles,
  Briefcase,
  Compass,
  FileText,
  FolderGit2,
  TrendingUp,
  Bot,
  Settings,
  LogOut,
  X,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockStudent } from '../../data/mockData';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

const navItems: NavItem[] = [
  { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Academic', path: '/dashboard/academic', icon: GraduationCap },
  { label: 'Skills', path: '/dashboard/skills', icon: Sparkles, badge: 'Gap Alert' },
  { label: 'Career', path: '/dashboard/career', icon: Briefcase },
  { label: 'Roadmap', path: '/dashboard/roadmap', icon: Compass },
  { label: 'Resume', path: '/dashboard/resume', icon: FileText, badge: 'ATS 84' },
  { label: 'Projects', path: '/dashboard/projects', icon: FolderGit2, badge: '3 Active' },
  { label: 'Progress', path: '/dashboard/progress', icon: TrendingUp },
  { label: 'AI Assistant', path: '/dashboard/ai', icon: Bot, badge: 'Online', badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { label: 'Settings', path: '/dashboard/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
    onClose();
  };

  const student = user?.studentProfile || mockStudent;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0A0D14] border-r border-[#19202E] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#19202E]">
          <NavLink to="/" className="flex items-center gap-2.5 group" onClick={onClose}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-500/20 border border-indigo-400/30">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-base tracking-wider text-white">NEXORA</span>
              <span className="block text-[9px] uppercase tracking-widest text-indigo-400 font-mono -mt-1">Intelligence</span>
            </div>
          </NavLink>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#151B28] transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Mini Card */}
        <div className="p-3.5 mx-3 mt-3.5 rounded-xl bg-[#0F1420] border border-[#1C2436] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-9 h-9 rounded-full object-cover border border-indigo-500/40 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{student.name}</p>
              <p className="text-[11px] text-slate-400 truncate">Sem {student.currentSemester} • CGPA {student.cgpa}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-[11px] font-mono font-medium text-amber-400 flex-shrink-0">
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{student.learningStreakDays}d</span>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-2.5 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Platform Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/20 to-indigo-600/5 text-indigo-300 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-[#131824]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                            item.badgeColor || (isActive ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30' : 'bg-[#18202F] text-slate-400 border-[#242F45]')
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />}
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Separator & Footer / Sign Out */}
        <div className="p-3 border-t border-[#19202E] bg-[#0A0D14]/80 space-y-2">
          <NavLink
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-[#131824] transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>View Public Landing Page</span>
          </NavLink>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-400/90 hover:text-rose-300 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
