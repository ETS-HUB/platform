export type ResourceType = "TUTORIAL" | "VIDEO" | "DOCUMENTATION";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type LearningStyle = "VISUAL" | "READING" | "HANDS_ON";

export interface AdminResource {
  id: string;
  topicId: string;
  title: string;
  url: string;
  type: ResourceType;
  difficulty: Difficulty;
  learningStyle: LearningStyle;
  description: string;
  isActive: boolean;
  topic: { name: string };
}

export interface ResourcePayload {
  topicId: string;
  title: string;
  url: string;
  type: ResourceType;
  difficulty: Difficulty;
  learningStyle: LearningStyle;
  description: string;
}

export interface ResourcesPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
