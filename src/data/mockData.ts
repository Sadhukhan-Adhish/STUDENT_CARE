export interface Institution {
  collegeName: string;
  universityName: string;
  universityRollNumber: string;
  courseDegree: string;
  branchDepartment: string;
  currentYear: string | number;
  currentSemester: number;
  // Optional institution fields
  collegeStudentId?: string;
  universityRegistrationNumber?: string;
  admissionYear?: string | number;
  expectedGraduationYear?: string | number;
}

export interface SyllabusTopic {
  id: string;
  title: string;
  unitOrModule?: string;
  completed?: boolean;
}

export interface Subject {
  id?: string;
  code?: string;
  name: string;
  credits?: number;
  semester?: number | string; // e.g. 1-8 or "Semester 3"
  semesterNumber?: number;
  // Optional academic fields
  marks?: number;
  internalMarks?: number;
  externalMarks?: number;
  totalMarks?: number;
  grade?: string;
  score?: number;
  attendance?: number;
  category?: 'Core' | 'Elective' | 'Lab' | 'Math' | string;
  status?: 'Strong' | 'Average' | 'Needs Improvement';
  topics?: string[];
}

export type SubjectPerformance = Subject;

export interface Semester {
  semester: string; // e.g. "Semester 1" or "Sem 1"
  semesterNumber?: number;
  sgpa?: number;
  cgpa?: number;
  credits: number;
  completed?: boolean;
}

export type AcademicSemester = Semester;

export interface AcademicProfile {
  currentSemester: number;
  totalSemesters: number;
  semesters: Semester[];
  subjects: Subject[];
  cgpa?: number;
  sgpa?: number;
  totalCredits?: number;
}

export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface Skill {
  id: string;
  name: string;
  proficiency?: SkillProficiency;
  currentLevel: number; // 0 - 100
  score?: number;
  certification?: string;
  experience?: string;
  category?: 'Programming' | 'AI & ML' | 'Databases & Web' | 'DevOps & Tools' | string;
  requiredLevel?: number; // 0 - 100
  gap?: number; // positive = deficit
  priority?: 'High' | 'Medium' | 'Low';
  action?: string;
  trend?: 'up' | 'stable' | 'down';
}

export type SkillItem = Skill;

export type ProjectStatus = 'Idea' | 'In Progress' | 'Completed' | 'Planned' | 'Recommended';

export interface Project {
  id: string;
  title: string;
  name?: string;
  tagline?: string;
  description?: string;
  technologies: string[];
  techStack?: string[];
  skillsUsed?: string[];
  skillsCovered?: string[];
  skillGapAddressed?: string;
  status: ProjectStatus;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  progress?: number;
  estimatedHours?: number;
  githubLink?: string;
  githubUrl?: string;
  projectLink?: string;
  demoUrl?: string;
  category?: 'Machine Learning' | 'Full Stack' | 'Cloud & Systems' | 'Computer Vision' | 'AI / ML' | 'Distributed Systems' | 'DevOps & Cloud' | string;
}

export interface CareerGoal {
  targetRole: string;
  targetRoles?: string[];
  careerGoals?: string[];
  customRole?: string;
  secondaryRole?: string;
  industryTrack?: string;
  industryDomain?: string;
  timeline?: string;
  notes?: string;
  setAt?: string;
  updatedAt?: string;
}

export interface ResumeInfo {
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadedAt: string;
  fileData?: string; // Data URL or text representation
  notes?: string;
}

export interface SkillGoal {
  id: string;
  skill: string;
  name?: string;
  currentLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  targetLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  reason?: string;
  category?: string;
}

export type OwnSkillUpItem = SkillGoal;

export interface CollegeSyllabusItem {
  id: string;
  semester: number;
  courseOrDegree?: string;
  branchOrProgram?: string;
  subjectName?: string;
  subjectCode?: string;
  topics?: string[];
  title?: string;
  fileName?: string;
  fileSize?: string;
  uploadedAt?: string;
  notes?: string;
}

export interface Progress {
  learningStreakDays: number;
  totalHoursStudied: number;
  completedRoadmapTasks?: number;
  totalRoadmapTasks?: number;
  badgesUnlocked?: number;
}

export interface StudentProfile {
  id: string;
  rollNumber: string; // University Roll Number (Primary Student ID)
  name: string;
  email: string;
  password?: string;
  avatar: string;
  college?: string;
  university: string;
  degree: string;
  department: string;
  graduationYear: number;
  admissionYear?: number;
  collegeStudentId?: string;
  universityRegistrationNumber?: string;
  currentYear?: string | number;
  currentSemester: number;
  totalSemesters?: number;

  // Onboarding status & telemetry
  onboardingCompleted?: boolean;
  onboardingStep?: number;

  // Structured modular sub-profiles
  institution?: Institution;
  academic?: AcademicProfile;
  careerGoal?: CareerGoal;
  progress?: Progress;

  // Direct access fields for existing dashboard compatibility
  cgpa?: number;
  sgpa?: number;
  targetCgpa?: number;
  targetCareer: string;
  careerGoals?: string[];
  secondaryTargetCareer?: string;
  readinessScore?: number;
  skillScore?: number;
  learningStreakDays?: number;
  totalHoursStudied?: number;
  phone?: string;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  semesters?: AcademicSemester[];
  subjects?: SubjectPerformance[];
  skills?: SkillItem[];
  ownSkillUp?: SkillGoal[];
  projects?: ProjectItem[];
  syllabus?: CollegeSyllabusItem[];
  careerGoalDetails?: CareerGoal;
  resumeInfo?: ResumeInfo | null;
  roadmapStages?: RoadmapStage[];
}

export interface CareerPath {
  id: string;
  title: string;
  matchScore: number;
  avgSalaryRange: string;
  openingsGrowth: string;
  description: string;
  requiredSkills: string[];
  userStrengths: string[];
  missingSkills: string[];
  suggestedProjects: string[];
  targetCompanies: string[];
}

export interface RoadmapTask {
  id: string;
  title: string;
  type?: 'Skill' | 'Project' | 'Course' | 'Certification' | 'General';
  status: 'Not Started' | 'In Progress' | 'Completed';
  completed: boolean;
  estHours?: number;
  notes?: string;
  dueDate?: string;
}

export interface RoadmapStage {
  id: string;
  number: number;
  title: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Upcoming';
  progress: number;
  estimatedEffort?: string;
  description?: string;
  skills?: string[];
  tasks: RoadmapTask[];
}

export type ProjectItem = Project;

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'Streak' | 'Skill' | 'Project' | 'Academic';
}

export const mockStudent: StudentProfile = {
  id: 'unx-clean-student',
  rollNumber: '',
  name: 'Student',
  email: '',
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Student',
  college: '',
  university: '',
  degree: '',
  department: '',
  graduationYear: undefined,
  currentSemester: 1,
  cgpa: 0,
  targetCgpa: undefined,
  targetCareer: '',
  careerGoals: [],
  secondaryTargetCareer: '',
  readinessScore: 0,
  skillScore: 0,
  learningStreakDays: 0,
  totalHoursStudied: 0,
  phone: '',
  bio: '',
  githubUrl: '',
  linkedinUrl: '',
  semesters: [],
  subjects: [],
  skills: [],
  ownSkillUp: [],
  projects: [],
  syllabus: [],
  roadmapStages: [],
  careerGoalDetails: undefined,
  resumeInfo: undefined,
};

export const sampleGuestStudent: StudentProfile = mockStudent;

export const mockAcademicSemesters: AcademicSemester[] = [
  { semester: 'Sem 1', sgpa: 8.2, cgpa: 8.2, credits: 21 },
  { semester: 'Sem 2', sgpa: 8.45, cgpa: 8.32, credits: 22 },
  { semester: 'Sem 3', sgpa: 8.9, cgpa: 8.51, credits: 24 },
  { semester: 'Sem 4', sgpa: 8.65, cgpa: 8.55, credits: 23 },
  { semester: 'Sem 5', sgpa: 9.1, cgpa: 8.68, credits: 25 },
  { semester: 'Sem 6 (Current)', sgpa: 9.25, cgpa: 8.72, credits: 24 },
];

export const mockSubjectPerformances: SubjectPerformance[] = [
  { code: 'CS301', name: 'Design & Analysis of Algorithms', credits: 4, grade: 'A+', score: 94, attendance: 95, category: 'Core', status: 'Strong' },
  { code: 'CS302', name: 'Database Management Systems', credits: 4, grade: 'A', score: 88, attendance: 92, category: 'Core', status: 'Strong' },
  { code: 'CS303', name: 'Machine Learning Fundamentals', credits: 4, grade: 'A+', score: 96, attendance: 98, category: 'Core', status: 'Strong' },
  { code: 'CS304', name: 'Computer Networks & Protocols', credits: 3, grade: 'B+', score: 78, attendance: 82, category: 'Core', status: 'Average' },
  { code: 'CS305', name: 'Embedded Systems & Microprocessors', credits: 3, grade: 'B', score: 71, attendance: 74, category: 'Core', status: 'Needs Improvement' },
  { code: 'CS306', name: 'Cloud Computing & Distributed Systems', credits: 3, grade: 'A', score: 87, attendance: 90, category: 'Elective', status: 'Strong' },
  { code: 'MA301', name: 'Probability, Statistics & Stochastic Models', credits: 3, grade: 'A', score: 89, attendance: 93, category: 'Math', status: 'Strong' },
];

export const mockSkills: SkillItem[] = [
  { id: '1', name: 'Python', category: 'Programming', proficiency: 'Advanced', currentLevel: 82, requiredLevel: 90, gap: 8, priority: 'High', action: 'Complete Advanced Async & Memory Profiling', trend: 'up' },
  { id: '2', name: 'C++', category: 'Programming', proficiency: 'Intermediate', currentLevel: 64, requiredLevel: 75, gap: 11, priority: 'Medium', action: 'Practice STL & Concurrency algorithms', trend: 'stable' },
  { id: '3', name: 'Machine Learning', category: 'AI & ML', proficiency: 'Advanced', currentLevel: 78, requiredLevel: 85, gap: 7, priority: 'High', action: 'Implement End-to-End Ensemble Pipeline', trend: 'up' },
  { id: '4', name: 'PyTorch / Deep Learning', category: 'AI & ML', proficiency: 'Intermediate', currentLevel: 52, requiredLevel: 80, gap: 28, priority: 'High', action: 'Build Transformer attention mechanisms', trend: 'up' },
  { id: '5', name: 'SQL & Database Design', category: 'Databases & Web', proficiency: 'Advanced', currentLevel: 74, requiredLevel: 80, gap: 6, priority: 'Medium', action: 'Study index optimization & CTEs', trend: 'stable' },
  { id: '6', name: 'React & Modern Frontend', category: 'Databases & Web', proficiency: 'Intermediate', currentLevel: 68, requiredLevel: 65, gap: -3, priority: 'Low', action: 'Sufficient for target ML dashboard role', trend: 'stable' },
  { id: '7', name: 'Docker & Containerization', category: 'DevOps & Tools', proficiency: 'Beginner', currentLevel: 42, requiredLevel: 70, gap: 28, priority: 'High', action: 'Containerize multi-container ML FastAPI apps', trend: 'up' },
  { id: '8', name: 'Git & GitHub', category: 'DevOps & Tools', proficiency: 'Advanced', currentLevel: 85, requiredLevel: 85, gap: 0, priority: 'Low', action: 'Branching, PRs & CI/CD workflows', trend: 'stable' },
];

export const mockOwnSkillUp: SkillGoal[] = [
  {
    id: 'skillup-1',
    skill: 'Machine Learning',
    currentLevel: 'Beginner',
    targetLevel: 'Advanced',
    reason: 'I want to improve my ML skills and build real-world models.',
  },
  {
    id: 'skillup-2',
    skill: 'Deep Learning',
    currentLevel: 'Beginner',
    targetLevel: 'Intermediate',
    reason: 'Understand neural network architectures and transformer mechanisms.',
  },
  {
    id: 'skillup-3',
    skill: 'Docker',
    currentLevel: 'Beginner',
    targetLevel: 'Advanced',
    reason: 'Containerize production FastAPI services for scalable deployment.',
  },
];

export const mockCareerPaths: CareerPath[] = [
  {
    id: 'career-ml-eng',
    title: 'Machine Learning Engineer',
    matchScore: 78,
    avgSalaryRange: '$125,000 - $165,000 / yr',
    openingsGrowth: '+34% YoY',
    description: 'Design, train, optimize, and deploy predictive and deep learning models into production systems with high throughput and low latency.',
    requiredSkills: ['Python', 'PyTorch/TensorFlow', 'MLOps', 'Docker', 'SQL', 'FastAPI', 'Distributed Training'],
    userStrengths: ['Python (82%)', 'Algorithms (A+)', 'Statistics (89%)', 'Scikit-Learn (78%)'],
    missingSkills: ['MLOps Deployment (35%)', 'PyTorch Advanced (52%)', 'Docker & Kubernetes (42%)'],
    suggestedProjects: ['End-to-End Landslide Risk Prediction', 'Real-time Object Detection with ONNX', 'LLM RAG Pipeline with Vector Search'],
    targetCompanies: ['DeepMind', 'OpenAI', 'Databricks', 'Scale AI', 'Stripe', 'NVIDIA'],
  },
  {
    id: 'career-swe-backend',
    title: 'Full Stack & Backend Systems Engineer',
    matchScore: 84,
    avgSalaryRange: '$110,000 - $150,000 / yr',
    openingsGrowth: '+22% YoY',
    description: 'Architect scalable web services, microservices, high-concurrency database queries, and interactive web client interfaces.',
    requiredSkills: ['Python / Go', 'SQL & Postgres', 'React / TypeScript', 'Docker', 'System Design', 'REST & gRPC'],
    userStrengths: ['DBMS (A)', 'Algorithms (A+)', 'SQL (74%)', 'React (68%)'],
    missingSkills: ['System Design at Scale', 'gRPC & Microservices', 'CI/CD Pipelines'],
    suggestedProjects: ['High-Throughput Analytics Dashboard', 'Distributed Task Queue in Redis', 'Career Intelligence Platform'],
    targetCompanies: ['Google', 'Microsoft', 'Atlassian', 'Uber', 'Amazon', 'Cloudflare'],
  },
  {
    id: 'career-data-scientist',
    title: 'Data Scientist / AI Researcher',
    matchScore: 81,
    avgSalaryRange: '$115,000 - $155,000 / yr',
    openingsGrowth: '+26% YoY',
    description: 'Leverage statistical modeling, experiment design, hypothesis testing, and machine learning to extract actionable intelligence from complex datasets.',
    requiredSkills: ['Python', 'R / Julia', 'Statistical Inference', 'Tableau / PowerBI', 'Scikit-Learn', 'Feature Engineering'],
    userStrengths: ['Statistics & Probability (89%)', 'Python (82%)', 'Academic Foundation & Algorithms'],
    missingSkills: ['A/B Testing Frameworks', 'Big Data (Spark/Hadoop)', 'Advanced Causal Inference'],
    suggestedProjects: ['Academic Performance Predictive Engine', 'Financial Fraud Anomaly Detector'],
    targetCompanies: ['Meta', 'Netflix', 'Palantir', 'Two Sigma', 'Bloomberg'],
  },
];

export const mockRoadmapStages: RoadmapStage[] = [
  {
    id: 'stage-1',
    number: 1,
    title: 'Foundation & Core Fundamentals',
    status: 'Completed',
    progress: 100,
    estimatedEffort: '3 Months',
    description: 'Solidify foundational computer science, discrete mathematics, object-oriented concepts, and computational problem solving.',
    skills: ['C++', 'Python Basics', 'Data Structures', 'Discrete Mathematics', 'Linux Shell'],
    tasks: [
      { id: 't1', title: 'Master Array, Linked List, Tree & Graph Traversals', type: 'Skill', status: 'Completed', completed: true, estHours: 40 },
      { id: 't2', title: 'Complete 100 LeetCode Medium Problems', type: 'Course', status: 'Completed', completed: true, estHours: 60 },
      { id: 't3', title: 'Implement Custom Memory Allocator in C++', type: 'Project', status: 'Completed', completed: true, estHours: 25 },
    ],
  },
  {
    id: 'stage-2',
    number: 2,
    title: 'Core Systems & Applied Software',
    status: 'Completed',
    progress: 100,
    estimatedEffort: '4 Months',
    description: 'Deep dive into database architecture, operating systems, networking fundamentals, and clean API design.',
    skills: ['SQL & Schema Design', 'Algorithms', 'FastAPI & REST', 'Git & CI/CD', 'Docker Basics'],
    tasks: [
      { id: 't4', title: 'Build Normalized Relational DB with Stored Procedures', type: 'Project', status: 'Completed', completed: true, estHours: 35 },
      { id: 't5', title: 'Implement Dynamic Programming & Shortest Path Algorithms', type: 'Skill', status: 'Completed', completed: true, estHours: 30 },
      { id: 't6', title: 'Deploy Containerized API service on Cloud Run', type: 'Project', status: 'Completed', completed: true, estHours: 20 },
    ],
  },
  {
    id: 'stage-3',
    number: 3,
    title: 'Specialized Machine Learning & Data Systems',
    status: 'In Progress',
    progress: 50,
    estimatedEffort: '3 Months',
    description: 'Transition from basic software to data engineering pipelines, mathematical modeling, and statistical ML algorithms.',
    skills: ['Scikit-Learn', 'Pandas & NumPy', 'PyTorch Foundations', 'Feature Engineering', 'Vector Databases'],
    tasks: [
      { id: 't7', title: 'Train supervised ensemble models on Kaggle tabular datasets', type: 'Skill', status: 'Completed', completed: true, estHours: 35 },
      { id: 't8', title: 'Build Landslide Risk Early-Warning Classifier', type: 'Project', status: 'Completed', completed: true, estHours: 45 },
      { id: 't9', title: 'Implement Convolutional Neural Net from scratch in PyTorch', type: 'Course', status: 'In Progress', completed: false, estHours: 30 },
      { id: 't10', title: 'Vector Embeddings and Semantic Search Integration', type: 'Skill', status: 'Not Started', completed: false, estHours: 20 },
    ],
  },
  {
    id: 'stage-4',
    number: 4,
    title: 'Advanced AI Architectures & MLOps',
    status: 'In Progress',
    progress: 33,
    estimatedEffort: '3 Months',
    description: 'Build production-ready machine learning services with automated pipelines, continuous training, and low-latency inference.',
    skills: ['Transformers', 'MLflow / Weights & Biases', 'Docker & Kubernetes', 'ONNX Runtime', 'FastAPI Serving'],
    tasks: [
      { id: 't11', title: 'Fine-tune an Open Source LLM for Domain Specific Q&A', type: 'Project', status: 'Not Started', completed: false, estHours: 50 },
      { id: 't12', title: 'Set up automated model tracking and registry with MLflow', type: 'Course', status: 'Completed', completed: true, estHours: 15 },
      { id: 't13', title: 'Build High-Throughput Batch Prediction Service', type: 'Project', status: 'In Progress', completed: false, estHours: 40 },
    ],
  },
  {
    id: 'stage-5',
    number: 5,
    title: 'Internship Preparation & System Portfolios',
    status: 'Not Started',
    progress: 0,
    estimatedEffort: '2 Months',
    description: 'Refine technical portfolio, polish ATS-compliant resume, conduct mock behavioral & system design interviews.',
    skills: ['System Design for AI', 'Mock Technical Rounds', 'Open Source Contributions', 'ATS Optimization'],
    tasks: [
      { id: 't14', title: 'Conduct 5 Peer Mock System Design Sessions', type: 'Course', status: 'Not Started', completed: false, estHours: 20 },
      { id: 't15', title: 'Publish 2 Open-Source Reproducible AI Repositories', type: 'Project', status: 'Not Started', completed: false, estHours: 35 },
      { id: 't16', title: 'Build and Verify Comprehensive Technical Portfolio', type: 'Certification', status: 'Not Started', completed: false, estHours: 10 },
    ],
  },
  {
    id: 'stage-6',
    number: 6,
    title: 'Placement & Industry Job Preparation',
    status: 'Not Started',
    progress: 0,
    estimatedEffort: '2 Months',
    description: 'Targeted applications, on-campus interview drives, salary negotiation strategy, and technical showcase.',
    skills: ['Placement Coding Tests', 'Domain Deep Dives', 'Leadership & Behavioral Rounds'],
    tasks: [
      { id: 't17', title: 'Solve 50 Company-Specific Advanced Test Cases', type: 'Course', status: 'Not Started', completed: false, estHours: 40 },
      { id: 't18', title: 'Finalize Industry Capstone Project Presentation', type: 'Project', status: 'Not Started', completed: false, estHours: 30 },
    ],
  },
];

export const mockProjects: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'AI Study Assistant',
    name: 'AI Study Assistant',
    tagline: 'Context-aware dynamic study guide generator using semantic retrieval',
    description: 'A full-stack intelligence platform that ingests lecture PDFs, parses mathematical notations, generates hierarchical concept maps, and quizzes students using adaptive repetition.',
    category: 'Machine Learning',
    difficulty: 'Intermediate',
    status: 'In Progress',
    progress: 75,
    technologies: ['React', 'TypeScript', 'FastAPI', 'Python', 'ChromaDB'],
    skillsUsed: ['Python', 'FastAPI', 'React', 'Machine Learning'],
    skillsCovered: ['Python', 'FastAPI', 'Vector Search', 'React', 'Prompt Engineering'],
    skillGapAddressed: 'FastAPI & Vector Database Integration (+18%)',
    estimatedHours: 45,
    githubUrl: 'https://github.com/sample-student/ai-study-assistant',
    demoUrl: 'https://study-assistant.preview.app',
  },
  {
    id: 'proj-2',
    title: 'Landslide Risk Prediction Engine',
    name: 'Landslide Risk Prediction Engine',
    tagline: 'Geospatial ML classifier predicting precipitation-triggered hazards',
    description: 'Trained ensemble models on satellite soil moisture, slope gradient, and historical rainfall data. Achieved 91.4% ROC-AUC with explainable SHAP feature importance visualizations.',
    category: 'Machine Learning',
    difficulty: 'Advanced',
    status: 'Completed',
    progress: 100,
    technologies: ['Python', 'Scikit-Learn', 'XGBoost', 'GeoPandas', 'Streamlit'],
    skillsUsed: ['Python', 'Machine Learning', 'Statistical Analysis'],
    skillsCovered: ['Data Science', 'Machine Learning', 'Feature Engineering', 'Statistical Analysis'],
    skillGapAddressed: 'Ensemble Learning & Feature Selection (+22%)',
    estimatedHours: 60,
    githubUrl: 'https://github.com/sample-student/landslide-risk-ml',
  },
  {
    id: 'proj-3',
    title: 'Smart Finance Dashboard',
    name: 'Smart Finance Dashboard',
    tagline: 'Real-time expenditure tracking with automated budget anomaly detection',
    description: 'Architected a reactive financial telemetry tool that categorizes transaction streams, predicts end-of-month runway, and flags unusual variance with Isolation Forests.',
    category: 'Full Stack',
    difficulty: 'Intermediate',
    status: 'Completed',
    progress: 100,
    technologies: ['React', 'Tailwind CSS', 'PostgreSQL', 'Node.js', 'Recharts'],
    skillsUsed: ['React', 'SQL & Database Design', 'JavaScript'],
    skillsCovered: ['SQL', 'Database Normalization', 'React', 'Data Visualization'],
    skillGapAddressed: 'SQL Query Optimization & Real-Time Aggregations (+15%)',
    estimatedHours: 40,
    githubUrl: 'https://github.com/sample-student/smart-finance-tracker',
  },
  {
    id: 'proj-4',
    title: 'Computer Vision Defect Detector',
    name: 'Computer Vision Defect Detector',
    tagline: 'Real-time surface anomaly detection using fine-tuned MobileNet & ONNX',
    description: 'Engineered an edge-ready computer vision pipeline identifying manufacturing imperfections on micro-assemblies with under 35ms latency per frame.',
    category: 'Computer Vision',
    difficulty: 'Advanced',
    status: 'Idea',
    progress: 0,
    technologies: ['PyTorch', 'OpenCV', 'ONNX Runtime', 'Docker', 'Python'],
    skillsUsed: ['PyTorch / Deep Learning', 'Computer Vision', 'Docker & Containerization'],
    skillsCovered: ['Deep Learning', 'PyTorch', 'Docker', 'Computer Vision'],
    skillGapAddressed: 'Directly addresses your largest PyTorch & Docker gap (-28% deficit)',
    estimatedHours: 55,
  },
  {
    id: 'proj-5',
    title: 'Full Stack Career Tracker',
    name: 'Full Stack Career Tracker',
    tagline: 'High-concurrency student progress telemetry and job opportunity matching',
    description: 'Build an asynchronous job scraper, resume keyword aligner, and interview round tracking board with push notifications and calendar synchronization.',
    category: 'Cloud & Systems',
    difficulty: 'Intermediate',
    status: 'Idea',
    progress: 0,
    technologies: ['Go / Python', 'PostgreSQL', 'Redis', 'Docker', 'Tailwind CSS'],
    skillsUsed: ['SQL & Database Design', 'Docker & Containerization', 'Python'],
    skillsCovered: ['System Design', 'Redis Caching', 'Docker', 'Backend Services'],
    skillGapAddressed: 'Fills Backend Systems & Microservices Gap (+20%)',
    estimatedHours: 50,
  },
];

export const mockResumeAnalysis = {
  overallScore: 84,
  matchPercentage: 82,
  targetRole: 'Machine Learning Engineer',
  atsStatus: 'Pass (High Potential)',
  fileName: 'Sample_Student_ML_Resume.pdf',
  uploadedAt: 'Sep 12, 2026',
  detectedSkills: [
    'Python (NumPy, Pandas, Scikit-Learn)',
    'PyTorch Foundations',
    'SQL (PostgreSQL, Indexing)',
    'C++ (Data Structures, Algorithms)',
    'FastAPI & REST APIs',
    'Git & GitHub Actions',
    'Docker Containers',
    'Machine Learning Pipelines',
    'Statistical Modeling',
    'Tailwind CSS & React',
  ],
  missingKeywords: [
    'MLOps & MLflow Tracking',
    'Model Serving (Triton / TorchServe)',
    'Vector Database (Pinecone / Milvus / Chroma)',
    'Distributed Training (DDP / Ray)',
    'Continuous Integration (CI/CD)',
    'Kubernetes Cluster Deployment',
  ],
  strengths: [
    'Solid academic record and core technical foundation prominently showcased',
    'Clear quantitative impact metrics in Landslide Risk ML project (91.4% ROC-AUC)',
    'Strong computer science core foundation (Data Structures, Algorithms, DBMS)',
    'Concise 1-page format with clean standard ATS typography and clear section headers',
  ],
  recommendations: [
    'Highlight production deployment metrics (e.g. latency in ms, queries/sec, inference cost)',
    'Add specific PyTorch deep learning architectures (Transformers, CNNs, Attention Mechanisms)',
    'Incorporate keywords from target role: "MLOps", "Model Monitoring", "Data Drift"',
    'Separate core programming languages from frameworks for clearer ATS parsing',
  ],
  sectionScores: {
    contactInfo: 100,
    education: 95,
    technicalSkills: 85,
    experienceAndProjects: 82,
    formattingAndAts: 88,
  },
};

export const mockAchievements: AchievementBadge[] = [
  { id: 'b1', title: '14-Day Streak', description: 'Maintained continuous daily learning activity on UNNEXA', icon: 'Flame', unlockedAt: 'Yesterday', category: 'Streak' },
  { id: 'b2', title: 'Algorithm Virtuoso', description: 'Attained A+ in Design & Analysis of Algorithms', icon: 'Award', unlockedAt: 'Aug 2026', category: 'Academic' },
  { id: 'b3', title: 'First ML Model Shipped', description: 'Trained and deployed Landslide Prediction model', icon: 'Cpu', unlockedAt: 'Jul 2026', category: 'Project' },
  { id: 'b4', title: 'ATS Optimizer', description: 'Elevated Resume Match Score from 62 to 84', icon: 'FileCheck', unlockedAt: 'Sep 2026', category: 'Skill' },
  { id: 'b5', title: 'Code Crafter', description: 'Over 120 commits and 4 completed portfolio projects', icon: 'Code', unlockedAt: 'Jun 2026', category: 'Project' },
  { id: 'b6', title: 'High Honor Roll', description: 'Maintained CGPA above 8.5 for 4 consecutive semesters', icon: 'Trophy', unlockedAt: 'May 2026', category: 'Academic' },
];

export const mockRecentActivities = [
  { id: 'act-1', text: 'Completed practice module: PyTorch Tensor Operations & Autograd', timestamp: '2 hours ago', category: 'Skill' },
  { id: 'act-2', text: 'Updated AI Study Assistant repo with Vector Search embeddings', timestamp: 'Yesterday', category: 'Project' },
  { id: 'act-3', text: 'Scored 94% on Algorithms Mid-Semester Review Assessment', timestamp: '3 days ago', category: 'Academic' },
  { id: 'act-4', text: 'Analyzed resume against Machine Learning Engineer target profile', timestamp: '5 days ago', category: 'Resume' },
  { id: 'act-5', text: 'Unlocked 14-Day Learning Streak Badge', timestamp: '6 days ago', category: 'Achievement' },
];

export const mockWeeklyActivity = [
  { day: 'Mon', hours: 3.5, tasks: 4 },
  { day: 'Tue', hours: 4.2, tasks: 5 },
  { day: 'Wed', hours: 2.8, tasks: 3 },
  { day: 'Thu', hours: 5.0, tasks: 6 },
  { day: 'Fri', hours: 4.0, tasks: 4 },
  { day: 'Sat', hours: 6.2, tasks: 7 },
  { day: 'Sun', hours: 4.5, tasks: 5 },
];

export const mockCollegeSyllabus: CollegeSyllabusItem[] = [
  {
    id: 'syl-cs301',
    semester: 6,
    courseOrDegree: 'B.Tech',
    branchOrProgram: 'Computer Science & AI',
    subjectName: 'Design & Analysis of Algorithms',
    subjectCode: 'CS301',
    title: 'Algorithms & Computational Complexity',
    topics: ['Divide and Conquer', 'Greedy Method', 'Dynamic Programming', 'Graph Algorithms', 'NP-Completeness'],
    uploadedAt: 'Semester 6 Start',
  },
  {
    id: 'syl-cs302',
    semester: 6,
    courseOrDegree: 'B.Tech',
    branchOrProgram: 'Computer Science & AI',
    subjectName: 'Database Management Systems',
    subjectCode: 'CS302',
    title: 'Relational Database Architecture & Query Processing',
    topics: ['ER Modeling', 'Relational Algebra & Normalization', 'Indexing & B+ Trees', 'Transaction & Concurrency', 'Crash Recovery'],
    uploadedAt: 'Semester 6 Start',
  },
  {
    id: 'syl-cs303',
    semester: 6,
    courseOrDegree: 'B.Tech',
    branchOrProgram: 'Computer Science & AI',
    subjectName: 'Machine Learning Fundamentals',
    subjectCode: 'CS303',
    title: 'Statistical Learning & Deep Representations',
    topics: ['Linear & Logistic Regression', 'Support Vector Machines', 'Decision Trees & Ensembles', 'Neural Networks', 'Unsupervised Clustering'],
    uploadedAt: 'Semester 6 Start',
  },
];

// Initialize mockStudent with empty collections (starts from zero)
mockStudent.semesters = [];
mockStudent.subjects = [];
mockStudent.skills = [];
mockStudent.ownSkillUp = [];
mockStudent.projects = [];
mockStudent.syllabus = [];
mockStudent.roadmapStages = [];
mockStudent.careerGoalDetails = undefined;
mockStudent.resumeInfo = undefined;

// Academic Calculation Helpers
export const gradeToPoints = (grade: string): number => {
  switch (grade.toUpperCase()) {
    case 'O':
    case 'A+':
      return 10.0;
    case 'A':
      return 9.0;
    case 'B+':
      return 8.0;
    case 'B':
      return 7.0;
    case 'C+':
      return 6.0;
    case 'C':
      return 5.0;
    case 'D':
      return 4.0;
    case 'F':
      return 0.0;
    default:
      return 0.0;
  }
};

export const hasEnoughDataForSGPA = (subjects?: SubjectPerformance[]): boolean => {
  if (!subjects || subjects.length === 0) return false;
  return subjects.some((s) => s.grade && s.grade.trim() !== '' && s.grade !== '-' && s.grade.toUpperCase() !== 'PENDING');
};

export const calculateSGPA = (subjects?: SubjectPerformance[]): number | null => {
  if (!subjects || subjects.length === 0) return null;
  const graded = subjects.filter(
    (s) => s.grade && s.grade.trim() !== '' && s.grade !== '-' && s.grade.toUpperCase() !== 'PENDING'
  );
  if (graded.length === 0) return null;
  let totalPoints = 0;
  let totalCredits = 0;
  for (const s of graded) {
    const credits = s.credits || 3;
    const pts = s.grade ? gradeToPoints(s.grade) : 0;
    totalPoints += pts * credits;
    totalCredits += credits;
  }
  return totalCredits > 0 ? Number((totalPoints / totalCredits).toFixed(2)) : null;
};

export const hasEnoughDataForCGPA = (semesters?: AcademicSemester[]): boolean => {
  if (!semesters || semesters.length === 0) return false;
  return semesters.some((s) => typeof s.sgpa === 'number' && s.sgpa > 0);
};

export const calculateCGPA = (semesters?: AcademicSemester[]): number | null => {
  if (!semesters || semesters.length === 0) return null;
  const valid = semesters.filter((s) => typeof s.sgpa === 'number' && s.sgpa > 0);
  if (valid.length === 0) return null;
  let totalPoints = 0;
  let totalCredits = 0;
  for (const sem of valid) {
    const credits = sem.credits || 20;
    totalPoints += (sem.sgpa || 0) * credits;
    totalCredits += credits;
  }
  return totalCredits > 0 ? Number((totalPoints / totalCredits).toFixed(2)) : null;
};

export const calculateReadinessScore = (skills?: SkillItem[]): number | null => {
  if (!skills || skills.length === 0) return null;
  const total = skills.reduce((sum, s) => sum + (s.currentLevel || 0), 0);
  return Math.round(total / skills.length);
};

