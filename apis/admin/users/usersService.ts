import { api } from "@/apis/api";
import type {
  AdminUserListItem,
  AdminUserDetail,
  CandidateListItem,
  CandidateFilters,
  UsersPagination,
  CreateUserPayload,
  UpdateUserPayload,
} from "./types";

export interface UserListFilters {
  role?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UsersListResponse {
  users: AdminUserListItem[];
  pagination: UsersPagination;
}

export interface CandidatesListResponse {
  candidates: CandidateListItem[];
  pagination: UsersPagination;
}

export const usersService = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUsers: builder.query<UsersListResponse, UserListFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.role) params.set("role", filters.role);
        if (filters.search) params.set("search", filters.search);
        if (filters.isActive !== undefined)
          params.set("isActive", String(filters.isActive));
        if (filters.page) params.set("page", String(filters.page));
        if (filters.limit) params.set("limit", String(filters.limit));
        const q = params.toString();
        return `/api/admin/users${q ? `?${q}` : ""}`;
      },
      providesTags: ["Users"],
    }),

    getAdminUserDetail: builder.query<AdminUserDetail, string>({
      query: (userId) => `/api/admin/users/${userId}`,
      providesTags: (_r, _e, id) => [{ type: "Users", id }],
    }),

    createAdminUser: builder.mutation<AdminUserListItem, CreateUserPayload>({
      query: (payload) => ({
        url: "/api/admin/users",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Users"],
    }),

    updateAdminUser: builder.mutation<
      AdminUserListItem,
      { userId: string; payload: UpdateUserPayload }
    >({
      query: ({ userId, payload }) => ({
        url: `/api/admin/users/${userId}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_r, _e, { userId }) => [
        "Users",
        { type: "Users", id: userId },
      ],
    }),

    deactivateUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/api/admin/users/${userId}/deactivate`,
        method: "POST",
      }),
      invalidatesTags: ["Users"],
    }),

    activateUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/api/admin/users/${userId}/activate`,
        method: "POST",
      }),
      invalidatesTags: ["Users"],
    }),

    resetUserPassword: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/api/admin/users/${userId}/reset-password`,
        method: "POST",
      }),
    }),

    getCandidates: builder.query<CandidatesListResponse, CandidateFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.skill) params.set("skill", filters.skill);
        if (filters.minScore !== undefined)
          params.set("minScore", String(filters.minScore));
        if (filters.maxScore !== undefined)
          params.set("maxScore", String(filters.maxScore));
        if (filters.experienceLevel)
          params.set("experienceLevel", filters.experienceLevel);
        if (filters.goal) params.set("goal", filters.goal);
        if (filters.page) params.set("page", String(filters.page));
        if (filters.limit) params.set("limit", String(filters.limit));
        const q = params.toString();
        return `/api/users/candidates${q ? `?${q}` : ""}`;
      },
      providesTags: ["Users"],
    }),
  }),
});

export const {
  useGetAdminUsersQuery,
  useGetAdminUserDetailQuery,
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useDeactivateUserMutation,
  useActivateUserMutation,
  useResetUserPasswordMutation,
  useGetCandidatesQuery,
} = usersService;
