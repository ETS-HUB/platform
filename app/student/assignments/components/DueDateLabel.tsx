import { Calendar, AlertTriangle } from "lucide-react";

export function DueDateLabel({
  dueDate,
  isSubmitted,
}: {
  dueDate?: string;
  isSubmitted: boolean;
}) {
  if (!dueDate) return null;

  const due = new Date(dueDate);
  const now = new Date();
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / 86400000);
  const isOverdue = diffDays < 0 && !isSubmitted;
  const isDueSoon = diffDays >= 0 && diffDays <= 2 && !isSubmitted;

  const formatted = due.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  // Overdue-but-submitted and far-future due dates both get neutral styling —
  // urgency coloring is reserved for cases the student can still act on.
  if (isOverdue) {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-base font-medium text-gray-500"
        style={{ color: "#DC2626" }}
      >
        <AlertTriangle size={12} />
        Overdue · was due {formatted}
      </span>
    );
  }

  if (isDueSoon) {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-base font-medium text-gray-500"
        style={{ color: "#D97706" }}
      >
        <Calendar size={12} />
        Due{" "}
        {diffDays === 0
          ? "today"
          : diffDays === 1
            ? "tomorrow"
            : `in ${diffDays} days`}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 text-base font-medium text-gray-500"
      style={{ color: "#9CA3AF" }}
    >
      <Calendar size={12} />
      Due {formatted}
    </span>
  );
}
