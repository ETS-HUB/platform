import { api } from "@/apis/api";
import type {
  AdminResource,
  ResourcePayload,
  ResourcesPagination,
} from "./types";

export interface ResourcesFilters {
  topicId?: string;
  type?: string;
  difficulty?: string;
  page?: number;
  limit?: number;
}

export interface ResourcesListResponse {
  resources: AdminResource[];
  pagination: ResourcesPagination;
}

export const resourcesService = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminResources: builder.query<ResourcesListResponse, ResourcesFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.topicId) params.set("topicId", filters.topicId);
        if (filters.type) params.set("type", filters.type);
        if (filters.difficulty) params.set("difficulty", filters.difficulty);
        if (filters.page) params.set("page", String(filters.page));
        if (filters.limit) params.set("limit", String(filters.limit));
        const q = params.toString();
        return `/api/resources${q ? `?${q}` : ""}`;
      },
      transformResponse: (raw: any) =>
        Array.isArray(raw)
          ? {
              resources: raw,
              pagination: {
                page: 1,
                limit: raw.length,
                total: raw.length,
                totalPages: 1,
              },
            }
          : raw,
      providesTags: ["Resources"],
    }),

    createResource: builder.mutation<AdminResource, ResourcePayload>({
      query: (payload) => ({
        url: "/api/resources",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Resources"],
    }),

    bulkCreateResources: builder.mutation<
      { uploaded: number },
      { resources: ResourcePayload[] }
    >({
      query: (payload) => ({
        url: "/api/resources/bulk",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Resources"],
    }),

    updateResource: builder.mutation<
      AdminResource,
      { id: string; payload: Partial<ResourcePayload> }
    >({
      query: ({ id, payload }) => ({
        url: `/api/resources/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Resources"],
    }),

    deleteResource: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/resources/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Resources"],
    }),
  }),
});

export const {
  useGetAdminResourcesQuery,
  useCreateResourceMutation,
  useBulkCreateResourcesMutation,
  useUpdateResourceMutation,
  useDeleteResourceMutation,
} = resourcesService;
