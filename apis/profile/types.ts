export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  profile: {
    goal?: string;
    trackSlug?: string | null;
    xp: number;
    level: number;
    learningStyle?: string;
    weeklyHours?: number;
  };
}

export interface LevelInfo {
  xp: number;
  level: number;
  levelName: string;
  nextLevel: {
    level: number;
    name: string;
    xpRequired: number;
    xpRemaining: number;
    progress: number;
  } | null;
}

export interface EarnedBadge {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  icon?: string | null; // emoji from API (legacy field)
  earnedAt: string;
}

export interface AvailableBadge {
  id: string;
  name: string;
  imageUrl?: string | null;
  icon?: string | null; // emoji from API
  description?: string;
  isActive?: boolean;
  criteria: {
    type: "quiz_score" | "practice_count" | "overall_score";
    topic?: string;
    minScore?: number;
    count?: number;
  };
}

export interface Certificate {
  certificateId: string;
  courseName: string;
  grade: string;
  issuedAt: string;
  topic: { name: string; imageUrl?: string | null };
}

export interface AssessmentAttempt {
  percentageScore: number;
  config: { name: string };
  completedAt: string;
}

export interface TopicProgress {
  topicId: string;
  topicName: string;
  parentTopic: string;
  totalLessons: number;
  completedLessons: number;
  percentage: number;
  enrolledAt: string;
}

export interface LessonProgressSummary {
  topicProgress: TopicProgress[];
  recentlyCompleted: {
    completed: boolean;
    score: number;
    completedAt: string;
    lesson: { title: string; topicId: string };
  }[];
  totalLessonsCompleted: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId?: string;
  firstName: string;
  lastName?: string;
  avatar?: string;
  xp?: number;
  level?: number;
  lessonsCompleted?: number;
  avgScore?: number;
  totalAttempts?: number;
  trackSlug?: string | null;
}

export interface MyRankResponse {
  myRank: number;
  myEntry: LeaderboardEntry;
  top10: LeaderboardEntry[];
  surrounding: LeaderboardEntry[];
  totalParticipants: number;
}

export type LeaderboardCategory = "xp" | "lessons" | "assessment";
