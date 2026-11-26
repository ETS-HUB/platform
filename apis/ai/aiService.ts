import { api } from "../api";
import type {
  NudgeRequest,
  NudgeResult,
  GenerateContentRequest,
  GenerateContentResponse,
  MyLearningResponse,
  MyLearningItem,
  CommunityResponse,
  CommunityItem,
  UpdateProgressRequest,
  UpdateProgressResponse,
  FetchLessonRequest,
  FetchLessonResponse,
} from "./types";
import type { LearningItem } from "../roadmap/tutor/types";
import { formatTimeAgo } from "@/lib/utils";

export const aiService = api.injectEndpoints({
  endpoints: (builder) => ({
    requestNudge: builder.mutation<NudgeResult, NudgeRequest>({
      query: ({ questionId }) => ({
        url: "/api/ai/nudge",
        method: "POST",
        body: { questionId },
      }),
    }),

    generateContent: builder.mutation<
      GenerateContentResponse,
      GenerateContentRequest
    >({
      query: (body) => ({
        url: "/api/ai/generate",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AiLearning"],
    }),

    getMyLearning: builder.query<
      MyLearningItem[],
      { contentType?: string; search?: string; page?: number; limit?: number }
    >({
      query: (params) => ({
        url: "/api/ai/my-learning",
        params,
      }),
      transformResponse: (response: MyLearningResponse) =>
        response.data.map((item) => ({
          ...item,
          createdAt: formatTimeAgo(item.createdAt),
        })),
      providesTags: ["AiLearning"],
    }),

    getCommunity: builder.query<
      CommunityItem[],
      {
        contentType?: string;
        search?: string;
        excludeOwn?: boolean;
        page?: number;
        limit?: number;
      }
    >({
      query: (params) => ({
        url: "/api/ai/community",
        params,
      }),
      transformResponse: (response: CommunityResponse) =>
        response.data.map((item) => ({
          ...item,
          createdAt: formatTimeAgo(item.createdAt),
        })),
      providesTags: ["AiCommunity"],
    }),

    getContent: builder.query<GenerateContentResponse, string>({
      query: (id) => `/api/ai/content/${id}`,
      providesTags: (_result, _error, id) => [{ type: "AiLearning", id }],
    }),

    fetchLesson: builder.mutation<FetchLessonResponse, FetchLessonRequest>({
      query: ({ contentId, moduleId, lessonId }) => ({
        url: `/api/ai/content/${contentId}/lesson`,
        method: "POST",
        body: { moduleId, lessonId },
      }),
    }),

    updateProgress: builder.mutation<
      UpdateProgressResponse,
      { id: string; progress: UpdateProgressRequest }
    >({
      query: ({ id, progress }) => ({
        url: `/api/ai/content/${id}/progress`,
        method: "PATCH",
        body: progress,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "AiLearning", id },
        "AiLearning",
      ],
    }),
  }),
});

export const {
  useRequestNudgeMutation,
  useGenerateContentMutation,
  useGetMyLearningQuery,
  useGetCommunityQuery,
  useGetContentQuery,
  useFetchLessonMutation,
  useUpdateProgressMutation,
} = aiService;
