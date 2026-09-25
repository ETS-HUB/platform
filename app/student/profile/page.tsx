"use client";

import { useState } from "react";
import { LayoutGrid, Settings, BarChart3 } from "lucide-react";
import { Skeleton } from "antd";
import { useSelector } from "react-redux";
import { LevelCard } from "./components/LevelCard";
import { BadgeGrid } from "./components/BadgeGrid";
import { CertificateSection } from "./components/CertificateSection";
import { StatsTab } from "./components/StatsTab";
import { SettingsTab } from "./components/SettingsTab";
import {
  useGetMyLevelQuery,
  useGetMyBadgesQuery,
  useGetAvailableBadgesQuery,
  useGetMyCertificatesQuery,
} from "@/apis/profile/profileService";
import { useGetUserMeQuery } from "@/apis/dashboard/dashboardService";
import type {
  Certificate,
  AssessmentAttempt,
  LessonProgressSummary,
} from "@/apis/profile/types";
import type { RootState } from "@/store";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserIcon } from "@hugeicons/core-free-icons";

type Tab = "overview" | "stats" | "settings";

export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>("overview");
  const { accessToken } = useSelector((s: RootState) => s.tokens);

  const { data: meData, isLoading: meLoading } = useGetUserMeQuery(undefined, {
    skip: !accessToken,
  });
  const { data: levelData, isLoading: levelLoading } = useGetMyLevelQuery();
  const { data: earnedBadges = [], isLoading: badgesLoading } =
    useGetMyBadgesQuery();
  const { data: availableBadges = [] } = useGetAvailableBadgesQuery();
  const { data: rawCerts = [], isLoading: certsLoading } =
    useGetMyCertificatesQuery();

  // Map MyCertificate → Certificate shape used by CertificateSection
  const certificates: Certificate[] = rawCerts.map((c) => ({
    certificateId: c.certificateId,
    courseName: c.topic.name,
    grade: c.grade,
    issuedAt: c.issuedAt,
    topic: { name: c.topic.name, imageUrl: null },
  }));

  // Extract assessment attempts from /api/users/me
  const assessmentAttempts: AssessmentAttempt[] = (
    (meData?.assessmentAttempts as any[]) ?? []
  ).map((a: any) => ({
    percentageScore: a.percentageScore,
    config: { name: a.config?.name ?? "Assessment" },
    completedAt: a.completedAt,
  }));

  // Derive lesson progress from dashboard/me data — stub empty if not available
  // A dedicated /api/users/lesson-progress endpoint would be ideal; use empty for now
  const lessonProgress: LessonProgressSummary = {
    topicProgress: [],
    recentlyCompleted: [],
    totalLessonsCompleted: 0,
  };

  const isLoading = meLoading || levelLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen w-full">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-[#F3F4F6] animate-pulse" />
          <div className="flex-1">
            <Skeleton active paragraph={{ rows: 1 }} title={{ width: "40%" }} />
          </div>
        </div>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  const user = meData
    ? {
        id: meData.id,
        firstName: meData.firstName,
        lastName: meData.lastName,
        email: meData.email,
        avatar: meData.avatar,
        profile: {
          goal: (meData.profile as any)?.goal,
          trackSlug: (meData.profile as any)?.trackSlug ?? null,
          xp: (meData.profile as any)?.xp ?? 0,
          level: (meData.profile as any)?.level ?? 1,
          experienceLevel: (meData.profile as any)?.experienceLevel,
          learningStyle: (meData.profile as any)?.learningStyle,
          weeklyHours: (meData.profile as any)?.weeklyHours,
        },
      }
    : null;

  if (!user) return null;

  return (
    <div className="min-h-screen w-full">
      <div className="flex items-center gap-4 mb-8">
        {user?.avatar ? (
          <Image
            src={user.avatar}
            alt={"User"}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <HugeiconsIcon icon={UserIcon} size={32} className="text-gray-400" />
        )}

        <div>
          <h1 className="text-2xl font-semibold text-[#0e1430]">
            {user.firstName} {user.lastName}
          </h1>
          {user.profile.goal && (
            <p className="text-base text-[#6B7280]">{user.profile.goal}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 mb-6 border-b border-[#EDEDED]">
        {(
          [
            { key: "overview", label: "Overview", icon: LayoutGrid },
            { key: "stats", label: "Stats", icon: BarChart3 },
            { key: "settings", label: "Settings", icon: Settings },
          ] as const
        ).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className="flex items-center gap-1.5 text-base font-medium px-4 py-2.5"
            style={{
              color: tab === key ? "#3A0CA3" : "#9CA3AF",
              borderBottom:
                tab === key ? "2px solid #3A0CA3" : "2px solid transparent",
            }}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="flex flex-col gap-8">
          {levelData ? (
            <LevelCard level={levelData} />
          ) : (
            <Skeleton active paragraph={{ rows: 2 }} />
          )}

          <div>
            <h2
              className="text-[15px] font-bold mb-4"
              style={{ color: "#0e1430" }}
            >
              Badges
            </h2>
            {badgesLoading ? (
              <Skeleton active paragraph={{ rows: 3 }} />
            ) : (
              <BadgeGrid earned={earnedBadges} available={availableBadges} />
            )}
          </div>

          <div>
            <h2
              className="text-[15px] font-bold mb-4"
              style={{ color: "#0e1430" }}
            >
              Certificates
            </h2>
            {certsLoading ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : (
              <CertificateSection certificates={certificates} />
            )}
          </div>
        </div>
      )}

      {tab === "stats" && (
        <StatsTab
          attempts={assessmentAttempts}
          lessonProgress={lessonProgress}
        />
      )}

      {tab === "settings" && <SettingsTab user={user} />}
    </div>
  );
}
