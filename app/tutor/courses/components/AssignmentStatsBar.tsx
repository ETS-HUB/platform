import type { AssignmentStats } from "@/apis/tutor/courses/types";

export function AssignmentStatsBar({ stats }: { stats: AssignmentStats }) {
  const segments = [
    { label: "Approved", value: stats.approved, color: "#059669" },
    { label: "Pending", value: stats.pending, color: "#D97706" },
    { label: "Rejected", value: stats.rejected, color: "#DC2626" },
    { label: "Not submitted", value: stats.notSubmitted, color: "#E5E7EB" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span
          className="text-[11.5px] font-medium"
          style={{ color: "#6B7280" }}
        >
          {stats.submitted}/{stats.totalEnrolled} submitted
        </span>
        <span className="text-[12px] font-bold" style={{ color: "#3A0CA3" }}>
          {stats.submissionRate}%
        </span>
      </div>
      <div
        className="flex h-2 rounded-full overflow-hidden"
        style={{ background: "#F0F0F0" }}
      >
        {segments.map((s) => (
          <div
            key={s.label}
            style={{
              width: `${(s.value / stats.totalEnrolled) * 100}%`,
              background: s.color,
            }}
            title={`${s.label}: ${s.value}`}
          />
        ))}
      </div>
      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
        {segments
          .filter((s) => s.value > 0)
          .map((s) => (
            <span
              key={s.label}
              className="inline-flex items-center gap-1 text-[10.5px]"
              style={{ color: "#9CA3AF" }}
            >
              <span
                className="rounded-full"
                style={{ width: 6, height: 6, background: s.color }}
              />
              {s.label} {s.value}
            </span>
          ))}
      </div>
    </div>
  );
}
