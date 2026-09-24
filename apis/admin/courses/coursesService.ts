import { api } from "@/apis/api";
import type {
  CourseNode,
  CreateCategoryPayload,
  CreateCoursePayload,
  UpdateTopicPayload,
} from "./types";

export const coursesService = api.injectEndpoints({
  endpoints: (builder) => ({
    getTopics: builder.query<CourseNode[], void>({
      query: () => "/api/assessment/topics",
      providesTags: ["Courses"],
    }),

    createTopic: builder.mutation<
      CourseNode,
      CreateCategoryPayload | CreateCoursePayload
    >({
      query: (payload) => ({
        url: "/api/assessment/topics",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Courses"],
    }),

    updateTopic: builder.mutation<
      CourseNode,
      { id: string; payload: UpdateTopicPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/api/assessment/topics/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Courses"],
    }),

    deleteTopic: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/assessment/topics/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),
  }),
});

export const {
  useGetTopicsQuery,
  useCreateTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
} = coursesService;
