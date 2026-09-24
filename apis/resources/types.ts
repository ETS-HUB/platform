export type ResourceType = "TUTORIAL" | "VIDEO" | "DOCUMENTATION";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type LearningStyle = "VISUAL" | "READING" | "HANDS_ON";

export interface RecommendedResource {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  topic: string;
  difficulty: Difficulty;
}

export interface LibraryResource {
  id: string;
  topicId: string;
  title: string;
  url: string;
  type: ResourceType;
  difficulty: Difficulty;
  learningStyle: LearningStyle;
  description: string;
  topic: { name: string };
}

export interface ResourcePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
