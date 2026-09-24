import { TrendingUp, BookOpen, ClipboardCheck } from "lucide-react";
import type { AssessmentAttempt, LessonProgressSummary } from "@/apis/profile/types";

export function StatsTab({
  attempts,
  lessonProgress,
}: {
  attempts: AssessmentAttempt[];
  lessonProgress: LessonProgressSummary;
}) {
  return (
    <div className="flex flex-col gap-8">
      {/* lesson progress per topic */}
      <div>
        <h3
          className="text-[13px] font-bold uppercase tracking-wide mb-4 flex items-center gap-1.5"
          style={{ color: "#8A8A8A" }}
        >
          <BookOpen size={13} />
          Course progress
        </h3>
        <div className="flex flex-col gap-3">
          {lessonProgress.topicProgress.map((t) => (
            <div
              key={t.topicId}
              className="rounded-xl p-4"
              style={{ background: "#FFFFFF", border: "1.5px solid #EDE0FB" }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <p
                    className="text-[13px] font-semibold"
                    style={{ color: "#0e1430" }}
                  >
                    {t.topicName}
                  </p>
                  <p className="text-[11px]" style={{ color: "#9CA3AF" }}>
                    {t.parentTopic}
                  </p>
                </div>
                <span
                  className="text-[13px] font-bold"
                  style={{
                    color: t.percentage === 100 ? "#059669" : "#3A0CA3",
                  }}
                >
                  {t.completedLessons}/{t.totalLessons}
                </span>
              </div>
              <div
                className="h-1.5 rounded-full"
                style={{ background: "#EDE0FB" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${t.percentage}%`,
                    background: t.percentage === 100 ? "#059669" : "#3A0CA3",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* assessment history */}
      <div>
        <h3
          className="text-[13px] font-bold uppercase tracking-wide mb-4 flex items-center gap-1.5"
          style={{ color: "#8A8A8A" }}
        >
          <ClipboardCheck size={13} />
          Assessment history
        </h3>
        {attempts.length === 0 ? (
          <p className="text-[12.5px]" style={{ color: "#9CA3AF" }}>
            No assessments taken yet.
          </p>
        ) : (
          <div className="flex flex-col">
            {attempts.map((a, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3"
                style={{
                  borderBottom:
                    i < attempts.length - 1 ? "1px solid #F2F2F2" : "none",
                }}
              >
                <div>
                  <p
                    className="text-[13px] font-medium"
                    style={{ color: "#374151" }}
                  >
                    {a.config.name}
                  </p>
                  <p className="text-[11px]" style={{ color: "#9CA3AF" }}>
                    {new Date(a.completedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className="text-[14px] font-bold"
                  style={{
                    color:
                      a.percentageScore >= 70
                        ? "#059669"
                        : a.percentageScore >= 40
                          ? "#D97706"
                          : "#DC2626",
                  }}
                >
                  {a.percentageScore}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
