import { api } from "../api";
import type { NudgeRequest, NudgeResult } from "./types";

export const aiService = api.injectEndpoints({
  endpoints: (builder) => ({
    requestNudge: builder.mutation<NudgeResult, NudgeRequest>({
      query: ({ questionId }) => ({
        url: "/api/ai/nudge",
        method: "POST",
        body: { questionId },
      }),
    }),
  }),
});

export const { useRequestNudgeMutation } = aiService;
