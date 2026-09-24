import { Users, ClipboardCheck, TrendingUp, Dumbbell } from "lucide-react";
import type { DashboardStats } from "@/apis/admin/analytics/types";

export function StatTiles({ stats }: { stats: DashboardStats }) {
  const tiles = [
    {
      label: "Total students",
      value: stats.totalStudents,
      icon: Users,
      color: "#3A0CA3",
      bg: "#F5EEFE",
    },
    {
      label: "Assessments completed",
      value: `${stats.completedAssessments}/${stats.totalAssessments}`,
      icon: ClipboardCheck,
      color: "#059669",
      bg: "#F0FDF4",
    },
    {
      label: "Completion rate",
      value: `${stats.completionRate}%`,
      icon: TrendingUp,
      color:
        stats.completionRate >= 70
          ? "#059669"
          : stats.completionRate >= 40
            ? "#D97706"
            : "#DC2626",
      bg:
        stats.completionRate >= 70
          ? "#F0FDF4"
          : stats.completionRate >= 40
            ? "#FFF3E0"
            : "#FEF2F2",
    },
    {
      label: "Practice sessions",
      value: stats.totalPracticeSessions,
      icon: Dumbbell,
      color: "#F52593",
      bg: "#FCE3F1",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {tiles.map((tile) => {
        const Icon = tile.icon;
        return (
          <div
            key={tile.label}
            className="rounded-2xl p-5 flex items-center gap-4 border border-[#EDE0FB] bg-white"
          >
            <div
              className="flex items-center justify-center rounded-full w-11 h-11 shrink-0"
              style={{ background: tile.bg }}
            >
              <Icon size={19} style={{ color: tile.color }} />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none text-[#0e1430]">
                {tile.value}
              </p>
              <p className="text-sm mt-1.5 text-gray-600">{tile.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
