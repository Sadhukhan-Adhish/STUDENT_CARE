import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  mockStudent,
  mockAcademicSemesters,
  mockSubjectPerformances,
  mockSkills,
  mockProjects,
  StudentProfile,
  Institution,
  AcademicProfile,
  Semester,
  Subject,
  Skill,
  Project,
  CareerGoal,
  Progress,
  SubjectPerformance,
  AcademicSemester,
  SkillItem,
  ProjectItem,
  calculateSGPA,
  calculateCGPA,
  calculateReadinessScore,
} from '../data/mockData';

export interface User {
  uid: string;
  rollNumber: string;
  email: string | null;
  displayName: string;
  photoURL: string;
  studentProfile: StudentProfile;
  isGuest?: boolean;
}

export interface StudentRegistrationParams {
  // Step 1: Personal
  name: string;
  email: string;
  password?: string;
  phone?: string;
  avatar?: string;

  // Step 2: Institution
  collegeName?: string;
  universityName?: string;
  universityRollNumber?: string;
  courseDegree?: string;
  branchDepartment?: string;
  currentYear?: string | number;
  currentSemester?: number;
  collegeStudentId?: string;
  universityRegistrationNumber?: string;
  admissionYear?: string | number;
  expectedGraduationYear?: string | number;

  // Step 3: Academic
  totalSemesters?: number;
  subjects?: SubjectPerformance[];
  semesters?: AcademicSemester[];
  syllabus?: import('../data/mockData').CollegeSyllabusItem[];

  // Step 4: Skills
  skills?: SkillItem[];
  ownSkillUp?: import('../data/mockData').SkillGoal[];

  // Step 5: Projects
  projects?: ProjectItem[];

  // Step 6: Career Goal
  targetCareer?: string;
  customCareerGoal?: string;

  // Onboarding status
  onboardingCompleted?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isGuest: boolean;
  login: (rollNumberOrEmail: string, password?: string) => Promise<boolean>;
  signup: (params: StudentRegistrationParams) => Promise<boolean>;
  logout: () => Promise<void>;
  enterGuestMode: () => Promise<void>;
  exitGuestMode: () => Promise<void>;
  demoLogin: () => Promise<void>;
  updateProfile: (profile: Partial<StudentProfile>) => void;
  // Onboarding helpers
  saveOnboardingStep: (data: Partial<StudentProfile>, step?: number) => void;
  completeOnboarding: (finalData?: Partial<StudentProfile>) => void;
  // Dynamic Academic management
  addSubject: (subject: SubjectPerformance) => void;
  updateSubject: (code: string, updated: Partial<SubjectPerformance>) => void;
  deleteSubject: (code: string) => void;
  addSemester: (sem: AcademicSemester) => void;
  // Dynamic Skill management
  addSkill: (skill: Omit<SkillItem, 'id'>) => void;
  updateSkill: (id: string, updated: Partial<SkillItem>) => void;
  deleteSkill: (id: string) => void;
  // Dynamic Project management
  addProject: (project: Omit<ProjectItem, 'id'>) => void;
  updateProject: (id: string, updated: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;
  // Reset
  resetToDemoStudent: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'nexora_auth_user';
const STUDENTS_DB_KEY = 'nexora_students_db';

const getSampleGuestUser = (): User => {
  return {
    uid: 'guest-' + Date.now(),
    rollNumber: 'GUEST-DEMO',
    email: 'guest@nexora.demo',
    displayName: 'Guest Student',
    photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=GuestStudent',
    isGuest: true,
    studentProfile: {
      id: 'guest-sample-student',
      rollNumber: 'GUEST-DEMO',
      name: 'Guest Student',
      email: 'guest@nexora.demo',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=GuestStudent',
      college: 'Pacific Institute of Technology',
      university: 'Pacific Institute of Technology',
      degree: 'Bachelor of Technology (B.Tech)',
      department: 'Computer Science & AI',
      graduationYear: 2027,
      currentSemester: 6,
      cgpa: 8.74,
      targetCgpa: 9.0,
      targetCareer: 'Machine Learning Engineer',
      secondaryTargetCareer: 'Full Stack Systems Engineer',
      readinessScore: 76,
      skillScore: 82,
      learningStreakDays: 14,
      totalHoursStudied: 184,
      bio: 'Guest demonstration student profile for exploring NEXORA platform capabilities.',
      onboardingCompleted: true,
      onboardingStep: 7,
      semesters: [...mockAcademicSemesters],
      subjects: [...mockSubjectPerformances],
      skills: [...mockSkills],
      projects: [...mockProjects],
    },
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const isGuest = Boolean(user?.isGuest);

  // Helper to persist user and update student db (only if not guest)
  const persistUser = (updatedUser: User | null) => {
    setUser(updatedUser);
    if (updatedUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
      // Only persist registered students into the student database, NEVER guests
      if (!updatedUser.isGuest) {
        try {
          const storedDb = localStorage.getItem(STUDENTS_DB_KEY);
          const db: Record<string, StudentProfile> = storedDb ? JSON.parse(storedDb) : {};
          if (updatedUser.studentProfile.rollNumber) {
            db[updatedUser.studentProfile.rollNumber.toUpperCase().trim()] = updatedUser.studentProfile;
          }
          if (updatedUser.studentProfile.email) {
            db[updatedUser.studentProfile.email.toLowerCase().trim()] = updatedUser.studentProfile;
          }
          localStorage.setItem(STUDENTS_DB_KEY, JSON.stringify(db));
        } catch (e) {
          console.error('Error syncing student database', e);
        }
      }
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  useEffect(() => {
    try {
      // Clean up any stale legacy Alex Chen demo keys from student db or auth
      const storedDb = localStorage.getItem(STUDENTS_DB_KEY);
      if (storedDb) {
        const db: Record<string, any> = JSON.parse(storedDb);
        if (db['22CS084'] || db['alex.chen@university.edu']) {
          delete db['22CS084'];
          delete db['alex.chen@university.edu'];
          localStorage.setItem(STUDENTS_DB_KEY, JSON.stringify(db));
        }
      }

      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed: User = JSON.parse(stored);
        // Purge any old session that was Alex Chen
        if (
          parsed.rollNumber === '22CS084' ||
          parsed.displayName === 'Alex Chen' ||
          parsed.studentProfile?.rollNumber === '22CS084'
        ) {
          localStorage.removeItem(AUTH_STORAGE_KEY);
          setUser(null);
        } else {
          setUser(parsed);
        }
      } else {
        // No active session: keep user null so unauthenticated visitors must sign in or choose guest mode
        setUser(null);
      }
    } catch (e) {
      console.error('Error loading auth session', e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const enterGuestMode = async (): Promise<void> => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const guestUser = getSampleGuestUser();
    persistUser(guestUser);
    setLoading(false);
  };

  const exitGuestMode = async (): Promise<void> => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 200));
    persistUser(null);
    setLoading(false);
  };

  const login = async (rollNumber: string, password?: string): Promise<boolean> => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    const identifier = rollNumber.trim();
    if (!identifier) {
      setLoading(false);
      throw new Error('Please enter your University Roll Number');
    }

    const upperId = identifier.toUpperCase();
    const lowerId = identifier.toLowerCase();

    // Check local student database for registered student
    let profileToLoad: StudentProfile | null = null;
    try {
      const storedDb = localStorage.getItem(STUDENTS_DB_KEY);
      if (storedDb) {
        const db: Record<string, StudentProfile> = JSON.parse(storedDb);
        if (db[upperId]) profileToLoad = db[upperId];
        else if (db[lowerId]) profileToLoad = db[lowerId];
      }
    } catch (e) {
      console.error('Error checking student db', e);
    }

    if (!profileToLoad) {
      setLoading(false);
      throw new Error(`No student account found for Roll Number "${identifier}". Please create an account or explore in Guest Mode.`);
    }

    // Validate password if student set a password during onboarding
    if (profileToLoad.password && password && profileToLoad.password !== password) {
      setLoading(false);
      throw new Error('Incorrect password. Please verify your credentials.');
    }

    const loggedUser: User = {
      uid: profileToLoad.id,
      rollNumber: profileToLoad.rollNumber,
      email: profileToLoad.email,
      displayName: profileToLoad.name,
      photoURL: profileToLoad.avatar,
      isGuest: false,
      studentProfile: profileToLoad,
    };

    persistUser(loggedUser);
    setLoading(false);
    return true;
  };

  const signup = async (params: StudentRegistrationParams): Promise<boolean> => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const rollNo = params.universityRollNumber?.trim().toUpperCase() || '';
    const email = params.email.trim().toLowerCase();
    const degree = params.courseDegree?.trim() || '';
    const department = params.branchDepartment?.trim() || '';
    const currentSem = Number(params.currentSemester) || 1;
    const finalCareer =
      params.targetCareer === 'Other' && params.customCareerGoal
        ? params.customCareerGoal.trim()
        : (params.targetCareer?.trim() || '');

    const subjects = params.subjects || [];
    const semesters = params.semesters || [];
    const skills = params.skills || [];
    const ownSkillUp = params.ownSkillUp || [];
    const projects = params.projects || [];
    const syllabus = params.syllabus || [];

    // Calculated metrics ONLY if real data provided
    const calculatedSgpa = subjects.length > 0 ? calculateSGPA(subjects) : null;
    const calculatedCgpa = semesters.length > 0 ? calculateCGPA(semesters) : null;
    const calculatedReadiness = skills.length > 0 ? calculateReadinessScore(skills) : null;

    const institution: Institution = {
      collegeName: params.collegeName?.trim() || '',
      universityName: params.universityName?.trim() || '',
      universityRollNumber: rollNo,
      courseDegree: degree,
      branchDepartment: department,
      currentYear: params.currentYear || Math.ceil(currentSem / 2),
      currentSemester: currentSem,
      collegeStudentId: params.collegeStudentId,
      universityRegistrationNumber: params.universityRegistrationNumber,
      admissionYear: params.admissionYear,
      expectedGraduationYear: params.expectedGraduationYear,
    };

    const academic: AcademicProfile = {
      currentSemester: currentSem,
      totalSemesters: params.totalSemesters || 8,
      semesters: semesters,
      subjects: subjects,
      cgpa: calculatedCgpa || undefined,
      sgpa: calculatedSgpa || undefined,
      totalCredits: subjects.reduce((sum, s) => sum + (s.credits || 0), 0),
    };

    const careerGoal: CareerGoal = {
      targetRole: finalCareer,
      customRole: params.customCareerGoal,
    };

    const progress: Progress = {
      learningStreakDays: 1,
      totalHoursStudied: 0,
      completedRoadmapTasks: 0,
      totalRoadmapTasks: 0,
    };

    const newProfile: StudentProfile = {
      id: 'nex-std-' + Date.now(),
      rollNumber: rollNo,
      name: params.name.trim(),
      email,
      password: params.password,
      phone: params.phone?.trim(),
      avatar: params.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(rollNo || email || 'student')}`,
      college: params.collegeName?.trim() || '',
      university: params.universityName?.trim() || '',
      department,
      degree,
      graduationYear: params.expectedGraduationYear
        ? Number(params.expectedGraduationYear)
        : new Date().getFullYear() + Math.max(1, 4 - Math.floor(currentSem / 2)),
      currentYear: params.currentYear || Math.ceil(currentSem / 2),
      currentSemester: currentSem,
      totalSemesters: params.totalSemesters || 8,

      onboardingCompleted: params.onboardingCompleted ?? false,
      onboardingStep: 0,

      institution,
      academic,
      careerGoal,
      progress,

      cgpa: calculatedCgpa || undefined,
      targetCgpa: 9.0,
      targetCareer: finalCareer,
      secondaryTargetCareer: '',
      readinessScore: calculatedReadiness || undefined,
      skillScore: calculatedReadiness || undefined,
      learningStreakDays: 1,
      totalHoursStudied: 0,
      bio: `Student enrolled in ${degree || 'undergraduate studies'} ${department ? `(${department})` : ''}.`,
      semesters,
      subjects,
      skills,
      ownSkillUp,
      projects,
      syllabus,
    };

    const newUser: User = {
      uid: newProfile.id,
      rollNumber: newProfile.rollNumber,
      email: newProfile.email,
      displayName: newProfile.name,
      photoURL: newProfile.avatar,
      isGuest: false,
      studentProfile: newProfile,
    };

    persistUser(newUser);
    setLoading(false);
    return true;
  };

  const saveOnboardingStep = (data: Partial<StudentProfile>, step?: number) => {
    if (!user) return;
    const current = user.studentProfile;
    const updatedProfile: StudentProfile = {
      ...current,
      ...data,
      onboardingStep: typeof step === 'number' ? step : current.onboardingStep,
    };

    const updatedUser: User = {
      ...user,
      displayName: updatedProfile.name || user.displayName,
      rollNumber: updatedProfile.rollNumber || user.rollNumber,
      photoURL: updatedProfile.avatar || user.photoURL,
      studentProfile: updatedProfile,
    };

    persistUser(updatedUser);
  };

  const completeOnboarding = (finalData?: Partial<StudentProfile>) => {
    if (!user) return;
    const current = user.studentProfile;
    const merged: StudentProfile = {
      ...current,
      ...(finalData || {}),
      onboardingCompleted: true,
      onboardingStep: 7,
    };

    // Calculate real metrics ONLY if real data exists
    const subjects = merged.subjects || [];
    const semesters = merged.semesters || [];
    const skills = merged.skills || [];

    const realSgpa = subjects.length > 0 ? calculateSGPA(subjects) : null;
    const realCgpa = semesters.length > 0 ? calculateCGPA(semesters) : null;
    const realReadiness = skills.length > 0 ? calculateReadinessScore(skills) : null;

    const finalizedProfile: StudentProfile = {
      ...merged,
      cgpa: realCgpa !== null ? realCgpa : undefined,
      sgpa: realSgpa !== null ? realSgpa : undefined,
      readinessScore: realReadiness !== null ? realReadiness : undefined,
      skillScore: realReadiness !== null ? realReadiness : undefined,
    };

    const updatedUser: User = {
      ...user,
      displayName: finalizedProfile.name,
      rollNumber: finalizedProfile.rollNumber,
      photoURL: finalizedProfile.avatar || user.photoURL,
      studentProfile: finalizedProfile,
    };

    persistUser(updatedUser);
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 200));
    persistUser(null);
    setLoading(false);
  };

  const demoLogin = async (): Promise<void> => {
    // Legacy support redirect to Guest Mode
    await enterGuestMode();
  };

  const updateProfile = (updatedFields: Partial<StudentProfile>) => {
    if (!user) return;
    const current = user.studentProfile;
    const updatedProfile: StudentProfile = {
      ...current,
      ...updatedFields,
    };

    const updatedUser: User = {
      ...user,
      displayName: updatedProfile.name,
      rollNumber: updatedProfile.rollNumber,
      photoURL: updatedProfile.avatar || user.photoURL,
      studentProfile: updatedProfile,
    };

    persistUser(updatedUser);
  };

  // Academic Management Methods
  const addSubject = (subject: SubjectPerformance) => {
    if (!user) return;
    const currentSubjects = user.studentProfile.subjects || [];
    const newSubjects = [subject, ...currentSubjects];
    const newSgpa = calculateSGPA(newSubjects);

    const currentSemesters = user.studentProfile.semesters || [];
    const updatedSemesters = currentSemesters.map((sem, idx) => {
      if (idx === currentSemesters.length - 1 || sem.semester.includes('Current')) {
        return { ...sem, sgpa: newSgpa !== null ? newSgpa : sem.sgpa };
      }
      return sem;
    });

    const newCgpa = calculateCGPA(updatedSemesters);

    updateProfile({
      subjects: newSubjects,
      semesters: updatedSemesters,
      cgpa: newCgpa !== null ? newCgpa : user.studentProfile.cgpa,
    });
  };

  const updateSubject = (code: string, updated: Partial<SubjectPerformance>) => {
    if (!user) return;
    const currentSubjects = user.studentProfile.subjects || [];
    const newSubjects = currentSubjects.map((s) => (s.code === code ? { ...s, ...updated } : s));
    const newSgpa = calculateSGPA(newSubjects);

    const currentSemesters = user.studentProfile.semesters || [];
    const updatedSemesters = currentSemesters.map((sem, idx) => {
      if (idx === currentSemesters.length - 1 || sem.semester.includes('Current')) {
        return { ...sem, sgpa: newSgpa !== null ? newSgpa : sem.sgpa };
      }
      return sem;
    });

    const newCgpa = calculateCGPA(updatedSemesters);

    updateProfile({
      subjects: newSubjects,
      semesters: updatedSemesters,
      cgpa: newCgpa !== null ? newCgpa : user.studentProfile.cgpa,
    });
  };

  const deleteSubject = (code: string) => {
    if (!user) return;
    const currentSubjects = user.studentProfile.subjects || [];
    const newSubjects = currentSubjects.filter((s) => s.code !== code);
    const newSgpa = calculateSGPA(newSubjects);

    const currentSemesters = user.studentProfile.semesters || [];
    const updatedSemesters = currentSemesters.map((sem, idx) => {
      if (idx === currentSemesters.length - 1 || sem.semester.includes('Current')) {
        return { ...sem, sgpa: newSgpa !== null ? newSgpa : sem.sgpa };
      }
      return sem;
    });

    const newCgpa = calculateCGPA(updatedSemesters);

    updateProfile({
      subjects: newSubjects,
      semesters: updatedSemesters,
      cgpa: newCgpa !== null ? newCgpa : user.studentProfile.cgpa,
    });
  };

  const addSemester = (newSem: AcademicSemester) => {
    if (!user) return;
    const currentSemesters = user.studentProfile.semesters || [];
    const updated = [...currentSemesters, newSem];
    const newCgpa = calculateCGPA(updated);
    updateProfile({
      semesters: updated,
      cgpa: newCgpa !== null ? newCgpa : user.studentProfile.cgpa,
      currentSemester: currentSemesters.length + 1,
    });
  };

  // Skill Management Methods
  const addSkill = (skill: Omit<SkillItem, 'id'>) => {
    if (!user) return;
    const currentSkills = user.studentProfile.skills || [];
    const req = skill.requiredLevel || 80;
    const cur = skill.currentLevel || 50;
    const newSkill: SkillItem = {
      ...skill,
      id: 'skill-' + Date.now(),
      requiredLevel: req,
      currentLevel: cur,
      gap: req - cur,
    };
    const updatedSkills = [newSkill, ...currentSkills];
    const avgSkill = calculateReadinessScore(updatedSkills);
    updateProfile({
      skills: updatedSkills,
      skillScore: avgSkill !== null ? avgSkill : undefined,
      readinessScore: avgSkill !== null ? avgSkill : undefined,
    });
  };

  const updateSkill = (id: string, updated: Partial<SkillItem>) => {
    if (!user) return;
    const currentSkills = user.studentProfile.skills || [];
    const updatedSkills = currentSkills.map((s) => {
      if (s.id === id) {
        const merged = { ...s, ...updated };
        if (updated.currentLevel !== undefined || updated.requiredLevel !== undefined) {
          const r = merged.requiredLevel || 80;
          const c = merged.currentLevel || 50;
          merged.gap = r - c;
        }
        return merged;
      }
      return s;
    });
    const avgSkill = calculateReadinessScore(updatedSkills);
    updateProfile({
      skills: updatedSkills,
      skillScore: avgSkill !== null ? avgSkill : undefined,
      readinessScore: avgSkill !== null ? avgSkill : undefined,
    });
  };

  const deleteSkill = (id: string) => {
    if (!user) return;
    const currentSkills = user.studentProfile.skills || [];
    const updatedSkills = currentSkills.filter((s) => s.id !== id);
    const avgSkill = calculateReadinessScore(updatedSkills);
    updateProfile({
      skills: updatedSkills,
      skillScore: avgSkill !== null ? avgSkill : undefined,
      readinessScore: avgSkill !== null ? avgSkill : undefined,
    });
  };

  // Project Management Methods
  const addProject = (project: Omit<ProjectItem, 'id'>) => {
    if (!user) return;
    const currentProjects = user.studentProfile.projects || [];
    const newProject: ProjectItem = {
      ...project,
      id: 'proj-' + Date.now(),
    };
    updateProfile({
      projects: [newProject, ...currentProjects],
    });
  };

  const updateProject = (id: string, updated: Partial<ProjectItem>) => {
    if (!user) return;
    const currentProjects = user.studentProfile.projects || [];
    const updatedProjects = currentProjects.map((p) => (p.id === id ? { ...p, ...updated } : p));
    updateProfile({
      projects: updatedProjects,
    });
  };

  const deleteProject = (id: string) => {
    if (!user) return;
    const currentProjects = user.studentProfile.projects || [];
    updateProfile({
      projects: currentProjects.filter((p) => p.id !== id),
    });
  };

  const resetToDemoStudent = () => {
    const guestUser = getSampleGuestUser();
    persistUser(guestUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isGuest,
        login,
        signup,
        logout,
        enterGuestMode,
        exitGuestMode,
        demoLogin,
        updateProfile,
        saveOnboardingStep,
        completeOnboarding,
        addSubject,
        updateSubject,
        deleteSubject,
        addSemester,
        addSkill,
        updateSkill,
        deleteSkill,
        addProject,
        updateProject,
        deleteProject,
        resetToDemoStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
