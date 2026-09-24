"use client";
import toast from "react-hot-toast";

import { useState } from "react";
import { Modal, message } from "antd";
import { AlertTriangle } from "lucide-react";
import { CriteriaBreakdown } from "./CriteriaBreakdown";
import { GradeTag } from "./GradeTag";
import type { AdminCertificate } from "@/apis/admin/certificates/types";

export function RevokeCertificateModal({
  cert,
  open,
  onClose,
  onRevoke,
}: {
  cert: AdminCertificate | null;
  open: boolean;
  onClose: () => void;
  onRevoke: (topicId: string, userId: string) => Promise<void>;
}) {
  const [confirmText, setConfirmText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!cert) return null;

  const expectedText = cert.certificateId;
  const canConfirm = confirmText.trim() === expectedText;

  const handleRevoke = async () => {
    if (!canConfirm) return;
    setSubmitting(true);
    try {
      // topicId isn't directly on the certificate object — it's implied by the
      // topic name, but the revoke endpoint needs the real topicId + userId.
      // The list response doesn't include topicId explicitly; confirm whether
      // it should, or whether topic.id needs adding to this response shape.
      await onRevoke("", cert.user.id);
      toast.success("Certificate revoked");
      onClose();
    } catch {
      toast.error("Failed to revoke certificate");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={() => {
        setConfirmText("");
        onClose();
      }}
      onOk={handleRevoke}
      okText="Revoke certificate"
      okButtonProps={{
        danger: true,
        disabled: !canConfirm,
        loading: submitting,
      }}
      title="Revoke certificate"
      width={480}
    >
      <div className="flex flex-col gap-4 mt-4">
        <div
          className="flex items-start gap-2.5 rounded-xl p-3.5"
          style={{ background: "#FEF2F2" }}
        >
          <AlertTriangle
            size={16}
            style={{ color: "#DC2626" }}
            className="shrink-0 mt-0.5"
          />
          <p className="text-[12.5px]" style={{ color: "#991B1B" }}>
            This permanently invalidates the certificate. Anyone who previously
            verified it will no longer find it valid.
          </p>
        </div>

        <div className="rounded-xl p-4" style={{ background: "#FAFAFA" }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p
                className="text-[13px] font-semibold"
                style={{ color: "#0e1430" }}
              >
                {cert.user.firstName} {cert.user.lastName}
              </p>
              <p className="text-[11.5px]" style={{ color: "#9CA3AF" }}>
                {cert.topic.name}
              </p>
            </div>
            <GradeTag grade={cert.overallGrade} />
          </div>
          <CriteriaBreakdown cert={cert} />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Type the certificate ID to confirm:{" "}
            <span className="font-mono font-semibold">{expectedText}</span>
          </label>
          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full text-[13px] font-mono px-3 py-2 rounded-lg outline-none"
            style={{ border: "1px solid #D9D9D9" }}
          />
        </div>
      </div>
    </Modal>
  );
}
