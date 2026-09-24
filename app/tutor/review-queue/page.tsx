"use client";
import toast from "react-hot-toast";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Empty, Select, Skeleton } from "antd";
import { Eye } from "lucide-react";

import { SubmissionStatusTag } from "@/app/core/admin/assignments/components/SubmissionStatusTag";
import { ReviewModal } from "@/app/core/admin/assignments/components/ReviewModal";
import {
  useGetMyReviewQueueQuery,
  useReviewSubmissionMutation,
} from "@/apis/tutor/tutorService";
import type {
  SubmissionListItem,
  ReviewPayload,
} from "@/apis/admin/assignments/types";
import Header from "@/components/ui/Header";
import { getApiError } from "@/lib/apiError";

function formatRelative(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function TutorReviewQueuePage() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight");

  const { data: queue = [], isLoading } = useGetMyReviewQueueQuery();
  const [reviewSubmission] = useReviewSubmissionMutation();

  const [statusFilter, setStatusFilter] = useState<
    "SUBMITTED" | "IN_REVIEW" | undefined
  >("SUBMITTED");
  const [reviewing, setReviewing] = useState<SubmissionListItem | null>(null);

  const filtered = statusFilter
    ? queue.filter((s) => s.status === statusFilter)
    : queue;

  const pendingCount = queue.filter((s) => s.status === "SUBMITTED").length;
  const inReviewCount = queue.filter((s) => s.status === "IN_REVIEW").length;

  const handleReview = async (submissionId: string, payload: ReviewPayload) => {
    try {
      await reviewSubmission({ submissionId, payload }).unwrap();
      toast.success(
        payload.status === "APPROVED"
          ? "Approved"
          : payload.status === "REJECTED"
            ? "Rejected"
            : "Resubmission requested",
      );
      setReviewing(null);
    } catch (err) {
      toast.error(getApiError(err, "Failed to submit review"));
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="flex items-start justify-between mb-6">
        <Header
          title="Review queue"
          subtitle={
            isLoading
              ? "Loading submissions..."
              : `${pendingCount} pending · ${inReviewCount} in review`
          }
        />
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
          ]}
        />
      </div>

      {isLoading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : filtered.length === 0 ? (
        <Empty description="Nothing to review right now." />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
              style={{
                background: s.id === highlightId ? "#F5EEFE" : "#FFFFFF",
                border: `1.5px solid ${s.id === highlightId ? "#C9BEDD" : "#EDE0FB"}`,
              }}
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
                <p className="text-[13px] font-semibold text-[#0e1430] truncate">
                  {s.student.firstName} {s.student.lastName}
                </p>
                <p className="text-[11.5px] text-gray-400 truncate">
                  {s.assignment.title}
                  {s.assignment.topic?.name
                    ? ` · ${s.assignment.topic.name}`
                    : ""}
                </p>
              </div>
              <SubmissionStatusTag status={s.status} />
              <span className="text-[11px] text-gray-400 shrink-0">
                {formatRelative(s.submittedAt)}
              </span>
              <button
                type="button"
                onClick={() => setReviewing(s)}
                className="flex cursor-pointer items-center gap-1 text-[12px] font-semibold px-3 py-1.5 rounded-full shrink-0"
                style={{ background: "#F5EEFE", color: "#3A0CA3" }}
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
        onReview={handleReview}
      />
    </div>
  );
}
