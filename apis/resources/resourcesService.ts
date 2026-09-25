import { api } from "@/apis/api";
import type {
  LibraryResource,
  RecommendedResource,
  ResourcePagination,
  ResourceType,
  Difficulty,
  LearningStyle,
} from "./types";

export interface ResourceFilters {
  topicId?: string;
  type?: ResourceType;
  difficulty?: Difficulty;
  learningStyle?: LearningStyle;
  page?: number;
  limit?: number;
}

export interface ResourcesResponse {
  resources: LibraryResource[];
  pagination: ResourcePagination;
}

export const resourcesService = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/resources — paginated + filterable
    getResources: builder.query<ResourcesResponse, ResourceFilters>({
      query: (params) => ({
        url: "/api/resources",
        params,
      }),
      providesTags: ["Resources"],
    }),

    // GET /api/resources/recommended — personalised recommendations
    getRecommendedResources: builder.query<RecommendedResource[], void>({
      query: () => "/api/resources/recommended",
      providesTags: ["Resources"],
    }),
  }),
});

export const { useGetResourcesQuery, useGetRecommendedResourcesQuery } =
  resourcesService;
