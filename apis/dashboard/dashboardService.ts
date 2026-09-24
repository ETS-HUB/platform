import { api } from "../api";
import type {
  DashboardResponse,
  CourseDetailResponse,
  UserMeResponse,
} from "../dashboard/types";

export const dashboardService = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardResponse, void>({
      query: () => "/api/dashboard/courses",
      providesTags: ["Dashboard"],
    }),

    getCourseDetail: builder.query<CourseDetailResponse, string>({
      query: (courseId) => `/api/dashboard/courses/${courseId}`,
      providesTags: (_result, _error, courseId) => [
        { type: "Dashboard", id: courseId },
      ],
    }),

    getUserMe: builder.query<UserMeResponse, void>({
      query: () => "/api/users/me",
      providesTags: ["Users"],
    }),
  }),
});

export const {
  useGetDashboardQuery,
  useGetCourseDetailQuery,
  useGetUserMeQuery,
} = dashboardService;
