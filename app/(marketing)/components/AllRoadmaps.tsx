"use client";

import { useState } from "react";
import Link from "next/link";

import Section from "./Section";
import type { RoadmapItem, RoadmapKind } from "@/apis/roadmap/home/type";

const TABS: { id: RoadmapKind; label: string }[] = [
  { id: "role", label: "Role-based" },
  { id: "skill", label: "Skill-based" },
  { id: "practice", label: "Best practices" },
];

export default function AllRoadmaps({ items }: { items: RoadmapItem[] }) {
  const [tab, setTab] = useState<RoadmapKind>("role");
  const visible = items.filter((i) => i.kind === tab);

  return (
    <section style={{ background: "#0e1430" }}>
      <div className="max-w-6xl mx-auto px-6 py-14">
        <h2 className="text-[22px] font-bold text-white">All {items.length} roadmaps</h2>

        <div className="mt-5 flex flex-wrap gap-2">
          {TABS.map((t) => {
            const count = items.filter((i) => i.kind === t.id).length;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className="flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors"
                style={
                  active
                    ? { background: "#FFFFFF", color: "#0e1430" }
                    : { background: "rgba(255,255,255,0.08)", color: "#D1D5DB" }
                }
              >
                {t.label}
                <span style={{ color: active ? "#6B7280" : "#9CA3AF" }}>{count}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((i) => (
            <Link
              key={i.slug}
              href={`/roadmaps/${i.slug}`}
              className="text-[14px] transition-colors hover:text-white"
              style={{ color: "#A5B4FC" }}
            >
              {i.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}