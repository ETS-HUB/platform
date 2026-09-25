import { api } from "@/apis/api";
import type {
  LevelInfo,
  EarnedBadge,
  AvailableBadge,
  Certificate,
  MyRankResponse,
  LeaderboardEntry,
  LeaderboardCategory,
  LessonProgressSummary,
} from "./types";

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  goal?: string;
  trackSlug?: string | null;
  experienceLevel?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  learningStyle?: "VISUAL" | "READING" | "HANDS_ON";
  weeklyHours?: number;
}

export interface MyCertificate {
  id: string;
  certificateId: string;
  grade: string;
  averageQuizScore: number;
  issuedAt: string;
  topic: {
    name: string;
    icon?: string | null;
    parent?: { name: string } | null;
  };
}

export const profileService = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/gamification/level
    getMyLevel: builder.query<LevelInfo, void>({
      query: () => "/api/gamification/level",
      providesTags: ["Users"],
    }),

    // GET /api/gamification/badges — earned badges for current user
    getMyBadges: builder.query<EarnedBadge[], void>({
      query: () => "/api/gamification/badges",
      providesTags: ["Badges"],
    }),

    // GET /api/gamification/available-badges — all badge definitions
    getAvailableBadges: builder.query<AvailableBadge[], void>({
      query: () => "/api/gamification/available-badges",
      providesTags: ["Badges"],
    }),

    // GET /api/certificates/my — student's own certificates
    getMyCertificates: builder.query<MyCertificate[], void>({
      query: () => "/api/certificates/my",
      providesTags: ["Certificates"],
    }),

    // GET /api/leaderboard/my-rank?category=xp&track=...
    getMyRank: builder.query<
      MyRankResponse,
      { category: LeaderboardCategory; track?: string }
    >({
      query: ({ category, track }) => ({
        url: "/api/leaderboard/my-rank",
        params: { category, ...(track ? { track } : {}) },
      }),
      providesTags: ["Users"],
    }),

    // GET /api/leaderboard/xp or /api/leaderboard/assessment
    getLeaderboard: builder.query<
      LeaderboardEntry[],
      { category: "xp" | "assessment"; track?: string; limit?: number }
    >({
      query: ({ category, track, limit }) => ({
        url: `/api/leaderboard/${category}`,
        params: { ...(track ? { track } : {}), ...(limit ? { limit } : {}) },
      }),
      providesTags: ["Users"],
    }),

    // PATCH /api/users/profile
    updateProfile: builder.mutation<void, UpdateProfilePayload>({
      query: (payload) => ({
        url: "/api/users/profile",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Users"],
    }),

    // GET /api/users/lesson-progress (lesson progress summary)
    // Using the dashboard data for this — re-expose as a separate query if endpoint exists
    // For now, use progress from lesson service
  }),
});

export const {
  useGetMyLevelQuery,
  useGetMyBadgesQuery,
  useGetAvailableBadgesQuery,
  useGetMyCertificatesQuery,
  useGetMyRankQuery,
  useGetLeaderboardQuery,
  useUpdateProfileMutation,
} = profileService;
