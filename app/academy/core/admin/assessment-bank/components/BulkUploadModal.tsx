"use client";
import toast from "react-hot-toast";

import { useState } from "react";
import { Modal, message } from "antd";
import { UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";
import type {
  CreateQuestionPayload,
  BulkUploadResult,
} from "@/apis/admin/questions/types";

const PLACEHOLDER = `{
  "questions": [
    {
      "topicId": "clx4d5e6f7g8h9i0j1k2l3m4n",
      "difficulty": "EASY",
      "text": "Which symbol is used for single-line comments?",
      "options": [
        { "id": "a", "text": "//", "isCorrect": true },
        { "id": "b", "text": "#", "isCorrect": false }
      ],
      "explanation": "// starts a single-line comment.",
      "points": 10
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
    !("questions" in parsed)
  ) {
    return { valid: false, error: 'Missing top-level "questions" array' };
  }
  const questions = (parsed as { questions: unknown }).questions;
  if (!Array.isArray(questions) || questions.length === 0) {
    return { valid: false, error: '"questions" must be a non-empty array' };
  }
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i] as Partial<CreateQuestionPayload>;
    if (!q.topicId || !q.text || !q.difficulty || !Array.isArray(q.options)) {
      return {
        valid: false,
        error: `Question ${i + 1} is missing a required field (topicId, text, difficulty, or options)`,
      };
    }
    if (!q.options.some((o) => o.isCorrect)) {
      return {
        valid: false,
        error: `Question ${i + 1} has no option marked isCorrect: true`,
      };
    }
  }
  return { valid: true, count: questions.length };
}

export function BulkUploadModal({
  open,
  onClose,
  onUpload,
}: {
  open: boolean;
  onClose: () => void;
  onUpload: (questions: CreateQuestionPayload[]) => Promise<BulkUploadResult>;
}) {
  const [raw, setRaw] = useState("");
  const [validation, setValidation] = useState<{
    valid: boolean;
    error?: string;
    count?: number;
  } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<BulkUploadResult | null>(null);

  const handleChange = (value: string) => {
    setRaw(value);
    setResult(null);
    if (!value.trim()) {
      setValidation(null);
      return;
    }
    try {
      const parsed = JSON.parse(value);
      setValidation(validate(parsed));
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
      const uploadResult = await onUpload(parsed.questions);
      setResult(uploadResult);
      toast.success(`${uploadResult.uploaded} question(s) uploaded`);
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
      okText={`Upload${validation?.count ? ` ${validation.count} question(s)` : ""}`}
      okButtonProps={{
        disabled: !validation?.valid,
        loading: uploading,
        style: { background: "#3A0CA3" },
      }}
      title="Bulk upload questions"
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
            questions
          </code>{" "}
          array. Same shape as creating one question.
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
              ? `${validation.count} valid question(s) ready to upload`
              : validation.error}
          </div>
        )}

        {result && (
          <div
            className="flex items-center gap-2 text-[12.5px] px-3 py-2 rounded-lg"
            style={{ background: "#F5EEFE", color: "#3A0CA3" }}
          >
            <UploadCloud size={14} />
            {result.uploaded} question(s) created successfully.
          </div>
        )}
      </div>
    </Modal>
  );
}
