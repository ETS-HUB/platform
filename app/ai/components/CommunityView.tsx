"use client";

import { useState } from "react";
import { Search, Eye, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { TYPE_META } from "@/apis/roadmap/tutor/meta";
import type { ContentType } from "@/apis/roadmap/tutor/types";
import type { CommunityItem } from "@/apis/ai/types";

const TYPE_LABELS: Record<string, ContentType> = {
  ROADMAP: "roadmap",
  COURSE: "course",
  GUIDE: "guide",
  QUIZ: "quiz",
};

function CommunityCard({ item }: { item: CommunityItem }) {
  const router = useRouter();
  const typeKey = (item.contentType ?? "").toUpperCase();
  const type = TYPE_LABELS[typeKey] ?? "roadmap";
  const meta = TYPE_META[type];
  const Icon = meta.icon;

  const handleOpen = () => {
    if (type === "roadmap") router.push(`/ai/roadmap/${item.id}`);
    else if (type === "course") router.push(`/ai/course/${item.id}`);
    else if (type === "quiz") router.push(`/ai/quiz/${item.id}`);
  };

  return (
    <button
      type="button"
      onClick={handleOpen}
      className="group flex h-full flex-col rounded-2xl border bg-white p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#3A0CA3]/10"
      style={{ borderColor: "#EDE0FB" }}
    >
      <span
        className="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
        style={{ background: meta.tint, color: meta.color }}
      >
        <Icon size={12} />
        {meta.label}
      </span>

      <h3
        className="mt-3 text-[15px] font-bold leading-tight"
        style={{ color: "#0e1430" }}
      >
        {item.title}
      </h3>
      <p
        className="mt-1.5 line-clamp-2 flex-1 text-[13px] leading-relaxed"
        style={{ color: "#6B7280" }}
      >
        {item.description}
      </p>

      <div className="mt-4 flex items-center justify-between gap-2">
        <div
          className="flex items-center gap-2 text-[12px]"
          style={{ color: "#9CA3AF" }}
        >
          {item.author?.name && (
            <>
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold"
                style={{ background: "#F3E8FF", color: "#7C3AED" }}
              >
                {item.author.name[0]}
              </span>
              <span style={{ color: "#4B5563" }}>{item.author.name}</span>
              <span>·</span>
            </>
          )}
          <span>{item.createdAt}</span>
        </div>
        <div
          className="flex items-center gap-2 text-[11px]"
          style={{ color: "#9CA3AF" }}
        >
          {item.viewCount > 0 && (
            <span className="flex items-center gap-0.5">
              <Eye size={11} /> {item.viewCount}
            </span>
          )}
          {item.copyCount > 0 && (
            <span className="flex items-center gap-0.5">
              <Copy size={11} /> {item.copyCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

interface CommunityViewProps {
  items: CommunityItem[];
  isLoading?: boolean;
}

export default function CommunityView({
  items,
  isLoading = false,
}: CommunityViewProps) {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<ContentType | "">("");

  const visible = items.filter((i) => {
    const type = TYPE_LABELS[(i.contentType ?? "").toUpperCase()] ?? "roadmap";
    const matchType = !activeType || type === activeType;
    const matchQuery =
      !query.trim() ||
      `${i.title} ${i.description}`
        .toLowerCase()
        .includes(query.trim().toLowerCase());
    return matchType && matchQuery;
  });

  return (
    <div className="mb-12">
      <div
        className="flex items-center gap-3 rounded-2xl border bg-white px-5 py-3.5"
        style={{ borderColor: "#EDE0FB" }}
      >
        <Search size={17} style={{ color: "#9CA3AF" }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search what others are learning"
          className="w-full bg-transparent text-[14.5px] outline-none placeholder:text-[#9CA3AF]"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveType("")}
          className="rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors"
          style={{
            borderColor: !activeType ? "#3A0CA3" : "#EDE0FB",
            background: !activeType ? "#F3E8FF" : "#FFFFFF",
            color: !activeType ? "#3A0CA3" : "#4B5563",
          }}
        >
          All
        </button>
        {(Object.keys(TYPE_META) as ContentType[]).map((t) => {
          const m = TYPE_META[t];
          const Icon = m.icon;
          const active = activeType === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setActiveType(active ? "" : t)}
              className="flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors"
              style={{
                borderColor: active ? m.color : "#EDE0FB",
                background: active ? m.tint : "#FFFFFF",
                color: active ? m.color : "#4B5563",
              }}
            >
              <Icon size={13} />
              {m.label}s
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-44 rounded-2xl border animate-pulse"
              style={{ borderColor: "#EDE0FB", background: "#FAF7FF" }}
            />
          ))}
        </div>
      ) : visible.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((i) => (
            <CommunityCard key={i.id} item={i} />
          ))}
        </div>
      ) : (
        <p
          className="py-16 text-center text-[14px]"
          style={{ color: "#6B7280" }}
        >
          {items.length === 0
            ? "No community content yet. Be the first to share!"
            : "No results found."}
        </p>
      )}
    </div>
  );
}
