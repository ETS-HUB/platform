"use client";

import { useState } from "react";
import { Compass, MessageCircle, Sparkles, BookMarked } from "lucide-react";

import GenerateView from "./GenerateView";
import MyLearningView from "./MyLearningView";
import ChatView from "./ChatView";
import CommunityView from "./CommunityView";
import type { ContentType, Level } from "@/apis/roadmap/tutor/types";
import type { CommunityItem, MyLearningItem } from "@/apis/ai/types";
import CommunitySection from "@/app/(marketing)/components/CommunitySection";

type View = "generate" | "learning" | "chat" | "community";

const VIEWS: { id: View; label: string; icon: React.ElementType }[] = [
  { id: "generate", label: "Generate", icon: Sparkles },
  { id: "learning", label: "My Learning", icon: BookMarked },
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "community", label: "Community", icon: Compass },
];

interface AiTutorProps {
  isAuthenticated: boolean;
  onAuthRequired?: () => void;
  myItems?: MyLearningItem[];
  myItemsLoading?: boolean;
  communityItems?: CommunityItem[];
  communityLoading?: boolean;
  onGenerate?: (input: {
    type: ContentType;
    prompt: string;
    level: Level;
  }) => Promise<void>;
  isGenerating?: boolean;
  token?: string;
  initialView?: View;
  onTabChange?: (tab: View) => void;
}

export default function AiTutor({
  isAuthenticated,
  onAuthRequired,
  myItems = [],
  myItemsLoading = false,
  communityItems = [],
  communityLoading = false,
  onGenerate,
  isGenerating = false,
  token,
  initialView = "generate",
  onTabChange,
}: AiTutorProps) {
  const [view, setView] = useState<View>(initialView);

  const go = (v: View) => {
    if (!isAuthenticated && (v === "learning" || v === "chat"))
      return onAuthRequired?.();
    setView(v);
    onTabChange?.(v);
  };

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Sub navigation */}
        <div className="mb-10 flex justify-center">
          <div
            role="tablist"
            className="flex max-w-full gap-1 overflow-x-auto rounded-full border bg-white p-1.5 shadow-sm"
            style={{ borderColor: "#EDE0FB" }}
          >
            {VIEWS.map((v) => {
              const Icon = v.icon;
              const active = view === v.id;
              return (
                <button
                  key={v.id}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  onClick={() => go(v.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[13.5px] font-medium transition-colors ${
                    active
                      ? "bg-neutral-800 text-white"
                      : "text-neutral-600 cursor-pointer hover:bg-neutral-100 hover:text-neutral-900"
                  }`}
                >
                  <Icon size={15} />
                  {v.label}
                </button>
              );
            })}
          </div>
        </div>

        {view === "generate" && (
          <>
            <GenerateView
              isAuthenticated={isAuthenticated}
              onAuthRequired={onAuthRequired}
              onGenerate={onGenerate}
              isGenerating={isGenerating}
              communityItems={communityItems}
            />
            <CommunitySection />
          </>
        )}
        {view === "learning" && (
          <MyLearningView items={myItems} isLoading={myItemsLoading} />
        )}
        {view === "chat" && (
          <ChatView
            isAuthenticated={isAuthenticated}
            onAuthRequired={onAuthRequired}
            myItems={myItems}
            apiUrl={process.env.NEXT_PUBLIC_API_URL || ""}
            token={token}
          />
        )}
        {view === "community" && (
          <>
            <CommunityView
              items={communityItems}
              isLoading={communityLoading}
            />
            <CommunitySection />
          </>
        )}
      </div>
    </section>
  );
}
