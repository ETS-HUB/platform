import { CheckCircle2 } from "lucide-react";
import type { PracticeSession } from "@/apis/student/types";

function formatRelativeDate(dateStr: string) {
  const date = new Date(dateStr);
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function SessionHistoryList({
  sessions,
}: {
  sessions: PracticeSession[];
}) {
  if (sessions.length === 0) {
    return (
      <p className="text-[12.5px] py-4" style={{ color: "#9CA3AF" }}>
        No sessions yet for this topic.
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      {sessions.map((s, i) => {
        const percentage = Math.round(
          (s.correctAnswers / s.totalQuestions) * 100,
        );
        const color =
          percentage >= 70
            ? "#059669"
            : percentage >= 40
              ? "#D97706"
              : "#DC2626";

        return (
          <div
            key={s.id}
            className="flex items-center justify-between py-3"
            style={{
              borderBottom:
                i < sessions.length - 1 ? "1px solid #F2F2F2" : "none",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-full w-8 h-8"
                style={{ background: `${color}15` }}
              >
                <CheckCircle2 size={14} style={{ color }} />
              </div>
              <div>
                <p className="text-base text-[#374151] font-medium">
                  {s.correctAnswers}/{s.totalQuestions} correct
                </p>
                <p className="text-sm" style={{ color: "#9CA3AF" }}>
                  {formatRelativeDate(s.completedAt)}
                </p>
              </div>
            </div>
            <span className="text-base font-bold" style={{ color }}>
              {percentage}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
