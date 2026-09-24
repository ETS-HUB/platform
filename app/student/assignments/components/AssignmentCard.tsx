import { FileCode2, Rocket, Paperclip } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { DueDateLabel } from "./DueDateLabel";
import type { AssignmentListItem } from "@/apis/assignments/types";

const TYPE_META = {
  EXERCISE: { icon: FileCode2, label: "Exercise", color: "#3A0CA3" },
  PROJECT: { icon: Rocket, label: "Project", color: "#F52593" },
};

export function AssignmentCard({
  assignment,
  onClick,
}: {
  assignment: AssignmentListItem;
  onClick: () => void;
}) {
  const meta = TYPE_META[assignment.type];
  const Icon = meta.icon;
  const isSubmitted = !!assignment.mySubmission;
  const isGraded =
    assignment.mySubmission?.status === "APPROVED" &&
    assignment.mySubmission.score !== null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left bg-white border border-[#EDE0FB] cursor-pointer flex items-start justify-between gap-4 rounded-2xl p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex gap-3.5 min-w-0">
        <div
          className="flex items-center justify-center rounded-full w-10 h-10 shrink-0"
          style={{ background: `${meta.color}15` }}
        >
          <Icon size={17} style={{ color: meta.color }} />
        </div>

        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-semibold uppercase tracking-wide"
              style={{ color: meta.color }}
            >
              {meta.label}
            </span>
            <span className="text-sm text-[#9CA3AF]">
              {assignment.points} pts
            </span>
          </div>
          <h3
            className="text-base text-[#0e1430] font-semibold leading-snug"
          >
            {assignment.title}
          </h3>
          <div className="flex items-center gap-3 flex-wrap ">
            <DueDateLabel
              dueDate={assignment.dueDate}
              isSubmitted={isSubmitted}
            />
            {(assignment.requiresLink || assignment.requiresFile) && (
              <span
                className="inline-flex items-center gap-1 text-base font-medium text-gray-500"
              >
                <Paperclip size={11} />
                {[
                  assignment.requiresLink && "link",
                  assignment.requiresFile && "file",
                ]
                  .filter(Boolean)
                  .join(" + ")}{" "}
                required
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <StatusBadge status={assignment.mySubmission?.status ?? null} />
        {isGraded && (
          <span className="text-[15px] font-bold" style={{ color: "#059669" }}>
            {assignment.mySubmission!.score}%
          </span>
        )}
      </div>
    </button>
  );
}
