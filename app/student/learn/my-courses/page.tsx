"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import { Skeleton } from "antd";

import { useGetDashboardQuery } from "@/apis/dashboard/dashboardService";
import { CourseCard, CourseCardData } from "../components/CourseCard";
import Header from "@/components/ui/Header";

const SKELETON_COUNT = 8;

function CourseCardSkeleton() {
  return (
    <div
      className="relative rounded-2xl p-6 pr-8 flex items-center justify-between gap-6 w-full overflow-hidden"
      style={{
        background: "#FBFAFE",
        border: "1.5px solid #EDE0FB",
        minHeight: "180px",
      }}
    >
      <div className="flex flex-col gap-3 w-full max-w-[62%]">
        {/* category pill */}
        <Skeleton.Button
          active
          size="small"
          shape="round"
          style={{ width: 90, height: 20 }}
        />

        {/* icon + title */}
        <div className="flex items-center gap-2.5 mt-1">
          <Skeleton.Avatar active size={22} shape="circle" />
          <Skeleton.Input active size="small" style={{ width: 140 }} />
        </div>

        {/* lessons / enrolled meta row */}
        <div className="flex items-center gap-4 mt-1">
          <Skeleton.Input
            active
            size="small"
            style={{ width: 70, height: 14 }}
          />
          <Skeleton.Input
            active
            size="small"
            style={{ width: 50, height: 14 }}
          />
        </div>

        {/* progress bar */}
        <div className="max-w-[220px] mt-1 w-full">
          <div className="flex justify-between mb-1.5">
            <Skeleton.Input
              active
              size="small"
              style={{ width: 60, height: 12 }}
            />
            <Skeleton.Input
              active
              size="small"
              style={{ width: 28, height: 12 }}
            />
          </div>
          <Skeleton.Input
            active
            size="small"
            style={{ width: "100%", height: 6, borderRadius: 999 }}
          />
        </div>
      </div>

      <Skeleton.Avatar
        active
        shape="circle"
        size={90}
        style={{ position: "absolute", right: -10, bottom: -20, opacity: 0.6 }}
      />
    </div>
  );
}

export default function MyCoursesPage() {
  const router = useRouter();
  const { data, isLoading } = useGetDashboardQuery();

  const courseCards: CourseCardData[] = useMemo(
    () =>
      (data?.enrolledCourses || []).map((c: any) => ({
        id: c.courseId,
        name: c.courseName,
        icon: c.courseIcon,
        categoryName: c.category || "General",
        totalLessons: c.totalLessons,
        totalEnrollments: c.totalEnrolled,
        isEnrolled: true,
        progress: {
          completedLessons: c.completedLessons,
          totalLessons: c.totalLessons,
          percentage: c.percentage,
        },
      })),
    [data],
  );

  const handleCourseClick = (courseId: string) => {
    router.push(`/student/learn/${courseId}`);
  };

  return (
    <div className="min-h-screen w-full">
      <div>
        <div className="mb-8">
          <Header
            title="My courses"
            subtitle="Courses you're currently enrolled in."
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        ) : courseCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <BookOpen size={48} style={{ color: "#C9BEDD" }} />
            <p
              className="text-[15px] font-medium mt-4"
              style={{ color: "#6B7280" }}
            >
              No courses yet
            </p>
            <p className="text-[13px] mt-1" style={{ color: "#9CA3AF" }}>
              Enroll in a course to start learning.
            </p>
            <button
              type="button"
              onClick={() => router.push("/student/learn/all")}
              className="mt-6 text-[14px] font-semibold px-5 py-2.5 rounded-full"
              style={{ background: "#3A0CA3", color: "#FFFFFF" }}
            >
              Browse courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {courseCards.map((course, index) => (
              <CourseCard
                key={course.id}
                index={index}
                course={course}
                onClick={() => handleCourseClick(course.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
