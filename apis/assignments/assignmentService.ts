import { api } from "../api";

// ── Types ─────────────────────────────────────────────────────────────────

export interface UploadedFile {
  url: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt?: string;
}

export interface SubmissionPayload {
  link?: string;
  files?: UploadedFile[];
  text?: string;
}

export interface MySubmission {
  id: string;
  status: "SUBMITTED" | "APPROVED" | "REJECTED";
  score: number | null;
  feedback: string | null;
  link: string | null;
  files: UploadedFile[];
  text: string | null;
  submittedAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  type: string;
  dueDate: string | null;
  maxScore: number;
  mySubmission: MySubmission | null;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  lessonId: string;
  courseName: string;
  isSubmitted: boolean;
  mySubmission: MySubmission | null;
}

// ── Service ───────────────────────────────────────────────────────────────

export const assignmentService = api.injectEndpoints({
  endpoints: (builder) => ({
    getCourseAssignments: builder.query<Assignment[], string>({
      query: (topicId) => `/api/assignments/course/${topicId}`,
      providesTags: ["Assignments"],
    }),

    getAssignmentDetail: builder.query<{ assignment: Assignment }, string>({
      query: (id) => `/api/assignments/detail/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Assignments", id }],
    }),

    getMySubmissions: builder.query<{ submissions: MySubmission[] }, void>({
      query: () => "/api/assignments/my-submissions",
      providesTags: ["Assignments"],
    }),

    getMyProjects: builder.query<ProjectItem[], void>({
      query: () => "/api/assignments/my-projects",
      providesTags: ["Assignments"],
    }),

    submitAssignment: builder.mutation<
      MySubmission,
      { assignmentId: string; payload: SubmissionPayload }
    >({
      query: ({ assignmentId, payload }) => ({
        url: `/api/assignments/submit/${assignmentId}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Assignments", "Lessons"],
    }),
  }),
});

export const {
  useGetCourseAssignmentsQuery,
  useGetAssignmentDetailQuery,
  useGetMySubmissionsQuery,
  useGetMyProjectsQuery,
  useSubmitAssignmentMutation,
} = assignmentService;
