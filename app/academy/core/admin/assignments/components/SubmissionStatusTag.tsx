import { Tag } from "antd";
import type { SubmissionStatus } from "@/apis/admin/assignments/types";

const STATUS_META: Record<SubmissionStatus, { label: string; color: string }> =
  {
    SUBMITTED: { label: "Pending review", color: "gold" },
    IN_REVIEW: { label: "In review", color: "blue" },
    APPROVED: { label: "Approved", color: "green" },
    REJECTED: { label: "Rejected", color: "red" },
    RESUBMIT: { label: "Resubmit requested", color: "orange" },
  };

export function SubmissionStatusTag({ status }: { status: SubmissionStatus }) {
  const meta = STATUS_META[status];
  return (
    <Tag style={{ fontSize: 15 }} color={meta.color} bordered={false}>
      {meta.label}
    </Tag>
  );
}
