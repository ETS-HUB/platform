import { api } from "../api";
import type {
  AssignmentListItem,
  AssignmentDetail,
  MySubmission,
  SubmittedFile,
} from "./types";

export interface SubmissionPayload {
  link?: string;
  files?: SubmittedFile[];
  text?: string;
}

export const assignmentService = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/assignments/course/:topicId — all assignments for an enrolled course
    getCourseAssignments: builder.query<AssignmentListItem[], string>({
      query: (topicId) => `/api/assignments/course/${topicId}`,
      providesTags: ["Assignments"],
    }),

    // GET /api/assignments/detail/:id — full assignment + student's submission
    getAssignmentDetail: builder.query<AssignmentDetail, string>({
      query: (id) => `/api/assignments/detail/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Assignments", id }],
    }),

    // POST /api/assignments/submit/:assignmentId
    submitAssignment: builder.mutation<
      MySubmission,
      { assignmentId: string; payload: SubmissionPayload }
    >({
      query: ({ assignmentId, payload }) => ({
        url: `/api/assignments/submit/${assignmentId}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (_r, _e, { assignmentId }) => [
        "Assignments",
        { type: "Assignments", id: assignmentId },
        "Lessons",
      ],
    }),
  }),
});

export const {
  useGetCourseAssignmentsQuery,
  useGetAssignmentDetailQuery,
  useSubmitAssignmentMutation,
} = assignmentService;
