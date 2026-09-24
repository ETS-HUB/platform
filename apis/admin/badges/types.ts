export type BadgeCriteriaType =
  | "quiz_score"
  | "practice_count"
  | "overall_score";

export interface BadgeCriteria {
  type: BadgeCriteriaType;
  topic?: string; // topic name, per student-facing example — confirm vs topicId
  minScore?: number;
  count?: number;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
  criteria: BadgeCriteria;
  isActive: boolean;
}

export interface BadgePayload {
  name: string;
  imageUrl?: string;
  description?: string;
  criteria: BadgeCriteria;
}
