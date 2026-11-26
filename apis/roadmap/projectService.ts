import { api } from "@/apis/api";
import type {
  ProjectAdminListResponse,
  ProjectListResponse,
  ProjectDetail,
  ProjectAdminItem,
  Submission,
  SubmissionsResponse,
  VoteResponse,
  CreateProjectPayload,
  UpdateProjectPayload,
  UserProject,
} from "./projectTypes";

export const projectService = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminProjects: builder.query<
      ProjectAdminListResponse,
      { status?: string; difficulty?: string; page?: number; limit?: number }
    >({
      query: (params) => ({ url: "/api/projects/admin", params }),
      providesTags: ["Projects"],
    }),

    createProject: builder.mutation<ProjectAdminItem, CreateProjectPayload>({
      query: (body) => ({ url: "/api/projects", method: "POST", body }),
      invalidatesTags: ["Projects"],
    }),

    updateProject: builder.mutation<
      ProjectAdminItem,
      { id: string; payload: UpdateProjectPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/api/projects/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        "Projects",
        { type: "Projects", id },
      ],
    }),

    publishProject: builder.mutation<ProjectAdminItem, string>({
      query: (id) => ({ url: `/api/projects/${id}/publish`, method: "POST" }),
      invalidatesTags: ["Projects"],
    }),

    archiveProject: builder.mutation<ProjectAdminItem, string>({
      query: (id) => ({ url: `/api/projects/${id}/archive`, method: "POST" }),
      invalidatesTags: ["Projects"],
    }),

    deleteProject: builder.mutation<void, string>({
      query: (id) => ({ url: `/api/projects/${id}`, method: "DELETE" }),
      invalidatesTags: ["Projects"],
    }),

    getProjects: builder.query<
      ProjectListResponse,
      { difficulty?: string; roadmapId?: string; page?: number; limit?: number }
    >({
      query: (params) => ({ url: "/api/projects", params }),
      providesTags: ["Projects"],
    }),

    getProject: builder.query<ProjectDetail, string>({
      query: (id) => `/api/projects/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Projects", id }],
    }),

    startProject: builder.mutation<UserProject, string>({
      query: (id) => ({ url: `/api/projects/${id}/start`, method: "POST" }),
      invalidatesTags: (_r, _e, id) => ["Projects", { type: "Projects", id }],
    }),

    submitProject: builder.mutation<
      UserProject,
      { id: string; solutionUrl: string }
    >({
      query: ({ id, solutionUrl }) => ({
        url: `/api/projects/${id}/submit`,
        method: "POST",
        body: { solutionUrl },
      }),
      invalidatesTags: (_r, _e, { id }) => [
        "Projects",
        { type: "Projects", id },
      ],
    }),

    getSubmissions: builder.query<
      SubmissionsResponse,
      { id: string; page?: number; limit?: number }
    >({
      query: ({ id, ...params }) => ({
        url: `/api/projects/${id}/submissions`,
        params,
      }),
      providesTags: (_r, _e, { id }) => [
        { type: "Projects", id: `submissions-${id}` },
      ],
    }),

    voteSubmission: builder.mutation<
      VoteResponse,
      { userProjectId: string; voteType: "UPVOTE" | "DOWNVOTE" }
    >({
      query: ({ userProjectId, voteType }) => ({
        url: `/api/projects/submissions/${userProjectId}/vote`,
        method: "POST",
        body: { voteType },
      }),
      invalidatesTags: ["Projects"],
    }),
  }),
});

export const {
  useGetAdminProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  usePublishProjectMutation,
  useArchiveProjectMutation,
  useDeleteProjectMutation,
  useGetProjectsQuery,
  useGetProjectQuery,
  useStartProjectMutation,
  useSubmitProjectMutation,
  useGetSubmissionsQuery,
  useVoteSubmissionMutation,
} = projectService;
