import type { AdminCertificate } from "@/apis/admin/certificates/types";

function MiniStat({
  label,
  value,
  total,
  suffix = "",
}: {
  label: string;
  value: number;
  total?: number;
  suffix?: string;
}) {
  const isRatio = total !== undefined;
  const pct = isRatio ? Math.round((value / total) * 100) : value;
  const color = pct >= 90 ? "#059669" : pct >= 70 ? "#D97706" : "#DC2626";

  return (
    <div>
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span style={{ color: "#8B84A0" }}>{label}</span>
        <span className="font-semibold" style={{ color }}>
          {isRatio ? `${value}/${total}` : `${value}${suffix}`}
        </span>
      </div>
      <div className="h-1 rounded-full" style={{ background: "#F0F0F0" }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function CriteriaBreakdown({ cert }: { cert: AdminCertificate }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <MiniStat
        label="Lessons"
        value={cert.lessonsCompleted}
        total={cert.totalLessons}
      />
      <MiniStat
        label="Projects approved"
        value={cert.projectsApproved}
        total={cert.totalProjects}
      />
      <MiniStat
        label="Avg. quiz score"
        value={cert.averageQuizScore}
        suffix="%"
      />
    </div>
  );
}
