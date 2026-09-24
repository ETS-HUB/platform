import { useRouter } from "next/navigation";
import {
  ClipboardCheck,
  MessageCircle,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import type { TutorDashboard } from "@/apis/tutor/dashboard/types";

export function TutorStatTiles({ dashboard }: { dashboard: TutorDashboard }) {
  const router = useRouter();

  const tiles = [
    {
      label: "Pending reviews",
      sublabel: "submitted + in review",
      value: dashboard.pendingReviews,
      icon: ClipboardCheck,
      color: dashboard.pendingReviews > 0 ? "#DC2626" : "#059669",
      bg: dashboard.pendingReviews > 0 ? "#FEF2F2" : "#F0FDF4",
      onClick: () => router.push("/tutor/review-queue"),
    },
    {
      label: "Unread messages",
      value: dashboard.unreadMessages,
      icon: MessageCircle,
      color: dashboard.unreadMessages > 0 ? "#D97706" : "#8B84A0",
      bg: dashboard.unreadMessages > 0 ? "#FFF3E0" : "#F5F5F5",
      onClick: undefined,
    },
    {
      label: "Reviewed this week",
      value: dashboard.reviewedThisWeek,
      icon: CheckCircle2,
      color: "#059669",
      bg: "#F0FDF4",
      onClick: () => router.push("/tutor/review-history"),
    },
    {
      label: "Assigned courses",
      value: dashboard.assignedCourseCount,
      icon: BookOpen,
      color: "#3A0CA3",
      bg: "#F5EEFE",
      onClick: () => router.push("/tutor/courses"),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {tiles.map((tile) => {
        const Icon = tile.icon;
        const Wrapper = tile.onClick ? "button" : "div";
        return (
          <Wrapper
            key={tile.label}
            {...(tile.onClick ? { type: "button", onClick: tile.onClick } : {})}
            className="rounded-2xl p-5 flex items-center gap-4 text-left transition-shadow"
            style={{
              background: "#FFFFFF",
              border: "1.5px solid #EDE0FB",
              cursor: tile.onClick ? "pointer" : "default",
            }}
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
              <p className="text-sm text-gray-500 mt-1.5">
                {tile.label}
              </p>
              {tile.sublabel && (
                <p className="text-sm text-gray-400 mt-0.5">
                  {tile.sublabel}
                </p>
              )}
            </div>
          </Wrapper>
        );
      })}
    </div>
  );
}
