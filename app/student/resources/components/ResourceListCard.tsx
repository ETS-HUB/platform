import { ExternalLink, Eye, BookText, Wrench } from "lucide-react";
import { ResourceTypeBadge } from "./ResourceTypeBadge";
import { DifficultyDot } from "./DifficultyDot";
import type { LibraryResource, LearningStyle } from "@/apis/resources/types";
import Link from "next/link";

const STYLE_META: Record<LearningStyle, { label: string; icon: typeof Eye }> = {
  VISUAL: { label: "Visual", icon: Eye },
  READING: { label: "Reading", icon: BookText },
  HANDS_ON: { label: "Hands-on", icon: Wrench },
};

export function ResourceListCard({ resource }: { resource: LibraryResource }) {
  const styleMeta = resource.learningStyle
    ? STYLE_META[resource.learningStyle]
    : null;
  const StyleIcon = styleMeta?.icon;

  return (
    <Link
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start justify-between gap-4 rounded-2xl p-5 transition-shadow hover:shadow-md"
      style={{ background: "#FFFFFF", border: "1.5px solid #EDE0FB" }}
    >
      <div className="flex flex-col gap-3 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <ResourceTypeBadge type={resource.type} />
          <span className="text-sm bg-[#F5F5F5] text-[#6B7280] font-medium px-2 py-0.5 rounded-full">
            {resource.topic.name}
          </span>
        </div>

        <h3
          className="text-lg font-semibold leading-snug"
          style={{ color: "#0e1430" }}
        >
          {resource.title}
        </h3>

        {resource.description && (
          <p className="text-base leading-relaxed" style={{ color: "#6B7280" }}>
            {resource.description}
          </p>
        )}

        <div className="flex items-center gap-3 mt-1">
          <DifficultyDot difficulty={resource.difficulty} />
          {styleMeta && StyleIcon && (
            <span
              className="inline-flex items-center gap-1 text-base"
              style={{ color: "#9CA3AF" }}
            >
              <StyleIcon size={11} />
              {styleMeta.label}
            </span>
          )}
        </div>
      </div>

      <ExternalLink
        size={20}
        style={{ color: "#C9BEDD" }}
        className="shrink-0 mt-1"
      />
    </Link>
  );
}
