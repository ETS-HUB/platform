// components/roadmap/RoadmapHeader.tsx
"use client";

import Link from "next/link";
import { ArrowLeft, Bot, FolderKanban, Map } from "lucide-react";

export type RoadmapTab = "roadmap" | "projects" | "tutor";

const TABS: { id: RoadmapTab; label: string; icon: React.ElementType }[] = [
  { id: "roadmap", label: "Roadmap", icon: Map },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "tutor", label: "AI Tutor", icon: Bot },
];

const AVATARS = [
  "/images/avatars/1.jpg",
  "/images/avatars/2.jpg",
  "/images/avatars/3.jpg",
  "/images/avatars/4.jpg",
];

interface RoadmapHeaderProps {
  title: string;
  description?: string;
  activeTab: RoadmapTab;
  onTabChange: (tab: RoadmapTab) => void;
  isAuthenticated: boolean;
  learnerCount?: number;
  avatars?: string[];
}

export default function RoadmapHeader({
  title,
  description,
  activeTab,
  onTabChange,
  isAuthenticated,
  learnerCount,
  avatars = AVATARS,
}: RoadmapHeaderProps) {
  return (
    <div className="bg-[#FAFAFA] font-family-outfit">
      <div className="mx-auto w-full max-w-5xl px-11 sm:px-13 py-6">
        <div className="overflow-hidden rounded-2xl border border-[#EDE0FB] bg-white">
          {/* Header */}
          <div className="px-6 pt-5">
            <Link
              href="/roadmaps"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors hover:text-[#3A0CA3]"
              style={{ color: "#6B7280" }}
            >
              <ArrowLeft size={14} />
              All Roadmaps
            </Link>

            <h2
              className="mt-8 text-[34px] sm:text-[44px] font-extrabold leading-tight tracking-tight"
              style={{ color: "#0e1430" }}
            >
              {title}
            </h2>
            {description && (
              <p
                className="mt-2 text-[15px] sm:text-[17px]"
                style={{ color: "#6B7280" }}
              >
                {description}
              </p>
            )}
          </div>

          {/* Tabs */}
          <div
            role="tablist"
            className="mt-8 flex items-center gap-1 overflow-x-auto px-4 sm:px-6"
          >
            {TABS.map((t) => {
              const active = activeTab === t.id;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  onClick={() => onTabChange(t.id)}
                  className="relative flex shrink-0 items-center gap-2 px-3 py-3.5 text-[14px] font-medium transition-colors"
                  style={{ color: active ? "#0e1430" : "#6B7280" }}
                >
                  <Icon size={16} />
                  {t.label}
                  {active && (
                    <span
                      className="absolute inset-x-2 bottom-0 h-[2px] rounded-full"
                      style={{ background: "#3A0CA3" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Social proof strip */}
        {!isAuthenticated && (
          <div
            className="mt-3 flex flex-col gap-3 rounded-2xl border bg-white px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between"
            style={{ borderColor: "#EDE0FB" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {avatars.slice(0, 5).map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="h-8 w-8 rounded-full border-2 border-white object-cover bg-[#F3E8FF]"
                    style={{ zIndex: avatars.length - i }}
                  />
                ))}
              </div>
              <p className="text-[13px]" style={{ color: "#4B5563" }}>
                Join{" "}
                {learnerCount ? (
                  <b style={{ color: "#0e1430" }}>{learnerCount}+</b>
                ) : (
                  "others"
                )}{" "}
                already learning and tracking their progress with ETS
              </p>
            </div>

            <Link
              href="/signup"
              className="shrink-0 self-start rounded-full px-5 py-2 text-[13px] font-semibold text-white transition-transform hover:-translate-y-0.5 sm:self-auto"
              style={{ background: "#0e1430" }}
            >
              Sign up free
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
