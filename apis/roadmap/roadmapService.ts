import { api } from "@/apis/api";
import type {
  RoadmapSummary,
  RoadmapDetail,
  RoadmapWithProgress,
  NodeStatusRecord,
  NodeStatus,
  AdminRoadmapListItem,
  CreateRoadmapPayload,
  UpdateRoadmapPayload,
  NodeContent,
  CreateNodeContentPayload,
  UpdateNodeContentPayload,
  ImportRoadmapPayload,
  ImportNodeContentPayload,
  BulkImportResult,
} from "./types";

export const roadmapService = api.injectEndpoints({
  endpoints: (builder) => ({
    getRoadmaps: builder.query<RoadmapSummary[], void>({
      query: () => "/api/roadmap",
      providesTags: ["Roadmaps" as const],
    }),

    getRoadmap: builder.query<RoadmapDetail, string>({
      query: (slug) => `/api/roadmap/${slug}`,
      providesTags: (_r, _e, slug) => [{ type: "Roadmaps" as const, id: slug }],
    }),

    getRoadmapProgress: builder.query<RoadmapWithProgress, string>({
      query: (slug) => `/api/roadmap/${slug}/my-progress`,
      providesTags: (_r, _e, slug) => [
        { type: "Roadmaps" as const, id: `progress-${slug}` },
      ],
    }),

    setNodeStatus: builder.mutation<
      NodeStatusRecord,
      { slug: string; nodeId: string; status: NodeStatus }
    >({
      query: ({ slug, nodeId, status }) => ({
        url: `/api/roadmap/${slug}/${nodeId}/status`,
        method: "POST",
        body: { status },
      }),
      invalidatesTags: (_r, _e, { slug }) => [
        { type: "Roadmaps" as const, id: `progress-${slug}` },
      ],
    }),

    unsetNodeStatus: builder.mutation<
      { message: string },
      { slug: string; nodeId: string }
    >({
      query: ({ slug, nodeId }) => ({
        url: `/api/roadmap/${slug}/${nodeId}/status`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, { slug }) => [
        { type: "Roadmaps" as const, id: `progress-${slug}` },
      ],
    }),

    clearProgress: builder.mutation<{ message: string }, string>({
      query: (slug) => ({
        url: `/api/roadmap/${slug}/progress/clear`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, slug) => [
        { type: "Roadmaps" as const, id: `progress-${slug}` },
      ],
    }),

    getAdminRoadmaps: builder.query<AdminRoadmapListItem[], void>({
      query: () => "/api/roadmap/admin/all",
      providesTags: ["Roadmaps" as const],
    }),

    createRoadmap: builder.mutation<RoadmapDetail, CreateRoadmapPayload>({
      query: (payload) => ({
        url: "/api/roadmap",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Roadmaps" as const],
    }),

    updateRoadmap: builder.mutation<
      RoadmapDetail,
      { slug: string; payload: UpdateRoadmapPayload }
    >({
      query: ({ slug, payload }) => ({
        url: `/api/roadmap/${slug}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_r, _e, { slug }) => [
        "Roadmaps" as const,
        { type: "Roadmaps" as const, id: slug },
      ],
    }),

    deleteRoadmap: builder.mutation<{ message: string }, string>({
      query: (slug) => ({
        url: `/api/roadmap/${slug}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Roadmaps" as const],
    }),

    syncRoadmap: builder.mutation<RoadmapDetail, string>({
      query: (slug) => ({
        url: `/api/roadmap/sync/${slug}`,
        method: "POST",
      }),
      invalidatesTags: ["Roadmaps" as const],
    }),

    getNodeContent: builder.query<
      NodeContent,
      { slug: string; nodeId: string }
    >({
      query: ({ slug, nodeId }) =>
        `/api/roadmap/${slug}/node/${nodeId}/content`,
      providesTags: (_r, _e, { slug, nodeId }) => [
        { type: "Roadmaps" as const, id: `node-${slug}-${nodeId}` },
      ],
    }),

    syncNodeContent: builder.mutation<
      NodeContent,
      { slug: string; nodeId: string }
    >({
      query: ({ slug, nodeId }) => ({
        url: `/api/roadmap/sync/${slug}/node/${nodeId}`,
        method: "POST",
      }),
      invalidatesTags: (_r, _e, { slug, nodeId }) => [
        { type: "Roadmaps" as const, id: `node-${slug}-${nodeId}` },
      ],
    }),

    syncAllNodes: builder.mutation<{ message: string; synced: number }, string>(
      {
        query: (slug) => ({
          url: `/api/roadmap/sync/${slug}/nodes/all`,
          method: "POST",
        }),
        invalidatesTags: (_r, _e, slug) => [
          { type: "Roadmaps" as const, id: slug },
        ],
      },
    ),

    createNodeContent: builder.mutation<NodeContent, CreateNodeContentPayload>({
      query: (payload) => ({
        url: "/api/roadmap/node-content",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (_r, _e, { roadmapSlug, nodeId }) => [
        { type: "Roadmaps" as const, id: `node-${roadmapSlug}-${nodeId}` },
      ],
    }),

    updateNodeContent: builder.mutation<
      NodeContent,
      { slug: string; nodeId: string; payload: UpdateNodeContentPayload }
    >({
      query: ({ slug, nodeId, payload }) => ({
        url: `/api/roadmap/${slug}/node/${nodeId}/content`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_r, _e, { slug, nodeId }) => [
        { type: "Roadmaps" as const, id: `node-${slug}-${nodeId}` },
      ],
    }),

    deleteNodeContent: builder.mutation<
      { message: string },
      { slug: string; nodeId: string }
    >({
      query: ({ slug, nodeId }) => ({
        url: `/api/roadmap/${slug}/node/${nodeId}/content`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, { slug, nodeId }) => [
        { type: "Roadmaps" as const, id: `node-${slug}-${nodeId}` },
      ],
    }),

    getAllNodeContents: builder.query<NodeContent[], string>({
      query: (slug) => `/api/roadmap/${slug}/node-contents/all`,
      providesTags: (_r, _e, slug) => [
        { type: "Roadmaps" as const, id: `nodes-${slug}` },
      ],
    }),

    importRoadmap: builder.mutation<RoadmapDetail, ImportRoadmapPayload>({
      query: (payload) => ({
        url: "/api/roadmap/import/roadmap",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Roadmaps" as const],
    }),

    importNodeContent: builder.mutation<NodeContent, ImportNodeContentPayload>({
      query: (payload) => ({
        url: "/api/roadmap/import/node-content",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (_r, _e, { roadmapSlug, nodeId }) => [
        { type: "Roadmaps" as const, id: `node-${roadmapSlug}-${nodeId}` },
      ],
    }),

    importNodeContentsBulk: builder.mutation<
      BulkImportResult,
      ImportNodeContentPayload[]
    >({
      query: (payload) => ({
        url: "/api/roadmap/import/node-contents/bulk",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (_r, _e, contents) => {
        const slugs = [...new Set(contents.map((c) => c.roadmapSlug))];
        return slugs.map((slug) => ({
          type: "Roadmaps" as const,
          id: `nodes-${slug}`,
        }));
      },
    }),
  }),
});

export const {
  useGetRoadmapsQuery,
  useGetRoadmapQuery,
  useGetRoadmapProgressQuery,
  useSetNodeStatusMutation,
  useUnsetNodeStatusMutation,
  useClearProgressMutation,
  useGetAdminRoadmapsQuery,
  useCreateRoadmapMutation,
  useUpdateRoadmapMutation,
  useDeleteRoadmapMutation,
  useSyncRoadmapMutation,
  useGetNodeContentQuery,
  useLazyGetNodeContentQuery,
  useSyncNodeContentMutation,
  useSyncAllNodesMutation,
  useCreateNodeContentMutation,
  useUpdateNodeContentMutation,
  useDeleteNodeContentMutation,
  useGetAllNodeContentsQuery,
  useImportRoadmapMutation,
  useImportNodeContentMutation,
  useImportNodeContentsBulkMutation,
} = roadmapService;
