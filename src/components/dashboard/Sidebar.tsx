import React, { useMemo } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
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
  User,
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

export const SidebarComponent: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
    onClose();
  };

  const student = user?.studentProfile || mockStudent;

  const navItems = useMemo<NavItem[]>(() => {
    const hasSkillGapAlert = user?.isGuest
      ? true
      : Boolean(student.skills?.some((s) => s.priority === 'High' && (s.gap ?? 0) > 0));

    const projectsBadge = user?.isGuest
      ? '3 Demo'
      : student.projects?.length
      ? `${student.projects.length} Active`
      : undefined;

    return [
      { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Academic', path: '/dashboard/academic', icon: GraduationCap },
      {
        label: 'Skills',
        path: '/dashboard/skills',
        icon: Sparkles,
        badge: hasSkillGapAlert ? 'Gap Alert' : undefined,
      },
      { label: 'Career', path: '/dashboard/career', icon: Briefcase },
      { label: 'Roadmap', path: '/dashboard/roadmap', icon: Compass },
      {
        label: 'Resume',
        path: '/dashboard/resume',
        icon: FileText,
        badge: student.resumeInfo?.fileName ? 'PDF' : undefined,
      },
      {
        label: 'Projects',
        path: '/dashboard/projects',
        icon: FolderGit2,
        badge: projectsBadge,
      },
      { label: 'Progress', path: '/dashboard/progress', icon: TrendingUp },
      {
        label: 'AI Assistant',
        path: '/dashboard/ai',
        icon: Bot,
        badge: 'Ready',
        badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      },
      { label: 'Profile', path: '/profile', icon: User },
      { label: 'Settings', path: '/dashboard/settings', icon: Settings },
    ];
  }, [user?.isGuest, student.skills, student.projects?.length, student.resumeInfo?.fileName]);

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
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0E141C] border-r border-[#1C2633] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#1C2633]">
          <NavLink
            to="/"
            className="flex items-center gap-2.5 group rounded-lg outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D89B5B]/60"
            onClick={onClose}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D89B5B] to-[#B97B3C] flex items-center justify-center shadow-sm shadow-[#D89B5B]/15 border border-[#E8B47E]/30">
              <svg className="w-4 h-4 text-[#0B0F14]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-base tracking-wider text-[#F3F0E8]">UNNEXA</span>
              <span className="block text-[9px] uppercase tracking-widest text-[#D89B5B] font-mono -mt-1">Intelligence</span>
            </div>
          </NavLink>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-[#9AA5B1] hover:text-[#F3F0E8] hover:bg-[#18232F] transition-colors outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D89B5B]/60"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Mini Card - Clicking routes to /profile */}
        <Link
          to="/profile"
          onClick={(e) => {
            onClose();
            if (e.detail > 0) {
              (e.currentTarget as HTMLElement)?.blur();
            }
          }}
          className="p-3 mx-3 mt-3 rounded-xl bg-[#131B24] hover:bg-[#17222E] border border-[#1E2938] hover:border-[#D89B5B]/40 transition-all flex items-center justify-between group cursor-pointer outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D89B5B]/60"
          title="View Student Profile"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative">
              <img
                src={student.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Guest'}
                alt={user?.isGuest ? 'Guest' : student.name}
                className="w-9 h-9 rounded-full object-cover border border-[#D89B5B]/40 flex-shrink-0"
              />
              {user?.isGuest ? (
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#D89B5B] ring-2 ring-[#131B24]" />
              ) : (
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#67C5B8] ring-2 ring-[#131B24]" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#F3F0E8] truncate group-hover:text-[#E8B47E] transition-colors">
                {user?.isGuest ? (student.name && student.name !== 'Guest Student' ? student.name : 'Guest User') : student.name}
              </p>
              <p className="text-[11px] text-[#9AA5B1] truncate">
                {user?.isGuest
                  ? 'Explore UNNEXA'
                  : student.cgpa
                  ? `Sem ${student.currentSemester} • CGPA ${student.cgpa.toFixed(2)}`
                  : `Sem ${student.currentSemester} • Active Student`}
              </p>
            </div>
          </div>

          {user?.isGuest ? (
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[#D89B5B]/15 text-[#E8B47E] border border-[#D89B5B]/30 flex-shrink-0">
              Guest
            </span>
          ) : student.learningStreakDays ? (
            <div className="flex items-center gap-1 bg-[#D89B5B]/12 border border-[#D89B5B]/25 px-2 py-0.5 rounded text-[11px] font-mono font-medium text-[#E8B47E] flex-shrink-0">
              <Flame className="w-3.5 h-3.5 fill-[#D89B5B] text-[#D89B5B]" />
              <span>{student.learningStreakDays}d</span>
            </div>
          ) : (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#67C5B8]/12 text-[#7CD4C8] border border-[#67C5B8]/25 flex-shrink-0">
              Active
            </span>
          )}
        </Link>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-2.5 mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#9AA5B1]">
            Platform Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={(e) => {
                  onClose();
                  if (e.detail > 0) {
                    (e.currentTarget as HTMLElement)?.blur();
                  }
                }}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 group outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D89B5B]/60 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0E141C] ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D89B5B]/18 to-[#D89B5B]/5 text-[#F3F0E8] border border-[#D89B5B]/35 shadow-sm'
                      : 'text-[#9AA5B1] hover:text-[#F3F0E8] hover:bg-[#16202B] hover:border-[#243344] border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-[#D89B5B]' : 'text-[#9AA5B1] group-hover:text-[#F3F0E8]'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                            item.badgeColor || (isActive ? 'bg-[#D89B5B]/15 text-[#E8B47E] border-[#D89B5B]/30' : 'bg-[#18232F] text-[#9AA5B1] border-[#223040]')
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#D89B5B]" />}
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Separator & Footer / Sign Out */}
        <div className="p-3 border-t border-[#1C2633] bg-[#0E141C] space-y-2">
          <NavLink
            to="/"
            onClick={(e) => {
              if (e.detail > 0) {
                (e.currentTarget as HTMLElement)?.blur();
              }
            }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[#9AA5B1] hover:text-[#F3F0E8] hover:bg-[#16202B] transition-colors outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D89B5B]/60"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#67C5B8] animate-pulse" />
            <span>View Public Landing Page</span>
          </NavLink>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-300 hover:text-rose-200 bg-rose-500/8 hover:bg-rose-500/15 border border-rose-500/20 transition-all duration-150 cursor-pointer outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/60"
          >
            <LogOut className="w-4 h-4" />
            <span>{user?.isGuest ? 'Exit Guest Mode' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export const Sidebar = React.memo(SidebarComponent);

