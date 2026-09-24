import { BookOpen, File, FileCode, SquarePlay } from "lucide-react";
import type { ResourceType } from "@/apis/resources/types";

const TYPE_META: Record<
  ResourceType,
  { label: string; color: string; icon: typeof BookOpen }
> = {
  TUTORIAL: { label: "Tutorial", color: "#3A0CA3", icon: BookOpen },
  VIDEO: { label: "Video", color: "#F52593", icon: SquarePlay },
  DOCUMENTATION: { label: "Docs", color: "#7408b3", icon: FileCode },
};

export function ResourceTypeBadge({ type }: { type: ResourceType }) {
  const meta = TYPE_META[type];
  const Icon = meta.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 text-sm font-medium px-2.5 py-1 rounded-full"
      style={{ color: meta.color, background: `${meta.color}15` }}
    >
      <Icon size={20} />
      {meta.label}
    </span>
  );
}
