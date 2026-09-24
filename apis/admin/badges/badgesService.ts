import { api } from "@/apis/api";
import type { BadgeDefinition, BadgePayload } from "./types";

interface BadgeListResponse {
  definitions: BadgeDefinition[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const badgesService = api.injectEndpoints({
  endpoints: (builder) => ({
    getBadgeDefinitions: builder.query<BadgeListResponse, void>({
      query: () => "/api/gamification/badge-definitions",
      providesTags: ["Badges"],
    }),

    createBadgeDefinition: builder.mutation<BadgeDefinition, BadgePayload>({
      query: (payload) => ({
        url: "/api/gamification/badge-definitions",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Badges"],
    }),

    // PATCH — update fields OR pass { isActive: false } to deactivate
    updateBadgeDefinition: builder.mutation<
      BadgeDefinition,
      { id: string; payload: Partial<BadgePayload> & { isActive?: boolean } }
    >({
      query: ({ id, payload }) => ({
        url: `/api/gamification/badge-definitions/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Badges"],
    }),

    // DELETE — hard-deletes the record
    deleteBadgeDefinition: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/gamification/badge-definitions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Badges"],
    }),
  }),
});

export const {
  useGetBadgeDefinitionsQuery,
  useCreateBadgeDefinitionMutation,
  useUpdateBadgeDefinitionMutation,
  useDeleteBadgeDefinitionMutation,
} = badgesService;
