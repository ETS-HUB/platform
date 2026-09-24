import { api } from "../api";
import type {
  LevelInfo,
  Badge,
  MyAttemptsResponse,
  Resource,
  PracticeTopic,
  PracticeStartResponse,
  PracticeAnswerResponse,
  PracticeCompleteResponse,
  PracticeHistoryResponse,
  PracticeProgressResponse,
} from "./types";

export const studentService = api.injectEndpoints({
  endpoints: (builder) => ({
    getLevel: builder.query<LevelInfo, void>({
      query: () => "/api/gamification/level",
    }),

    getBadges: builder.query<Badge[], void>({
      query: () => "/api/gamification/badges",
    }),

    getMyAttempts: builder.query<MyAttemptsResponse, void>({
      query: () => "/api/assessment/my-attempts",
    }),

    getRecommendedResources: builder.query<Resource[], void>({
      query: () => "/api/resources/recommended",
    }),

    getPracticeTopics: builder.query<PracticeTopic[], void>({
      query: () => "/api/practice/topics",
      providesTags: ["Practice"],
    }),

    startPractice: builder.mutation<
      PracticeStartResponse,
      { topicId: string; count: number }
    >({
      query: ({ topicId, count }) => ({
        url: `/api/practice/start/${topicId}?count=${count}`,
        method: "POST",
      }),
    }),

    submitPracticeAnswer: builder.mutation<
      PracticeAnswerResponse,
      { questionId: string; selectedOption: string }
    >({
      query: ({ questionId, selectedOption }) => ({
        url: `/api/practice/answer/${questionId}`,
        method: "POST",
        body: { selectedOption },
      }),
    }),

    completePractice: builder.mutation<
      PracticeCompleteResponse,
      { sessionId: string; correctAnswers: number }
    >({
      query: ({ sessionId, correctAnswers }) => ({
        url: `/api/practice/complete/${sessionId}`,
        method: "POST",
        body: { correctAnswers },
      }),
      invalidatesTags: ["Practice"],
    }),

    getPracticeHistory: builder.query<PracticeHistoryResponse, void>({
      query: () => "/api/practice/history",
    }),

    getPracticeProgress: builder.query<PracticeProgressResponse, string>({
      query: (topicId) => `/api/practice/progress/${topicId}`,
    }),
  }),
});

export const {
  useGetLevelQuery,
  useGetBadgesQuery,
  useGetMyAttemptsQuery,
  useGetRecommendedResourcesQuery,
  useGetPracticeTopicsQuery,
  useStartPracticeMutation,
  useSubmitPracticeAnswerMutation,
  useCompletePracticeMutation,
  useGetPracticeHistoryQuery,
  useGetPracticeProgressQuery,
} = studentService;
