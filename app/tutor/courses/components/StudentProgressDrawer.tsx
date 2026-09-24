import { Drawer } from "antd";
import { X, CheckCircle2, Circle } from "lucide-react";
import type { RosterStudent } from "@/apis/tutor/courses/types";
import { useGetStudentProgressQuery } from "@/apis/tutor/tutorService";

export function StudentProgressDrawer({
  student,
  topicId,
  onClose,
}: {
  student: RosterStudent | null;
  topicId: string;
  onClose: () => void;
}) {
  const { data: progress, isLoading } = useGetStudentProgressQuery(
    { topicId, studentId: student?.id ?? "" },
    { skip: !student },
  );

  if (!student) return null;

  return (
    <Drawer
      open={!!student}
      onClose={onClose}
      width={420}
      closable={false}
      styles={{ body: { padding: 0 } }}
    >
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid #EDEDED" }}
      >
        <div className="flex items-center gap-2.5">
          <img
            src={
              student.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.firstName}`
            }
            alt=""
            className="w-8 h-8 rounded-full object-cover"
          />
          <span
            className="text-[13.5px] font-bold"
            style={{ color: "#0e1430" }}
          >
            {student.firstName} {student.lastName}
          </span>
        </div>
        <button type="button" onClick={onClose}>
          <X size={18} style={{ color: "#8A8A8A" }} />
        </button>
      </div>

      <div className="px-5 py-5">
        {isLoading || !progress ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-10 rounded-xl animate-pulse"
                style={{ background: "#F3F4F6" }}
              />
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-[12.5px] font-medium"
                style={{ color: "#6B7280" }}
              >
                {progress.completedLessons}/{progress.totalLessons} lessons
                complete
              </span>
              <span
                className="text-[15px] font-bold"
                style={{ color: "#3A0CA3" }}
              >
                {progress.percentage}%
              </span>
            </div>
            <div
              className="h-1.5 rounded-full mb-5"
              style={{ background: "#EDE0FB" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress.percentage}%`,
                  background: "#3A0CA3",
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              {progress.lessons.map((l) => (
                <div
                  key={l.id}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl"
                  style={{ background: "#FAFAFA" }}
                >
                  {l.isCompleted ? (
                    <CheckCircle2 size={16} style={{ color: "#059669" }} />
                  ) : (
                    <Circle size={16} style={{ color: "#D1D5DB" }} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[12.5px] font-medium truncate"
                      style={{ color: l.isCompleted ? "#374151" : "#9CA3AF" }}
                    >
                      {l.order}. {l.title}
                    </p>
                  </div>
                  {l.score !== null && (
                    <span
                      className="text-[12px] font-bold shrink-0"
                      style={{
                        color:
                          l.score >= 70
                            ? "#059669"
                            : l.score >= 40
                              ? "#D97706"
                              : "#DC2626",
                      }}
                    >
                      {l.score}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
}
