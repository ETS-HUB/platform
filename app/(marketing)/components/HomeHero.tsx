"use client";

import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

import type { Category } from "@/apis/roadmap/home/type";

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "all", label: "Most popular" },
  { id: "ai", label: "AI" },
  { id: "web", label: "Web" },
  { id: "data", label: "Data" },
  { id: "devops", label: "DevOps & Security" },
  { id: "languages", label: "Languages" },
  { id: "interview", label: "Interview" },
];

interface HomeHeroProps {
  total: number;
  query: string;
  onQueryChange: (q: string) => void;
  category: Category;
  onCategoryChange: (c: Category) => void;
}

export default function HomeHero({
  total,
  query,
  onQueryChange,
  category,
  onCategoryChange,
}: HomeHeroProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section
      className="relative sm:pt-14 overflow-hidden font-family-outfit"
      style={{
        background: "#0C1020",
      }}
    >
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full opacity-30 blur-3xl"
        style={{ background: "#A78BFA" }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full opacity-20 blur-3xl"
        style={{ background: "#2B78E4" }}
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-12 sm:pt-24 sm:pb-16">
        <h1 className="text-[36px] sm:text-[52px] font-extrabold leading-[1.05] tracking-tight text-white">
          Find your path.
          <br />
          <span style={{ color: "#C4B5FD" }}>Learn with direction.</span>
        </h1>
        <p
          className="mt-4 max-w-xl text-[15px] sm:text-[17px] leading-relaxed"
          style={{ color: "rgba(255,255,255,0.8)" }}
        >
          Step-by-step roadmaps, courses and guides that show what to learn
          next.
        </p>

        {/* Search */}
        <div className="mt-8 max-w-2xl">
          <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-xl shadow-black/20">
            <Search size={18} style={{ color: "#9CA3AF" }} />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={`Search ${total} roadmaps`}
              className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-[#9CA3AF]"
              style={{ color: "#0e1430" }}
            />
            {query ? (
              <button
                type="button"
                onClick={() => onQueryChange("")}
                aria-label="Clear search"
                className="rounded-full p-1 hover:bg-[#F3F4F6]"
              >
                <X size={14} style={{ color: "#6B7280" }} />
              </button>
            ) : (
              <kbd
                className="hidden sm:block rounded-md border px-1.5 py-0.5 text-[11px]"
                style={{ borderColor: "#E5E7EB", color: "#9CA3AF" }}
              >
                Ctrl K
              </kbd>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const active = category === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onCategoryChange(c.id)}
                className="rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors"
                style={
                  active
                    ? { background: "#FFFFFF", color: "#3A0CA3" }
                    : {
                        background: "rgba(255,255,255,0.12)",
                        color: "#FFFFFF",
                        border: "1px solid rgba(255,255,255,0.22)",
                      }
                }
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
