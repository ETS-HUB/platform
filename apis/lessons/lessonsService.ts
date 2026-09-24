import { api } from "../api";
import type { HierarchyResponse, HierarchyParams } from "../lessons/types";

export interface CategoryListItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  coverImage: string | null;
  _count: { children: number };
}

export interface BookmarkedCourse {
  courseId: string;
  courseName: string;
  courseDescription: string;
  courseIcon: string;
  coverImage: string | null;
  category: string;
  track: string | null;
  totalLessons: number;
  totalEnrolled: number;
  bookmarkedAt: string;
}

export const lessonsService = api.injectEndpoints({
  endpoints: (builder) => ({
    getTopicsHierarchy: builder.query<
      HierarchyResponse,
      HierarchyParams | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.track) searchParams.set("track", params.track);
        if (params?.category) searchParams.set("category", params.category);
        if (params?.page) searchParams.set("page", String(params.page));
        if (params?.limit) searchParams.set("limit", String(params.limit));
        const query = searchParams.toString();
        return `/api/lessons/topics/hierarchy${query ? `?${query}` : ""}`;
      },
      providesTags: ["Lessons"],
    }),

    getCategories: builder.query<CategoryListItem[], void>({
      query: () => "/api/lessons/topics/categories",
      providesTags: ["Lessons"],
    }),

    getBookmarks: builder.query<BookmarkedCourse[], void>({
      query: () => "/api/lessons/bookmarks",
      providesTags: ["Bookmarks"],
    }),

    addBookmark: builder.mutation<void, string>({
      query: (topicId) => ({
        url: `/api/lessons/bookmark/${topicId}`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, topicId) => [
        "Bookmarks",
        { type: "Dashboard", id: topicId },
      ],
    }),

    removeBookmark: builder.mutation<void, string>({
      query: (topicId) => ({
        url: `/api/lessons/bookmark/${topicId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, topicId) => [
        "Bookmarks",
        { type: "Dashboard", id: topicId },
      ],
    }),

    // ── Lesson Detail ───────────────────────────────────────────────────
    getLesson: builder.query<LessonResponse, string>({
      query: (lessonId) => `/api/lessons/${lessonId}`,
      providesTags: (_result, _error, lessonId) => [
        { type: "Lessons", id: lessonId },
      ],
    }),

    answerLessonQuestion: builder.mutation<
      LessonAnswerResult,
      { lessonId: string; questionId: string; selectedOption: string }
    >({
      query: ({ lessonId, questionId, selectedOption }) => ({
        url: `/api/lessons/${lessonId}/answer/${questionId}`,
        method: "POST",
        body: { selectedOption },
      }),
    }),

    completeLesson: builder.mutation<
      LessonCompleteResult,
      { lessonId: string; score?: number }
    >({
      query: ({ lessonId, score }) => ({
        url: `/api/lessons/${lessonId}/complete`,
        method: "POST",
        body: score !== undefined ? { score } : {},
      }),
      invalidatesTags: ["Lessons", "Dashboard"],
    }),

    getTopicProgress: builder.query<TopicProgressResponse, string>({
      query: (topicId) => `/api/lessons/topics/${topicId}/progress`,
      providesTags: (_r, _e, topicId) => [
        { type: "Lessons", id: `progress-${topicId}` },
      ],
    }),

    claimCertificate: builder.mutation<ClaimCertificateResult, string>({
      query: (topicId) => ({
        url: `/api/certificates/claim/${topicId}`,
        method: "POST",
      }),
      invalidatesTags: ["Dashboard", "Lessons"],
    }),
  }),
});

// ── Lesson Types ──────────────────────────────────────────────────────────

export interface LessonQuestionOption {
  id: string;
  text: string;
}

export interface LessonQuestion {
  id: string;
  order: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  text: string;
  options: LessonQuestionOption[];
  points: number;
}

export interface LessonContentBlock {
  type: "TEXT" | "VIDEO" | "CODE" | "RESOURCE_LINK";
  order: number;
  title: string;
  content: string;
  overview?: string | null;
  metadata?: { duration?: string; provider?: string; language?: string };
  questions?: LessonQuestion[];
}

export interface LessonResponse {
  id: string;
  title: string;
  description?: string;
  order: number;
  duration: number;
  topic?: { name: string; id: string };
  isLocked: boolean;
  lockReason?: string | null;
  contentBlocks: LessonContentBlock[];
  questions: LessonQuestion[];
}

export interface LessonAnswerResult {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
  points: number;
}

export interface LessonCompleteResult {
  completed: boolean;
  score: number;
  completedAt: string;
  xpEarned: number;
  nextLesson?: { id: string; title: string } | null;
}

export interface TopicProgressLesson {
  id?: string;
  title: string;
  order: number;
  isCompleted: boolean;
  score: number | null;
}

export interface TopicProgressResponse {
  totalLessons: number;
  completedLessons: number;
  percentage: number;
  lessons: TopicProgressLesson[];
}

export interface ClaimCertificateResult {
  id: string;
  userId: string;
  topicId: string;
  lessonsCompleted: number;
  totalLessons: number;
  projectsApproved: number;
  totalProjects: number;
  averageQuizScore: number;
  overallGrade: string;
  certificateId: string;
  issuedAt: string;
}

export const {
  useGetTopicsHierarchyQuery,
  useGetCategoriesQuery,
  useGetBookmarksQuery,
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
  useGetLessonQuery,
  useAnswerLessonQuestionMutation,
  useCompleteLessonMutation,
  useGetTopicProgressQuery,
  useClaimCertificateMutation,
} = lessonsService;
