"use client";

import { useState } from "react";
import { Upload, Link2, FileText, X, Loader2 } from "lucide-react";
import { Input, message } from "antd";
import type { SubmittedFile } from "@/apis/assignments/types";

function looksLikeUrl(value: string) {
  if (!value.trim()) return true;
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function SubmissionForm({
  requiresLink,
  requiresFile,
  requiresText,
  isResubmit,
  onSubmit,
}: {
  requiresLink: boolean;
  requiresFile: boolean;
  requiresText: boolean;
  isResubmit: boolean;
  onSubmit: (payload: {
    link?: string;
    files?: SubmittedFile[];
    text?: string;
  }) => Promise<void>;
}) {
  const [link, setLink] = useState("");
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [linkTouched, setLinkTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const linkIsValid = !requiresLink || looksLikeUrl(link);
  const linkOk = requiresLink ? link.trim().length > 0 && linkIsValid : true;
  const textOk = requiresText ? text.trim().length > 0 : true;
  const fileOk = requiresFile ? files.length > 0 : true;
  const canSubmit = linkOk && textOk && fileOk && !submitting;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles((prev) => [...prev, ...Array.from(e.target.files || [])]);
    e.target.value = "";
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      setLinkTouched(true);
      return;
    }
    setSubmitting(true);
    try {
      // File upload step happens here in the real implementation —
      // uploaded results become SubmittedFile[] before calling onSubmit
      await onSubmit({
        link: requiresLink ? link.trim() : undefined,
        text: requiresText ? text.trim() : undefined,
      });
    } catch {
      message.error("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "#F5EEFE", border: "1.5px solid #DDC9F0" }}
    >
      <h4 className="text-sm font-bold mb-3" style={{ color: "#3A0CA3" }}>
        {isResubmit ? "Resubmit your work" : "Submit your work"}
      </h4>

      {requiresLink && (
        <div className="mb-3">
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Link <span style={{ color: "#DC2626" }}>*</span>
          </label>
          <Input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onBlur={() => setLinkTouched(true)}
            placeholder="https://github.com/you/project"
            prefix={<Link2 size={14} className="text-gray-400" />}
            status={linkTouched && !linkIsValid ? "error" : undefined}
            className="rounded-lg"
          />
          {linkTouched && !linkIsValid && (
            <p className="text-[11px] mt-1" style={{ color: "#DC2626" }}>
              Enter a full URL
            </p>
          )}
        </div>
      )}

      {requiresText && (
        <div className="mb-3">
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Notes <span style={{ color: "#DC2626" }}>*</span>
          </label>
          <Input.TextArea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe your approach..."
            rows={3}
            className="rounded-lg"
          />
        </div>
      )}

      {requiresFile && (
        <div className="mb-4">
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Files <span style={{ color: "#DC2626" }}>*</span>
          </label>
          <label
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-[#EDE0FB]"
            style={{ border: "1.5px dashed #C9BEDD" }}
          >
            <Upload size={14} style={{ color: "#3A0CA3" }} />
            <span className="text-xs font-medium" style={{ color: "#3A0CA3" }}>
              Choose files
            </span>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>

          {files.length > 0 && (
            <div className="flex flex-col gap-1.5 mt-2">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white text-xs"
                >
                  <span className="flex items-center gap-1.5 text-gray-700 truncate">
                    <FileText size={12} />
                    {f.name}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFiles((prev) => prev.filter((_, idx) => idx !== i))
                    }
                  >
                    <X size={13} className="text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full text-sm font-semibold py-2.5 rounded-lg text-white disabled:opacity-50 transition-transform hover:scale-[1.02] active:scale-[0.98]"
        style={{ background: "#3A0CA3" }}
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 size={14} className="animate-spin" /> Submitting...
          </span>
        ) : isResubmit ? (
          "Resubmit"
        ) : (
          "Submit"
        )}
      </button>
    </div>
  );
}
