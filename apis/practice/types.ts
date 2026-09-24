// Single source of truth lives in student/types — re-export here for backward compat
export type {
  PracticeTopic,
  PracticeStartResponse as PracticeSessionStart,
  PracticeAnswerResponse as PracticeAnswerResult,
  PracticeCompleteResponse as PracticeSessionComplete,
  PracticeSession as PracticeHistorySession,
  PracticeProgressResponse as PracticeProgress,
} from "@/apis/student/types";

// Also export the sub-types used by components
export type { PracticeQuestion, PracticeSession } from "@/apis/student/types";

// PracticeProgressPoint — inline since it's tiny
export interface PracticeProgressPoint {
  date: string;
  percentage: number;
}

// PracticeQuestionOption — inline since it's tiny
export interface PracticeQuestionOption {
  id: string;
  text: string;
}

// Priority stays here — not in student/types
export type Priority = "high" | "medium" | "low";
