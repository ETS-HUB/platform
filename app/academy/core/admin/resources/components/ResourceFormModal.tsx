"use client";
import toast from "react-hot-toast";

import { useEffect, useState } from "react";
import { Modal, Input, Select } from "antd";
import type {
  AdminResource,
  ResourceType,
  Difficulty,
  LearningStyle,
  ResourcePayload,
} from "@/apis/admin/resources/types";

function looksLikeUrl(value: string) {
  try {
    const u = new URL(value.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function ResourceFormModal({
  resource,
  topics,
  open,
  onClose,
  onSave,
}: {
  resource: AdminResource | null;
  topics: { id: string; name: string }[];
  open: boolean;
  onClose: () => void;
  onSave: (id: string | null, payload: ResourcePayload) => Promise<void>;
}) {
  const isEdit = !!resource;

  const [topicId, setTopicId] = useState<string | undefined>();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [urlTouched, setUrlTouched] = useState(false);
  const [type, setType] = useState<ResourceType>("TUTORIAL");
  const [difficulty, setDifficulty] = useState<Difficulty>("EASY");
  const [learningStyle, setLearningStyle] = useState<LearningStyle>("READING");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setTopicId(resource?.topicId);
    setTitle(resource?.title ?? "");
    setUrl(resource?.url ?? "");
    setUrlTouched(false);
    setType(resource?.type ?? "TUTORIAL");
    setDifficulty(resource?.difficulty ?? "EASY");
    setLearningStyle(resource?.learningStyle ?? "READING");
    setDescription(resource?.description ?? "");
  }, [resource, open]);

  const urlValid = looksLikeUrl(url);
  const isValid =
    !!topicId &&
    title.trim().length > 0 &&
    urlValid &&
    description.trim().length > 0;

  const handleSubmit = async () => {
    if (!isValid) {
      setUrlTouched(true);
      return;
    }
    setSubmitting(true);
    try {
      await onSave(resource?.id ?? null, {
        topicId: topicId!,
        title: title.trim(),
        url: url.trim(),
        type,
        difficulty,
        learningStyle,
        description: description.trim(),
      });
      toast.success(isEdit ? "Resource updated" : "Resource created");
      onClose();
    } catch {
      toast.error(
        isEdit ? "Failed to update resource" : "Failed to create resource",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText={isEdit ? "Save changes" : "Create resource"}
      okButtonProps={{
        disabled: !isValid,
        loading: submitting,
        style: { background: "#3A0CA3" },
      }}
      title={isEdit ? "Edit resource" : "New resource"}
      width={520}
    >
      <div className="flex flex-col gap-3 mt-4">
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Topic
          </label>
          <Select
            value={topicId}
            onChange={setTopicId}
            style={{ width: "100%" }}
            placeholder="Select a topic"
            size="large"
            options={topics.map((t) => ({ label: t.name, value: t.id }))}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Title
          </label>
          <Input
            value={title}
            size="large"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. JavaScript.info"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            URL
          </label>
          <Input
            value={url}
            size="large"
            onChange={(e) => setUrl(e.target.value)}
            onBlur={() => setUrlTouched(true)}
            status={urlTouched && !urlValid ? "error" : undefined}
            placeholder="https://..."
          />
          {urlTouched && !urlValid && (
            <p className="text-[11px] mt-1" style={{ color: "#DC2626" }}>
              Enter a full, valid URL
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Type
            </label>
            <Select
              value={type}
              onChange={setType}
              size="large"
              style={{ width: "100%" }}
              options={[
                { label: "Tutorial", value: "TUTORIAL" },
                { label: "Video", value: "VIDEO" },
                { label: "Documentation", value: "DOCUMENTATION" },
              ]}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Difficulty
            </label>
            <Select
              value={difficulty}
              size="large"
              onChange={setDifficulty}
              style={{ width: "100%" }}
              options={[
                { label: "Easy", value: "EASY" },
                { label: "Medium", value: "MEDIUM" },
                { label: "Hard", value: "HARD" },
              ]}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Learning style
            </label>
            <Select
              value={learningStyle}
              size="large"
              onChange={setLearningStyle}
              style={{ width: "100%" }}
              options={[
                { label: "Visual", value: "VISUAL" },
                { label: "Reading", value: "READING" },
                { label: "Hands-on", value: "HANDS_ON" },
              ]}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Description
          </label>
          <Input.TextArea
            value={description}
            size="large"
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Shown to students in the library"
          />
        </div>
      </div>
    </Modal>
  );
}
