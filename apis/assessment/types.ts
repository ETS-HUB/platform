export type AssessmentTrack =
  | "FRONTEND"
  | "BACKEND"
  | "FULLSTACK"
  | "DATA_SCIENCE"
  | "DATA_ANALYSIS"
  | "CYBERSECURITY"
  | "DEVOPS"
  | "UI_UX"
  | "PRODUCT_MANAGEMENT"
  | "GRAPHIC_DESIGN"
  | "MOBILE"
  | "GENERAL";

export type AssessmentDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface AssessmentConfig {
  id: string;
  name: string;
  description: string;
  track: AssessmentTrack;
  difficulty: AssessmentDifficulty;
  totalQuestions: number;
  timeLimitMinutes: number;
  isBoothMode: boolean;
  isActive: boolean;
  topicDistribution: Record<string, number> | null;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  topic: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  points: number;
  timeLimit: number | null;
}

export interface StartAssessmentResponse {
  attemptId: string;
  timeLimitMinutes: number;
  totalQuestions: number;
  questions: Question[];
}

export interface SubmitAnswerRequest {
  questionId: string;
  selectedOption: string;
  timeTaken: number;
}

export interface SubmitAnswerResponse {
  id: string;
  attemptId: string;
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
  timeTaken: number;
  createdAt: string;
}

export interface TopicScore {
  topicName: string;
  correct: number;
  total: number;
  percentage: number;
}

export interface CompleteResponse {
  attemptId: string;
  totalScore: number;
  maxScore: number;
  percentageScore: number;
  topicScores: Record<string, TopicScore>;
  completedAt: string;
}

export interface LearningPathWeek {
  week: number;
  topic: string;
  focus: string;
  estimatedHours: number;
  priority: "high" | "medium" | "low";
  reason: string;
}

export interface Recommendation {
  id: string;
  title: string;
  url: string;
  type: "DOCUMENTATION" | "TUTORIAL" | "VIDEO" | "COURSE";
  topic: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

export interface AiReportData {
  skillReport: { report: string } | { error: string; detail: string };
  learningPath:
    | { learningPath: LearningPathWeek[] }
    | { error: string; detail: string };
  cheatSheet:
    | { topic: string; cheatSheet: string }
    | { error: string; detail: string };
  recommendations:
    | {
        recommendations: Recommendation[];
        weakTopics: string[];
      }
    | { error: string; detail: string };
}

export interface Badge {
  name: string;
  description: string;
  icon: string;
  profileId: string;
}

export interface CertificateStrength {
  topic: string;
  score: number;
}

export interface CertificateBadge {
  name: string;
  icon: string;
  description: string;
  earnedAt: string;
}

export interface TopicBreakdownItem {
  topic: string;
  score: number;
  correct: number;
  total: number;
}

export interface ShareCard {
  title: string;
  subtitle: string;
  highlights: string[];
  badgeCount: number;
  platform: string;
  verifyUrl: string;
}

export interface Certificate {
  id: string;
  studentName: string;
  assessmentName: string;
  completedAt: string;
  overallScore: number;
  percentile: number;
  level: number;
  levelName: string;
  xp: number;
  strengths: CertificateStrength[];
  badges: CertificateBadge[];
  topicBreakdown: TopicBreakdownItem[];
  shareCard: ShareCard;
}

export interface CertificateResponse {
  certificate: Certificate;
}
