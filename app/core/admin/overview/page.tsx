"use client";

import { useState } from "react";
import { Skeleton } from "antd";
import { StatTiles } from "./components/StatTiles";
import { ScoreDistributionChart } from "./components/ScoreDistributionChart";
import { TopicPerformanceTable } from "./components/TopicPerformanceTable";
import { SkillGapBanner } from "./components/SkillGapBanner";
import { RecentActivityFeed } from "./components/RecentActivityFeed";
import { DistributionBreakdown } from "./components/DistributionBreakdown";
import {
  useGetDashboardStatsQuery,
  useGetScoreDistributionQuery,
  useGetTopicPerformanceQuery,
  useGetSkillGapsQuery,
  useGetRecentActivityQuery,
  useGetGoalDistributionQuery,
  useGetExperienceLevelsQuery,
} from "@/apis/admin/analytics/analyticsService";
import Header from "@/components/ui/Header";

export default function AdminOverviewPage() {
  const [activityLimit, setActivityLimit] = useState(3);

  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: distribution, isLoading: distributionLoading } =
    useGetScoreDistributionQuery();
  const { data: topicPerformance, isLoading: topicLoading } =
    useGetTopicPerformanceQuery();
  const { data: skillGaps, isLoading: skillGapsLoading } =
    useGetSkillGapsQuery();
  const { data: activity, isLoading: activityLoading } =
    useGetRecentActivityQuery({ limit: activityLimit });
  const { data: goals, isLoading: goalsLoading } =
    useGetGoalDistributionQuery();
  const { data: experience, isLoading: experienceLoading } =
    useGetExperienceLevelsQuery();

  return (
    <div className="min-h-screen w-full">
      <div className="mb-8">
        <Header
          title="Overview"
          subtitle="Platform activity and student performance at a glance."
        />
      </div>

      <div className="flex flex-col gap-6">
        {statsLoading || !stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl p-5 border border-[#EDE0FB] bg-white"
              >
                <Skeleton active paragraph={{ rows: 1 }} />
              </div>
            ))}
          </div>
        ) : (
          <StatTiles stats={stats} />
        )}

        {skillGapsLoading || !skillGaps ? (
          <Skeleton active paragraph={{ rows: 1 }} />
        ) : (
          <SkillGapBanner gaps={skillGaps} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6">
          <div
            className="rounded-2xl p-6"
            style={{ background: "#FFFFFF", border: "1.5px solid #EDE0FB" }}
          >
            <h3 className="text-[13px] font-semibold uppercase tracking-wide mb-4 text-[#8A8A8A]">
              Score distribution
            </h3>
            {distributionLoading || !distribution ? (
              <Skeleton active paragraph={{ rows: 4 }} />
            ) : (
              <ScoreDistributionChart distribution={distribution} />
            )}
          </div>

          <div className="rounded-2xl p-6 bg-white border border-[#EDE0FB]">
            {activityLoading || !activity ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
              <RecentActivityFeed
                activity={activity}
                limit={activityLimit}
                onLimitChange={setActivityLimit}
              />
            )}
          </div>
        </div>

        <div className="rounded-2xl p-6 bg-white border border-[#EDE0FB]">
          <h3 className="text-sm font-semibold uppercase tracking-wide mb-4 text-[#8A8A8A]">
            Topic performance
          </h3>
          {topicLoading ||
          skillGapsLoading ||
          !topicPerformance ||
          !skillGaps ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : (
            <TopicPerformanceTable
              performance={topicPerformance}
              skillGaps={skillGaps}
            />
          )}
        </div>

        <div className="rounded-2xl p-6 bg-white border border-[#EDE0FB]">
          {goalsLoading || experienceLoading || !goals || !experience ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : (
            <DistributionBreakdown goals={goals} experience={experience} />
          )}
        </div>
      </div>
    </div>
  );
}
