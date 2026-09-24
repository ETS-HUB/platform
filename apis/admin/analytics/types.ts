export interface DashboardStats {
  totalStudents: number;
  totalAssessments: number;
  completedAssessments: number;
  totalPracticeSessions: number;
  completionRate: number;
}

export type ScoreDistribution = Record<string, number>;

export interface TopicPerformance {
  topic: string;
  averageScore: number;
  totalAttempts: number;
}

export type SkillGapSeverity = "critical" | "high" | "moderate";

export interface SkillGap {
  topic: string;
  averageScore: number;
  severity: SkillGapSeverity;
}

export interface RecentActivityItem {
  studentName: string;
  email: string;
  assessment: string;
  score: number;
  completedAt: string;
}

export interface GoalDistributionItem {
  goal: string;
  count: number;
}

export type ExperienceLevels = Record<string, number>;
