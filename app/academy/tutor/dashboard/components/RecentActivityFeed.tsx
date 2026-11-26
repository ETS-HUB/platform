import { useRouter } from "next/navigation";
import type { RecentActivityItem } from "@/apis/tutor/dashboard/types";

const STATUS_LABEL: Record<
  RecentActivityItem["status"],
  { label: string; color: string }
> = {
  SUBMITTED: { label: "submitted", color: "#D97706" },
  IN_REVIEW: { label: "in review", color: "#3A0CA3" },
  APPROVED: { label: "approved", color: "#059669" },
  REJECTED: { label: "rejected", color: "#DC2626" },
  RESUBMIT: { label: "resubmit requested", color: "#F97316" },
};

function formatRelativeDate(dateStr: string) {
  const diffDays = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 86400000,
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function RecentActivityFeed({
  activity,
}: {
  activity: RecentActivityItem[];
}) {
  const router = useRouter();

  if (activity.length === 0) {
    return (
      <p className="text-[12.5px] py-4" style={{ color: "#9CA3AF" }}>
        No recent submissions.
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      {activity.map((item, i) => {
        const meta = STATUS_LABEL[item.status];
        return (
          <button
            key={item.submissionId}
            type="button"
            onClick={() =>
              router.push(`/tutor/review-queue?highlight=${item.submissionId}`)
            }
            className="flex items-center justify-between text-left py-3"
            style={{
              borderBottom:
                i < activity.length - 1 ? "1px solid #F2F2F2" : "none",
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={
                  item.student.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.student.firstName}`
                }
                alt=""
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="text-base text-gray-900 font-medium truncate">
                  {item.student.firstName} {item.student.lastName}
                </p>
                <p className="text-sm truncate text-gray-500">
                  {item.assignmentTitle} · {item.course.name}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0 ml-3">
              <span
                className="text-sm capitalize font-semibold"
                style={{ color: meta.color }}
              >
                {meta.label}
              </span>
              <span className="text-sm text-gray-500">
                {formatRelativeDate(item.submittedAt)}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
