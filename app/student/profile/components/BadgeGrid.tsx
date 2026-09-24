import { Lock } from "lucide-react";
import type { EarnedBadge, AvailableBadge } from "@/apis/profile/types";

function describeCriteria(badge: AvailableBadge): string {
  const { criteria } = badge;
  if (criteria.type === "quiz_score")
    return `Score ${criteria.minScore}%+ in ${criteria.topic}`;
  if (criteria.type === "practice_count")
    return `Complete ${criteria.count} practice sessions`;
  if (criteria.type === "overall_score")
    return `Score ${criteria.minScore}%+ overall`;
  return "";
}

export function BadgeGrid({
  earned,
  available,
}: {
  earned: EarnedBadge[];
  available: AvailableBadge[];
}) {
  const earnedNames = new Set(earned.map((b) => b.name));
  const lockedBadges = available.filter((b) => !earnedNames.has(b.name));

  return (
    <div>
      {earned.length > 0 && (
        <div className="mb-6">
          <h3
            className="text-[13px] font-bold uppercase tracking-wide mb-3"
            style={{ color: "#8A8A8A" }}
          >
            Earned ({earned.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {earned.map((badge) => (
              <div
                key={badge.id}
                className="flex flex-col items-center text-center gap-2 rounded-2xl p-4"
                style={{ background: "#FFFBEB", border: "1.5px solid #FDE68A" }}
              >
                {badge.imageUrl ? (
                  <img
                    src={badge.imageUrl}
                    alt={badge.name}
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <span className="text-[32px] leading-none">🏅</span>
                )}
                <p
                  className="text-[12.5px] font-bold"
                  style={{ color: "#0e1430" }}
                >
                  {badge.name}
                </p>
                <p className="text-[10.5px]" style={{ color: "#92400E" }}>
                  {badge.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {lockedBadges.length > 0 && (
        <div>
          <h3
            className="text-[13px] font-bold uppercase tracking-wide mb-3"
            style={{ color: "#8A8A8A" }}
          >
            To earn
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {lockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="relative flex flex-col items-center text-center gap-2 rounded-2xl p-4"
                style={{ background: "#FAFAFA", border: "1.5px solid #E5E7EB" }}
              >
                <div className="absolute top-2 right-2">
                  <Lock size={11} style={{ color: "#C4C4C4" }} />
                </div>
                <span className="text-[32px] leading-none opacity-30 grayscale">
                  🏅
                </span>
                <p
                  className="text-[12.5px] font-semibold"
                  style={{ color: "#6B7280" }}
                >
                  {badge.name}
                </p>
                <p className="text-[10.5px]" style={{ color: "#9CA3AF" }}>
                  {describeCriteria(badge)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
