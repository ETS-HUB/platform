"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "antd";
import { PracticeTopicCard } from "./components/PracticeTopicCard";
import type { Priority } from "@/apis/practice/types";
import Header from "@/components/ui/Header";
import { useGetPracticeTopicsQuery } from "@/apis/student/studentService";
import type { PracticeTopic } from "@/apis/student/types";
import { IMAGES } from "@/constants/images";
import Image from "next/image";

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
const SECTION_META: Record<Priority, { title: string; hint: string }> = {
  high: { title: "Needs work", hint: "Scored below 40% — worth another pass" },
  medium: {
    title: "Keep practicing",
    hint: "Scored 40–70%, or not attempted yet",
  },
  low: { title: "Strong topics", hint: "Scored above 70% — you've got these" },
};

export default function PracticeListPage() {
  const router = useRouter();
  const { data: topics = [], isLoading } = useGetPracticeTopicsQuery();

  const grouped = useMemo(() => {
    const groups: Record<Priority, PracticeTopic[]> = {
      high: [],
      medium: [],
      low: [],
    };
    for (const t of topics) groups[t.recommendedPriority].push(t);
    return groups;
  }, [topics]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full">
        <div className="mb-8">
          <Header
            title="Practice mode"
            subtitle="Quick drills to sharpen up on topics you've already learned."
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-5"
              style={{ background: "#F3F4F6" }}
            >
              <Skeleton active paragraph={{ rows: 2 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="mb-8">
        <Header
          title="Practice mode"
          subtitle="Quick drills to sharpen up on topics you've already learned."
        />
      </div>

      {topics.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
          <Image
            src={IMAGES.EmptyImage}
            width={300}
            height={300}
            alt="No practice topics available"
          />
          <p className="text-base text-gray-500">
            Complete a few lessons first — practice topics unlock as you go.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {(Object.keys(SECTION_META) as Priority[]).map((priority) => {
            const items = grouped[priority];
            if (items.length === 0) return null;
            const meta = SECTION_META[priority];
            return (
              <div key={priority}>
                <div className="flex items-baseline gap-2 mb-1">
                  <h2 className="text-[13px] font-semibold text-[#0e1430] uppercase tracking-wide">
                    {meta.title}
                  </h2>
                  <span className="text-sm text-gray-500">{items.length}</span>
                </div>
                <p className="text-sm mb-4 text-gray-600">{meta.hint}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {items
                    .slice()
                    .sort(
                      (a, b) =>
                        PRIORITY_ORDER[a.recommendedPriority] -
                        PRIORITY_ORDER[b.recommendedPriority],
                    )
                    .map((topic) => (
                      <PracticeTopicCard
                        key={topic.id}
                        topic={topic}
                        onClick={() =>
                          router.push(`/student/practice/${topic.id}`)
                        }
                      />
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
