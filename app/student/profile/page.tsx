"use client";

import { useState } from "react";
import { LayoutGrid, Settings, BarChart3 } from "lucide-react";
import { LevelCard } from "./components/LevelCard";
import { BadgeGrid } from "./components/BadgeGrid";
import { CertificateSection } from "./components/CertificateSection";
import { StatsTab } from "./components/StatsTab";
import { SettingsTab } from "./components/SettingsTab";
import type {
  UserProfile,
  LevelInfo,
  EarnedBadge,
  AvailableBadge,
  Certificate,
  AssessmentAttempt,
  LessonProgressSummary,
} from "@/apis/profile/types";

const MOCK_USER: UserProfile = {
  id: "u1",
  firstName: "Alex",
  lastName: "Johnson",
  email: "alex@example.com",
  avatar: null,
  profile: {
    goal: "Become a frontend developer",
    trackSlug: "frontend",
    xp: 566,
    level: 1,
  },
};

const MOCK_LEVEL: LevelInfo = {
  xp: 566,
  level: 1,
  levelName: "Explorer",
  nextLevel: {
    level: 10,
    name: "Builder",
    xpRequired: 500,
    xpRemaining: 0,
    progress: 100,
  },
};

const MOCK_EARNED: EarnedBadge[] = [
  {
    id: "b1",
    name: "First Assessment",
    description: "Completed first assessment",
    earnedAt: "2026-07-16T12:29:37.874Z",
  },
  {
    id: "b2",
    name: "HTML Expert",
    description: "Scored 75%+ in HTML",
    earnedAt: "2026-07-16T12:29:37.874Z",
  },
  {
    id: "b3",
    name: "Quick Learner",
    description: "Scored 70%+ overall",
    earnedAt: "2026-07-16T12:29:37.874Z",
  },
];

const MOCK_AVAILABLE: AvailableBadge[] = [
  {
    id: "bd1",
    name: "React Pro",
    description: "Scored above 75% in React",
    criteria: { type: "quiz_score", topic: "React", minScore: 75 },
  },
  {
    id: "bd2",
    name: "JavaScript Proficient",
    criteria: { type: "quiz_score", topic: "JavaScript", minScore: 75 },
  },
  {
    id: "bd3",
    name: "Practice Champion",
    criteria: { type: "practice_count", count: 10 },
  },
  {
    id: "bd4",
    name: "Top Performer",
    criteria: { type: "overall_score", minScore: 90 },
  },
];

const MOCK_CERTIFICATES: Certificate[] = [];

const MOCK_ATTEMPTS: AssessmentAttempt[] = [
  {
    percentageScore: 68,
    config: { name: "Frontend Developer Assessment" },
    completedAt: "2026-07-14T00:00:00Z",
  },
];

const MOCK_PROGRESS: LessonProgressSummary = {
  topicProgress: [
    {
      topicId: "js-uuid",
      topicName: "JavaScript Fundamentals",
      parentTopic: "Programming",
      totalLessons: 9,
      completedLessons: 9,
      percentage: 100,
      enrolledAt: "2026-07-16T00:00:00Z",
    },
    {
      topicId: "react-uuid",
      topicName: "React Essentials",
      parentTopic: "Programming",
      totalLessons: 10,
      completedLessons: 0,
      percentage: 0,
      enrolledAt: "2026-07-16T00:00:00Z",
    },
  ],
  recentlyCompleted: [
    {
      completed: true,
      score: 85,
      completedAt: "2026-07-14T00:00:00Z",
      lesson: { title: "ES6+ Features", topicId: "js-uuid" },
    },
  ],
  totalLessonsCompleted: 9,
};

type Tab = "overview" | "stats" | "settings";

export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>("overview");

  const user = MOCK_USER;
  const level = MOCK_LEVEL;

  return (
    <div className="min-h-screen w-full">
      <div className="flex items-center gap-4 mb-8">
        <img
          src={
            user.avatar ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`
          }
          alt=""
          className="w-16 h-16 rounded-full object-cover"
        />
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
          <LevelCard level={level} />

          <div>
            <h2
              className="text-[15px] font-bold mb-4"
              style={{ color: "#0e1430" }}
            >
              Badges
            </h2>
            <BadgeGrid earned={MOCK_EARNED} available={MOCK_AVAILABLE} />
          </div>

          <div>
            <h2
              className="text-[15px] font-bold mb-4"
              style={{ color: "#0e1430" }}
            >
              Certificates
            </h2>
            <CertificateSection certificates={MOCK_CERTIFICATES} />
          </div>
        </div>
      )}

      {tab === "stats" && (
        <StatsTab attempts={MOCK_ATTEMPTS} lessonProgress={MOCK_PROGRESS} />
      )}

      {tab === "settings" && <SettingsTab user={user} />}
    </div>
  );
}
