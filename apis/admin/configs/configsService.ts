import { api } from "@/apis/api";
import type { AssessmentConfig, ConfigPayload } from "./types";

export const configsService = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminConfigs: builder.query<
      AssessmentConfig[],
      { track?: string } | void
    >({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.track) params.set("track", filters.track);
        const q = params.toString();
        return `/api/assessment/configs${q ? `?${q}` : ""}`;
      },
      providesTags: ["Assessment"],
    }),

    createConfig: builder.mutation<AssessmentConfig, ConfigPayload>({
      query: (payload) => ({
        url: "/api/assessment/configs",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Assessment"],
    }),

    updateConfig: builder.mutation<
      AssessmentConfig,
      { id: string; payload: Partial<ConfigPayload> }
    >({
      query: ({ id, payload }) => ({
        url: `/api/assessment/configs/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Assessment"],
    }),

    deleteConfig: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/assessment/configs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Assessment"],
    }),
  }),
});

export const {
  useGetAdminConfigsQuery,
  useCreateConfigMutation,
  useUpdateConfigMutation,
  useDeleteConfigMutation,
} = configsService;
