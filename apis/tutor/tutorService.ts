import { api } from "@/apis/api";
import type { TutorDashboard, TutorCourse } from "./dashboard/types";
import type {
  TutorCourseDetail,
  RosterResponse,
  StudentProgress,
} from "./courses/types";
import type {
  CreateAssignmentPayload,
  UpdateAssignmentPayload,
  AdminAssignment,
  SubmissionStatus,
  SubmissionListItem,
  AssignmentSubmissionsResponse,
  ReviewQueueItem,
  ReviewHistoryResponse,
  ReviewPayload,
  ReviewedSubmission,
} from "@/apis/admin/assignments/types";

export const tutorService = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/tutor/dashboard
    getTutorDashboard: builder.query<TutorDashboard, void>({
      query: () => "/api/tutor/dashboard",
      providesTags: ["Assignments"],
    }),

    // GET /api/tutor/my-courses
    getTutorMyCourses: builder.query<TutorCourse[], void>({
      query: () => "/api/tutor/my-courses",
      providesTags: ["Lessons"],
    }),

    // GET /api/tutor/courses/:topicId
    getTutorCourseDetail: builder.query<TutorCourseDetail, string>({
      query: (topicId) => `/api/tutor/courses/${topicId}`,
      providesTags: (_r, _e, topicId) => [
        { type: "Lessons", id: topicId },
        "Assignments",
      ],
    }),

    // GET /api/lessons/topics/:topicId/students
    getTopicStudents: builder.query<
      RosterResponse,
      { topicId: string; page?: number; limit?: number }
    >({
      query: ({ topicId, page = 1, limit = 20 }) => ({
        url: `/api/lessons/topics/${topicId}/students`,
        params: { page, limit },
      }),
      providesTags: (_r, _e, { topicId }) => [
        { type: "Lessons", id: `roster-${topicId}` },
      ],
    }),

    // GET /api/lessons/topics/:topicId/students/:studentId/progress
    getStudentProgress: builder.query<
      StudentProgress,
      { topicId: string; studentId: string }
    >({
      query: ({ topicId, studentId }) =>
        `/api/lessons/topics/${topicId}/students/${studentId}/progress`,
      providesTags: (_r, _e, { topicId, studentId }) => [
        { type: "Lessons", id: `progress-${topicId}-${studentId}` },
      ],
    }),

    // POST /api/assignments — tutor creates assignment for their course
    createTutorAssignment: builder.mutation<
      AdminAssignment,
      CreateAssignmentPayload
    >({
      query: (payload) => ({
        url: "/api/assignments",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Assignments"],
    }),

    // PATCH /api/assignments/:id — tutor updates their assignment
    updateTutorAssignment: builder.mutation<
      AdminAssignment,
      { id: string; payload: UpdateAssignmentPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/api/assignments/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Assignments"],
    }),

    // GET /api/assignments/submissions/:topicId — all submissions for a course (filterable by status)
    getCourseSubmissions: builder.query<
      SubmissionListItem[],
      { topicId: string; status?: SubmissionStatus }
    >({
      query: ({ topicId, status }) => ({
        url: `/api/assignments/submissions/${topicId}`,
        params: status ? { status } : undefined,
      }),
      providesTags: (_r, _e, { topicId }) => [
        { type: "Assignments", id: `course-subs-${topicId}` },
      ],
    }),

    // GET /api/assignments/:assignmentId/submissions — submissions for one assignment
    getAssignmentSubmissions: builder.query<
      AssignmentSubmissionsResponse,
      { assignmentId: string; status?: SubmissionStatus }
    >({
      query: ({ assignmentId, status }) => ({
        url: `/api/assignments/${assignmentId}/submissions`,
        params: status ? { status } : undefined,
      }),
      providesTags: (_r, _e, { assignmentId }) => [
        { type: "Assignments", id: `subs-${assignmentId}` },
      ],
    }),

    // GET /api/assignments/my-review-queue — SUBMITTED + IN_REVIEW across all tutor courses
    getMyReviewQueue: builder.query<ReviewQueueItem[], void>({
      query: () => "/api/assignments/my-review-queue",
      providesTags: ["Assignments"],
    }),

    // GET /api/assignments/my-review-history — already-reviewed submissions
    getMyReviewHistory: builder.query<
      ReviewHistoryResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 }) => ({
        url: "/api/assignments/my-review-history",
        params: { page, limit },
      }),
      providesTags: ["Assignments"],
    }),

    // POST /api/assignments/review/:submissionId — submit a review
    reviewSubmission: builder.mutation<
      ReviewedSubmission,
      { submissionId: string; payload: ReviewPayload }
    >({
      query: ({ submissionId, payload }) => ({
        url: `/api/assignments/review/${submissionId}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Assignments"],
    }),
  }),
});

export const {
  useGetTutorDashboardQuery,
  useGetTutorMyCoursesQuery,
  useGetTutorCourseDetailQuery,
  useGetTopicStudentsQuery,
  useGetStudentProgressQuery,
  useCreateTutorAssignmentMutation,
  useUpdateTutorAssignmentMutation,
  useGetCourseSubmissionsQuery,
  useGetAssignmentSubmissionsQuery,
  useGetMyReviewQueueQuery,
  useGetMyReviewHistoryQuery,
  useReviewSubmissionMutation,
} = tutorService;
