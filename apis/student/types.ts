export interface Badge {
  name: string;
  description?: string;
  icon: string;
  earnedAt?: string;
}

export interface UserProfile {
  goal: string;
  experienceLevel: string;
  learningStyle: string;
  weeklyHours: number;
  xp: number;
  level: number;
  aiSkillReport: string | null;
  aiLearningPath: unknown | null;
  aiCheatSheet: string | null;
  aiRecommendations: Resource[] | null;
  isVisibleToRecruiters: boolean;
  badges: Badge[];
}

export interface AssessmentAttemptSummary {
  percentageScore: number;
  topicScores: Record<
    string,
    { topicName?: string; percentage: number; correct: number; total: number }
  >;
  config: string | { name: string };
  completedAt?: string;
}

export interface UserMe {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  profile: UserProfile | null;
  assessmentAttempts: AssessmentAttemptSummary[];
}

export interface LevelInfo {
  xp: number;
  level: number;
  levelName: string;
  nextLevel: {
    level: number;
    name: string;
    xpRequired: number;
    xpRemaining: number;
    progress: number;
  };
}

export interface Resource {
  id?: string;
  title: string;
  url: string;
  type: string;
  topic: string;
  difficulty: string;
}

export interface AttemptDetail {
  percentageScore: number;
  topicScores: Record<string, number | { percentage: number }>;
  config: { name: string };
  completedAt: string;
}

export interface MyAttemptsResponse {
  attempts: AttemptDetail[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PracticeTopic {
  id: string;
  name: string;
  recommendedPriority: "high" | "medium" | "low";
  lastScore: number | null;
  _count: { questions: number };
}

export interface PracticeQuestion {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

export interface PracticeStartResponse {
  sessionId: string;
  topic: string;
  totalQuestions: number;
  questions: PracticeQuestion[];
}

export interface PracticeAnswerResponse {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
  points: number;
}

export interface PracticeCompleteResponse {
  sessionId: string;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  xpEarned: number;
}

export interface PracticeSession {
  id: string;
  topicId: string;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
  createdAt: string;
}

export interface PracticeHistoryResponse {
  sessions: PracticeSession[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PracticeProgressResponse {
  totalSessions: number;
  progress: { date: string; percentage: number }[];
}
