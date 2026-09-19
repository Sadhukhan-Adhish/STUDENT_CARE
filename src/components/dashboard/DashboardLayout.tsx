import React, { useState } from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAuth } from '../../context/AuthContext';
import { Compass, UserPlus } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, isGuest, exitGuestMode } = useAuth();

  // If loading, show clean loader
  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090D] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
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
    <div className="min-h-screen bg-[#08090D] text-slate-100 flex flex-col font-sans">
      {/* Persistent / Slide-out Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area (Offset for desktop 64-width sidebar) */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Guest Mode Global Alert Banner */}
        {isGuest && (
          <div className="bg-gradient-to-r from-amber-500/15 via-indigo-500/15 to-amber-500/10 border-b border-amber-500/30 px-4 py-2 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-300">
              <Compass className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="font-semibold font-mono uppercase tracking-wider text-[11px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                Guest Mode
              </span>
              <span className="text-slate-200">
                You are previewing sample data. Progress will not be permanently saved.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/signup"
                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Student Account</span>
              </Link>
              <button
                onClick={exitGuestMode}
                className="px-2.5 py-1 rounded-lg bg-[#141B2A] hover:bg-[#1E273D] text-slate-300 hover:text-white border border-[#232F4A] transition-colors text-xs cursor-pointer"
              >
                Exit Guest
              </button>
            </div>
          </div>
        )}

        <Topbar onOpenSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
