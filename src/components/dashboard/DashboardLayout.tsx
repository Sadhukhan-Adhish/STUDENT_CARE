import React, { useState, useCallback } from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAuth } from '../../context/AuthContext';
import { Compass, UserPlus } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, isGuest, exitGuestMode } = useAuth();

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleOpenSidebar = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  // If loading, show clean loader
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[#9AA5B1]">
          <div className="w-8 h-8 border-2 border-[#D89B5B]/30 border-t-[#D89B5B] rounded-full animate-spin" />
          <span className="text-xs font-mono">Loading student workspace...</span>
        </div>
      </div>
    );
  }

  // If unauthenticated, redirect to /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If a registered student has NOT completed onboarding, redirect to /onboarding
  if (!isGuest && user.studentProfile && user.studentProfile.onboardingCompleted === false) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#F3F0E8] flex flex-col font-sans relative">
      {/* Persistent / Slide-out Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

      {/* Main Content Area (Offset for desktop 64-width sidebar) */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Guest Mode Global Alert Banner */}
        {isGuest && (
          <div className="bg-[#151D26] border-b border-[#D89B5B]/30 px-4 py-2 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#E8B47E]">
              <Compass className="w-4 h-4 text-[#D89B5B] flex-shrink-0" />
              <span className="font-semibold font-mono uppercase tracking-wider text-[11px] bg-[#D89B5B]/15 text-[#E8B47E] px-2 py-0.5 rounded border border-[#D89B5B]/30">
                Guest Mode
              </span>
              <span className="text-[#9AA5B1]">
                You’re exploring UNNEXA as a guest. Your progress will not be permanently saved.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/signup"
                className="px-2.5 py-1 rounded-lg bg-[#D89B5B] hover:bg-[#E4AB70] text-[#0B0F14] font-semibold text-xs transition-all duration-150 flex items-center gap-1.5 shadow-sm hover:-translate-y-0.5 active:translate-y-0"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Student Account</span>
              </Link>
              <button
                onClick={exitGuestMode}
                className="px-2.5 py-1 rounded-lg bg-[#18222E] hover:bg-[#1F2C3A] text-[#9AA5B1] hover:text-[#F3F0E8] border border-[#243344] transition-all duration-150 text-xs cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
              >
                Exit Guest
              </button>
            </div>
          </div>
        )}

        <Topbar onOpenSidebar={handleOpenSidebar} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
