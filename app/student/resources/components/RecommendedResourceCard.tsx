import { ExternalLink } from "lucide-react";
import { ResourceTypeBadge } from "./ResourceTypeBadge";
import { DifficultyDot } from "./DifficultyDot";
import type { RecommendedResource } from "@/apis/resources/types";
import Link from "next/link";

export function RecommendedResourceCard({ resource }: { resource: RecommendedResource }) {
  return (
    <Link
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col gap-3 bg-white border-[#EDE0FB] border shadow-xs rounded-2xl p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <ResourceTypeBadge type={resource.type} />
        <ExternalLink size={16} style={{ color: "#C9BEDD" }} className="shrink-0 mt-0.5" />
      </div>

      <h3 className="text-base font-semibold leading-snug" style={{ color: "#0e1430" }}>
        {resource.title}
      </h3>

      <div className="flex items-center justify-between mt-auto">
        <span
          className="text-sm font-medium px-2 py-0.5 rounded-full"
          style={{ background: "#F5F5F5", color: "#6B7280" }}
        >
          {resource.topic}
        </span>
        <DifficultyDot difficulty={resource.difficulty} />
      </div>
    </Link>
  );
}