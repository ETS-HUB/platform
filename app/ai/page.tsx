"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { Sparkles } from "lucide-react";
import { message } from "antd";

import type { RootState } from "@/store";
import RoadmapNav from "../roadmap/[slug]/components/RoadmapNav";
import AiTutor from "./components/AiTutor";
import HomeFooter from "../(marketing)/components/HomeFooter";
import {
  useGenerateContentMutation,
  useGetMyLearningQuery,
  useGetCommunityQuery,
} from "@/apis/ai/aiService";
import type { ContentType, Level } from "@/apis/roadmap/tutor/types";

export default function StudyBuddyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accessToken } = useSelector((s: RootState) => s.tokens);
  const isAuthenticated = !!accessToken;

  const VALID_TABS = ["generate", "learning", "chat", "community"] as const;
  type AiView = (typeof VALID_TABS)[number];
  const tabParam = searchParams.get("tab") as AiView | null;
  const initialView: AiView =
    tabParam && VALID_TABS.includes(tabParam) ? tabParam : "generate";

  const [generateContent, { isLoading: isGenerating }] =
    useGenerateContentMutation();

  const { data: myItems = [], isLoading: loadingMyItems } =
    useGetMyLearningQuery({}, { skip: !isAuthenticated });

  const { data: communityItems = [], isLoading: loadingCommunity } =
    useGetCommunityQuery({ excludeOwn: true });

  const handleGenerate = async (input: {
    type: ContentType;
    prompt: string;
    level: Level;
  }) => {
    try {
      const result = await generateContent(input).unwrap();
      message.success("Content generated!");
      if (
        result.contentType === "course" ||
        (result as any).contentType === "COURSE"
      ) {
        router.push(`/ai/course/${result.id}`);
      } else if (
        result.contentType === "roadmap" ||
        (result as any).contentType === "ROADMAP"
      ) {
        router.push(`/ai/roadmap/${result.id}`);
      } else if (
        result.contentType === "quiz" ||
        (result as any).contentType === "QUIZ"
      ) {
        router.push(`/ai/quiz/${result.id}`);
      } else {
        router.push(`/ai?tab=learning`);
      }
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to generate content");
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-[#151c31]/95">
        <RoadmapNav />
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-30 blur-3xl"
          style={{ background: "#A78BFA" }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ background: "#2B78E4" }}
        />
        <div className="relative mx-auto max-w-4xl px-6 pt-28 pb-12 text-center sm:pt-32 sm:pb-16">
          <span
            className="mb-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold"
            style={{
              background: "rgba(255,255,255,0.14)",
              color: "#FFFFFF",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          >
            <Sparkles size={12} />
            Study Buddy
          </span>
          <h1 className="text-[32px] font-extrabold leading-tight tracking-tight text-white sm:text-[44px]">
            Learn with an AI that knows your goals
          </h1>
          <p
            className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed sm:text-[17px]"
            style={{ color: "rgba(255,255,255,0.82)" }}
          >
            Generate roadmaps, courses, guides and quizzes, or just ask a
            question.
          </p>
        </div>
      </section>

      <AiTutor
        key={initialView}
        isAuthenticated={isAuthenticated}
        onAuthRequired={() => router.push("/login")}
        myItems={myItems}
        myItemsLoading={loadingMyItems}
        communityItems={communityItems}
        communityLoading={loadingCommunity}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        token={accessToken || ""}
        initialView={initialView}
      />

      <HomeFooter />
    </div>
  );
}
