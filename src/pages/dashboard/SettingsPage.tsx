import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Camera,
  Upload,
  Check,
} from 'lucide-react';
import { PageHeader } from '../../components/common/UIComponents';
import { useAuth } from '../../context/AuthContext';
import { mockStudent } from '../../data/mockData';

const avatarPresets = ['Atlas', 'Nova', 'Felix', 'Luna', 'Orion', 'Lyra', 'Zenith', 'Echo'];

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
  const [avatar, setAvatar] = useState(student.avatar || (user?.isGuest ? 'https://api.dicebear.com/7.x/bottts/svg?seed=Guest' : 'https://api.dicebear.com/7.x/bottts/svg?seed=Student'));
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Preference switches
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [skillGapAlerts, setSkillGapAlerts] = useState(true);
  const [atsAlerts, setAtsAlerts] = useState(false);
  const [recruiterDiscovery, setRecruiterDiscovery] = useState(true);
  const [denseLayout, setDenseLayout] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarError(null);
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2.5 * 1024 * 1024) {
        setAvatarError('Please select an image smaller than 2.5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      university,
      degree,
      currentSemester: Number(currentSemester),
      targetCareer,
      avatar,
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
      <div className="rounded-2xl bg-[#151D26] border border-[#202C3B] shadow-xl overflow-hidden flex flex-col md:flex-row" id="settings-card">
        {/* Left Sub-Nav Tabs */}
        <div className="w-full md:w-60 bg-[#0E151E] border-b md:border-b-0 md:border-r border-[#202C3B] p-4 space-y-1">
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
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#D89B5B] text-[#0B0F14] font-semibold shadow-sm'
                    : 'text-[#9AA5B1] hover:text-[#F3F0E8] hover:bg-[#1B2533]'
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
            <div className="mb-6 p-3.5 rounded-xl bg-[#67C5B8]/15 border border-[#67C5B8]/30 text-xs text-[#7CD4C8] flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#67C5B8]" />
              <span>Settings updated successfully! Changes reflected across student profile.</span>
            </div>
          )}

          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5 max-w-2xl">
              <div>
                <h3 className="text-base font-bold text-[#F3F0E8]">Student Academic Profile</h3>
                <p className="text-xs text-[#9AA5B1] mt-1">
                  This data conditions the skill-gap calculations, roadmap stages, and ATS resume scoring.
                </p>
              </div>

              {/* Profile Photo / Avatar Control */}
              <div className="p-4 rounded-xl bg-[#0E151E] border border-[#202C3B] space-y-3" id="profile-avatar-control">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#F3F0E8] uppercase tracking-wider font-mono">
                    Profile Photo / Avatar
                  </label>
                  <span className="text-[11px] text-[#9AA5B1]">
                    {user?.isGuest ? 'Temporary guest avatar' : 'Student identity'}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="relative group flex-shrink-0">
                    <img
                      src={avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Guest'}
                      alt="Current Avatar"
                      className="w-16 h-16 rounded-2xl bg-[#0B0F14] border-2 border-[#D89B5B]/50 object-cover shadow-md"
                      referrerPolicy="no-referrer"
                    />
                    <label
                      htmlFor="avatar-file-input"
                      className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-[#D89B5B] hover:bg-[#E4AB70] text-[#0B0F14] cursor-pointer shadow-md transition-all hover:scale-105"
                      title="Upload custom image from device"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <input
                        id="avatar-file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <label
                        htmlFor="avatar-file-input-btn"
                        className="px-3 py-1.5 rounded-xl bg-[#1B2533] hover:bg-[#223042] border border-[#27384B] hover:border-[#D89B5B]/50 text-xs font-medium text-[#F3F0E8] transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#D89B5B]" />
                        <span>Upload Photo</span>
                        <input
                          id="avatar-file-input-btn"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>

                      {avatarPresets.map((preset) => {
                        const presetUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${preset}`;
                        const isSelected = avatar === presetUrl;
                        return (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => {
                              setAvatar(presetUrl);
                              setAvatarError(null);
                            }}
                            className={`relative p-1 rounded-xl border transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#D89B5B] bg-[#D89B5B]/20 ring-1 ring-[#D89B5B]'
                                : 'border-[#202C3B] bg-[#0B0F14] hover:border-[#2E3E52]'
                            }`}
                            title={`Select ${preset}`}
                          >
                            <img
                              src={presetUrl}
                              alt={preset}
                              className="w-7 h-7 rounded-lg bg-[#0B0F14]"
                              referrerPolicy="no-referrer"
                            />
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#D89B5B] text-[#0B0F14] flex items-center justify-center">
                                <Check className="w-2 h-2" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <p className="text-[11px] text-[#9AA5B1]">
                      Select an avatar preset or upload a custom image from your device.
                    </p>

                    {avatarError && (
                      <p className="text-[11px] text-[#E57373]">{avatarError}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-[#9AA5B1] mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0B0F14] border border-[#202C3B] rounded-xl px-3.5 py-2 text-xs text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B] font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#9AA5B1] mb-1.5">Student Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0B0F14] border border-[#202C3B] rounded-xl px-3.5 py-2 text-xs text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B] font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#9AA5B1] mb-1.5">University / Institute</label>
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full bg-[#0B0F14] border border-[#202C3B] rounded-xl px-3.5 py-2 text-xs text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B] font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#9AA5B1] mb-1.5">Degree Program</label>
                  <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full bg-[#0B0F14] border border-[#202C3B] rounded-xl px-3.5 py-2 text-xs text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B] font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#9AA5B1] mb-1.5">Current Semester</label>
                  <select
                    value={currentSemester}
                    onChange={(e) => setCurrentSemester(Number(e.target.value))}
                    className="w-full bg-[#0B0F14] border border-[#202C3B] rounded-xl px-3.5 py-2 text-xs text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B] font-sans"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#9AA5B1] mb-1.5">Primary Target Career</label>
                  <select
                    value={targetCareer}
                    onChange={(e) => setTargetCareer(e.target.value)}
                    className="w-full bg-[#0B0F14] border border-[#202C3B] rounded-xl px-3.5 py-2 text-xs text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B] font-sans"
                  >
                    <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                    <option value="Full Stack &amp; Backend Systems Engineer">Full Stack Systems Engineer</option>
                    <option value="Data Scientist / AI Researcher">Data Scientist / AI Researcher</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[#202C3B]">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#0B0F14] bg-[#D89B5B] hover:bg-[#E4AB70] transition-all flex items-center gap-2 shadow-sm cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
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
                <h3 className="text-base font-bold text-[#F3F0E8]">Security &amp; Authentication</h3>
                <p className="text-xs text-[#9AA5B1] mt-1">
                  Manage student credentials, roll number identification, and account access.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0E151E] border border-[#202C3B] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F3F0E8] uppercase tracking-wider font-mono">
                    {user?.isGuest ? 'Current Session: Guest Exploration Mode' : 'Current Session: Verified Student Profile'}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${user?.isGuest ? 'bg-[#D89B5B]/15 text-[#D89B5B] border border-[#D89B5B]/30' : 'bg-[#67C5B8]/15 text-[#7CD4C8] border border-[#67C5B8]/30'}`}>
                    {user?.isGuest ? 'Guest Mode' : 'Active Student'}
                  </span>
                </div>
                <p className="text-xs text-[#9AA5B1]">
                  {user?.isGuest
                    ? "You’re exploring UNNEXA as a guest. Your progress will not be permanently saved."
                    : `Signed in as ${student.name} (${student.email}). University Roll Number: ${student.rollNumber}.`}
                </p>
                {user?.isGuest && (
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#D89B5B] hover:bg-[#E4AB70] text-[#0B0F14] font-semibold text-xs transition-all shadow-sm"
                  >
                    Create Registered Account →
                  </Link>
                )}
              </div>

              {!user?.isGuest && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-[#9AA5B1] mb-1.5">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      className="w-full bg-[#0B0F14] border border-[#202C3B] rounded-xl px-3.5 py-2 text-xs text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B] font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#9AA5B1] mb-1.5">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      className="w-full bg-[#0B0F14] border border-[#202C3B] rounded-xl px-3.5 py-2 text-xs text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B] font-sans"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSaveSuccess(true);
                      setTimeout(() => setSaveSuccess(false), 3000);
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#1B2533] hover:bg-[#223042] text-[#F3F0E8] border border-[#27384B] transition-all cursor-pointer shadow-sm"
                  >
                    Update Password
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-base font-bold text-[#F3F0E8]">Appearance &amp; Theme</h3>
                <p className="text-xs text-[#9AA5B1] mt-1">
                  UNNEXA interface theme system configuration.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#0E151E] border border-[#D89B5B]/30 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#F3F0E8]">UNNEXA Midnight Ink &amp; Warm Copper (Active)</h4>
                    <p className="text-[11px] text-[#9AA5B1]">Deep Slate surfaces (#151D26) with refined copper accents.</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#D89B5B]">Active</span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-[#0E151E] border border-[#202C3B]">
                  <div>
                    <h4 className="text-xs font-bold text-[#F3F0E8]">High Contrast Typography</h4>
                    <p className="text-[11px] text-[#9AA5B1]">Enhance font contrast across charts and transcript tables.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={denseLayout}
                    onChange={(e) => setDenseLayout(e.target.checked)}
                    className="w-4 h-4 rounded border-[#202C3B] bg-[#0B0F14] text-[#D89B5B] focus:ring-0 accent-[#D89B5B]"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-base font-bold text-[#F3F0E8]">Notification Telemetry</h3>
                <p className="text-xs text-[#9AA5B1] mt-1">
                  Configure alerts for new skill gaps, mid-term grade uploads, and roadmap deadlines.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#0E151E] border border-[#202C3B]">
                  <div>
                    <h4 className="text-xs font-bold text-[#F3F0E8]">Weekly Performance Digest</h4>
                    <p className="text-[11px] text-[#9AA5B1]">Summary of hours studied, streak status, and GPA trends.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 rounded border-[#202C3B] bg-[#0B0F14] text-[#D89B5B] focus:ring-0 accent-[#D89B5B]"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-[#0E151E] border border-[#202C3B]">
                  <div>
                    <h4 className="text-xs font-bold text-[#F3F0E8]">Skill Gap &amp; Market Alerts</h4>
                    <p className="text-[11px] text-[#9AA5B1]">Notify when target role requirements shift or gaps exceed 20%.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={skillGapAlerts}
                    onChange={(e) => setSkillGapAlerts(e.target.checked)}
                    className="w-4 h-4 rounded border-[#202C3B] bg-[#0B0F14] text-[#D89B5B] focus:ring-0 accent-[#D89B5B]"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-[#0E151E] border border-[#202C3B]">
                  <div>
                    <h4 className="text-xs font-bold text-[#F3F0E8]">ATS Keyword Suggestions</h4>
                    <p className="text-[11px] text-[#9AA5B1]">Notify when new resume keywords are identified in job boards.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={atsAlerts}
                    onChange={(e) => setAtsAlerts(e.target.checked)}
                    className="w-4 h-4 rounded border-[#202C3B] bg-[#0B0F14] text-[#D89B5B] focus:ring-0 accent-[#D89B5B]"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-base font-bold text-[#F3F0E8]">Data Privacy &amp; Anonymization</h3>
                <p className="text-xs text-[#9AA5B1] mt-1">
                  Control how your academic transcripts and project code are shared.
                </p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#0E151E] border border-[#202C3B]">
                <div>
                  <h4 className="text-xs font-bold text-[#F3F0E8]">Verified Recruiter Talent Search</h4>
                  <p className="text-[11px] text-[#9AA5B1]">Allow verified employers to match your profile based on verified skill scores.</p>
                </div>
                <input
                  type="checkbox"
                  checked={recruiterDiscovery}
                  onChange={(e) => setRecruiterDiscovery(e.target.checked)}
                  className="w-4 h-4 rounded border-[#202C3B] bg-[#0B0F14] text-[#D89B5B] focus:ring-0 accent-[#D89B5B]"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#0E151E] border border-[#202C3B] text-xs text-[#9AA5B1]">
                <p className="font-semibold text-[#F3F0E8] mb-1">Academic Data Sovereignty</p>
                <p className="text-[#9AA5B1] leading-relaxed">
                  Your university transcripts and GPA records are stored locally for client-side analytics. No raw grades are sold to third parties.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-base font-bold text-[#F3F0E8]">Telemetry Preferences</h3>
                <p className="text-xs text-[#9AA5B1] mt-1">
                  Configure recommendation frequency and target company weighting.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0E151E] border border-[#202C3B] space-y-3 text-xs text-[#9AA5B1]">
                <div>
                  <label className="block text-xs font-medium text-[#F3F0E8] mb-1">Learning Cadence Target</label>
                  <select className="w-full bg-[#0B0F14] border border-[#202C3B] rounded-xl px-3 py-2 text-xs text-[#F3F0E8] focus:outline-none focus:border-[#D89B5B]">
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
