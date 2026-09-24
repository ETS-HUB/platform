import { LeaderboardRow } from "./LeaderboardRow";
import type { MyRankResponse, LeaderboardCategory } from "@/apis/profile/types";

export function MyRankCard({
  data,
  category,
}: {
  data: MyRankResponse;
  category: LeaderboardCategory;
}) {
  const inTop10 = data.myRank <= 10;

  if (inTop10) return null; // already visible in the main top10 list — no need to repeat

  return (
    <div
      className="rounded-2xl p-5 mb-6"
      style={{ background: "#F5EEFE", border: "1.5px solid #DDC9F0" }}
    >
      <p
        className="text-[11px] font-bold uppercase tracking-wide mb-3"
        style={{ color: "#8B84A0" }}
      >
        Your rank — #{data.myRank} of {data.totalParticipants}
      </p>

      {data.surrounding.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          {data.surrounding.map((entry) => (
            <LeaderboardRow
              key={entry.rank}
              entry={entry}
              category={category}
              isCurrentUser={entry.rank === data.myRank}
            />
          ))}
        </div>
      ) : (
        <LeaderboardRow
          entry={data.myEntry}
          category={category}
          isCurrentUser
        />
      )}
    </div>
  );
}
