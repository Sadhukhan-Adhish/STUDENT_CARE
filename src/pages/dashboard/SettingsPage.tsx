import React, { useState } from 'react';
import {
  User,
  Shield,
  Bell,
  Palette,
  Key,
  Sliders,
  CheckCircle2,
  Save,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';
import { mockStudent } from '../../data/mockData';

export const SettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const student = user?.studentProfile || mockStudent;

  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'appearance' | 'notifications' | 'privacy' | 'preferences'>('profile');

  // Form states
  const [name, setName] = useState(student.name);
  const [email, setEmail] = useState(student.email);
  const [university, setUniversity] = useState(student.university);
  const [degree, setDegree] = useState(student.degree);
  const [currentSemester, setCurrentSemester] = useState(student.currentSemester);
  const [targetCareer, setTargetCareer] = useState(student.targetCareer);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Preference switches
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [skillGapAlerts, setSkillGapAlerts] = useState(true);
  const [atsAlerts, setAtsAlerts] = useState(false);
  const [recruiterDiscovery, setRecruiterDiscovery] = useState(true);
  const [denseLayout, setDenseLayout] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      university,
      degree,
      currentSemester: Number(currentSemester),
      targetCareer,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <PageHeader
        title="Platform &amp; Account Settings"
        subtitle="Manage your student identity credentials, academic affiliations, telemetry notifications, and privacy preferences."
        badge="SaaS Profile Control"
      />

      {/* Main Settings Card with Left Nav Tabs & Right Content */}
      <div className="rounded-2xl bg-[#0D111A] border border-[#1C2538] shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Sub-Nav Tabs */}
        <div className="w-full md:w-60 bg-[#090D15] border-b md:border-b-0 md:border-r border-[#182132] p-4 space-y-1">
          {[
            { id: 'profile', label: 'Student Profile', icon: User },
            { id: 'account', label: 'Security & Auth', icon: Key },
            { id: 'appearance', label: 'Appearance', icon: Palette },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'privacy', label: 'Data & Privacy', icon: Shield },
            { id: 'preferences', label: 'Preferences', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-[#121826]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Content Panels */}
        <div className="flex-1 p-6 sm:p-8">
          {saveSuccess && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Settings updated successfully! Changes reflected across telemetry dashboards.</span>
            </div>
          )}

          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5 max-w-2xl">
              <div>
                <h3 className="text-base font-bold text-white">Student Academic Profile</h3>
                <p className="text-xs text-slate-400 mt-1">
                  This data conditions the skill-gap calculations, roadmap stages, and ATS resume scoring.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#101522] border border-[#1E2638] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Student Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#101522] border border-[#1E2638] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">University / Institute</label>
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full bg-[#101522] border border-[#1E2638] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Degree Program</label>
                  <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full bg-[#101522] border border-[#1E2638] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Current Semester</label>
                  <select
                    value={currentSemester}
                    onChange={(e) => setCurrentSemester(Number(e.target.value))}
                    className="w-full bg-[#101522] border border-[#1E2638] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Primary Target Career</label>
                  <select
                    value={targetCareer}
                    onChange={(e) => setTargetCareer(e.target.value)}
                    className="w-full bg-[#101522] border border-[#1E2638] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                  >
                    <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                    <option value="Full Stack &amp; Backend Systems Engineer">Full Stack Systems Engineer</option>
                    <option value="Data Scientist / AI Researcher">Data Scientist / AI Researcher</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[#182132]">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile Updates</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'account' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-base font-bold text-white">Security &amp; Authentication</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Manage password credentials and future Firebase authentication hooks.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#111626] border border-[#1E283C] space-y-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Current Session: Mock Authentication
                </span>
                <p className="text-xs text-slate-300">
                  You are logged in as <strong>{student.name}</strong> ({student.email}). When Firebase Auth is provisioned, this interface will link directly to your Google or Email provider.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full bg-[#101522] border border-[#1E2638] rounded-xl px-3.5 py-2 text-xs text-white font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full bg-[#101522] border border-[#1E2638] rounded-xl px-3.5 py-2 text-xs text-white font-sans"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => alert('Password update simulated in demo mode.')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#161E30] hover:bg-[#1E2942] text-slate-200 border border-[#232F4A] transition-all cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-base font-bold text-white">Appearance &amp; Theme</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Customize the NEXORA dashboard visual styling.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#101522] border border-indigo-500/30 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">NEXORA Obsidian Dark (Default)</h4>
                    <p className="text-[11px] text-slate-400">Deep obsidian background (#08090D) with subtle violet glow.</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-400">Active</span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-[#101522] border border-[#1E2638]">
                  <div>
                    <h4 className="text-xs font-bold text-white">High Contrast Text</h4>
                    <p className="text-[11px] text-slate-400">Enhance font contrast across charts and transcript tables.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={denseLayout}
                    onChange={(e) => setDenseLayout(e.target.checked)}
                    className="w-4 h-4 rounded border-[#1E2638] bg-[#090D15] text-indigo-600 focus:ring-0"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-base font-bold text-white">Notification Telemetry</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Configure alerts for new skill gaps, mid-term grade uploads, and roadmap deadlines.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#101522] border border-[#1E2638]">
                  <div>
                    <h4 className="text-xs font-bold text-white">Weekly Performance Digest</h4>
                    <p className="text-[11px] text-slate-400">Summary of hours studied, streak status, and GPA trends.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 rounded border-[#1E2638] bg-[#090D15] text-indigo-600 focus:ring-0"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-[#101522] border border-[#1E2638]">
                  <div>
                    <h4 className="text-xs font-bold text-white">Skill Gap &amp; Market Alerts</h4>
                    <p className="text-[11px] text-slate-400">Notify when target role requirements shift or gaps exceed 20%.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={skillGapAlerts}
                    onChange={(e) => setSkillGapAlerts(e.target.checked)}
                    className="w-4 h-4 rounded border-[#1E2638] bg-[#090D15] text-indigo-600 focus:ring-0"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-[#101522] border border-[#1E2638]">
                  <div>
                    <h4 className="text-xs font-bold text-white">ATS Keyword Suggestions</h4>
                    <p className="text-[11px] text-slate-400">Notify when new resume keywords are identified in job boards.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={atsAlerts}
                    onChange={(e) => setAtsAlerts(e.target.checked)}
                    className="w-4 h-4 rounded border-[#1E2638] bg-[#090D15] text-indigo-600 focus:ring-0"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-base font-bold text-white">Data Privacy &amp; Anonymization</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Control how your academic transcripts and project code are shared.
                </p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#101522] border border-[#1E2638]">
                <div>
                  <h4 className="text-xs font-bold text-white">Verified Recruiter Talent Search</h4>
                  <p className="text-[11px] text-slate-400">Allow verified employers to match your profile based on verified skill scores.</p>
                </div>
                <input
                  type="checkbox"
                  checked={recruiterDiscovery}
                  onChange={(e) => setRecruiterDiscovery(e.target.checked)}
                  className="w-4 h-4 rounded border-[#1E2638] bg-[#090D15] text-indigo-600 focus:ring-0"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#111726] border border-[#1D273C] text-xs text-slate-300">
                <p className="font-semibold text-white mb-1">Academic Data Sovereignty</p>
                <p className="text-slate-400 leading-relaxed">
                  Your university transcripts and GPA records are stored locally for client-side analytics. No raw grades are sold to third parties.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-base font-bold text-white">Telemetry Preferences</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Configure recommendation frequency and target company weighting.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#101522] border border-[#1E2638] space-y-3 text-xs text-slate-300">
                <div>
                  <label className="block text-xs font-medium text-white mb-1">Learning Cadence Target</label>
                  <select className="w-full bg-[#090D15] border border-[#1E2638] rounded-xl px-3 py-2 text-xs text-white">
                    <option>High Intensity (25+ hrs / week)</option>
                    <option>Standard Coursework (15–20 hrs / week)</option>
                    <option>Exam Prep Mode (Focus on CGPA)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
