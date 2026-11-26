import { CheckCircle2, Clock, AlertCircle, RotateCcw } from "lucide-react";
import type { MySubmission } from "@/apis/assignments/types";

export function SubmissionStatusCard({
  submission,
}: {
  submission: MySubmission;
}) {
  if (submission.status === "APPROVED") {
    return (
      <div
        className="rounded-xl p-4 mb-4"
        style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
      >
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 size={16} style={{ color: "#059669" }} />
          <span className="text-sm font-semibold" style={{ color: "#059669" }}>
            Approved{submission.score !== null ? ` — ${submission.score}%` : ""}
          </span>
        </div>
        {submission.feedback && (
          <p className="text-xs mt-1" style={{ color: "#166534" }}>
            {submission.feedback}
          </p>
        )}
      </div>
    );
  }

  if (submission.status === "REJECTED") {
    return (
      <div
        className="rounded-xl p-4 mb-4"
        style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}
      >
        <div className="flex items-center gap-2 mb-1">
          <AlertCircle size={16} style={{ color: "#DC2626" }} />
          <span className="text-sm font-semibold" style={{ color: "#991B1B" }}>
            Changes needed
          </span>
        </div>
        {submission.feedback && (
          <p className="text-xs mt-1" style={{ color: "#7F1D1D" }}>
            {submission.feedback}
          </p>
        )}
        <p
          className="text-[11px] mt-2 flex items-center gap-1"
          style={{ color: "#991B1B" }}
        >
          <RotateCcw size={11} />
          Resubmit below once you've made changes.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-1">
        <Clock size={16} style={{ color: "#D97706" }} />
        <span className="text-base font-semibold" style={{ color: "#92400E" }}>
          Submitted — pending review
        </span>
      </div>
      <p className="text-sm mt-1" style={{ color: "#92400E" }}>
        Submitted{" "}
        {new Date(submission.submittedAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })}
        . You'll be notified once it's reviewed.
      </p>
    </div>
  );
}
