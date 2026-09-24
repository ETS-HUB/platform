import { api } from "../api";
import type {
  AssessmentConfig,
  StartAssessmentResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  CompleteResponse,
  AiReportData,
  Badge,
  CertificateResponse,
} from "./types";

export interface PercentileResponse {
  percentageScore: number;
  percentile: number;
  totalCandidates: number;
}

export const assessmentService = api.injectEndpoints({
  endpoints: (builder) => ({
    getAssessmentConfigs: builder.query<AssessmentConfig[], void>({
      query: () => "/api/assessment/configs",
      providesTags: ["Assessment"],
    }),

    startAssessment: builder.mutation<StartAssessmentResponse, string>({
      query: (configId) => ({
        url: `/api/assessment/start/${configId}`,
        method: "POST",
      }),
    }),

    submitAnswer: builder.mutation<
      SubmitAnswerResponse,
      { attemptId: string; data: SubmitAnswerRequest }
    >({
      query: ({ attemptId, data }) => ({
        url: `/api/assessment/attempt/${attemptId}/answer`,
        method: "POST",
        body: data,
      }),
    }),

    completeAssessment: builder.mutation<CompleteResponse, string>({
      query: (attemptId) => ({
        url: `/api/assessment/attempt/${attemptId}/complete`,
        method: "POST",
      }),
      invalidatesTags: ["Assessment", "Dashboard"],
    }),

    generateAiReport: builder.mutation<AiReportData, string>({
      query: (attemptId) => ({
        url: `/api/ai/generate-all/${attemptId}`,
        method: "POST",
      }),
    }),

    checkBadges: builder.mutation<Badge[], string>({
      query: (attemptId) => ({
        url: `/api/gamification/check-badges/${attemptId}`,
        method: "POST",
      }),
    }),

    getCertificate: builder.query<CertificateResponse, string>({
      query: (attemptId) => `/api/gamification/certificate/${attemptId}`,
    }),

    getPercentile: builder.query<PercentileResponse, string>({
      query: (attemptId) => `/api/assessment/attempt/${attemptId}/percentile`,
    }),
  }),
});

export const {
  useGetAssessmentConfigsQuery,
  useStartAssessmentMutation,
  useSubmitAnswerMutation,
  useCompleteAssessmentMutation,
  useGenerateAiReportMutation,
  useCheckBadgesMutation,
  useGetCertificateQuery,
  useGetPercentileQuery,
} = assessmentService;
