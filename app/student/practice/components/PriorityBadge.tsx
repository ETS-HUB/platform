import { Flame, TrendingUp, CheckCircle2 } from "lucide-react";
import type { Priority } from "@/apis/practice/types";

const PRIORITY_META: Record<
  Priority,
  { label: string; color: string; bg: string; icon: typeof Flame }
> = {
  high: { label: "Needs work", color: "#DC2626", bg: "#FEF2F2", icon: Flame },
  medium: {
    label: "Keep practicing",
    color: "#1a1a1a",
    bg: "#ffe866",
    icon: TrendingUp,
  },
  low: { label: "Strong", color: "#059669", bg: "#F0FDF4", icon: CheckCircle2 },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const meta = PRIORITY_META[priority];
  const Icon = meta.icon;
  return (
    <span
      className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full"
      style={{ color: meta.color, background: meta.bg }}
    >
      <Icon size={11} />
      {meta.label}
    </span>
  );
}
