import type { ContentType, Level } from "../roadmap/tutor/types";

export interface NudgeRequest {
  questionId: string;
}

export interface NudgeResult {
  nudge: string;
}

export interface GenerateContentRequest {
  type: ContentType;
  prompt: string;
  level: Level;
}

export interface GenerateContentResponse {
  id: string;
  contentType: ContentType;
  title: string;
  description: string;
  content: AiCourseContent | any; // typed for course; `any` for roadmap/guide/quiz
  isPublic: boolean;
  viewCount: number;
  copyCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AiLessonBody {
  objectives: string[];
  explanation: string;
  keyPoints: string[];
  codeExample?: { language: string; code: string; explanation: string };
  codeExercise?: {
    instructions: string;
    starterCode: string;
    solution: string;
    hints: string[];
  };
  summary: string;
  nextSteps: string;
}

export interface AiLesson {
  id: string;
  title: string;
  description: string;
  concepts: string[];
  duration?: string;
  body?: AiLessonBody;
}

export interface AiModule {
  id: string;
  title: string;
  description: string;
  lessons: AiLesson[];
  project?: string;
}

export interface AiCourseContent {
  keyword: string;
  title: string;
  about: string;
  description: string;
  difficulty: string;
  prerequisites: string;
  category: string;
  coversList: string[];
  learningOutcomes: string[];
  modulesCount: number;
  lessonsCount: number;
  done: string[];
  forkCount: number;
  forkedFromSlug: string;
  isFeatured: boolean;
  viewCount: number;
  modules: AiModule[];
}

export interface QuizOption {
  id: "a" | "b" | "c" | "d";
  text: string;
}

export interface QuizCodeBlock {
  language: string;
  code: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  codeBlock?: QuizCodeBlock;
  options: QuizOption[];
  correctAnswer: "a" | "b" | "c" | "d";
  explanation: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

export interface AiQuizContent {
  questions: QuizQuestion[];
}

export interface FetchLessonRequest {
  contentId: string; // course UUID
  moduleId: string;
  lessonId: string;
}

export interface FetchLessonResponse {
  lesson: AiLesson & { body: AiLessonBody };
  cached: boolean;
}

export interface LessonPaywallError {
  statusCode: 403;
  message: string;
  code: "LESSON_LIMIT_REACHED";
  generatedCount: number;
  limit: number;
  upgradePath: string;
}

export interface MyLearningProgress {
  completionPercentage: number;
  completedSections: string[];
}

export interface MyLearningItem {
  id: string;
  contentType: string; // "ROADMAP" | "COURSE" | "GUIDE" | "QUIZ"
  title: string;
  description: string;
  isPublic: boolean;
  viewCount: number;
  copyCount: number;
  createdAt: string;
  updatedAt: string;
  progress: MyLearningProgress;
  chatMessageCount: number;
  content: any;
}

export interface MyLearningResponse {
  data: MyLearningItem[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface CommunityResponse {
  data: CommunityItem[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface CommunityItem {
  id: string;
  contentType: string;
  title: string;
  description: string;
  viewCount: number;
  copyCount: number;
  createdAt: string;
  author: { name: string; avatar: string | null };
}

export interface ChatRequest {
  contentId: string;
  message: string;
}

export interface GeneralChatRequest {
  message: string;
}

export interface ChatTokenEvent {
  token: string;
}

export interface UpdateProgressRequest {
  done: number;
  total: number;
}

export interface UpdateProgressResponse {
  success: boolean;
  progress: { done: number; total: number };
}
