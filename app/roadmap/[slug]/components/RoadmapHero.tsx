// ../components/RoadmapHero.tsx
"use client";

import { useState } from "react";
import {
  ArrowDown,
  CheckCircle2,
  Layers,
  LogIn,
  Map,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import RoadmapNav from "./RoadmapNav";

interface RoadmapHeroProps {
  title: string;
  description?: string;
  topicCount: number;
  isAuthenticated: boolean;
  stats?: { done: number; percentage: number } | null;
  onStart: () => void;
  onReset: () => void;
  onAuthRequired?: () => void;
  onSearch?: (query: string) => void;
}

export default function RoadmapHero({
  title,
  description,
  topicCount,
  isAuthenticated,
  stats,
  onStart,
  onReset,
  onAuthRequired,
  onSearch,
}: RoadmapHeroProps) {
  const [query, setQuery] = useState("");

  const handleChange = (v: string) => {
    setQuery(v);
    onSearch?.(v);
  };

  return (
    <section className="relative overflow-hidden bg-[#151c31]/95 font-family-outfit">
      <RoadmapNav />
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{ background: "#A78BFA" }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full opacity-20 blur-3xl"
        style={{ background: "#2B78E4" }}
      />

      <div className="relative max-w-4xl mx-auto px-6 pt-28 pb-14 sm:pt-32 sm:pb-20">
        <div className="text-center">
          <span
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1 rounded-full mb-5"
            style={{
              background: "rgba(255,255,255,0.14)",
              color: "#FFFFFF",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          >
            <Map size={12} />
            Learning Roadmap
          </span>

          <h1 className="text-[32px] sm:text-[44px] leading-tight font-extrabold text-white tracking-tight">
            {title}
          </h1>

          {description && (
            <p
              className="mt-4 mx-auto max-w-2xl text-[15px] sm:text-[17px] leading-relaxed"
              style={{ color: "rgba(255,255,255,0.82)" }}
            >
              {description}
            </p>
          )}

          {/* Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearch?.(query);
            }}
            role="search"
            className="mt-8 mx-auto max-w-2xl"
          >
            <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3.5 shadow-xl shadow-black/20 ring-1 ring-white/20 transition-shadow focus-within:ring-2 focus-within:ring-[#A78BFA]">
              <Search
                size={18}
                style={{ color: "#9CA3AF" }}
                className="shrink-0"
              />
              <input
                value={query}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Explore a tech stack, concept, or career path."
                aria-label="Search roadmaps"
                className="min-w-0 flex-1 bg-transparent text-left text-[15px] outline-none placeholder:text-[#9CA3AF]"
                style={{ color: "#0e1430" }}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => handleChange("")}
                  aria-label="Clear search"
                  className="shrink-0 rounded-full p-1 hover:bg-[#F3F4F6]"
                >
                  <X size={14} style={{ color: "#6B7280" }} />
                </button>
              )}
            </div>
          </form>

          {/* Stats chips */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <div
              className="flex items-center gap-1.5 text-[13px] font-medium px-3.5 py-1.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.14)", color: "#FFFFFF" }}
            >
              <Layers size={14} />
              {topicCount} topics
            </div>
            {isAuthenticated && stats && (
              <div
                className="flex items-center gap-1.5 text-[13px] font-medium px-3.5 py-1.5 rounded-full"
                style={{ background: "#ECFDF5", color: "#059669" }}
              >
                <CheckCircle2 size={14} />
                {stats.done} done · {stats.percentage}%
              </div>
            )}
          </div>

          {/* Progress bar */}
          {isAuthenticated && stats && (
            <div className="mt-5 mx-auto max-w-sm">
              <div
                className="h-2 w-full rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${stats.percentage}%`,
                    background: "linear-gradient(90deg, #34D399, #A7F3D0)",
                  }}
                />
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onStart}
              className="flex items-center gap-2 text-[14px] font-semibold px-6 py-3 rounded-full transition-transform hover:-translate-y-0.5"
              style={{ background: "#FFFFFF", color: "#3A0CA3" }}
            >
              Start exploring
              <ArrowDown size={15} />
            </button>

            {!isAuthenticated ? (
              <button
                type="button"
                onClick={onAuthRequired}
                className="flex items-center gap-2 text-[14px] font-semibold px-6 py-3 rounded-full transition-colors hover:bg-white/20"
                style={{
                  color: "#FFFFFF",
                  border: "1px solid rgba(255,255,255,0.4)",
                }}
              >
                <LogIn size={15} />
                Sign in to track progress
              </button>
            ) : (
              <button
                type="button"
                onClick={onReset}
                className="flex items-center gap-2 text-[14px] font-semibold px-6 py-3 rounded-full transition-colors hover:bg-white/20"
                style={{
                  color: "#FFFFFF",
                  border: "1px solid rgba(255,255,255,0.4)",
                }}
              >
                <RotateCcw size={14} />
                Reset progress
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
