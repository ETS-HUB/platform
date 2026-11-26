"use client";
import toast from "react-hot-toast";

import { useState } from "react";
import { Modal, message } from "antd";
import { UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";
import type { ResourcePayload } from "@/apis/admin/resources/types";

const PLACEHOLDER = `{
  "resources": [
    {
      "topicId": "clx4d5e6f7g8h9i0j1k2l3m4n",
      "title": "JavaScript.info",
      "url": "https://javascript.info/",
      "type": "TUTORIAL",
      "difficulty": "EASY",
      "learningStyle": "READING",
      "description": "Comprehensive JS tutorial"
    }
  ]
}`;

function validate(parsed: unknown): {
  valid: boolean;
  error?: string;
  count?: number;
} {
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("resources" in parsed)
  ) {
    return { valid: false, error: 'Missing top-level "resources" array' };
  }
  const resources = (parsed as { resources: unknown }).resources;
  if (!Array.isArray(resources) || resources.length === 0) {
    return { valid: false, error: '"resources" must be a non-empty array' };
  }
  for (let i = 0; i < resources.length; i++) {
    const r = resources[i] as Partial<ResourcePayload>;
    if (!r.topicId || !r.title || !r.url || !r.type) {
      return {
        valid: false,
        error: `Resource ${i + 1} is missing a required field (topicId, title, url, or type)`,
      };
    }
    try {
      new URL(r.url);
    } catch {
      return { valid: false, error: `Resource ${i + 1} has an invalid URL` };
    }
  }
  return { valid: true, count: resources.length };
}

export function BulkResourceUploadModal({
  open,
  onClose,
  onUpload,
}: {
  open: boolean;
  onClose: () => void;
  onUpload: (resources: ResourcePayload[]) => Promise<{ uploaded: number }>;
}) {
  const [raw, setRaw] = useState("");
  const [validation, setValidation] = useState<{
    valid: boolean;
    error?: string;
    count?: number;
  } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ uploaded: number } | null>(null);

  const handleChange = (value: string) => {
    setRaw(value);
    setResult(null);
    if (!value.trim()) {
      setValidation(null);
      return;
    }
    try {
      setValidation(validate(JSON.parse(value)));
    } catch {
      setValidation({
        valid: false,
        error: "Invalid JSON — check for missing commas or brackets",
      });
    }
  };

  const handleUpload = async () => {
    if (!validation?.valid) return;
    setUploading(true);
    try {
      const parsed = JSON.parse(raw);
      const res = await onUpload(parsed.resources);
      setResult(res);
      toast.success(`${res.uploaded} resource(s) uploaded`);
    } catch {
      toast.error("Upload failed — check the payload and try again");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setRaw("");
    setValidation(null);
    setResult(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      onOk={handleUpload}
      okText={`Upload${validation?.count ? ` ${validation.count} resource(s)` : ""}`}
      okButtonProps={{
        disabled: !validation?.valid,
        loading: uploading,
        style: { background: "#3A0CA3" },
      }}
      title="Bulk upload resources"
      width={640}
    >
      <div className="flex flex-col gap-3 mt-4">
        <p className="text-[12.5px]" style={{ color: "#6B7280" }}>
          Paste a JSON object with a{" "}
          <code
            style={{
              background: "#F5F5F5",
              padding: "1px 4px",
              borderRadius: 4,
            }}
          >
            resources
          </code>{" "}
          array.
        </p>

        <textarea
          value={raw}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={12}
          className="text-[12px] p-3 rounded-lg outline-none"
          style={{
            fontFamily: "monospace",
            background: "#0e1430",
            color: "#E5E7EB",
            border:
              validation && !validation.valid
                ? "1.5px solid #DC2626"
                : "1.5px solid transparent",
          }}
        />

        {validation && (
          <div
            className="flex items-center gap-2 text-[12.5px] px-3 py-2 rounded-lg"
            style={{
              background: validation.valid ? "#F0FDF4" : "#FEF2F2",
              color: validation.valid ? "#166534" : "#991B1B",
            }}
          >
            {validation.valid ? (
              <CheckCircle2 size={14} />
            ) : (
              <AlertCircle size={14} />
            )}
            {validation.valid
              ? `${validation.count} valid resource(s) ready to upload`
              : validation.error}
          </div>
        )}

        {result && (
          <div
            className="flex items-center gap-2 text-[12.5px] px-3 py-2 rounded-lg"
            style={{ background: "#F5EEFE", color: "#3A0CA3" }}
          >
            <UploadCloud size={14} />
            {result.uploaded} resource(s) created successfully.
          </div>
        )}
      </div>
    </Modal>
  );
}
