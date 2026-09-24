export type ConfigDifficulty = "EASY" | "MEDIUM" | "HARD" | null;
export type DistributionMode = "topic" | "difficulty" | "random" | "none";

export interface AssessmentConfig {
  id: string;
  name: string;
  description: string | null;
  track: string;
  difficulty: ConfigDifficulty;
  totalQuestions: number;
  timeLimitMinutes: number;
  isBoothMode: boolean;
  isActive: boolean;
  topicDistribution: Record<string, number> | null;
  difficultyDistribution: Record<"EASY" | "MEDIUM" | "HARD", number> | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConfigPayload {
  name: string;
  description?: string;
  track: string;
  totalQuestions: number;
  timeLimitMinutes: number;
  isBoothMode: boolean;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  topicDistribution: Record<string, number> | null;
  difficultyDistribution: Record<"EASY" | "MEDIUM" | "HARD", number> | null;
}
