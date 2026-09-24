import { Check, Lock } from "lucide-react";
import type { NavLessonItem, ChatMessage } from "@/apis/lessons/types";

export function LessonSidebar({
  lessons,
  activeLessonId,
  onSelect,
}: {
  lessons: NavLessonItem[];
  activeLessonId: string;
  onSelect: (lessonId: string) => void;
}) {
  return (
    <div className="flex flex-col">
      <h3 className="text-base sm:text-lg font-semibold uppercase tracking-wide mb-6 px-1 text-[#8A8A8A]">
        Course content
      </h3>
      <div className="flex flex-col">
        {lessons.map((lesson, i) => {
          const isActive = lesson.id === activeLessonId;
          const isLast = i === lessons.length - 1;
          const isClickable = lesson.status !== "locked";

          const dotColor =
            lesson.status === "completed"
              ? "#059669"
              : isActive
                ? "#3A0CA3"
                : "#D1D5DB";

          return (
            <div key={lesson.id} className="flex gap-5">
              {/* dot + connecting line */}
              <div className="flex flex-col items-center">
                <div
                  className="flex items-center justify-center rounded-full shrink-0 transition-colors"
                  style={{
                    width: 32,
                    height: 32,
                    background:
                      lesson.status === "completed"
                        ? "#059669"
                        : isActive
                          ? "#3A0CA3"
                          : "#FFFFFF",
                    border: `2px solid ${dotColor}`,
                  }}
                >
                  {lesson.status === "completed" ? (
                    <Check
                      size={20}
                      strokeWidth={3}
                      style={{ color: "#FFFFFF" }}
                    />
                  ) : lesson.status === "locked" ? (
                    <Lock size={10} style={{ color: "#D1D5DB" }} />
                  ) : (
                    <div
                      className="rounded-full"
                      style={{
                        width: 7,
                        height: 7,
                        background: isActive ? "#FFFFFF" : "#D1D5DB",
                      }}
                    />
                  )}
                </div>
                {!isLast && (
                  <div
                    className="w-[2px] flex-1 my-0.5"
                    style={{
                      minHeight: 24,
                      background:
                        lesson.status === "completed" ? "#059669" : "#E5E7EB",
                    }}
                  />
                )}
              </div>

              {/* label */}
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onSelect(lesson.id)}
                className="flex-1 cursor-pointer hover:scale-105 transition-transform text-left pb-6 pr-2 disabled:cursor-not-allowed"
              >
                <p
                  className="text-base sm:text-lg leading-snug transition-colors"
                  style={{
                    fontWeight: isActive ? 700 : 500,
                    color:
                      lesson.status === "locked"
                        ? "#C4C4C4"
                        : isActive
                          ? "#3A0CA3"
                          : "#374151",
                  }}
                >
                  {lesson.order}. {lesson.title}
                </p>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
