export type ContentType = "roadmap" | "course" | "guide" | "quiz";
export type Level = "beginner" | "intermediate" | "advanced";

export interface LearningItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  createdAt: string;
  author?: { name: string; avatar?: string };
  progress?: { done: number; total: number };
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}
