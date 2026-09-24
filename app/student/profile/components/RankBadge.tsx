import { Crown } from "lucide-react";

export function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    const colors = { 1: "#FFD700", 2: "#C0C0C0", 3: "#CD7F32" };
    return (
      <div
        className="flex items-center justify-center rounded-full w-8 h-8 shrink-0"
        style={{ background: `${colors[rank as 1 | 2 | 3]}20` }}
      >
        <Crown
          size={14}
          style={{ color: colors[rank as 1 | 2 | 3] }}
          fill={colors[rank as 1 | 2 | 3]}
        />
      </div>
    );
  }
  return (
    <div
      className="flex items-center justify-center rounded-full w-8 h-8 shrink-0"
      style={{ background: "#F5F5F5" }}
    >
      <span className="text-[12px] font-bold" style={{ color: "#6B7280" }}>
        {rank}
      </span>
    </div>
  );
}
