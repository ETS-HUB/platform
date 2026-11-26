import { Users, BookOpen, ClipboardList, FileEdit } from "lucide-react";
import type { TutorCourseStats } from "@/apis/tutor/courses/types";

export function CourseStatsBar({ stats }: { stats: TutorCourseStats }) {
  const tiles = [
    {
      label: "Enrolled",
      value: stats.totalEnrolled,
      icon: Users,
      color: "#3A0CA3",
    },
    {
      label: "Published lessons",
      value: `${stats.publishedLessons}/${stats.totalLessons}`,
      icon: BookOpen,
      color: "#059669",
    },
    {
      label: "Draft lessons",
      value: stats.draftLessons,
      icon: FileEdit,
      color: stats.draftLessons > 0 ? "#D97706" : "#8B84A0",
    },
    {
      label: "Pending reviews",
      value: stats.pendingReviews,
      icon: ClipboardList,
      color: stats.pendingReviews > 0 ? "#DC2626" : "#059669",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {tiles.map((t) => {
        const Icon = t.icon;
        return (
          <div
            key={t.label}
            className="flex items-center gap-2.5 rounded-xl p-3.5 bg-[#FAFAFA]"
          >
            <Icon size={20} style={{ color: t.color }} />
            <div>
              <p className="text-xl text-[#0e1430] font-semibold leading-none">
                {t.value}
              </p>
              <p className="text-base text-[#9CA3AF] mt-1">{t.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
