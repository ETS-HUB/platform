import { api } from "@/apis/api";
import type {
  DashboardStats,
  ScoreDistribution,
  TopicPerformance,
  SkillGap,
  RecentActivityItem,
  GoalDistributionItem,
  ExperienceLevels,
} from "@/apis/admin/analytics/types";

export const analyticsService = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => "/api/analytics/dashboard",
      providesTags: ["Analytics"],
    }),

    getScoreDistribution: builder.query<ScoreDistribution, void>({
      query: () => "/api/analytics/score-distribution",
      providesTags: ["Analytics"],
    }),

    getTopicPerformance: builder.query<TopicPerformance[], void>({
      query: () => "/api/analytics/topic-performance",
      providesTags: ["Analytics"],
    }),

    getSkillGaps: builder.query<SkillGap[], void>({
      query: () => "/api/analytics/skill-gaps",
      providesTags: ["Analytics"],
    }),

    getRecentActivity: builder.query<RecentActivityItem[], { limit: number }>({
      query: ({ limit }) => `/api/analytics/recent-activity?limit=${limit}`,
      providesTags: ["Analytics"],
    }),

    getGoalDistribution: builder.query<GoalDistributionItem[], void>({
      query: () => "/api/analytics/goal-distribution",
      providesTags: ["Analytics"],
    }),

    getExperienceLevels: builder.query<ExperienceLevels, void>({
      query: () => "/api/analytics/experience-levels",
      providesTags: ["Analytics"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetScoreDistributionQuery,
  useGetTopicPerformanceQuery,
  useGetSkillGapsQuery,
  useGetRecentActivityQuery,
  useGetGoalDistributionQuery,
  useGetExperienceLevelsQuery,
} = analyticsService;
