import { SubjectPerformance, SkillItem, ProjectItem, SkillGoal, CollegeSyllabusItem } from '../../data/mockData';

export interface OnboardingData {
  // Step 1: Personal
  fullName: string;
  email: string;
  phone: string;
  avatar: string;

  // Step 2: Institution
  collegeName: string;
  universityName: string;
  rollNumber: string;
  collegeStudentId: string;
  universityRegNumber: string;

  // Step 3: Academic
  degree: string;
  customDegree?: string;
  department: string;
  customDepartment?: string;
  currentYear: string;
  currentSemester: number;
  totalSemesters: number;
  admissionYear: string;
  expectedGraduationYear: string;

  // Step 4: Subjects & Syllabus
  subjects: SubjectPerformance[];
  syllabus: CollegeSyllabusItem[];
  syllabusChoice: 'undecided' | 'later' | 'added';

  // Step 5: Skills & Own Skill Up
  skills: SkillItem[];
  ownSkillUp: SkillGoal[];

  // Step 6: Projects
  projects: ProjectItem[];

  // Step 7: Career Goal
  targetCareer: string;
  customCareer: string;
}
