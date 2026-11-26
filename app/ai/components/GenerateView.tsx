"use client";

import { useState } from "react";
import { ArrowUp, Loader2 } from "lucide-react";

import { TYPE_META } from "@/apis/roadmap/tutor/meta";
import type { ContentType, Level } from "@/apis/roadmap/tutor/types";
import type { CommunityItem } from "@/apis/ai/types";
import { Button } from "@/components";

const LEVELS: { id: Level; label: string }[] = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

interface GenerateViewProps {
  isAuthenticated: boolean;
  onAuthRequired?: () => void;
  onGenerate?: (input: {
    type: ContentType;
    prompt: string;
    level: Level;
  }) => Promise<void>;
  isGenerating?: boolean;
  communityItems?: CommunityItem[];
}

export default function GenerateView({
  isAuthenticated,
  onAuthRequired,
  onGenerate,
  isGenerating = false,
  communityItems = [],
}: GenerateViewProps) {
  const [type, setType] = useState<ContentType>("roadmap");
  const [level, setLevel] = useState<Level>("beginner");
  const [prompt, setPrompt] = useState("");
  const meta = TYPE_META[type];

  const submit = async () => {
    if (!prompt.trim() || isGenerating) return;
    if (!isAuthenticated) return onAuthRequired?.();
    try {
      await onGenerate?.({ type, prompt: prompt.trim(), level });
      setPrompt("");
    } catch (error) {}
  };

  return (
    <div>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mt-4 text-[#0e1430] text-[30px] sm:text-[38px] font-extrabold tracking-tight">
          What do you want to master?
        </h2>
        <p className="mt-2 text-[15px]" style={{ color: "#6B7280" }}>
          Tell us where you are. We'll shape it around you.
        </p>
      </div>

      <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
        {(Object.keys(TYPE_META) as ContentType[]).map((t) => {
          const m = TYPE_META[t];
          const Icon = m.icon;
          const active = type === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className="flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 transition-all"
              style={{
                borderColor: active ? m.color : "#EDE0FB",
                background: active ? m.tint : "#FFFFFF",
                boxShadow: active ? `0 0 0 3px ${m.tint}` : undefined,
              }}
            >
              <Icon size={20} style={{ color: m.color }} />
              <span
                className="text-[13.5px] font-semibold"
                style={{ color: "#0e1430" }}
              >
                {m.label}
              </span>
            </button>
          );
        })}
      </div>
      {/* <p className="mt-3 text-center text-[13px]" style={{ color: "#6B7280" }}>
        {meta.hint}
      </p> */}

      {/* Prompt card */}
      <div
        className="mx-auto mt-5 max-w-3xl rounded-3xl border bg-white p-4 shadow-xl shadow-[#3A0CA3]/5 transition-shadow focus-within:shadow-[#3A0CA3]/15"
        style={{ borderColor: "#EDE0FB" }}
      >
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
          }}
          rows={3}
          placeholder={meta.placeholder}
          className="w-full resize-none bg-transparent px-2 py-1 text-[15px] outline-none placeholder:text-[#9CA3AF]"
          style={{ color: "#0e1430" }}
        />

        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 rounded-full bg-[#F5F0FF] p-1">
            {LEVELS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLevel(l.id)}
                className="rounded-full px-3 py-1 text-[12px] font-medium transition-colors"
                style={
                  level === l.id
                    ? {
                        background: "#FFFFFF",
                        color: "#3A0CA3",
                        boxShadow: "0 1px 2px rgba(0,0,0,.08)",
                      }
                    : { color: "#6B7280" }
                }
              >
                {l.label}
              </button>
            ))}
          </div>

          <Button
            type="button"
            onClick={submit}
            disabled={!prompt.trim() || isGenerating}
            // className="flex items-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-semibold text-white transition-all enabled:hover:-translate-y-0.5 disabled:opacity-40"
            // style={{ background: "linear-gradient(135deg, #3A0CA3, #7C3AED)" }}
          >
            {isGenerating ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <ArrowUp size={15} />
            )}
            Generate {meta.label.toLowerCase()}
          </Button>
        </div>
      </div>

      <div className="mx-auto my-4 mb-10 flex max-w-3xl flex-wrap justify-center gap-2">
        {meta.examples.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => setPrompt(ex)}
            className="rounded-full border bg-white px-3.5 py-1.5 text-[12.5px] transition-colors hover:bg-[#FAF7FF]"
            style={{ borderColor: "#EDE0FB", color: "#4B5563" }}
          >
            {ex}
          </button>
        ))}
      </div>

      {communityItems.length > 0 && (
        <div className="mt-14">
          <h3
            className="mb-4 text-[17px] font-bold"
            style={{ color: "#0e1430" }}
          >
            Fresh from the community
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {communityItems.slice(0, 3).map((i) => {
              const type = (i.contentType ?? "").toLowerCase() as any;
              const meta =
                TYPE_META[type as keyof typeof TYPE_META] ?? TYPE_META.roadmap;
              const Icon = meta.icon;
              return (
                <div
                  key={i.id}
                  className="flex flex-col rounded-2xl border bg-white p-5"
                  style={{ borderColor: "#EDE0FB" }}
                >
                  <span
                    className="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{ background: meta.tint, color: meta.color }}
                  >
                    <Icon size={12} />
                    {meta.label}
                  </span>
                  <p
                    className="mt-3 text-[14px] font-bold"
                    style={{ color: "#0e1430" }}
                  >
                    {i.title}
                  </p>
                  <p
                    className="mt-1 text-[12.5px] leading-relaxed line-clamp-2 flex-1"
                    style={{ color: "#6B7280" }}
                  >
                    {i.description}
                  </p>
                  {i.author?.name && (
                    <p
                      className="mt-3 text-[11.5px]"
                      style={{ color: "#9CA3AF" }}
                    >
                      by {i.author.name} · {i.createdAt}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
