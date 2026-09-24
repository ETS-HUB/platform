"use client";
import toast from "react-hot-toast";

import { useEffect, useState } from "react";
import { Modal, Radio, InputNumber, message } from "antd";
import { Zap, ExternalLink, FileText } from "lucide-react";
import type {
  SubmissionListItem,
  ReviewPayload,
} from "@/apis/admin/assignments/types";
import Link from "next/link";

export function ReviewModal({
  submission,
  open,
  onClose,
  onReview,
}: {
  submission: SubmissionListItem | null;
  open: boolean;
  onClose: () => void;
  onReview: (submissionId: string, payload: ReviewPayload) => Promise<void>;
}) {
  const [status, setStatus] = useState<"APPROVED" | "REJECTED" | "RESUBMIT">(
    "APPROVED",
  );
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (submission) {
      // Pre-populate with existing review values when re-reviewing
      const existingStatus =
        submission.status === "APPROVED" ||
        submission.status === "REJECTED" ||
        submission.status === "RESUBMIT"
          ? submission.status
          : "APPROVED";
      setStatus(existingStatus);
      setScore(submission.score ?? submission.assignment.points);
      setFeedback(submission.feedback ?? "");
    }
  }, [submission, open]);

  if (!submission) return null;

  const scoreRequired = status === "APPROVED";
  const isValid =
    feedback.trim().length > 0 &&
    (!scoreRequired || (score !== null && score >= 0));
  const xpPreview =
    status === "APPROVED" && score !== null ? Math.round(score / 2) : null;

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    try {
      await onReview(submission.id, {
        status,
        score: score ?? undefined,
        feedback: feedback.trim(),
      });
      toast.success(
        status === "APPROVED"
          ? `Approved — ${xpPreview} XP awarded`
          : status === "REJECTED"
            ? "Submission rejected"
            : "Resubmission requested",
      );
      onClose();
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Submit review"
      okButtonProps={{
        disabled: !isValid,
        loading: submitting,
        style: { background: "#3A0CA3" },
      }}
      title={`Review: ${submission.assignment.title}`}
      width={560}
    >
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex items-center gap-3 rounded-xl p-3.5 bg-[#FAFAFA]">
          <img
            src={
              submission.student.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${submission.student.firstName}`
            }
            alt=""
            className="w-9 h-9 rounded-full object-cover"
          />
          <div>
            <p className="text-sm text-[#0e1430] font-semibold">
              {submission.student.firstName} {submission.student.lastName}
            </p>
            <p className="text-sm text-[#9CA3AF]">{submission.student.email}</p>
          </div>
        </div>

        <div className="rounded-xl p-4 bg-white border border-[#EDE0FB]">
          <h4 className="text-sm text-[#9CA3AF] font-semibold uppercase tracking-wide mb-3">
            Submission
          </h4>
          {submission.link && (
            <Link
              href={submission.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm mb-2 hover:underline"
              style={{ color: "#3A0CA3" }}
            >
              <ExternalLink size={15} />
              <span className="truncate">{submission.link}</span>
            </Link>
          )}
          {submission.files.length > 0 && (
            <div className="flex flex-col gap-1.5 mb-2">
              {submission.files.map((f, i) => (
                <Link
                  key={i}
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm  hover:underline"
                  style={{ color: "#374151" }}
                >
                  <FileText size={12} style={{ color: "#8B84A0" }} />
                  {f.fileName}
                </Link>
              ))}
            </div>
          )}
          {submission.text && (
            <p className="text-sm text-[#374151] leading-relaxed">
              {submission.text}
            </p>
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-2 block">
            Decision
          </label>
          <Radio.Group
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full"
          >
            <div className="flex flex-col gap-2">
              <Radio value="APPROVED">Approve</Radio>
              <Radio value="RESUBMIT">
                Request changes (student can resubmit)
              </Radio>
              <Radio value="REJECTED">Reject</Radio>
            </div>
          </Radio.Group>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Score {scoreRequired && <span style={{ color: "#DC2626" }}>*</span>}
            {!scoreRequired && (
              <span style={{ color: "#9CA3AF" }}> (optional)</span>
            )}
          </label>
          <InputNumber
            value={score}
            onChange={setScore}
            min={0}
            max={submission.assignment.points}
            style={{ width: 140 }}
            placeholder={`out of ${submission.assignment.points}`}
          />
          {xpPreview !== null && (
            <span
              className="inline-flex items-center gap-1 text-[11.5px] font-semibold ml-3"
              style={{ color: "#D97706" }}
            >
              <Zap size={11} fill="#D97706" />+{xpPreview} XP on approve
            </span>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Feedback <span style={{ color: "#DC2626" }}>*</span>
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
            placeholder={
              status === "APPROVED"
                ? "What did they do well?"
                : "What needs to change before this can be approved?"
            }
            className="w-full text-sm border border-gray-300 px-3 py-2 rounded-lg outline-none"
          />
        </div>
      </div>
    </Modal>
  );
}
