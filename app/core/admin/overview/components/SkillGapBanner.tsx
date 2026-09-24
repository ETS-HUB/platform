import { AlertTriangle } from "lucide-react";
import type { SkillGap } from "@/apis/admin/analytics/types";

export function SkillGapBanner({ gaps }: { gaps: SkillGap[] }) {
  if (gaps.length === 0) return null;

  const critical = gaps.filter(
    (g) => g.severity === "critical" || g.severity === "high",
  );

  if (critical.length === 0) return null;

  return (
    <div className="rounded-2xl p-4 flex items-start gap-3 bg-[#FEF2F2] border border-[#FECACA]">
      <AlertTriangle
        size={17}
        style={{ color: "#DC2626" }}
        className="shrink-0 mt-0.5"
      />
      <div>
        <p className="text-base font-semibold text-[#991B1B]">
          {critical.length} topic{critical.length > 1 ? "s" : ""} need
          {critical.length === 1 ? "s" : ""} attention
        </p>
        <p className="text-sm mt-0.5 text-[#7F1D1D] font-medium">
          {critical.map((g) => `${g.topic} (${g.averageScore}%)`).join(" · ")}
        </p>
      </div>
    </div>
  );
}
