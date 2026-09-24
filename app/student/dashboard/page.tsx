"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "antd";
import {
  Trophy,
  BarChart3,
  LogOut,
  ArrowRight,
  BookOpen,
  Zap,
  Clock,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";

import { logoutUser } from "@/store/slices/auth/authThunks";
import type { AppDispatch, RootState } from "@/store";

import { CourseCard } from "./components/CourseCard";
import Header from "@/components/ui/Header";
import StatTile from "./components/StatTile";
import {
  useGetDashboardQuery,
  useGetUserMeQuery,
} from "@/apis/dashboard/dashboardService";
import { LeaderboardWidget } from "../leaderboard/components/LeaderboardWidget";
import type { MyRankResponse } from "@/apis/profile/types";

export default function DashboardHome() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken } = useSelector((state: RootState) => state.tokens);
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState("All courses");

  const { data: meData, isLoading: meLoading } = useGetUserMeQuery(undefined, {
    skip: !accessToken,
  });
  const { data, isLoading: dashLoading } = useGetDashboardQuery(undefined, {
    skip: !accessToken || !meData || meData.assessmentAttempts?.length === 0,
  });

  // Redirect first-time users to assessment
  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
      return;
    }
    if (
      meData &&
      (!meData.assessmentAttempts || meData.assessmentAttempts.length === 0)
    ) {
      router.replace("/app/assesment");
    }
  }, [accessToken, meData, router]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.replace("/login");
  };

  const handleContinueCourse = (courseId: string) => {
    router.push(`/student/learn/${courseId}`);
  };

  function formatRelativeDate(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor(
      (now.setHours(0, 0, 0, 0) - new Date(date).setHours(0, 0, 0, 0)) /
        86400000,
    );

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  }

  // Derive category tabs from actual data
  const categoryTabs = useMemo(() => {
    if (!data) return ["All courses"];
    const categories = new Set(data.enrolledCourses.map((c) => c.category));
    return ["All courses", ...Array.from(categories)];
  }, [data]);

  const filteredCourses = useMemo(() => {
    if (!data) return [];
    if (activeTab === "All courses") return data.enrolledCourses;
    return data.enrolledCourses.filter((c) => c.category === activeTab);
  }, [activeTab, data]);

  const nextLessons = useMemo(() => {
    if (!data) return [];
    return data.enrolledCourses.filter((c) => c.nextLesson);
  }, [data]);

  if (meLoading) {
    return (
      <div className="min-h-screen w-full font-quicksand">
        <div className="p-6">
          <Skeleton active paragraph={{ rows: 1 }} title={{ width: "40%" }} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl p-5 min-h-[220px]"
                style={{ background: "#F3F4F6" }}
              >
                <Skeleton active paragraph={{ rows: 4 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const mockDataInTop3: MyRankResponse = {
    myRank: 1,
    myEntry: {
      rank: 1,
      userId: "u1",
      firstName: "Alex",
      lastName: "Johnson",
      xp: 566,
      level: 1,
      trackSlug: "frontend",
    },
    top10: [
      {
        rank: 1,
        userId: "u1",
        firstName: "Alex",
        lastName: "Johnson",
        xp: 566,
        level: 1,
        trackSlug: "frontend",
      },
      {
        rank: 2,
        userId: "u2",
        firstName: "Mike",
        lastName: "Student",
        xp: 289,
        level: 1,
        trackSlug: null,
      },
      {
        rank: 3,
        userId: "u3",
        firstName: "Ethan",
        lastName: "Student",
        xp: 263,
        level: 1,
        trackSlug: null,
      },
      {
        rank: 4,
        userId: "u4",
        firstName: "Priya",
        lastName: "Nair",
        xp: 210,
        level: 1,
        trackSlug: "frontend",
      },
      {
        rank: 5,
        userId: "u5",
        firstName: "Sam",
        lastName: "Lee",
        xp: 188,
        level: 1,
        trackSlug: null,
      },
    ],
    surrounding: [],
    totalParticipants: 9,
  };

  // Outside-top-3 case — footer row shows "Your rank #7"
  const mockDataOutsideTop3: MyRankResponse = {
    myRank: 7,
    myEntry: {
      rank: 7,
      userId: "u7",
      firstName: "Alex",
      lastName: "Johnson",
      xp: 94,
      level: 1,
      trackSlug: "frontend",
    },
    top10: [
      {
        rank: 1,
        userId: "u1",
        firstName: "Mike",
        lastName: "Student",
        xp: 566,
        level: 1,
        trackSlug: null,
      },
      {
        rank: 2,
        userId: "u2",
        firstName: "Ethan",
        lastName: "Student",
        xp: 289,
        level: 1,
        trackSlug: null,
      },
      {
        rank: 3,
        userId: "u3",
        firstName: "Priya",
        lastName: "Nair",
        xp: 263,
        level: 1,
        trackSlug: "frontend",
      },
      {
        rank: 4,
        userId: "u4",
        firstName: "Sam",
        lastName: "Lee",
        xp: 210,
        level: 1,
        trackSlug: null,
      },
      {
        rank: 5,
        userId: "u5",
        firstName: "Dana",
        lastName: "Wu",
        xp: 188,
        level: 1,
        trackSlug: "frontend",
      },
      {
        rank: 6,
        userId: "u6",
        firstName: "Chris",
        lastName: "Okoye",
        xp: 130,
        level: 1,
        trackSlug: null,
      },
      {
        rank: 7,
        userId: "u7",
        firstName: "Alex",
        lastName: "Johnson",
        xp: 94,
        level: 1,
        trackSlug: "frontend",
      },
    ],
    surrounding: [],
    totalParticipants: 9,
  };

  return (
    <div className="min-h-screen w-full font-quicksand">
      <div>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <Header
            title="Dashboard"
            subtitle={`Welcome back, ${user?.firstName}, here's your learning progress.`}
          />
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex gap-2 flex-wrap">
              {categoryTabs.map((tab) => {
                const active = tab === activeTab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className="text-[13.5px] cursor-pointer font-medium px-4 py-2 rounded-full transition-colors"
                    style={{
                      background: active ? "#3a0ca3" : "#FFFFFF",
                      color: active ? "#FFFFFF" : "#111",
                      border: active ? "none" : "1.5px solid #E5E5E5",
                    }}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Course grid */}
        {dashLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl p-5 min-h-[220px]"
                style={{ background: "#F3F4F6" }}
              >
                <Skeleton active paragraph={{ rows: 4 }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
            {filteredCourses.map((course, i) => (
              <CourseCard
                key={course.courseId}
                course={course}
                index={i}
                onContinue={handleContinueCourse}
              />
            ))}
          </div>
        )}

        {/* Next lessons + suggested */}
        {dashLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
            <div
              className="lg:col-span-2 rounded-2xl p-6"
              style={{ background: "#F5F5F5" }}
            >
              <Skeleton active paragraph={{ rows: 5 }} />
            </div>
            <div className="rounded-2xl p-6" style={{ background: "#F5F5F5" }}>
              <Skeleton active paragraph={{ rows: 4 }} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
            {nextLessons.length > 0 && (
              <div
                className="lg:col-span-2 rounded-2xl p-6"
                style={{ background: "#F5F5F5" }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-[18px] font-bold text-[#111]">
                    My next lessons
                  </h2>
                </div>

                <div className="grid grid-cols-[1fr_auto_auto] gap-y-1 text-[11.5px] font-semibold uppercase tracking-wide mb-2 px-1 text-[#9A9A9A]">
                  <span>Lesson</span>
                  <span>Duration</span>
                  <span />
                </div>

                <div className="flex flex-col">
                  {nextLessons.map((course) => (
                    <div
                      key={course.courseId}
                      className="grid grid-cols-[1fr_auto_auto] gap-x-4 items-center py-3 px-1"
                      style={{ borderTop: "1px solid #E5E5E5" }}
                    >
                      <div>
                        <p
                          className="text-[14px] font-semibold"
                          style={{ color: "#111" }}
                        >
                          {course.nextLesson!.title}
                        </p>
                        <p className="text-[12px]" style={{ color: "#8A8A8A" }}>
                          {course.courseName}
                        </p>
                      </div>
                      <span
                        className="text-[13px]"
                        style={{ color: "#6B7280" }}
                      >
                        {course.nextLesson!.duration} min
                      </span>
                      <button
                        type="button"
                        onClick={() => handleContinueCourse(course.courseId)}
                        className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-primary text-white transition-colors hover:bg-primary-dark cursor-pointer"
                      >
                        Start
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* suggested course */}
            {data?.suggestedCourses[0] && (
              <div
                className="rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden"
                style={{ background: "#C6F135" }}
              >
                {/* subtle decorative shape instead of a photo — keeps the flat-color energy but adds depth */}
                <div
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: 180,
                    height: 180,
                    top: -60,
                    right: -60,
                    background: "rgba(255,255,255,0.25)",
                  }}
                />

                <div className="relative">
                  <p className="text-sm font-medium mb-3 text-[#1A1A1A]">
                    New course matching your interests
                  </p>
                  <span
                    className="inline-block text-[11.5px] font-semibold px-3 py-1 rounded-full mb-3"
                    style={{ background: "#111", color: "#FFF" }}
                  >
                    {data.suggestedCourses[0].category}
                  </span>
                  <h3
                    className="text-[22px] font-bold leading-snug"
                    style={{ color: "#111" }}
                  >
                    {data.suggestedCourses[0].courseIcon}{" "}
                    {data.suggestedCourses[0].courseName}
                  </h3>
                  <p
                    className="text-[12.5px] mt-2"
                    style={{ color: "#3A3A3A" }}
                  >
                    {data.suggestedCourses[0].courseDescription}
                  </p>
                </div>

                <div className="mt-4 relative">
                  <p
                    className="text-[12.5px] mb-2"
                    style={{ color: "#3A3A3A" }}
                  >
                    {data.suggestedCourses[0].totalEnrolled} students enrolled
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/student/learn/${data.suggestedCourses[0].courseId}`,
                      )
                    }
                    className="w-full text-[14px] font-semibold py-2.5 rounded-full transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: "#FF5B39", color: "#FFF" }}
                  >
                    More details
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* bottom stats row */}
        {dashLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl p-6 border"
                style={{ background: "#FFFFFF", borderColor: "#EDEDED" }}
              >
                <Skeleton active paragraph={{ rows: 5 }} />
              </div>
            ))}
          </div>
        ) : (
          data && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {data.assessmentSummary.taken &&
                data.assessmentSummary.latest && (
                  <div
                    className="rounded-2xl p-6 border"
                    style={{ background: "#FFFFFF", borderColor: "#EDEDED" }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="flex items-center justify-center rounded-full w-8 h-8 shrink-0"
                          style={{ background: "#EEF1FE" }}
                        >
                          <Trophy size={16} style={{ color: "#2547F4" }} />
                        </div>
                        <div>
                          <h3
                            className="text-[13px] font-semibold"
                            style={{ color: "#8A8A8A" }}
                          >
                            Latest assessment
                          </h3>
                          <p
                            className="text-[13px] font-medium truncate max-w-[220px]"
                            style={{ color: "#111" }}
                          >
                            {data.assessmentSummary.latest.assessmentName}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => router.push("/app/assesment")}
                        className="flex items-center gap-1 bg-primary text-white text-xs font-semibold px-3 py-2 rounded-full shrink-0 transition-opacity hover:bg-primary-hover active:opacity-70"
                      >
                        Retake
                        <ArrowRight size={12} />
                      </button>
                    </div>

                    {/* Overall score */}
                    <div className="flex items-baseline gap-2 mt-4 mb-5">
                      <span
                        className="text-[34px] font-bold leading-none"
                        style={{
                          color:
                            data.assessmentSummary.latest.score >= 70
                              ? "#059669"
                              : data.assessmentSummary.latest.score >= 40
                                ? "#D97706"
                                : "#DC2626",
                        }}
                      >
                        {data.assessmentSummary.latest.score}%
                      </span>
                      <span
                        className="text-[12px] font-medium"
                        style={{ color: "#8A8A8A" }}
                      >
                        overall score
                      </span>
                    </div>

                    {/* Topic breakdown */}
                    <div className="flex flex-col gap-3">
                      {Object.values(
                        data.assessmentSummary.latest.topicScores,
                      ).map((t) => {
                        const color =
                          t.percentage >= 70
                            ? "#059669"
                            : t.percentage >= 40
                              ? "#D97706"
                              : "#DC2626";
                        return (
                          <div
                            key={t.topicName}
                            className="flex flex-col gap-1"
                          >
                            <div className="flex items-center justify-between text-[12.5px]">
                              <span
                                className="font-medium"
                                style={{ color: "#374151" }}
                              >
                                {t.topicName}
                              </span>
                              <span className="font-semibold" style={{ color }}>
                                {t.percentage}%
                              </span>
                            </div>
                            <div
                              className="w-full h-1.5 rounded-full overflow-hidden"
                              style={{ background: "#EFEFEF" }}
                            >
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${t.percentage}%`,
                                  background: color,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* recent activity */}
              <div
                className="rounded-2xl p-6 border"
                style={{ background: "#FFFFFF", borderColor: "#EDEDED" }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 size={18} style={{ color: "#111" }} />
                  <h3
                    className="text-[15px] font-bold"
                    style={{ color: "#111" }}
                  >
                    Recent activity
                  </h3>
                </div>

                <div className="flex flex-col">
                  {[
                    ...data.recentActivity.lessons.slice(0, 3).map((l) => ({
                      type: "lesson" as const,
                      title: l.title,
                      date: l.completedAt,
                      score: l.score,
                    })),
                    ...data.recentActivity.practice.slice(0, 3).map((p) => ({
                      type: "practice" as const,
                      title: "Practice session",
                      date: p.completedAt,
                      correct: p.correctAnswers,
                      total: p.totalQuestions,
                    })),
                  ]
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime(),
                    )
                    .slice(0, 4)
                    .map((item, i, arr) => {
                      const isLesson = item.type === "lesson";
                      const scoreColor = isLesson
                        ? item.score! >= 70
                          ? "#059669"
                          : item.score! >= 40
                            ? "#D97706"
                            : "#DC2626"
                        : "#111";

                      return (
                        <div
                          key={i}
                          className="flex items-center justify-between gap-3 py-3"
                          style={{
                            borderBottom:
                              i < arr.length - 1 ? "1px solid #F2F2F2" : "none",
                          }}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className="flex items-center justify-center rounded-full w-8 h-8 shrink-0"
                              style={{
                                background: isLesson ? "#EEF1FE" : "#FFF3E0",
                              }}
                            >
                              {isLesson ? (
                                <BookOpen
                                  size={14}
                                  style={{ color: "#2547F4" }}
                                />
                              ) : (
                                <Zap size={14} style={{ color: "#D97706" }} />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p
                                className="text-[12.5px] font-medium truncate"
                                style={{ color: "#374151" }}
                              >
                                {item.title}
                              </p>
                              <p
                                className="text-[11px]"
                                style={{ color: "#9CA3AF" }}
                              >
                                {formatRelativeDate(item.date)}
                              </p>
                            </div>
                          </div>

                          <span
                            className="text-[12.5px] font-semibold shrink-0"
                            style={{ color: scoreColor }}
                          >
                            {isLesson
                              ? `${item?.score ?? 0}%`
                              : `${item.correct}/${item.total}`}
                          </span>
                        </div>
                      );
                    })}

                  {data.recentActivity.lessons.length === 0 &&
                    data.recentActivity.practice.length === 0 && (
                      <div className="flex flex-col items-center text-center py-6 gap-2">
                        <div
                          className="flex items-center justify-center rounded-full w-10 h-10"
                          style={{ background: "#F3F4F6" }}
                        >
                          <BarChart3 size={18} style={{ color: "#9CA3AF" }} />
                        </div>
                        <p
                          className="text-[12.5px] font-medium"
                          style={{ color: "#374151" }}
                        >
                          No activity yet
                        </p>
                        <p
                          className="text-[11.5px]"
                          style={{ color: "#9CA3AF" }}
                        >
                          Start a course to see your progress here.
                        </p>
                      </div>
                    )}
                </div>
              </div>

              {/* stats */}
              <div
                className="rounded-2xl p-6 border"
                style={{ background: "#FFFFFF", borderColor: "#EDEDED" }}
              >
                <div className="flex items-center gap-2 mb-5">
                  <BarChart3 size={18} style={{ color: "#111" }} />
                  <h3
                    className="text-[15px] font-bold"
                    style={{ color: "#111" }}
                  >
                    Stats
                  </h3>
                </div>

                {/* 2x2 stat grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <StatTile
                    icon={<BookOpen size={14} style={{ color: "#2547F4" }} />}
                    iconBg="#EEF1FE"
                    value={data.stats.totalCoursesEnrolled}
                    label="Enrolled"
                  />
                  <StatTile
                    icon={<Clock size={14} style={{ color: "#D97706" }} />}
                    iconBg="#FFF3E0"
                    value={data.stats.coursesInProgress}
                    label="In progress"
                  />
                  <StatTile
                    icon={
                      <CheckCircle2 size={14} style={{ color: "#059669" }} />
                    }
                    iconBg="#E7F6EF"
                    value={data.stats.coursesCompleted}
                    label="Completed"
                    valueColor="#059669"
                  />
                  <StatTile
                    icon={
                      <GraduationCap size={14} style={{ color: "#7C3AED" }} />
                    }
                    iconBg="#F3EEFE"
                    value={data.stats.totalLessonsCompleted}
                    label="Lessons done"
                  />
                </div>

                {/* Course completion progress */}
                {data.stats.totalCoursesEnrolled > 0 && (
                  <div className="flex flex-col gap-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11.5px]">
                      <span style={{ color: "#9CA3AF" }}>
                        Course completion
                      </span>
                      <span
                        className="font-semibold"
                        style={{ color: "#374151" }}
                      >
                        {Math.round(
                          (data.stats.coursesCompleted /
                            data.stats.totalCoursesEnrolled) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                    <div
                      className="w-full h-1.5 rounded-full overflow-hidden"
                      style={{ background: "#EFEFEF" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            (data.stats.coursesCompleted /
                              data.stats.totalCoursesEnrolled) *
                            100
                          }%`,
                          background: "#059669",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>
      <LeaderboardWidget data={mockDataOutsideTop3} />
    </div>
  );
}
