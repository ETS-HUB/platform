import { FileCode2, Rocket, Clock } from "lucide-react";
import type { TutorCourseAssignment } from "@/apis/tutor/courses/types";

const TYPE_META = {
  EXERCISE: { icon: FileCode2, label: "Exercise", color: "#3A0CA3" },
  PROJECT: { icon: Rocket, label: "Project", color: "#F52593" },
};

export function TutorAssignmentCard({
  assignment,
  onEdit,
  onReview,
}: {
  assignment: TutorCourseAssignment;
  onEdit: () => void;
  onReview: () => void;
}) {
  const meta = TYPE_META[assignment.type];
  const Icon = meta.icon;
  const { stats } = assignment;

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "#FFFFFF", border: "1.5px solid #EDE0FB" }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-full w-9 h-9 shrink-0"
            style={{ background: `${meta.color}15` }}
          >
            <Icon size={16} style={{ color: meta.color }} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[10.5px] font-bold uppercase"
                style={{ color: meta.color }}
              >
                {meta.label}
              </span>
              <span className="text-[10.5px]" style={{ color: "#9CA3AF" }}>
                {assignment.points} pts
              </span>
              {assignment.dueDate && (
                <span
                  className="inline-flex items-center gap-0.5 text-[10.5px]"
                  style={{ color: "#9CA3AF" }}
                >
                  <Clock size={10} />
                  Due{" "}
                  {new Date(assignment.dueDate).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>
            <p className="text-[13.5px] font-bold" style={{ color: "#0e1430" }}>
              {assignment.title}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "#9CA3AF" }}>
              by {assignment.createdBy.firstName}{" "}
              {assignment.createdBy.lastName}
            </p>
          </div>
        </div>

        {/* Submission count */}
        <div className="text-right shrink-0">
          <p className="text-[15px] font-bold" style={{ color: "#3A0CA3" }}>
            {stats.submitted}
            <span className="text-[11px] font-normal text-gray-400">
              /{stats.totalEnrolled}
            </span>
          </p>
          <p className="text-[10.5px]" style={{ color: "#9CA3AF" }}>
            submitted
          </p>
          {stats.pending > 0 && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: "#FEF2F2", color: "#DC2626" }}
            >
              {stats.pending} pending
            </span>
          )}
        </div>
      </div>

      {/* Submission rate bar */}
      <div className="mb-3">
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "#F0F0F0" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${stats.submissionRate}%`,
              background:
                stats.submissionRate >= 70
                  ? "#059669"
                  : stats.submissionRate >= 40
                    ? "#D97706"
                    : "#DC2626",
            }}
          />
        </div>
        <p className="text-[10.5px] mt-1" style={{ color: "#9CA3AF" }}>
          {stats.submissionRate}% submission rate ·{" "}
          {stats.approved > 0 && (
            <span style={{ color: "#059669" }}>{stats.approved} approved </span>
          )}
          {stats.rejected > 0 && (
            <span style={{ color: "#DC2626" }}>{stats.rejected} rejected </span>
          )}
          {stats.notSubmitted > 0 && `${stats.notSubmitted} not submitted`}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="text-[12px] font-semibold px-3 py-1.5 rounded-full"
          style={{ background: "#F5EEFE", color: "#3A0CA3" }}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onReview}
          className="text-[12px] font-semibold px-3 py-1.5 rounded-full"
          style={{ background: "#3A0CA3", color: "#FFFFFF" }}
        >
          Review submissions
        </button>
      </div>
    </div>
  );
}
