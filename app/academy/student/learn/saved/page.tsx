"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2, BookmarkX } from "lucide-react";

import { useGetBookmarksQuery } from "@/apis/lessons/lessonsService";
import { CourseCard, CourseCardData } from "../components/CourseCard";
import Header from "@/components/ui/Header";

export default function SavedCoursesPage() {
  const router = useRouter();
  const { data: courses, isLoading } = useGetBookmarksQuery();

  const courseCards: CourseCardData[] = useMemo(
    () =>
      (courses || []).map((c) => ({
        id: c.courseId,
        name: c.courseName,
        icon: c.courseIcon,
        categoryName: c.category || "General",
        totalLessons: c.totalLessons,
        totalEnrollments: c.totalEnrolled,
      })),
    [courses],
  );

  const handleCourseClick = (courseId: string) => {
    router.push(`/student/learn/${courseId}`);
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#FAFAFA" }}
      >
        <Loader2
          className="w-7 h-7 animate-spin"
          style={{ color: "#3A0CA3" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div>
        <div className="mb-8">
          <Header
            title="Saved courses"
            subtitle="Courses you've bookmarked for later."
          />
        </div>

        {courseCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <BookmarkX size={48} style={{ color: "#C9BEDD" }} />
            <p
              className="text-[15px] font-medium mt-4"
              style={{ color: "#6B7280" }}
            >
              No saved courses yet
            </p>
            <p className="text-[13px] mt-1" style={{ color: "#9CA3AF" }}>
              Bookmark courses from the catalog to see them here.
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
