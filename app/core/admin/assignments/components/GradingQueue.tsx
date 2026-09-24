"use client";

import { useState } from "react";
import { Select, Empty } from "antd";
import { Eye } from "lucide-react";
import { SubmissionStatusTag } from "./SubmissionStatusTag";
import { ReviewModal } from "./ReviewModal";
import type {
  SubmissionListItem,
  SubmissionStatus,
  ReviewPayload,
} from "@/apis/admin/assignments/types";

export function GradingQueue({
  submissions,
  onReview,
}: {
  submissions: SubmissionListItem[];
  onReview: (submissionId: string, payload: ReviewPayload) => Promise<void>;
}) {
  const [statusFilter, setStatusFilter] = useState<
    SubmissionStatus | undefined
  >("SUBMITTED");
  const [reviewing, setReviewing] = useState<SubmissionListItem | null>(null);

  const filtered = statusFilter
    ? submissions.filter((s) => s.status === statusFilter)
    : submissions;
  const pendingCount = submissions.filter(
    (s) => s.status === "SUBMITTED",
  ).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p
          className="text-base"
          style={{ color: pendingCount > 0 ? "#D97706" : "#6B7280" }}
        >
          {pendingCount > 0
            ? `${pendingCount} submission${pendingCount > 1 ? "s" : ""} awaiting review`
            : "Nothing pending"}
        </p>
        <Select
          allowClear
          placeholder="All statuses"
          value={statusFilter}
          size="large"
          onChange={setStatusFilter}
          style={{ width: 180 }}
          options={[
            { label: "Pending review", value: "SUBMITTED" },
            { label: "In review", value: "IN_REVIEW" },
            { label: "Approved", value: "APPROVED" },
            { label: "Rejected", value: "REJECTED" },
            { label: "Resubmit requested", value: "RESUBMIT" },
          ]}
        />
      </div>

      {filtered.length === 0 ? (
        <Empty description="No submissions match this filter" />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "#FFFFFF", border: "1.5px solid #EDE0FB" }}
            >
              <img
                src={
                  s.student.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.student.firstName}`
                }
                alt=""
                className="w-9 h-9 rounded-full object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-base text-[#0e1430] font-semibold truncate">
                  {s.student.firstName} {s.student.lastName}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {s.assignment.title} · submitted{" "}
                  {new Date(s.submittedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <SubmissionStatusTag status={s.status} />
              {s.score !== null && (
                <span
                  className="text-base font-bold shrink-0"
                  style={{ color: "#059669" }}
                >
                  {s.score}/{s.assignment.points}
                </span>
              )}
              <button
                type="button"
                onClick={() => setReviewing(s)}
                className="flex cursor-pointer bg-[#F5EEFE] text-[#3A0CA3] items-center gap-1 text-[12px] font-semibold px-3 py-1.5 rounded-full shrink-0"
              >
                <Eye size={12} />
                Review
              </button>
            </div>
          ))}
        </div>
      )}

      <ReviewModal
        submission={reviewing}
        open={!!reviewing}
        onClose={() => setReviewing(null)}
        onReview={onReview}
      />
    </div>
  );
}
