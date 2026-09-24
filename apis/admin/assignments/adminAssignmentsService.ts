import { api } from "@/apis/api";
import type {
  AdminAssignment,
  AdminAssignmentsResponse,
  GetAdminAssignmentsParams,
  SubmissionListItem,
  ReviewedSubmission,
  CreateAssignmentPayload,
  UpdateAssignmentPayload,
  ReviewPayload,
  GetSubmissionsParams,
} from "./types";

export const adminAssignmentsService = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminAssignments: builder.query<
      AdminAssignmentsResponse,
      GetAdminAssignmentsParams
    >({
      query: (params) => ({
        url: "/api/assignments/admin/all",
        params,
      }),
      providesTags: ["Assignments"],
    }),

    // kept for use by AssignmentFormModal lessons dropdown and grading tab
    getAdminCourseAssignments: builder.query<AdminAssignment[], string>({
      query: (topicId) => `/api/assignments/course/${topicId}`,
      providesTags: ["Assignments"],
    }),

    createAdminAssignment: builder.mutation<
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

    updateAdminAssignment: builder.mutation<
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

    deleteAdminAssignment: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/assignments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Assignments"],
    }),

    getTopicSubmissions: builder.query<
      SubmissionListItem[],
      GetSubmissionsParams
    >({
      query: ({ topicId, status }) => ({
        url: `/api/assignments/submissions/${topicId}`,
        params: status ? { status } : undefined,
      }),
      providesTags: (_r, _e, { topicId }) => [
        { type: "Assignments", id: `sub-${topicId}` },
      ],
    }),

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
  useGetAdminAssignmentsQuery,
  useGetAdminCourseAssignmentsQuery,
  useCreateAdminAssignmentMutation,
  useUpdateAdminAssignmentMutation,
  useDeleteAdminAssignmentMutation,
  useGetTopicSubmissionsQuery,
  useReviewSubmissionMutation,
} = adminAssignmentsService;
