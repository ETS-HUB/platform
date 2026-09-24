export type UserRole = "STUDENT" | "TUTOR" | "RECRUITER" | "ADMIN";
export type ExperienceLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface UserProfileSummary {
  goal: string;
  experienceLevel: ExperienceLevel;
  xp: number;
  level: number;
  isVisibleToRecruiters: boolean;
}

export interface AdminUserListItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  profile: UserProfileSummary | null;
}

export interface UserBadge {
  id: string;
  name: string;
  awardedAt: string;
}

export interface AssessmentAttemptSummary {
  id: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
  config: { name: string };
}

export interface PracticeSessionSummary {
  id: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

export interface AdminUserDetail extends Omit<AdminUserListItem, "profile"> {
  profile: (UserProfileSummary & { badges: UserBadge[] }) | null;
  assessmentAttempts: AssessmentAttemptSummary[];
  practiceSessions: PracticeSessionSummary[];
}

export interface UsersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface CandidateListItem {
  id: string;
  userId: string;
  goal: string;
  trackSlug: string | null;
  experienceLevel: ExperienceLevel;
  learningStyle: string;
  weeklyHours: number;
  xp: number;
  level: number;
  isVisibleToRecruiters: boolean;
  createdAt: string;
  badges: {
    id: string;
    name: string;
    description: string;
    earnedAt: string;
  }[];
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    assessmentAttempts: {
      percentageScore: number;
      topicScores: Record<
        string,
        {
          total: number;
          correct: number;
          topicName: string;
          percentage: number;
        }
      >;
      completedAt: string;
    }[];
  };
}

export interface CandidateFilters {
  skill?: string;
  minScore?: number;
  maxScore?: number;
  experienceLevel?: ExperienceLevel;
  goal?: string;
  page?: number;
  limit?: number;
}
