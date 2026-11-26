"use client";

import { useMemo, useState } from "react";
import { Inbox, Search, Eye, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { TYPE_META } from "@/apis/roadmap/tutor/meta";
import type { ContentType } from "@/apis/roadmap/tutor/types";
import type { MyLearningItem } from "@/apis/ai/types";

type Filter = "all" | ContentType;

const TYPE_TO_CONTENT: Record<string, ContentType> = {
  ROADMAP: "roadmap",
  COURSE: "course",
  GUIDE: "guide",
  QUIZ: "quiz",
};

function getContentType(item: MyLearningItem): ContentType {
  return TYPE_TO_CONTENT[(item.contentType ?? "").toUpperCase()] ?? "roadmap";
}

function MyLearningCard({
  item,
  onClick,
}: {
  item: MyLearningItem;
  onClick: (item: MyLearningItem) => void;
}) {
  const type = getContentType(item);
  const meta = TYPE_META[type];
  const Icon = meta.icon;
  const pct = item.progress?.completionPercentage ?? 0;

  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      className="group flex h-full flex-col rounded-2xl border bg-white p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#3A0CA3]/10"
      style={{ borderColor: "#EDE0FB" }}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
          style={{ background: meta.tint, color: meta.color }}
        >
          <Icon size={12} />
          {meta.label}
        </span>
        {item.isPublic && (
          <span
            className="text-[10px] font-medium rounded-full px-2 py-0.5"
            style={{ background: "#F0FDF4", color: "#16A34A" }}
          >
            Public
          </span>
        )}
      </div>

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

      <div className="mt-4">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F3E8FF]">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: meta.color }}
          />
        </div>
        <div
          className="mt-2 flex items-center justify-between text-[11.5px]"
          style={{ color: "#9CA3AF" }}
        >
          <span>{pct}% complete</span>
          <div className="flex items-center gap-3">
            {item.chatMessageCount > 0 && (
              <span className="flex items-center gap-0.5">
                <MessageCircle size={11} /> {item.chatMessageCount}
              </span>
            )}
            {item.viewCount > 0 && (
              <span className="flex items-center gap-0.5">
                <Eye size={11} /> {item.viewCount}
              </span>
            )}
            <span>{item.createdAt}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function MyLearningView({
  items,
  isLoading = false,
}: {
  items: MyLearningItem[];
  isLoading?: boolean;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    items.forEach((i) => {
      const t = getContentType(i);
      c[t] = (c[t] ?? 0) + 1;
    });
    return c;
  }, [items]);

  const visible = items.filter((i) => {
    const type = getContentType(i);
    const matchType = filter === "all" || type === filter;
    const matchQuery =
      !query.trim() ||
      `${i.title} ${i.description}`
        .toLowerCase()
        .includes(query.trim().toLowerCase());
    return matchType && matchQuery;
  });

  const handleOpen = (item: MyLearningItem) => {
    const type = getContentType(item);
    if (type === "roadmap") router.push(`/ai/roadmap/${item.id}`);
    else if (type === "course") router.push(`/ai/course/${item.id}`);
    else if (type === "quiz") router.push(`/ai/quiz/${item.id}`);
    // guide — no viewer yet
  };

  const tabs: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    ...(Object.keys(TYPE_META) as ContentType[]).map((t) => ({
      id: t as Filter,
      label: TYPE_META[t].label + "s",
    })),
  ];

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => {
            const active = filter === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setFilter(t.id)}
                className="flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors"
                style={
                  active
                    ? { background: "#0e1430", color: "#FFFFFF" }
                    : { background: "#F5F0FF", color: "#4B5563" }
                }
              >
                {t.label}
                <span style={{ opacity: 0.6 }}>{counts[t.id] ?? 0}</span>
              </button>
            );
          })}
        </div>

        <div
          className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 sm:w-64"
          style={{ borderColor: "#EDE0FB" }}
        >
          <Search size={15} style={{ color: "#9CA3AF" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your learning"
            className="w-full bg-transparent text-[13.5px] outline-none placeholder:text-[#9CA3AF]"
          />
        </div>
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
      ) : visible.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((i) => (
            <MyLearningCard key={i.id} item={i} onClick={handleOpen} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <Inbox
            size={32}
            className="mx-auto mb-3"
            style={{ color: "#C4B5FD" }}
          />
          <p className="text-[14px]" style={{ color: "#6B7280" }}>
            Nothing here yet. Generate something to get started.
          </p>
        </div>
      )}
    </div>
  );
}
