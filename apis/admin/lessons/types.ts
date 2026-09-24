export type ContentBlockType = "TEXT" | "VIDEO" | "CODE" | "RESOURCE_LINK";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface AdminContentBlock {
  id?: string; // absent = not yet saved to server
  type: ContentBlockType;
  order: number;
  title: string;
  content: string;
  overview?: string;
  metadata?: { duration?: string; provider?: string; language?: string };
}

export interface AdminQuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface AdminLessonQuestion {
  id?: string;
  order: number;
  difficulty: Difficulty;
  text: string;
  options: AdminQuestionOption[];
  explanation: string;
  points: number;
}

export interface AdminLessonListItem {
  id: string;
  topicId: string;
  title: string;
  order: number;
  duration: number;
  isPublished: boolean;
  isProject: boolean;
  createdAt: string;
  topic: { name: string; parentId: string | null };
  _count: { contentBlocks: number; questions: number };
}

export interface AdminLessonDetail {
  id: string;
  topicId: string;
  title: string;
  description: string;
  order: number;
  duration: number;
  isPublished: boolean;
  isProject: boolean;
  createdAt: string;
  updatedAt: string;
  contentBlocks: AdminContentBlock[];
  questions: AdminLessonQuestion[];
}

export interface CreateLessonPayload {
  topicId: string;
  title: string;
  description: string;
  order: number;
  duration: number;
  isPublished: boolean;
  contentBlocks: Omit<AdminContentBlock, "id">[];
  questions: Omit<AdminLessonQuestion, "id">[];
}

export interface UpdateLessonPayload {
  title?: string;
  description?: string;
  order?: number;
  duration?: number;
  isPublished?: boolean;
}
