import { api } from "@/apis/api";
import type {
  AdminQuestion,
  CreateQuestionPayload,
  UpdateQuestionPayload,
  BulkUploadResult,
  QuestionsPagination,
} from "./types";

export interface QuestionsFilters {
  topicId?: string;
  difficulty?: string;
  page?: number;
  limit?: number;
}

export interface QuestionsListResponse {
  questions: AdminQuestion[];
  pagination: QuestionsPagination;
}

export const questionsService = api.injectEndpoints({
  endpoints: (builder) => ({
    getQuestions: builder.query<QuestionsListResponse, QuestionsFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.topicId) params.set("topicId", filters.topicId);
        if (filters.difficulty) params.set("difficulty", filters.difficulty);
        if (filters.page) params.set("page", String(filters.page));
        if (filters.limit) params.set("limit", String(filters.limit));
        const q = params.toString();
        return `/api/assessment/questions${q ? `?${q}` : ""}`;
      },
      transformResponse: (raw: any) =>
        Array.isArray(raw)
          ? {
              questions: raw,
              pagination: {
                page: 1,
                limit: raw.length,
                total: raw.length,
                totalPages: 1,
              },
            }
          : raw,
      providesTags: ["Questions"],
    }),

    createQuestion: builder.mutation<AdminQuestion, CreateQuestionPayload>({
      query: (payload) => ({
        url: "/api/assessment/questions",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Questions"],
    }),

    bulkCreateQuestions: builder.mutation<
      BulkUploadResult,
      { questions: CreateQuestionPayload[] }
    >({
      query: (payload) => ({
        url: "/api/assessment/questions/bulk",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Questions"],
    }),

    updateQuestion: builder.mutation<
      AdminQuestion,
      { id: string; payload: UpdateQuestionPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/api/assessment/questions/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Questions"],
    }),

    deleteQuestion: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/assessment/questions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Questions"],
    }),
  }),
});

export const {
  useGetQuestionsQuery,
  useCreateQuestionMutation,
  useBulkCreateQuestionsMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} = questionsService;
