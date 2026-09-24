import { useRouter } from "next/navigation";
import { Users, BookOpen, ClipboardList } from "lucide-react";
import type { TutorCourse } from "@/apis/tutor/courses/types";

export function TutorCourseCard({ course }: { course: TutorCourse }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(`/tutor/courses/${course.topicId}`)}
      className="w-full cursor-pointer bg-white border border-[#EDE0FB] text-left flex flex-col gap-3 rounded-2xl p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-base font-medium" style={{ color: "#9CA3AF" }}>
            {course.category}
          </p>
          <h3 className="text-lg font-semibold text-[#0e1430]">
            {course.topicName}
          </h3>
        </div>
        {course.pendingSubmissions > 0 && (
          <span
            className="text-sm font-bold px-2 py-0.5 rounded-full shrink-0"
            style={{ background: "#FEF2F2", color: "#DC2626" }}
          >
            {course.pendingSubmissions} pending
          </span>
        )}
      </div>

      <div
        className="flex items-center gap-4 text-base"
        style={{ color: "#8B84A0" }}
      >
        <span className="inline-flex items-center gap-1.5">
          <Users size={16} />
          {course.studentCount}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <BookOpen size={16} />
          {course.lessonCount} lessons
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ClipboardList size={16} />
          {course.assignmentCount} assignments
        </span>
      </div>
    </button>
  );
}
