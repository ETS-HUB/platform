import { api } from "@/apis/api";
import type {
  AdminLessonListItem,
  AdminLessonDetail,
  AdminContentBlock,
  AdminLessonQuestion,
  CreateLessonPayload,
  UpdateLessonPayload,
} from "./types";

// ── Tutor types ───────────────────────────────────────────────────────────
export interface AssignedTutor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
}

export interface AssignTutorPayload {
  tutorId: string;
  topicId: string;
}

// ── Response wrappers ──────────────────────────────────────────────────────
export interface LessonsListResponse {
  lessons: AdminLessonListItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LessonsListFilters {
  topicId?: string;
  isPublished?: boolean;
  page?: number;
  limit?: number;
}

export const lessonsAdminService = api.injectEndpoints({
  endpoints: (builder) => ({
    // ── Lessons ──────────────────────────────────────────────────────────
    getAdminLessons: builder.query<AdminLessonListItem[], LessonsListFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.topicId) params.set("topicId", filters.topicId);
        if (filters.isPublished !== undefined)
          params.set("isPublished", String(filters.isPublished));
        if (filters.page) params.set("page", String(filters.page));
        if (filters.limit) params.set("limit", String(filters.limit));
        const q = params.toString();
        return `/api/lessons/admin${q ? `?${q}` : ""}`;
      },
      transformResponse: (raw: any) =>
        Array.isArray(raw) ? raw : (raw.lessons ?? []),
      providesTags: ["Lessons"],
    }),

    getAdminLessonDetail: builder.query<AdminLessonDetail, string>({
      query: (lessonId) => `/api/lessons/admin/${lessonId}`,
      providesTags: (_r, _e, id) => [{ type: "Lessons", id }],
    }),

    createLesson: builder.mutation<AdminLessonDetail, CreateLessonPayload>({
      query: (payload) => ({
        url: "/api/lessons",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Lessons"],
    }),

    updateLesson: builder.mutation<
      AdminLessonDetail,
      { id: string; payload: UpdateLessonPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/api/lessons/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_r, _e, { id }) => ["Lessons", { type: "Lessons", id }],
    }),

    deleteLesson: builder.mutation<void, string>({
      query: (id) => ({ url: `/api/lessons/${id}`, method: "DELETE" }),
      invalidatesTags: ["Lessons"],
    }),

    // ── Content blocks ────────────────────────────────────────────────────
    addContentBlock: builder.mutation<
      AdminContentBlock,
      { lessonId: string; payload: Omit<AdminContentBlock, "id"> }
    >({
      query: ({ lessonId, payload }) => ({
        url: `/api/lessons/${lessonId}/content`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (_r, _e, { lessonId }) => [
        { type: "Lessons", id: lessonId },
      ],
    }),

    updateContentBlock: builder.mutation<
      AdminContentBlock,
      { blockId: string; payload: Partial<AdminContentBlock> }
    >({
      query: ({ blockId, payload }) => ({
        url: `/api/lessons/content/${blockId}`,
        method: "PATCH",
        body: payload,
      }),
    }),

    deleteContentBlock: builder.mutation<void, string>({
      query: (blockId) => ({
        url: `/api/lessons/content/${blockId}`,
        method: "DELETE",
      }),
    }),

    // ── Questions ─────────────────────────────────────────────────────────
    addLessonQuestion: builder.mutation<
      AdminLessonQuestion,
      { lessonId: string; payload: Omit<AdminLessonQuestion, "id"> }
    >({
      query: ({ lessonId, payload }) => ({
        url: `/api/lessons/${lessonId}/questions`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (_r, _e, { lessonId }) => [
        { type: "Lessons", id: lessonId },
      ],
    }),

    updateLessonQuestion: builder.mutation<
      AdminLessonQuestion,
      { questionId: string; payload: Partial<AdminLessonQuestion> }
    >({
      query: ({ questionId, payload }) => ({
        url: `/api/lessons/questions/${questionId}`,
        method: "PATCH",
        body: payload,
      }),
    }),

    deleteLessonQuestion: builder.mutation<void, string>({
      query: (questionId) => ({
        url: `/api/lessons/questions/${questionId}`,
        method: "DELETE",
      }),
    }),

    // ── Tutor assignment ──────────────────────────────────────────────────
    getTopicTutors: builder.query<AssignedTutor[], string>({
      query: (topicId) => `/api/lessons/tutors/${topicId}`,
      providesTags: (_r, _e, topicId) => [
        { type: "Lessons", id: `tutors-${topicId}` },
      ],
    }),

    assignTutor: builder.mutation<void, AssignTutorPayload>({
      query: (payload) => ({
        url: "/api/lessons/tutors/assign",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (_r, _e, { topicId }) => [
        { type: "Lessons", id: `tutors-${topicId}` },
      ],
    }),

    removeTutor: builder.mutation<void, { tutorId: string; topicId: string }>({
      query: ({ tutorId, topicId }) => ({
        url: `/api/lessons/tutors/${tutorId}/${topicId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, { topicId }) => [
        { type: "Lessons", id: `tutors-${topicId}` },
      ],
    }),
  }),
});

export const {
  useGetAdminLessonsQuery,
  useGetAdminLessonDetailQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
  useAddContentBlockMutation,
  useUpdateContentBlockMutation,
  useDeleteContentBlockMutation,
  useAddLessonQuestionMutation,
  useUpdateLessonQuestionMutation,
  useDeleteLessonQuestionMutation,
  useGetTopicTutorsQuery,
  useAssignTutorMutation,
  useRemoveTutorMutation,
} = lessonsAdminService;
