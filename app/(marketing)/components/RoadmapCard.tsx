import Link from "next/link";
import {
  ArrowUpRight,
  Brain,
  Code2,
  Database,
  Globe,
  MessagesSquare,
  ShieldCheck,
} from "lucide-react";

import type { Category, RoadmapItem } from "@/apis/roadmap/home/type";

export const CATEGORY_META: Record<
  Exclude<Category, "all">,
  { label: string; icon: React.ElementType; tint: string; color: string }
> = {
  ai: { label: "AI", icon: Brain, tint: "#F3E8FF", color: "#7C3AED" },
  web: { label: "Web", icon: Globe, tint: "#EAF2FF", color: "#2B78E4" },
  data: { label: "Data", icon: Database, tint: "#ECFDF5", color: "#059669" },
  devops: {
    label: "DevOps & Security",
    icon: ShieldCheck,
    tint: "#FFF7ED",
    color: "#EA580C",
  },
  languages: {
    label: "Languages",
    icon: Code2,
    tint: "#FDF2F8",
    color: "#DB2777",
  },
  interview: {
    label: "Interview",
    icon: MessagesSquare,
    tint: "#FFFBEB",
    color: "#D97706",
  },
};

export default function RoadmapCard({ item }: { item: RoadmapItem }) {
  const meta = CATEGORY_META[item.category];
  const Icon = meta.icon;

  return (
    <Link
      href={`/roadmap/${item.slug}`}
      className="group relative flex items-center gap-3 rounded-2xl border px-4 py-3.5 bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#3A0CA3]/10"
      style={{ borderColor: "#EDE0FB" }}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p
            className="truncate text-[14.5px] font-semibold"
            style={{ color: "#0e1430" }}
          >
            {item.title}
          </p>
          {item.isNew && (
            <span
              className="rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase"
              style={{ background: "#FEF3C7", color: "#B45309" }}
            >
              New
            </span>
          )}
        </div>
      </div>

      <ArrowUpRight
        size={16}
        className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
        style={{ color: "#3A0CA3" }}
      />
    </Link>
  );
}
