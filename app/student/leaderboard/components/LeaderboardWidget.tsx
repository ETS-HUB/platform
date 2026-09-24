// leaderboard/LeaderboardWidget.tsx
import { useRouter } from "next/navigation";
import { Trophy, ArrowRight } from "lucide-react";
import { RankBadge } from "../../profile/components/RankBadge";
import type { MyRankResponse } from "@/apis/profile/types";

export function LeaderboardWidget({ data }: { data: MyRankResponse }) {
  const router = useRouter();
  const top3 = data.top10.slice(0, 3);
  const inTop3 = data.myRank <= 3;

  return (
    <div className="rounded-2xl p-6" style={{ background: "#F5F5F5" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy size={16} style={{ color: "#3A0CA3" }} />
          <h3 className="text-[14px] font-bold" style={{ color: "#111" }}>
            Leaderboard
          </h3>
        </div>
        <button
          type="button"
          onClick={() => router.push("/student/leaderboard")}
          className="flex items-center gap-1 text-[11.5px] font-semibold"
          style={{ color: "#3A0CA3" }}
        >
          See all
          <ArrowRight size={12} />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {top3.map((entry) => (
          <div key={entry.rank} className="flex items-center gap-2.5">
            <RankBadge rank={entry.rank} />
            <span
              className="text-[12.5px] font-medium flex-1 truncate"
              style={{ color: "#374151" }}
            >
              {entry.firstName}
            </span>
            <span
              className="text-[12px] font-bold"
              style={{ color: "#3A0CA3" }}
            >
              {entry.xp} XP
            </span>
          </div>
        ))}
      </div>

      {!inTop3 && (
        <div
          className="flex items-center justify-between mt-3 pt-3 text-[12px]"
          style={{ borderTop: "1px solid #E5E7EB", color: "#6B7280" }}
        >
          <span>Your rank</span>
          <span className="font-bold" style={{ color: "#3A0CA3" }}>
            #{data.myRank}
          </span>
        </div>
      )}
    </div>
  );
}
