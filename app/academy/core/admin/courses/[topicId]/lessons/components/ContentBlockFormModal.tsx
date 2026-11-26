"use client";
import toast from "react-hot-toast";

import { useEffect, useState } from "react";
import { Modal, Input, Select } from "antd";
import type {
  AdminContentBlock,
  ContentBlockType,
} from "@/apis/admin/lessons/types";

export function ContentBlockFormModal({
  block,
  nextOrder,
  open,
  onClose,
  onSave,
}: {
  block: AdminContentBlock | null; // null = create mode
  nextOrder: number;
  open: boolean;
  onClose: () => void;
  onSave: (block: AdminContentBlock) => Promise<void>;
}) {
  const isEdit = !!block;
  const [type, setType] = useState<ContentBlockType>("TEXT");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [overview, setOverview] = useState("");
  const [videoDuration, setVideoDuration] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setType(block?.type ?? "TEXT");
    setTitle(block?.title ?? "");
    setContent(block?.content ?? "");
    setOverview(block?.overview ?? "");
    setVideoDuration(block?.metadata?.duration ?? "");
    setLanguage(block?.metadata?.language ?? "javascript");
  }, [block, open]);

  const isValid = title.trim().length > 0 && content.trim().length > 0;

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    try {
      const metadata =
        type === "VIDEO"
          ? { duration: videoDuration, provider: "youtube" }
          : type === "CODE"
            ? { language }
            : undefined;

      await onSave({
        id: block?.id,
        type,
        order: block?.order ?? nextOrder,
        title: title.trim(),
        content: content.trim(),
        overview: overview.trim() || undefined,
        metadata,
      });
      toast.success(isEdit ? "Block updated" : "Block added");
      onClose();
    } catch {
      toast.error(isEdit ? "Failed to update block" : "Failed to add block");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText={isEdit ? "Save changes" : "Add block"}
      okButtonProps={{
        disabled: !isValid,
        loading: submitting,
        style: { background: "#3A0CA3" },
      }}
      title={isEdit ? "Edit content block" : "Add content block"}
      width={560}
    >
      <div className="flex flex-col gap-3 mt-4">
        {!isEdit && (
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Block type
            </label>
            <Select
              value={type}
              size="large"
              onChange={setType}
              style={{ width: "100%" }}
              options={[
                { label: "Text (markdown)", value: "TEXT" },
                { label: "Video", value: "VIDEO" },
                { label: "Code", value: "CODE" },
                { label: "Resource link", value: "RESOURCE_LINK" },
              ]}
            />
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Title
          </label>
          <Input
            value={title}
            size="large"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Introduction"
          />
        </div>

        {type === "TEXT" && (
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Content (markdown)
            </label>
            <Input.TextArea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              size="large"
              placeholder="## Heading&#10;&#10;Body text..."
            />
          </div>
        )}

        {type === "VIDEO" && (
          <>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                YouTube URL
              </label>
              <Input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Duration (e.g. 8:24)
              </label>
              <Input
                value={videoDuration}
                onChange={(e) => setVideoDuration(e.target.value)}
                style={{ width: 120 }}
              />
            </div>
          </>
        )}

        {type === "CODE" && (
          <>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Language
              </label>
              <Select
                value={language}
                onChange={setLanguage}
                style={{ width: 160 }}
                options={[
                  { label: "JavaScript", value: "javascript" },
                  { label: "TypeScript", value: "typescript" },
                  { label: "HTML", value: "html" },
                  { label: "CSS", value: "css" },
                  { label: "Python", value: "python" },
                ]}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Code
              </label>
              <Input.TextArea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                style={{ fontFamily: "monospace" }}
              />
            </div>
          </>
        )}

        {type === "RESOURCE_LINK" && (
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              URL
            </label>
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="https://developer.mozilla.org/..."
            />
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Overview (optional)
          </label>
          <Input.TextArea
            value={overview}
            size="large"
            onChange={(e) => setOverview(e.target.value)}
            rows={2}
            placeholder="Shown below the block as context"
          />
        </div>
      </div>
    </Modal>
  );
}
