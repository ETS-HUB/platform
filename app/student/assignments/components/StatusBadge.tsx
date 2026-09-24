import { Clock, CheckCircle2, AlertCircle, Circle } from "lucide-react";
import type { SubmissionStatus } from "@/apis/assignments/types";

const STATUS_META: Record<
  SubmissionStatus | "NOT_SUBMITTED",
  { label: string; color: string; bg: string; icon: typeof Clock }
> = {
  NOT_SUBMITTED: {
    label: "Not started",
    color: "#8B84A0",
    bg: "#F5EEFE",
    icon: Circle,
  },
  SUBMITTED: {
    label: "Pending review",
    color: "#D97706",
    bg: "#FFF3E0",
    icon: Clock,
  },
  APPROVED: {
    label: "Approved",
    color: "#059669",
    bg: "#F0FDF4",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Needs changes",
    color: "#DC2626",
    bg: "#FEF2F2",
    icon: AlertCircle,
  },
};

export function StatusBadge({ status }: { status: SubmissionStatus | null }) {
  const meta = STATUS_META[status ?? "NOT_SUBMITTED"];
  const Icon = meta.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 text-sm font-semibold px-2.5 py-1 rounded-full"
      style={{ color: meta.color, background: meta.bg }}
    >
      <Icon size={11} />
      {meta.label}
    </span>
  );
}
