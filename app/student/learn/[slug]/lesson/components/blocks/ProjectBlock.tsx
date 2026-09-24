"use client";

import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import {
  Upload,
  Link2,
  FileText,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  File as FileIcon,
} from "lucide-react";
import { Input, message } from "antd";
import type { RootState } from "@/store";
import {
  uploadMultipleFiles,
  isAllowedFileType,
} from "@/apis/upload/uploadService";
import { useSubmitAssignmentMutation } from "@/apis/assignments/assignmentService";
import type {
  UploadedFile,
  MySubmission,
} from "@/apis/assignments/assignmentService";
import { TextBlock } from "../blocks/TextBlock"; // reuse the real markdown renderer

interface ProjectBlockProps {
  content: string;
  overview?: string | null;
  assignmentId?: string;
  mySubmission?: MySubmission | null;
}

const MAX_FILES = 10;
const NOTES_MAX_LENGTH = 500;

function looksLikeUrl(value: string) {
  if (!value.trim()) return true; // empty is valid — link is optional
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function ProjectBlock({
  content,
  overview,
  assignmentId,
  mySubmission,
}: ProjectBlockProps) {
  const { accessToken } = useSelector((state: RootState) => state.tokens);
  const [submitAssignment, { isLoading: submitting }] =
    useSubmitAssignmentMutation();

  const [link, setLink] = useState("");
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [linkTouched, setLinkTouched] = useState(false);
  const dropRef = useRef<HTMLLabelElement>(null);

  const submission = mySubmission;
  const isSubmitted = !!submission;
  const canResubmit = submission?.status === "REJECTED";
  const linkIsValid = looksLikeUrl(link);
  const totalFileCount = files.length + uploadedFiles.length;

  const addFiles = (incoming: File[]) => {
    const invalid = incoming.filter((f) => !isAllowedFileType(f));
    if (invalid.length) {
      message.error(
        `Unsupported file type: ${invalid.map((f) => f.name).join(", ")}`,
      );
      return;
    }
    if (totalFileCount + incoming.length > MAX_FILES) {
      message.error(`Maximum ${MAX_FILES} files allowed`);
      return;
    }
    setFiles((prev) => [...prev, ...incoming]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files || []));
    e.target.value = ""; // allow re-selecting the same file after removal
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragActive(false);
    addFiles(Array.from(e.dataTransfer.files || []));
  };

  const removePendingFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!assignmentId || !accessToken) return;
    if (!linkIsValid) {
      setLinkTouched(true);
      message.error("That link doesn't look like a valid URL");
      return;
    }

    let finalFiles = uploadedFiles;

    if (files.length > 0) {
      setUploading(true);
      try {
        const uploaded = await uploadMultipleFiles(files, accessToken);
        // Map UploadResponse → UploadedFile shape expected by the submission payload
        const mappedFiles: UploadedFile[] = uploaded.map((r, i) => ({
          url: r.url,
          fileName: files[i]?.name ?? r.url.split("/").pop() ?? "file",
          fileType: files[i]?.type ?? "application/octet-stream",
          fileSize: files[i]?.size ?? 0,
        }));
        finalFiles = [...uploadedFiles, ...mappedFiles];
        setUploadedFiles(finalFiles);
        setFiles([]);
      } catch {
        message.error("File upload failed. Please try again.");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    try {
      await submitAssignment({
        assignmentId,
        payload: {
          link: link.trim() || undefined,
          files: finalFiles.length > 0 ? finalFiles : undefined,
          text: text.trim() || undefined,
        },
      }).unwrap();
      message.success("Project submitted!");
    } catch {
      message.error("Submission failed. Please try again.");
    }
  };

  const hasAnyContent =
    link.trim() || files.length > 0 || uploadedFiles.length > 0 || text.trim();

  return (
    <div>
      {/* Project description — reuse the real markdown renderer, not a hand-rolled parser */}
      <div className="mb-4">
        <TextBlock content={content} />
      </div>
      {overview && (
        <p className="text-sm text-gray-500 italic mb-4">{overview}</p>
      )}

      {/* Approved / pending status */}
      {isSubmitted && !canResubmit && (
        <div
          className="rounded-xl p-4 mb-4"
          style={{
            background:
              submission.status === "APPROVED" ? "#F0FDF4" : "#FFFBEB",
            border: `1px solid ${submission.status === "APPROVED" ? "#BBF7D0" : "#FDE68A"}`,
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            {submission.status === "APPROVED" ? (
              <CheckCircle2 size={16} style={{ color: "#059669" }} />
            ) : (
              <AlertCircle size={16} style={{ color: "#D97706" }} />
            )}
            <span
              className="text-sm font-semibold"
              style={{
                color: submission.status === "APPROVED" ? "#059669" : "#92400E",
              }}
            >
              {submission.status === "APPROVED"
                ? `Approved — ${submission.score}%`
                : "Pending Review"}
            </span>
          </div>
          {submission.feedback && (
            <p className="text-sm text-gray-600 mt-1">{submission.feedback}</p>
          )}
        </div>
      )}

      {/* Rejected — feedback now shown, not silently dropped */}
      {canResubmit && (
        <div
          className="rounded-xl p-4 mb-4"
          style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}
        >
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={16} style={{ color: "#DC2626" }} />
            <span
              className="text-sm font-semibold"
              style={{ color: "#991B1B" }}
            >
              Not approved — changes needed
            </span>
          </div>
          {submission?.feedback && (
            <p className="text-sm mt-1" style={{ color: "#7F1D1D" }}>
              {submission.feedback}
            </p>
          )}
        </div>
      )}

      {(!isSubmitted || canResubmit) && assignmentId && (
        <div className="rounded-xl p-5 bg-[#F5EEFE] mb-4 border border-[#DDC9F0] font-noto">
          <h4 className="text-lg font-semibold font-noto mb-3 text-[#3A0CA3]">
            {canResubmit ? (
              <span className="flex items-center gap-1.5">
                <RotateCcw size={14} /> Resubmit your project
              </span>
            ) : (
              "Submit your project"
            )}
          </h4>

          <div className="mb-3">
            <label className="text-base font-medium text-gray-600 mb-1 block">
              Project link (GitHub, CodePen, etc.)
            </label>
            <Input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              onBlur={() => setLinkTouched(true)}
              placeholder="https://github.com/you/project"
              prefix={<Link2 size={14} className="text-gray-400" />}
              status={linkTouched && !linkIsValid ? "error" : undefined}
              className="rounded-lg py-3!"
            />
            {linkTouched && !linkIsValid && (
              <p className="text-[11px] mt-1" style={{ color: "#DC2626" }}>
                Enter a full URL, e.g. https://github.com/you/project
              </p>
            )}
          </div>

          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-600 block">
                Notes (optional)
              </label>
              <span
                className="text-[11px]"
                style={{
                  color: text.length > NOTES_MAX_LENGTH ? "#DC2626" : "#9CA3AF",
                }}
              >
                {text.length}/{NOTES_MAX_LENGTH}
              </span>
            </div>
            <Input.TextArea
              value={text}
              onChange={(e) =>
                setText(e.target.value.slice(0, NOTES_MAX_LENGTH))
              }
              placeholder="Describe your approach..."
              rows={3}
              className="rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Attachments ({totalFileCount}/{MAX_FILES})
            </label>
            <label
              ref={dropRef}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-colors"
              style={{
                border: `1.5px dashed ${dragActive ? "#3A0CA3" : "#C9BEDD"}`,
                background: dragActive ? "#EDE0FB" : "transparent",
              }}
            >
              <Upload size={14} style={{ color: "#3A0CA3" }} />
              <span
                className="text-sm font-medium"
                style={{ color: "#3A0CA3" }}
              >
                {dragActive
                  ? "Drop files here"
                  : "Choose files or drag them here"}
              </span>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
                accept=".png,.jpg,.jpeg,.gif,.webp,.pdf,.doc,.docx,.zip,.rar,.txt,.js,.ts"
              />
            </label>

            {/* Already-uploaded files — previously invisible, now shown with their own remove action */}
            {uploadedFiles.length > 0 && (
              <div className="flex flex-col gap-1.5 mt-2">
                {uploadedFiles.map((f, i) => (
                  <div
                    key={`uploaded-${i}`}
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg text-sm"
                    style={{
                      background: "#F0FDF4",
                      border: "1px solid #BBF7D0",
                    }}
                  >
                    <span className="flex items-center gap-1.5 text-gray-700 truncate">
                      <CheckCircle2 size={12} style={{ color: "#059669" }} />
                      {f.fileName}
                    </span>
                    <button type="button" onClick={() => removeUploadedFile(i)}>
                      <X
                        size={13}
                        className="text-gray-400 hover:text-red-500"
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Pending (not-yet-uploaded) files */}
            {files.length > 0 && (
              <div className="flex flex-col gap-1.5 mt-2">
                {files.map((f, i) => (
                  <div
                    key={`pending-${i}`}
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white text-sm"
                  >
                    <span className="flex items-center gap-1.5 text-gray-700 truncate">
                      <FileText size={12} />
                      {f.name}
                      <span className="text-gray-400">
                        ({(f.size / 1024).toFixed(0)} KB)
                      </span>
                    </span>
                    <button type="button" onClick={() => removePendingFile(i)}>
                      <X
                        size={13}
                        className="text-gray-400 hover:text-red-500"
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || uploading || !hasAnyContent || !linkIsValid}
            className="w-full text-sm font-semibold py-2.5 rounded-lg text-white disabled:opacity-50 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "#3A0CA3" }}
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Uploading...
              </span>
            ) : submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Submitting...
              </span>
            ) : canResubmit ? (
              "Resubmit"
            ) : (
              "Submit Project"
            )}
          </button>
          {!hasAnyContent && (
            <p className="text-sm text-gray-500 text-center mt-2">
              Add a link, file, or notes to submit
            </p>
          )}
        </div>
      )}
    </div>
  );
}
