import { Pencil, Trash2, PowerOff } from "lucide-react";
import { describeCriteria } from "./CriteriaDescription";
import type { BadgeDefinition } from "@/apis/admin/badges/types";

function BadgeIcon({ badge }: { badge: BadgeDefinition }) {
  if (badge.imageUrl) {
    return (
      <img
        src={badge.imageUrl}
        alt={badge.name}
        className="w-10 h-10 rounded-lg object-contain"
      />
    );
  }
  return <span className="text-2xl">🏅</span>;
}

export function BadgesGrid({
  badges,
  onEdit,
  onToggleActive,
  onDelete,
}: {
  badges: BadgeDefinition[];
  onEdit: (b: BadgeDefinition) => void;
  onToggleActive: (b: BadgeDefinition) => void;
  onDelete: (b: BadgeDefinition) => void;
}) {
  if (badges.length === 0) {
    return (
      <p className="text-[13px] py-10 text-center" style={{ color: "#9CA3AF" }}>
        No badges yet — create one to start rewarding student progress.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className="flex items-start gap-3 rounded-2xl p-4"
          style={{
            background: badge.isActive ? "#FFFFFF" : "#FAFAFA",
            border: "1.5px solid #EDE0FB",
            opacity: badge.isActive ? 1 : 0.55,
          }}
        >
          <div
            className="flex items-center justify-center rounded-2xl shrink-0"
            style={{ width: 48, height: 48, background: "#FFFBEB" }}
          >
            <BadgeIcon badge={badge} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-semibold text-[#0e1430]">
              {badge.name}
              {!badge.isActive && (
                <span
                  className="ml-1.5 text-sm font-semibold"
                  style={{ color: "#9CA3AF" }}
                >
                  (deactivated)
                </span>
              )}
            </p>
            {badge.description && (
              <p className="text-base text-[#9CA3AF] mb-1">
                {badge.description}
              </p>
            )}
            <p className="text-sm font-medium text-primary">
              {describeCriteria(badge.criteria)}
            </p>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onEdit(badge)}
              className="p-1.5 cursor-pointer rounded-full hover:bg-gray-100"
              title="Edit"
            >
              <Pencil size={18} style={{ color: "#6B7280" }} />
            </button>
            <button
              type="button"
              onClick={() => onToggleActive(badge)}
              className="p-1.5 cursor-pointer rounded-full hover:bg-yellow-50"
              title={badge.isActive ? "Deactivate" : "Reactivate"}
            >
              <PowerOff
                size={18}
                style={{ color: badge.isActive ? "#D97706" : "#059669" }}
              />
            </button>
            <button
              type="button"
              onClick={() => onDelete(badge)}
              className="p-1.5 cursor-pointer rounded-full hover:bg-red-50"
              title="Delete permanently"
            >
              <Trash2 size={18} style={{ color: "#DC2626" }} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
