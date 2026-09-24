export interface CourseSummary {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  track: string | null;
  coverImage: string | null;
  parentId: string | null;
  createdAt: string;
  _count: {
    lessons: number;
    enrollments: number;
  };
  isEnrolled?: boolean;
  progress?: {
    completedLessons: number;
    totalLessons: number;
    percentage: number;
  };
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  track: string | null;
  coverImage: string | null;
  parentId: string | null;
  createdAt: string;
  _count: {
    lessons: number;
    enrollments: number;
  };
  children: CourseSummary[];
}

export interface HierarchyResponse {
  categories: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface HierarchyParams {
  track?: string;
  category?: string;
  page?: number;
  limit?: number;
}

// ── Lesson Types ──────────────────────────────────────────────────────────

export type ContentBlockType =
  | "TEXT"
  | "VIDEO"
  | "CODE"
  | "RESOURCE_LINK"
  | "PROJECT";

export interface QuestionOption {
  id: string;
  text: string;
}

export interface LessonQuestion {
  id: string;
  order: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  text: string;
  options: QuestionOption[];
  points: number;
}

export interface ContentBlock {
  id?: string;
  type: ContentBlockType;
  order: number;
  title: string;
  content: string;
  overview?: string | null;
  metadata?: { duration?: string; provider?: string; language?: string };
  questions?: LessonQuestion[];
}

export interface AnswerResult {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
  points: number;
}

export interface LessonData {
  id: string;
  title: string;
  description?: string;
  order: number;
  duration: number;
  topic?: { name: string; id: string };
  isLocked: boolean;
  lockReason?: string | null;
  contentBlocks: ContentBlock[];
  questions: LessonQuestion[];
}

export interface NavLessonItem {
  id: string;
  order: number;
  title: string;
  status: "completed" | "current" | "locked";
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  isOwn: boolean;
  mentionedUser?: string;
  text: string;
  timestamp: string;
}
