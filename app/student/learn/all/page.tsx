"use client";

import { useMemo, useState } from "react";
import { Pagination } from "antd";
import { useRouter } from "next/navigation";

import {
  useGetTopicsHierarchyQuery,
  useGetCategoriesQuery,
} from "@/apis/lessons/lessonsService";
import { CourseCard, CourseCardData } from "../components/CourseCard";
import { CategoryTabs } from "../components/CategoryTabs";
import { CourseCardSkeleton } from "../components/CourseCardSkeleton";
import Header from "@/components/ui/Header";

const PAGE_SIZE = 8;

export default function CoursesListingPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const [page, setPage] = useState(1);

  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: hierarchyData, isLoading } = useGetTopicsHierarchyQuery({
    category: activeCategory !== "all" ? activeCategory : undefined,
    page,
    limit: PAGE_SIZE,
  });

  const categoryTabs = useMemo(
    () =>
      (categoriesData || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        icon: c.icon,
      })),
    [categoriesData],
  );

  const allCourses: CourseCardData[] = useMemo(() => {
    if (!hierarchyData) return [];
    return hierarchyData.categories.flatMap((category: any) =>
      category.children.map((course: any) => ({
        id: course.id,
        name: course.name,
        imageUrl: course.imageUrl,
        categoryName: category.name,
        totalLessons: course._count.lessons,
        totalEnrollments: course._count.enrollments,
        isEnrolled: course.isEnrolled,
        progress: course.progress,
      })),
    );
  }, [hierarchyData]);

  const totalItems = hierarchyData?.pagination.total || 0;

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    setPage(1);
  };

  const handleCourseClick = (courseId: string) => {
    router.push(`/student/learn/${courseId}`);
  };

  return (
    <div className="min-h-screen w-full">
      <div>
        {/* promo banner */}
        <div
          className="rounded-2xl p-8 mb-10 relative overflow-hidden"
          style={{ background: "#3A0CA3" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,232,102,0.35) 1.5px, transparent 1.5px)",
              backgroundSize: "22px 22px",
              maskImage:
                "linear-gradient(to right, black 0%, black 40%, transparent 85%)",
              WebkitMaskImage:
                "linear-gradient(to right, black 0%, black 40%, transparent 85%)",
            }}
          />
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 320,
              height: 320,
              top: -140,
              right: -100,
              background:
                "radial-gradient(circle, rgba(255,232,102,0.18) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 220,
              height: 220,
              bottom: -120,
              right: 60,
              background:
                "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
            }}
          />

          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-widest mb-3 text-light-yellow">
              New this week
            </p>
            <h2 className="text-[28px] font-bold mb-2 max-w-md text-white">
              Build real skills, one lesson at a time
            </h2>
            <p
              className="text-base font-medium max-w-md mb-5"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              Explore hands-on courses across programming, design, and tooling —
              track your progress as you go.
            </p>
            <button
              type="button"
              onClick={() => handleCategoryChange("all")}
              className="text-[14px] font-semibold px-5 py-2.5 rounded-full transition-transform hover:scale-[1.03] active:scale-[0.97]"
              style={{ background: "#FFE866", color: "#3A0CA3" }}
            >
              Browse all courses
            </button>
          </div>
        </div>

        {/* title */}
        <div className="mb-6">
          <Header
            title="All courses"
            subtitle="Pick up where you left off, or start something new."
          />
        </div>

        {/* category tabs */}
        <div className="mb-8">
          <CategoryTabs
            categories={categoryTabs}
            active={activeCategory}
            onChange={handleCategoryChange}
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        ) : allCourses.length === 0 ? (
          <p
            className="text-[14px] py-10 text-center"
            style={{ color: "#8A8A8A" }}
          >
            No courses in this category yet.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {allCourses.map((course, index) => (
                <CourseCard
                  key={course.id}
                  index={index}
                  course={course}
                  onClick={() => handleCourseClick(course.id)}
                />
              ))}
            </div>

            <div className="flex justify-center">
              <Pagination
                current={page}
                onChange={(p) => setPage(p)}
                total={totalItems}
                pageSize={PAGE_SIZE}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
