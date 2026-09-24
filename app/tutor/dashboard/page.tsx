"use client";

import { GraduationCap } from "lucide-react";
import { TutorStatTiles } from "./components/TutorStatTiles";
import { TutorCourseCard } from "./components/TutorCourseCard";
import { RecentActivityFeed } from "./components/RecentActivityFeed";
import { useGetTutorDashboardQuery } from "@/apis/tutor/tutorService";
import Header from "@/components/ui/Header";
import { Skeleton } from "antd";

export default function TutorOverviewPage() {
  const { data: dashboard, isLoading } = useGetTutorDashboardQuery();

  if (isLoading || !dashboard) {
    return (
      <div className="min-h-screen w-full">
        <div className="mb-8">
          <Header
            title="Overview"
            subtitle="Your courses and what needs your attention."
          />
        </div>
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="mb-8">
        <Header
          title="Overview"
          subtitle="Your courses and what needs your attention."
        />
      </div>

      <div className="flex flex-col gap-6">
        <TutorStatTiles dashboard={dashboard} />

        <div>
          <h3
            className="text-[13px] font-bold uppercase tracking-wide mb-4 text-[#8A8A8A]"
          >
            <GraduationCap size={13} className="inline mr-1.5 -mt-0.5" />
            Your courses
          </h3>
          {dashboard.courses.length === 0 ? (
            <p className="text-[13px]" style={{ color: "#9CA3AF" }}>
              No courses assigned yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dashboard.courses.map((c) => (
                <TutorCourseCard key={c.topicId} course={c} />
              ))}
            </div>
          )}
        </div>

        <div
          className="rounded-2xl p-6"
          style={{ background: "#FFFFFF", border: "1.5px solid #EDE0FB" }}
        >
          <h3
            className="text-sm font-semibold text-[#8A8A8A] uppercase tracking-wide mb-2"
          >
            Recent activity
          </h3>
          <RecentActivityFeed activity={dashboard.recentActivity} />
        </div>
      </div>
    </div>
  );
}
