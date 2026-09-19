import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { OnboardingPage } from './pages/onboarding/OnboardingPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';

// Dashboard Pages
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { AcademicPage } from './pages/dashboard/AcademicPage';
import { SkillsPage } from './pages/dashboard/SkillsPage';
import { CareerPage } from './pages/dashboard/CareerPage';
import { RoadmapPage } from './pages/dashboard/RoadmapPage';
import { ResumePage } from './pages/dashboard/ResumePage';
import { ProjectsPage } from './pages/dashboard/ProjectsPage';
import { ProgressPage } from './pages/dashboard/ProgressPage';
import { AiAssistantPage } from './pages/dashboard/AiAssistantPage';
import { SettingsPage } from './pages/dashboard/SettingsPage';
import { ProfilePage } from './pages/dashboard/ProfilePage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public & Auth Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* Authenticated Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="academic" element={<AcademicPage />} />
            <Route path="skills" element={<SkillsPage />} />
            <Route path="career" element={<CareerPage />} />
            <Route path="roadmap" element={<RoadmapPage />} />
            <Route path="resume" element={<ResumePage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="ai" element={<AiAssistantPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Direct Profile Route pointing to DashboardLayout with ProfilePage */}
          <Route path="/profile" element={<DashboardLayout />}>
            <Route index element={<ProfilePage />} />
          </Route>

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
