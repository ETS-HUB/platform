import type {
  GoalDistributionItem,
  ExperienceLevels,
} from "@/apis/admin/analytics/types";

const EXPERIENCE_COLORS: Record<string, string> = {
  BEGINNER: "#3A0CA3",
  INTERMEDIATE: "#D97706",
  ADVANCED: "#059669",
};

function DistributionList({
  items,
  total,
  colorFor,
}: {
  items: { label: string; count: number }[];
  total: number;
  colorFor: (label: string) => string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
        const color = colorFor(item.label);
        return (
          <div key={item.label}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="font-medium" style={{ color: "#374151" }}>
                {item.label}
              </span>
              <span style={{ color: "#9CA3AF" }}>
                {item.count} ({pct}%)
              </span>
            </div>
            <div
              className="h-1.5 rounded-full"
              style={{ background: "#F0F0F0" }}
            >
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, background: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function DistributionBreakdown({
  goals,
  experience,
}: {
  goals: GoalDistributionItem[];
  experience: ExperienceLevels;
}) {
  const goalItems = goals.map((g) => ({ label: g.goal, count: g.count }));
  const goalTotal = goalItems.reduce((sum, g) => sum + g.count, 0);

  const experienceItems = Object.entries(experience).map(([level, count]) => ({
    label: level,
    count,
  }));
  const experienceTotal = experienceItems.reduce((sum, e) => sum + e.count, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide mb-3 text-[#8A8A8A]">
          Career goals
        </h3>
        {goalItems.length === 0 ? (
          <p className="text-[12.5px]" style={{ color: "#9CA3AF" }}>
            No data yet.
          </p>
        ) : goalItems.length === 1 ? (
          <p className="text-base text-[#6B7280]">
            All {goalTotal} students share one goal:{" "}
            <strong style={{ color: "#0e1430" }}>{goalItems[0].label}</strong>
          </p>
        ) : (
          <DistributionList
            items={goalItems}
            total={goalTotal}
            colorFor={() => "#3A0CA3"}
          />
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide mb-3 text-[#8A8A8A]">
          Experience level
        </h3>
        {experienceItems.length === 0 ? (
          <p className="text-[12.5px]" style={{ color: "#9CA3AF" }}>
            No data yet.
          </p>
        ) : experienceItems.length === 1 ? (
          <p className="text-base text-[#6B7280]">
            All {experienceTotal} students are{" "}
            <strong style={{ color: "#0e1430" }}>
              {experienceItems[0].label.charAt(0) +
                experienceItems[0].label.slice(1).toLowerCase()}
            </strong>
          </p>
        ) : (
          <DistributionList
            items={experienceItems}
            total={experienceTotal}
            colorFor={(label) => EXPERIENCE_COLORS[label] ?? "#8B84A0"}
          />
        )}
      </div>
    </div>
  );
}
