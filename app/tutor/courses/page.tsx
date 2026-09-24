"use client";

import { Skeleton } from "antd";
import { TutorCourseCard } from "./components/TutorCourseCard";
import { useGetTutorMyCoursesQuery } from "@/apis/tutor/tutorService";
import Header from "@/components/ui/Header";

export default function TutorCoursesListPage() {
  const { data: courses = [], isLoading } = useGetTutorMyCoursesQuery();

  return (
    <div className="min-h-screen w-full">
      <div className="mb-8">
        <Header
          title="My courses"
          subtitle={`${!isLoading ? `${courses.length} course${courses.length === 1 ? "" : "s"} assigned to` : ""} you.`}
        />
      </div>

      {isLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : courses.length === 0 ? (
        <p className="text-sm py-10 text-center text-[#9CA3AF]">
          No courses assigned yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c) => (
            <TutorCourseCard key={c.topicId} course={c} />
          ))}
        </div>
      )}
    </div>
  );
}
