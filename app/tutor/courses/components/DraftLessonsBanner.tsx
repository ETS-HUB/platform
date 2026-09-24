import { FileEdit } from "lucide-react";
import type { DraftLessonSummary } from "@/apis/tutor/courses/types";

export function DraftLessonsBanner({
  drafts,
}: {
  drafts: DraftLessonSummary[];
}) {
  if (drafts.length === 0) return null;

  return (
    <div
      className="rounded-xl p-4 mb-4"
      style={{ background: "#FFF3E0", border: "1.5px solid #FDE68A" }}
    >
      <div className="flex items-center gap-2 mb-2.5">
        <FileEdit size={14} style={{ color: "#D97706" }} />
        <span className="text-[12px] font-bold" style={{ color: "#92400E" }}>
          {drafts.length} draft lesson{drafts.length > 1 ? "s" : ""} — not
          visible to students
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {drafts.map((d) => (
          <div
            key={d.id}
            className="flex items-center justify-between text-[12.5px]"
          >
            <span style={{ color: "#78350F" }}>
              {d.order}. {d.title}
            </span>
            <span style={{ color: "#B45309" }}>{d.duration} min</span>
          </div>
        ))}
      </div>
    </div>
  );
}
