"use client";
import toast from "react-hot-toast";

import { useState } from "react";
import { Pagination, Skeleton, Empty } from "antd";
import { Pencil } from "lucide-react";

import {
  useGetMyReviewHistoryQuery,
  useReviewSubmissionMutation,
} from "@/apis/tutor/tutorService";
import { SubmissionStatusTag } from "@/app/core/admin/assignments/components/SubmissionStatusTag";
import { ReviewModal } from "@/app/core/admin/assignments/components/ReviewModal";
import type {
  ReviewHistoryItem,
  ReviewPayload,
  SubmissionListItem,
} from "@/apis/admin/assignments/types";
import Header from "@/components/ui/Header";
import { getApiError } from "@/lib/apiError";

const PAGE_SIZE = 20;

// ReviewModal expects SubmissionListItem — ReviewHistoryItem satisfies that shape
function toSubmissionListItem(s: ReviewHistoryItem): SubmissionListItem {
  return s;
}

export default function TutorReviewHistoryPage() {
  const [page, setPage] = useState(1);
  const [rereviewing, setRereviewing] = useState<ReviewHistoryItem | null>(
    null,
  );

  const { data, isLoading } = useGetMyReviewHistoryQuery({
    page,
    limit: PAGE_SIZE,
  });
  const [reviewSubmission] = useReviewSubmissionMutation();

  const submissions = data?.submissions ?? [];
  const pagination = data?.pagination;

  const handleReview = async (submissionId: string, payload: ReviewPayload) => {
    try {
      await reviewSubmission({ submissionId, payload }).unwrap();
      toast.success(
        payload.status === "APPROVED"
          ? "Updated — approved"
          : payload.status === "REJECTED"
            ? "Updated — rejected"
            : "Updated — resubmission requested",
      );
      setRereviewing(null);
    } catch (err) {
      toast.error(getApiError(err, "Failed to update review"));
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="mb-6">
        <Header
          title="Review history"
          subtitle={
            pagination
              ? `${pagination.total} submission${pagination.total === 1 ? "" : "s"} reviewed`
              : "Your past reviews."
          }
        />
      </div>

      {isLoading ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : submissions.length === 0 ? (
        <Empty description="No reviews yet." />
      ) : (
        <div className="flex flex-col gap-2">
          {submissions.map((s) => (
            <div
              key={s.id}
              className="flex bg-white border border-[#EDE0FB] items-center gap-3 px-4 py-3 rounded-xl"
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
                <p className="text-base font-semibold text-[#0e1430] truncate">
                  {s.student.firstName} {s.student.lastName}
                </p>
                <p className="text-base text-gray-400 truncate">
                  {s.assignment.title}
                  {s.assignment.topic?.name
                    ? ` · ${s.assignment.topic.name}`
                    : ""}
                </p>
              </div>

              <SubmissionStatusTag status={s.status} />

              {s.score !== null && (
                <span className="text-sm text-[#059669] font-bold shrink-0">
                  {s.score}/{s.assignment.points}
                </span>
              )}

              {s.reviewedAt && (
                <span className="text-sm text-gray-400 shrink-0">
                  {new Date(s.reviewedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "2-digit",
                  })}
                </span>
              )}

              <button
                type="button"
                onClick={() => setRereviewing(s)}
                className="flex bg-[#F5EEFE] text-[#3A0CA3] cursor-pointer items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-full shrink-0"
                title="Update this review"
              >
                <Pencil size={15} />
                Update
              </button>
            </div>
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            current={page}
            total={pagination.total}
            pageSize={PAGE_SIZE}
            onChange={setPage}
          />
        </div>
      )}

      <ReviewModal
        submission={rereviewing ? toSubmissionListItem(rereviewing) : null}
        open={!!rereviewing}
        onClose={() => setRereviewing(null)}
        onReview={handleReview}
      />
    </div>
  );
}
