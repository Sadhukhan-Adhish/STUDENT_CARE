import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
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
  CollegeSyllabusItem,
  SkillGoal,
  mockOwnSkillUp,
  mockCollegeSyllabus,
  ResumeInfo,
  RoadmapStage,
  RoadmapTask,
  mockRoadmapStages,
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
  updateSubject: (idOrCode: string, updated: Partial<SubjectPerformance>) => void;
  deleteSubject: (idOrCode: string) => void;
  addSemester: (sem: AcademicSemester) => void;
  updateSemester: (semesterNameOrNumber: string | number, updated: Partial<AcademicSemester>) => void;
  deleteSemester: (semesterNameOrNumber: string | number) => void;
  setCurrentSemester: (semNumber: number) => void;
  // Dynamic Syllabus management
  addSyllabusItem: (item: Omit<CollegeSyllabusItem, 'id'>) => void;
  updateSyllabusItem: (id: string, updated: Partial<CollegeSyllabusItem>) => void;
  deleteSyllabusItem: (id: string) => void;
  // Dynamic Skill management
  addSkill: (skill: Omit<SkillItem, 'id'>) => void;
  updateSkill: (id: string, updated: Partial<SkillItem>) => void;
  deleteSkill: (id: string) => void;
  // Own Skill Up management
  addOwnSkillUp: (item: Omit<SkillGoal, 'id'>) => void;
  updateOwnSkillUp: (id: string, updated: Partial<SkillGoal>) => void;
  deleteOwnSkillUp: (id: string) => void;
  // Dynamic Project management
  addProject: (project: Omit<ProjectItem, 'id'>) => void;
  updateProject: (id: string, updated: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;
  // Dynamic Career management
  setCareerGoal: (goal: { targetRole: string; industryDomain?: string; timeline?: string; notes?: string }) => void;
  addCareerGoal: (goal: string) => void;
  removeCareerGoal: (goal: string) => void;
  setCareerGoals: (goals: string[]) => void;
  clearCareerGoal: () => void;
  // Dynamic Resume management
  uploadResume: (info: ResumeInfo) => void;
  removeResume: () => void;
  // Dynamic Roadmap management
  addRoadmapStage: (stage: Omit<RoadmapStage, 'id' | 'number'>) => void;
  updateRoadmapStage: (stageId: string, updated: Partial<RoadmapStage>) => void;
  deleteRoadmapStage: (stageId: string) => void;
  addRoadmapTask: (stageId: string, task: Omit<RoadmapTask, 'id' | 'completed'> & { completed?: boolean }) => void;
  updateRoadmapTask: (stageId: string, taskId: string, updated: Partial<RoadmapTask>) => void;
  deleteRoadmapTask: (stageId: string, taskId: string) => void;
  toggleRoadmapTask: (stageId: string, taskId: string, targetStatus?: 'Not Started' | 'In Progress' | 'Completed') => void;
  initializeDefaultRoadmap: (roleTitle?: string) => void;
  // Reset
  resetToDemoStudent: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'unnexa_auth_user';
const STUDENTS_DB_KEY = 'unnexa_students_db';

const getCleanGuestUser = (): User => {
  return {
    uid: 'guest-' + Date.now(),
    rollNumber: '',
    email: '',
    displayName: 'Guest',
    photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=Guest',
    isGuest: true,
    studentProfile: {
      id: 'guest-profile-' + Date.now(),
      rollNumber: '',
      name: 'Guest',
      email: '',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Guest',
      college: '',
      university: '',
      degree: '',
      department: '',
      graduationYear: undefined,
      currentSemester: 1,
      cgpa: 0,
      targetCgpa: undefined,
      targetCareer: '',
      secondaryTargetCareer: '',
      readinessScore: 0,
      skillScore: 0,
      learningStreakDays: 0,
      totalHoursStudied: 0,
      bio: '',
      onboardingCompleted: true,
      onboardingStep: 7,
      semesters: [],
      subjects: [],
      skills: [],
      ownSkillUp: [],
      projects: [],
      syllabus: [],
      careerGoalDetails: undefined,
      resumeInfo: undefined,
      roadmapStages: [],
    },
  };
};

const getSampleGuestUser = getCleanGuestUser;

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

      // Also clean up any legacy nexora keys from localStorage
      localStorage.removeItem('nexora_auth_user');
      localStorage.removeItem('nexora_students_db');

      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed: User = JSON.parse(stored);
        // Purge any old session that was Alex Chen or old fake guest
        if (
          parsed.rollNumber === '22CS084' ||
          parsed.displayName === 'Alex Chen' ||
          parsed.studentProfile?.rollNumber === '22CS084' ||
          parsed.rollNumber === 'GUEST-DEMO' ||
          parsed.email === 'guest@nexora.demo' ||
          parsed.displayName === 'Guest Student'
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
      careerGoalDetails: finalCareer
        ? {
            targetRole: finalCareer,
            customRole: params.customCareerGoal,
            setAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0],
          }
        : undefined,
      resumeInfo: null,
      roadmapStages: [],
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
    const newSubject: SubjectPerformance = {
      ...subject,
      id: subject.id || `sub-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    };
    const newSubjects = [newSubject, ...currentSubjects];
    const newSgpa = calculateSGPA(newSubjects);

    const currentSemesters = user.studentProfile.semesters || [];
    const targetSem = typeof newSubject.semester === 'number'
      ? newSubject.semester
      : (typeof newSubject.semesterNumber === 'number' ? newSubject.semesterNumber : user.studentProfile.currentSemester);

    const updatedSemesters = currentSemesters.map((sem, idx) => {
      const semNum = typeof sem.semesterNumber === 'number'
        ? sem.semesterNumber
        : Number(String(sem.semester).replace(/[^0-9]/g, '')) || idx + 1;
      if (semNum === targetSem || sem.semester.includes('Current')) {
        return { ...sem, sgpa: newSgpa !== null ? newSgpa : sem.sgpa };
      }
      return sem;
    });

    const newCgpa = calculateCGPA(updatedSemesters);

    updateProfile({
      subjects: newSubjects,
      semesters: updatedSemesters,
      cgpa: newCgpa !== null ? newCgpa : user.studentProfile.cgpa,
      sgpa: newSgpa !== null ? newSgpa : user.studentProfile.sgpa,
    });
  };

  const updateSubject = (idOrCode: string, updated: Partial<SubjectPerformance>) => {
    if (!user) return;
    const currentSubjects = user.studentProfile.subjects || [];
    const newSubjects = currentSubjects.map((s) =>
      (s.id === idOrCode || (s.code && s.code === idOrCode)) ? { ...s, ...updated } : s
    );
    const newSgpa = calculateSGPA(newSubjects);

    const currentSemesters = user.studentProfile.semesters || [];
    const updatedSemesters = currentSemesters.map((sem) => {
      if (sem.semester.includes('Current') || (typeof sem.semesterNumber === 'number' && sem.semesterNumber === user.studentProfile.currentSemester)) {
        return { ...sem, sgpa: newSgpa !== null ? newSgpa : sem.sgpa };
      }
      return sem;
    });

    const newCgpa = calculateCGPA(updatedSemesters);

    updateProfile({
      subjects: newSubjects,
      semesters: updatedSemesters,
      cgpa: newCgpa !== null ? newCgpa : user.studentProfile.cgpa,
      sgpa: newSgpa !== null ? newSgpa : user.studentProfile.sgpa,
    });
  };

  const deleteSubject = (idOrCode: string) => {
    if (!user) return;
    const currentSubjects = user.studentProfile.subjects || [];
    const newSubjects = currentSubjects.filter((s) => s.id !== idOrCode && s.code !== idOrCode);
    const newSgpa = calculateSGPA(newSubjects);

    const currentSemesters = user.studentProfile.semesters || [];
    const updatedSemesters = currentSemesters.map((sem) => {
      if (sem.semester.includes('Current')) {
        return { ...sem, sgpa: newSgpa !== null ? newSgpa : sem.sgpa };
      }
      return sem;
    });

    const newCgpa = calculateCGPA(updatedSemesters);

    updateProfile({
      subjects: newSubjects,
      semesters: updatedSemesters,
      cgpa: newCgpa !== null ? newCgpa : (updatedSemesters.length === 0 ? undefined : user.studentProfile.cgpa),
      sgpa: newSgpa !== null ? newSgpa : undefined,
    });
  };

  const addSemester = (newSem: AcademicSemester) => {
    if (!user) return;
    const currentSemesters = user.studentProfile.semesters || [];
    const existingIndex = currentSemesters.findIndex(
      (s) => s.semester.toLowerCase().trim() === newSem.semester.toLowerCase().trim()
    );
    let updated: AcademicSemester[];
    if (existingIndex >= 0) {
      updated = currentSemesters.map((s, idx) => (idx === existingIndex ? { ...s, ...newSem } : s));
    } else {
      updated = [...currentSemesters, newSem];
    }
    const newCgpa = calculateCGPA(updated);
    updateProfile({
      semesters: updated,
      cgpa: newCgpa !== null ? newCgpa : user.studentProfile.cgpa,
    });
  };

  const updateSemester = (semesterNameOrNumber: string | number, updatedFields: Partial<AcademicSemester>) => {
    if (!user) return;
    const currentSemesters = user.studentProfile.semesters || [];
    const updated = currentSemesters.map((s) => {
      const matchName = s.semester.toLowerCase().trim() === String(semesterNameOrNumber).toLowerCase().trim();
      const matchNum = s.semesterNumber === semesterNameOrNumber || Number(s.semester.replace(/[^0-9]/g, '')) === semesterNameOrNumber;
      if (matchName || matchNum) {
        return { ...s, ...updatedFields };
      }
      return s;
    });
    const newCgpa = calculateCGPA(updated);
    updateProfile({
      semesters: updated,
      cgpa: newCgpa !== null ? newCgpa : user.studentProfile.cgpa,
    });
  };

  const deleteSemester = (semesterNameOrNumber: string | number) => {
    if (!user) return;
    const currentSemesters = user.studentProfile.semesters || [];
    const updated = currentSemesters.filter((s) => {
      const matchName = s.semester.toLowerCase().trim() === String(semesterNameOrNumber).toLowerCase().trim();
      const matchNum = s.semesterNumber === semesterNameOrNumber || Number(s.semester.replace(/[^0-9]/g, '')) === semesterNameOrNumber;
      return !matchName && !matchNum;
    });
    const newCgpa = calculateCGPA(updated);
    updateProfile({
      semesters: updated,
      cgpa: newCgpa !== null ? newCgpa : undefined,
    });
  };

  const setCurrentSemester = (semNumber: number) => {
    if (!user) return;
    updateProfile({
      currentSemester: semNumber,
    });
  };

  // Syllabus Management Methods
  const addSyllabusItem = (item: Omit<CollegeSyllabusItem, 'id'>) => {
    if (!user) return;
    const current = user.studentProfile.syllabus || [];
    const newItem: CollegeSyllabusItem = {
      ...item,
      id: `syl-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      uploadedAt: item.uploadedAt || new Date().toLocaleDateString(),
    };
    updateProfile({
      syllabus: [newItem, ...current],
    });
  };

  const updateSyllabusItem = (id: string, updated: Partial<CollegeSyllabusItem>) => {
    if (!user) return;
    const current = user.studentProfile.syllabus || [];
    const nextSyllabus = current.map((item) => (item.id === id ? { ...item, ...updated } : item));
    updateProfile({
      syllabus: nextSyllabus,
    });
  };

  const deleteSyllabusItem = (id: string) => {
    if (!user) return;
    const current = user.studentProfile.syllabus || [];
    updateProfile({
      syllabus: current.filter((item) => item.id !== id),
    });
  };

  // Skill Management Methods
  const addSkill = (skill: Omit<SkillItem, 'id'>) => {
    if (!user) return;
    const currentSkills = user.studentProfile.skills || [];
    const proficiency = skill.proficiency || 'Beginner';
    const levelMap: Record<string, number> = { Beginner: 30, Intermediate: 60, Advanced: 80, Expert: 95 };
    const cur = typeof skill.currentLevel === 'number' ? skill.currentLevel : (levelMap[proficiency] || 50);
    const req = typeof skill.requiredLevel === 'number' ? skill.requiredLevel : 85;
    const newSkill: SkillItem = {
      ...skill,
      id: 'skill-' + Date.now(),
      proficiency,
      currentLevel: cur,
      requiredLevel: req,
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
    const levelMap: Record<string, number> = { Beginner: 30, Intermediate: 60, Advanced: 80, Expert: 95 };
    const updatedSkills = currentSkills.map((s) => {
      if (s.id === id) {
        const merged = { ...s, ...updated };
        if (updated.proficiency && updated.currentLevel === undefined) {
          merged.currentLevel = levelMap[updated.proficiency] || merged.currentLevel || 50;
        }
        const r = typeof merged.requiredLevel === 'number' ? merged.requiredLevel : 85;
        const c = typeof merged.currentLevel === 'number' ? merged.currentLevel : 50;
        merged.gap = r - c;
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

  // Own Skill Up Management Methods
  const addOwnSkillUp = (item: Omit<SkillGoal, 'id'>) => {
    if (!user) return;
    const currentGoals = user.studentProfile.ownSkillUp || [];
    const newGoal: SkillGoal = {
      ...item,
      id: 'skillup-' + Date.now(),
      skill: item.skill || (item as any).name || '',
      name: item.skill || (item as any).name || '',
    };
    updateProfile({
      ownSkillUp: [newGoal, ...currentGoals],
    });
  };

  const updateOwnSkillUp = (id: string, updated: Partial<SkillGoal>) => {
    if (!user) return;
    const currentGoals = user.studentProfile.ownSkillUp || [];
    const updatedGoals = currentGoals.map((g) => {
      if (g.id === id) {
        const merged = { ...g, ...updated };
        if (updated.name && !updated.skill) {
          merged.skill = updated.name;
        } else if (updated.skill && !updated.name) {
          merged.name = updated.skill;
        }
        return merged;
      }
      return g;
    });
    updateProfile({
      ownSkillUp: updatedGoals,
    });
  };

  const deleteOwnSkillUp = (id: string) => {
    if (!user) return;
    const currentGoals = user.studentProfile.ownSkillUp || [];
    updateProfile({
      ownSkillUp: currentGoals.filter((g) => g.id !== id),
    });
  };

  // Project Management Methods
  const addProject = (project: Omit<ProjectItem, 'id'>) => {
    if (!user) return;
    const currentProjects = user.studentProfile.projects || [];
    const titleVal = project.title || project.name || 'Untitled Project';
    const newProject: ProjectItem = {
      ...project,
      id: 'proj-' + Date.now(),
      title: titleVal,
      name: titleVal,
      status: project.status || 'Idea',
      technologies: project.technologies || project.techStack || [],
      techStack: project.technologies || project.techStack || [],
      skillsUsed: project.skillsUsed || project.skillsCovered || [],
      skillsCovered: project.skillsUsed || project.skillsCovered || [],
      githubUrl: project.githubUrl || project.githubLink,
      githubLink: project.githubUrl || project.githubLink,
      demoUrl: project.demoUrl || project.projectLink,
      projectLink: project.demoUrl || project.projectLink,
    };
    updateProfile({
      projects: [newProject, ...currentProjects],
    });
  };

  const updateProject = (id: string, updated: Partial<ProjectItem>) => {
    if (!user) return;
    const currentProjects = user.studentProfile.projects || [];
    const updatedProjects = currentProjects.map((p) => {
      if (p.id === id) {
        const titleVal = updated.title || updated.name || p.title || p.name || 'Untitled Project';
        const merged: ProjectItem = {
          ...p,
          ...updated,
          title: titleVal,
          name: titleVal,
          technologies: updated.technologies || updated.techStack || p.technologies || p.techStack || [],
          skillsUsed: updated.skillsUsed || updated.skillsCovered || p.skillsUsed || p.skillsCovered || [],
          githubUrl: updated.githubUrl !== undefined ? updated.githubUrl : (updated.githubLink !== undefined ? updated.githubLink : p.githubUrl),
          githubLink: updated.githubLink !== undefined ? updated.githubLink : (updated.githubUrl !== undefined ? updated.githubUrl : p.githubLink),
          demoUrl: updated.demoUrl !== undefined ? updated.demoUrl : (updated.projectLink !== undefined ? updated.projectLink : p.demoUrl),
          projectLink: updated.projectLink !== undefined ? updated.projectLink : (updated.demoUrl !== undefined ? updated.demoUrl : p.projectLink),
        };
        return merged;
      }
      return p;
    });
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

  // Dynamic Career management
  const setCareerGoal = (goal: { targetRole: string; industryDomain?: string; timeline?: string; notes?: string }) => {
    if (!user) return;
    const now = new Date().toISOString().split('T')[0];
    const prevDetails = user.studentProfile.careerGoalDetails;
    const targetRole = goal.targetRole.trim();
    const existingGoals = user.studentProfile.careerGoals || (user.studentProfile.targetCareer ? [user.studentProfile.targetCareer] : []);
    const updatedGoals = existingGoals.includes(targetRole)
      ? existingGoals
      : [targetRole, ...existingGoals.filter(Boolean)];

    const newDetails: CareerGoal = {
      ...prevDetails,
      targetRole,
      careerGoals: updatedGoals,
      industryDomain: goal.industryDomain?.trim() || '',
      timeline: goal.timeline?.trim() || '',
      notes: goal.notes?.trim() || '',
      setAt: prevDetails?.setAt || now,
      updatedAt: now,
    };
    updateProfile({
      targetCareer: targetRole,
      careerGoals: updatedGoals,
      careerGoalDetails: newDetails,
      careerGoal: {
        targetRole,
        careerGoals: updatedGoals,
      },
    });
  };

  const addCareerGoal = (goal: string) => {
    if (!user) return;
    const trimmed = goal.trim();
    if (!trimmed) return;
    const current = user.studentProfile.careerGoals || (user.studentProfile.targetCareer ? [user.studentProfile.targetCareer] : []);
    if (current.some(g => g.toLowerCase() === trimmed.toLowerCase())) return;
    const updated = [...current, trimmed];
    updateProfile({
      careerGoals: updated,
      targetCareer: user.studentProfile.targetCareer || trimmed,
    });
  };

  const removeCareerGoal = (goal: string) => {
    if (!user) return;
    const current = user.studentProfile.careerGoals || (user.studentProfile.targetCareer ? [user.studentProfile.targetCareer] : []);
    const updated = current.filter((g) => g.toLowerCase() !== goal.toLowerCase());
    const newTarget = updated.length > 0 ? (updated.includes(user.studentProfile.targetCareer) ? user.studentProfile.targetCareer : updated[0]) : '';
    updateProfile({
      careerGoals: updated,
      targetCareer: newTarget,
    });
  };

  const setCareerGoals = (goals: string[]) => {
    if (!user) return;
    const cleaned = goals.map((g) => g.trim()).filter(Boolean);
    const newTarget = cleaned.length > 0 ? (cleaned.includes(user.studentProfile.targetCareer) ? user.studentProfile.targetCareer : cleaned[0]) : '';
    updateProfile({
      careerGoals: cleaned,
      targetCareer: newTarget,
    });
  };

  const clearCareerGoal = () => {
    if (!user) return;
    updateProfile({
      targetCareer: '',
      careerGoals: [],
      careerGoalDetails: undefined,
      careerGoal: undefined,
    });
  };

  // Dynamic Resume management
  const uploadResume = (info: ResumeInfo) => {
    if (!user) return;
    updateProfile({
      resumeInfo: info,
    });
  };

  const removeResume = () => {
    if (!user) return;
    updateProfile({
      resumeInfo: null,
    });
  };

  // Dynamic Roadmap management
  const calculateStageMetrics = (tasks: RoadmapTask[]) => {
    if (tasks.length === 0) return { progress: 0, status: 'Not Started' as const };
    const completedCount = tasks.filter((t) => t.status === 'Completed' || t.completed).length;
    const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
    const progress = Math.round((completedCount / tasks.length) * 100);
    const status =
      progress === 100
        ? ('Completed' as const)
        : completedCount > 0 || inProgressCount > 0
        ? ('In Progress' as const)
        : ('Not Started' as const);
    return { progress, status };
  };

  const addRoadmapStage = (stage: Omit<RoadmapStage, 'id' | 'number'>) => {
    if (!user) return;
    const currentStages = user.studentProfile.roadmapStages || [];
    const normalizedTasks: RoadmapTask[] = (stage.tasks || []).map((t, idx) => ({
      ...t,
      id: t.id || `task-${Date.now()}-${idx}`,
      status: t.status || (t.completed ? 'Completed' : 'Not Started'),
      completed: t.status === 'Completed' || Boolean(t.completed),
    }));
    const { progress, status } = calculateStageMetrics(normalizedTasks);
    const newStage: RoadmapStage = {
      ...stage,
      id: 'stage-' + Date.now(),
      number: currentStages.length + 1,
      tasks: normalizedTasks,
      progress,
      status: stage.status || status,
    };
    updateProfile({
      roadmapStages: [...currentStages, newStage],
    });
  };

  const updateRoadmapStage = (stageId: string, updated: Partial<RoadmapStage>) => {
    if (!user) return;
    const currentStages = user.studentProfile.roadmapStages || [];
    const updatedStages = currentStages.map((s) => {
      if (s.id === stageId) {
        const tasks = updated.tasks !== undefined ? updated.tasks : s.tasks;
        const metrics = calculateStageMetrics(tasks);
        return {
          ...s,
          ...updated,
          tasks,
          progress: updated.progress !== undefined ? updated.progress : metrics.progress,
          status: updated.status !== undefined ? updated.status : metrics.status,
        };
      }
      return s;
    });
    updateProfile({ roadmapStages: updatedStages });
  };

  const deleteRoadmapStage = (stageId: string) => {
    if (!user) return;
    const currentStages = user.studentProfile.roadmapStages || [];
    const filtered = currentStages
      .filter((s) => s.id !== stageId)
      .map((s, idx) => ({ ...s, number: idx + 1 }));
    updateProfile({ roadmapStages: filtered });
  };

  const addRoadmapTask = (stageId: string, task: Omit<RoadmapTask, 'id' | 'completed'> & { completed?: boolean }) => {
    if (!user) return;
    const currentStages = user.studentProfile.roadmapStages || [];
    const updatedStages = currentStages.map((s) => {
      if (s.id === stageId) {
        const newTask: RoadmapTask = {
          ...task,
          id: 'task-' + Date.now(),
          status: task.status || (task.completed ? 'Completed' : 'Not Started'),
          completed: task.status === 'Completed' || Boolean(task.completed),
        };
        const newTasks = [...s.tasks, newTask];
        const metrics = calculateStageMetrics(newTasks);
        return {
          ...s,
          tasks: newTasks,
          progress: metrics.progress,
          status: metrics.status,
        };
      }
      return s;
    });
    updateProfile({ roadmapStages: updatedStages });
  };

  const updateRoadmapTask = (stageId: string, taskId: string, updated: Partial<RoadmapTask>) => {
    if (!user) return;
    const currentStages = user.studentProfile.roadmapStages || [];
    const updatedStages = currentStages.map((s) => {
      if (s.id === stageId) {
        const updatedTasks = s.tasks.map((t) => {
          if (t.id === taskId) {
            const nextStatus =
              updated.status !== undefined
                ? updated.status
                : updated.completed !== undefined
                ? updated.completed
                  ? 'Completed'
                  : 'Not Started'
                : t.status;
            return {
              ...t,
              ...updated,
              status: nextStatus,
              completed: nextStatus === 'Completed',
            };
          }
          return t;
        });
        const metrics = calculateStageMetrics(updatedTasks);
        return {
          ...s,
          tasks: updatedTasks,
          progress: metrics.progress,
          status: metrics.status,
        };
      }
      return s;
    });
    updateProfile({ roadmapStages: updatedStages });
  };

  const deleteRoadmapTask = (stageId: string, taskId: string) => {
    if (!user) return;
    const currentStages = user.studentProfile.roadmapStages || [];
    const updatedStages = currentStages.map((s) => {
      if (s.id === stageId) {
        const filteredTasks = s.tasks.filter((t) => t.id !== taskId);
        const metrics = calculateStageMetrics(filteredTasks);
        return {
          ...s,
          tasks: filteredTasks,
          progress: metrics.progress,
          status: metrics.status,
        };
      }
      return s;
    });
    updateProfile({ roadmapStages: updatedStages });
  };

  const toggleRoadmapTask = (
    stageId: string,
    taskId: string,
    targetStatus?: 'Not Started' | 'In Progress' | 'Completed'
  ) => {
    if (!user) return;
    const currentStages = user.studentProfile.roadmapStages || [];
    const updatedStages = currentStages.map((s) => {
      if (s.id === stageId) {
        const updatedTasks = s.tasks.map((t) => {
          if (t.id === taskId) {
            let nextStatus: 'Not Started' | 'In Progress' | 'Completed';
            if (targetStatus) {
              nextStatus = targetStatus;
            } else {
              // Cycle: Not Started -> In Progress -> Completed -> Not Started
              if (t.status === 'Not Started') nextStatus = 'In Progress';
              else if (t.status === 'In Progress') nextStatus = 'Completed';
              else nextStatus = 'Not Started';
            }
            return {
              ...t,
              status: nextStatus,
              completed: nextStatus === 'Completed',
            };
          }
          return t;
        });
        const metrics = calculateStageMetrics(updatedTasks);
        return {
          ...s,
          tasks: updatedTasks,
          progress: metrics.progress,
          status: metrics.status,
        };
      }
      return s;
    });
    updateProfile({ roadmapStages: updatedStages });
  };

  const initializeDefaultRoadmap = (roleTitle?: string) => {
    if (!user) return;
    const target = roleTitle || user.studentProfile.targetCareer || 'Engineering Specialization';
    const defaultStages: RoadmapStage[] = [
      {
        id: 'stage-init-1',
        number: 1,
        title: 'Academic & Programming Foundations',
        status: 'In Progress',
        progress: 33,
        estimatedEffort: '2-3 Months',
        description: `Master core programming, computational structures, and mathematics essential for ${target}.`,
        skills: ['Data Structures', 'Core Programming', 'Algorithms'],
        tasks: [
          { id: 't-init-1', title: 'Data Structures & Algorithmic Problem Solving', type: 'Skill', status: 'Completed', completed: true, estHours: 40 },
          { id: 't-init-2', title: 'Foundational Programming Language Mastery', type: 'Course', status: 'In Progress', completed: false, estHours: 35 },
          { id: 't-init-3', title: 'Build CLI or System Utility Application', type: 'Project', status: 'Not Started', completed: false, estHours: 20 },
        ],
      },
      {
        id: 'stage-init-2',
        number: 2,
        title: `${target} Core Competencies`,
        status: 'Not Started',
        progress: 0,
        estimatedEffort: '3-4 Months',
        description: `Develop specialized domain skills and hands-on engineering workflows for ${target}.`,
        skills: ['Domain Specialization', 'System Design', 'Modern Frameworks'],
        tasks: [
          { id: 't-init-4', title: `Study Core Paradigms & Industry Tooling for ${target}`, type: 'Course', status: 'Not Started', completed: false, estHours: 45 },
          { id: 't-init-5', title: 'Implement First End-to-End Specialization Project', type: 'Project', status: 'Not Started', completed: false, estHours: 50 },
        ],
      },
      {
        id: 'stage-init-3',
        number: 3,
        title: 'Portfolio, Placement & Industry Readiness',
        status: 'Not Started',
        progress: 0,
        estimatedEffort: '2 Months',
        description: 'Complete capstone project, refine resume, and practice technical and domain problem solving.',
        skills: ['Portfolio Building', 'Resume Refinement', 'Interview Preparation'],
        tasks: [
          { id: 't-init-6', title: 'Upload & Align Tailored Career Resume', type: 'Certification', status: 'Not Started', completed: false, estHours: 10 },
          { id: 't-init-7', title: 'Deploy Production-Grade Capstone Project to Public Repository', type: 'Project', status: 'Not Started', completed: false, estHours: 40 },
        ],
      },
    ];
    updateProfile({ roadmapStages: defaultStages });
  };

  const resetToDemoStudent = () => {
    const guestUser = getSampleGuestUser();
    persistUser(guestUser);
  };

  const contextValue = useMemo(
    () => ({
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
      updateSemester,
      deleteSemester,
      setCurrentSemester,
      addSyllabusItem,
      updateSyllabusItem,
      deleteSyllabusItem,
      addSkill,
      updateSkill,
      deleteSkill,
      addOwnSkillUp,
      updateOwnSkillUp,
      deleteOwnSkillUp,
      addProject,
      updateProject,
      deleteProject,
      setCareerGoal,
      addCareerGoal,
      removeCareerGoal,
      setCareerGoals,
      clearCareerGoal,
      uploadResume,
      removeResume,
      addRoadmapStage,
      updateRoadmapStage,
      deleteRoadmapStage,
      addRoadmapTask,
      updateRoadmapTask,
      deleteRoadmapTask,
      toggleRoadmapTask,
      initializeDefaultRoadmap,
      resetToDemoStudent,
    }),
    [user, loading, isGuest]
  );

  return (
    <AuthContext.Provider value={contextValue}>
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
