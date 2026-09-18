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
}

export interface StudentRegistrationParams {
  // Step 1: Personal
  name: string;
  email?: string;
  password?: string;
  phone?: string;
  avatar?: string;

  // Step 2: Institution
  collegeName?: string;
  universityName: string;
  universityRollNumber: string;
  courseDegree: string;
  branchDepartment: string;
  currentYear?: string | number;
  currentSemester: number;
  collegeStudentId?: string;
  universityRegistrationNumber?: string;
  admissionYear?: string | number;
  expectedGraduationYear?: string | number;

  // Step 3: Academic
  totalSemesters?: number;
  subjects?: SubjectPerformance[];
  semesters?: AcademicSemester[];

  // Step 4: Skills
  skills?: SkillItem[];

  // Step 5: Projects
  projects?: ProjectItem[];

  // Step 6: Career Goal
  targetCareer: string;
  customCareerGoal?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (rollNumber: string, password?: string) => Promise<boolean>;
  signup: (params: StudentRegistrationParams) => Promise<boolean>;
  logout: () => Promise<void>;
  demoLogin: () => Promise<void>;
  updateProfile: (profile: Partial<StudentProfile>) => void;
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

const getInitialDemoUser = (): User => {
  return {
    uid: mockStudent.id,
    rollNumber: mockStudent.rollNumber,
    email: mockStudent.email,
    displayName: mockStudent.name,
    photoURL: mockStudent.avatar,
    studentProfile: {
      ...mockStudent,
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

  // Helper to persist user and update student db
  const persistUser = (updatedUser: User | null) => {
    setUser(updatedUser);
    if (updatedUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
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
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed: User = JSON.parse(stored);
        setUser(parsed);
      } else {
        // No active session: keep user null so unauthenticated users see login/signup
        setUser(null);
      }
    } catch (e) {
      console.error('Error loading auth session', e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

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

    // Check local student database
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

    // Support internal demo testing credentials if explicitly requested
    if (!profileToLoad) {
      if (upperId === '22CS084' || upperId === mockStudent.rollNumber.toUpperCase()) {
        profileToLoad = {
          ...mockStudent,
          semesters: [...mockAcademicSemesters],
          subjects: [...mockSubjectPerformances],
          skills: [...mockSkills],
          projects: [...mockProjects],
        };
      }
    }

    if (!profileToLoad) {
      setLoading(false);
      throw new Error(`No student account found for Roll Number "${identifier}". Please create an account.`);
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
      studentProfile: profileToLoad,
    };

    persistUser(loggedUser);
    setLoading(false);
    return true;
  };

  const signup = async (params: StudentRegistrationParams): Promise<boolean> => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const rollNo = params.universityRollNumber.trim().toUpperCase();
    const email = params.email?.trim() || `${rollNo.toLowerCase()}@${params.universityName.toLowerCase().replace(/[^a-z]/g, '') || 'university'}.edu`;
    const degree = params.courseDegree.trim();
    const department = params.branchDepartment.trim();
    const currentSem = Number(params.currentSemester) || 1;
    const finalCareer =
      params.targetCareer === 'Other' && params.customCareerGoal
        ? params.customCareerGoal.trim()
        : params.targetCareer.trim();

    const subjects = params.subjects || [];
    const semesters = params.semesters || [];
    const skills = params.skills || [];
    const projects = params.projects || [];

    // Calculated metrics
    const calculatedSgpa = calculateSGPA(subjects);
    const calculatedCgpa = calculateCGPA(semesters);
    const calculatedReadiness = calculateReadinessScore(skills);

    const institution: Institution = {
      collegeName: params.collegeName?.trim() || params.universityName.trim(),
      universityName: params.universityName.trim(),
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
      avatar: params.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(rollNo)}`,
      college: params.collegeName?.trim() || params.universityName.trim(),
      university: params.universityName.trim(),
      department,
      degree,
      graduationYear: params.expectedGraduationYear
        ? Number(params.expectedGraduationYear)
        : new Date().getFullYear() + Math.max(1, 4 - Math.floor(currentSem / 2)),
      currentYear: params.currentYear || Math.ceil(currentSem / 2),
      currentSemester: currentSem,
      totalSemesters: params.totalSemesters || 8,

      institution,
      academic,
      careerGoal,
      progress,

      cgpa: calculatedCgpa || undefined,
      targetCgpa: 9.0,
      targetCareer: finalCareer,
      secondaryTargetCareer: 'Software Engineer',
      readinessScore: calculatedReadiness || undefined,
      skillScore: calculatedReadiness || undefined,
      learningStreakDays: 1,
      totalHoursStudied: 0,
      bio: `Student at ${params.collegeName || params.universityName}, enrolled in ${degree} (${department}). Target Career: ${finalCareer}.`,
      semesters,
      subjects,
      skills,
      projects,
    };

    const newUser: User = {
      uid: newProfile.id,
      rollNumber: newProfile.rollNumber,
      email: newProfile.email,
      displayName: newProfile.name,
      photoURL: newProfile.avatar,
      studentProfile: newProfile,
    };

    persistUser(newUser);
    setLoading(false);
    return true;
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 200));
    persistUser(null);
    setLoading(false);
  };

  const demoLogin = async (): Promise<void> => {
    const demoUser = getInitialDemoUser();
    persistUser(demoUser);
  };

  const updateProfile = (updatedFields: Partial<StudentProfile>) => {
    if (!user) return;
    const current = user.studentProfile || mockStudent;
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
    const demoUser = getInitialDemoUser();
    persistUser(demoUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        demoLogin,
        updateProfile,
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
