"use client";

import { useState } from "react";
import { Trophy, Zap, BookOpen, ClipboardCheck } from "lucide-react";
import { Select, Skeleton } from "antd";
import { useSelector } from "react-redux";
import { LeaderboardRow } from "../profile/components/LeaderboardRow";
import { MyRankCard } from "../profile/components/MyRankCard";
import { useGetMyRankQuery } from "@/apis/profile/profileService";
import type { LeaderboardCategory } from "@/apis/profile/types";
import type { RootState } from "@/store";

const CATEGORY_META: Record<
  LeaderboardCategory,
  { label: string; icon: typeof Zap }
> = {
  xp: { label: "XP", icon: Zap },
  lessons: { label: "Lessons", icon: BookOpen },
  assessment: { label: "Assessment", icon: ClipboardCheck },
};

export default function LeaderboardPage() {
  const { accessToken } = useSelector((s: RootState) => s.tokens);
  const [category, setCategory] = useState<LeaderboardCategory>("xp");
  const [track, setTrack] = useState<string | undefined>(undefined);

  const { data, isLoading } = useGetMyRankQuery(
    { category, track },
    { skip: !accessToken },
  );

  return (
    <div className="min-h-screen w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <h1
          className="text-[26px] font-bold mb-1.5 flex items-center gap-2.5"
          style={{ color: "#0e1430" }}
        >
          <Trophy size={24} style={{ color: "#3A0CA3" }} />
          Leaderboard
        </h1>
        {data && (
          <p className="text-[14px]" style={{ color: "#6B7280" }}>
            {data.totalParticipants} students competing
          </p>
        )}
      </div>

      {/* category + track filters */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {(Object.keys(CATEGORY_META) as LeaderboardCategory[]).map((key) => {
          const meta = CATEGORY_META[key];
          const Icon = meta.icon;
          const isActive = category === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(key)}
              className="flex items-center gap-1.5 text-[12.5px] font-semibold px-3.5 py-2 rounded-full transition-colors"
              style={{
                background: isActive ? "#3A0CA3" : "#F5F5F5",
                color: isActive ? "#FFFFFF" : "#6B7280",
              }}
            >
              <Icon size={13} />
              {meta.label}
            </button>
          );
        })}

        <div className="ml-auto">
          <Select
            allowClear
            placeholder="All tracks"
            style={{ width: 140 }}
            value={track}
            onChange={setTrack}
            options={[
              { label: "Frontend", value: "frontend" },
              { label: "Backend", value: "backend" },
              { label: "Full Stack", value: "fullstack" },
            ]}
          />
        </div>
      </div>

      {isLoading ? (
        <Skeleton active paragraph={{ rows: 10 }} />
      ) : data ? (
        <>
          <MyRankCard data={data} category={category} />
          <div className="flex flex-col gap-1.5">
            {data.top10.map((entry) => (
              <LeaderboardRow
                key={entry.rank}
                entry={entry}
                category={category}
                isCurrentUser={entry.rank === data.myRank}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
