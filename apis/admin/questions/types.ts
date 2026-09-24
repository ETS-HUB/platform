export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface AdminQuestion {
  id: string;
  topicId: string;
  difficulty: Difficulty;
  text: string;
  options: QuestionOption[];
  explanation: string;
  points: number;
  timeLimit: number | null;
  isActive: boolean;
  createdAt: string;
  topic?: { name: string };
}

export interface CreateQuestionPayload {
  topicId: string;
  difficulty: Difficulty;
  text: string;
  options: QuestionOption[];
  explanation: string;
  points: number;
  timeLimit?: number;
}

export type UpdateQuestionPayload = Partial<CreateQuestionPayload>;

export interface BulkUploadResult {
  uploaded: number;
  questions: { id: string; text: string }[];
}

export interface QuestionsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
