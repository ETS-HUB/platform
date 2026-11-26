import { RankBadge } from "./RankBadge";
import type {
  LeaderboardEntry,
  LeaderboardCategory,
} from "@/apis/profile/types";

const TRACK_LABELS: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  fullstack: "Full Stack",
};

function getMetricDisplay(
  entry: LeaderboardEntry,
  category: LeaderboardCategory,
) {
  if (category === "xp") return { value: `${entry.xp} XP`, color: "#3A0CA3" };
  if (category === "lessons")
    return { value: `${entry.lessonsCompleted} lessons`, color: "#059669" };
  return { value: `${entry.avgScore}% avg`, color: "#D97706" };
}

export function LeaderboardRow({
  entry,
  category,
  isCurrentUser,
}: {
  entry: LeaderboardEntry;
  category: LeaderboardCategory;
  isCurrentUser: boolean;
}) {
  const metric = getMetricDisplay(entry, category);

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{
        background: isCurrentUser ? "#F5EEFE" : "transparent",
        border: isCurrentUser
          ? "1.5px solid #DDC9F0"
          : "1.5px solid transparent",
      }}
    >
      <RankBadge rank={entry.rank} />
      <img
        src={
          entry.avatar ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.firstName}`
        }
        alt=""
        className="w-8 h-8 rounded-full object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p
          className="text-[13px] font-semibold truncate"
          style={{ color: isCurrentUser ? "#3A0CA3" : "#0e1430" }}
        >
          {entry.firstName} {entry.lastName ?? ""}
          {isCurrentUser && (
            <span
              className="ml-1.5 text-[10.5px] font-medium"
              style={{ color: "#8B84A0" }}
            >
              (you)
            </span>
          )}
        </p>
        {entry.trackSlug && (
          <p className="text-[10.5px]" style={{ color: "#9CA3AF" }}>
            {TRACK_LABELS[entry.trackSlug] ?? entry.trackSlug}
          </p>
        )}
      </div>
      <span
        className="text-[13px] font-bold shrink-0"
        style={{ color: metric.color }}
      >
        {metric.value}
      </span>
    </div>
  );
}
