import { useRouter } from "next/navigation";
import { Users, BookOpen, ClipboardList } from "lucide-react";
import type { TutorCourse } from "@/apis/tutor/dashboard/types";

export function TutorCourseCard({ course }: { course: TutorCourse }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(`/tutor/courses/${course.topicId}`)}
      className="w-full text-left rounded-2xl overflow-hidden transition-shadow hover:shadow-md"
      style={{ background: "#FFFFFF", border: "1.5px solid #EDE0FB" }}
    >
      {course.coverImage ? (
        <img
          src={course.coverImage}
          alt=""
          className="w-full h-40 object-cover"
        />
      ) : (
        <div
          className="w-full h-28 flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #F5EEFE, #EDE0FB)" }}
        >
          <BookOpen size={22} style={{ color: "#C9BEDD" }} />
        </div>
      )}

      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-gray-500">
              {course.category}
            </p>
            <h3 className="text-base font-bold text-[#0e1430]">
              {course.topicName}
            </h3>
          </div>
          {course.pendingSubmissions > 0 && (
            <span className="text-sm font-bold bg-[#FEF2F2] text-[#DC2626] px-2 py-0.5 rounded-full shrink-0">
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
      </div>
    </button>
  );
}
