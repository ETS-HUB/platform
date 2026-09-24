"use client";
import toast from "react-hot-toast";

import { useEffect, useState } from "react";
import {
  Modal,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Switch,
  message,
} from "antd";
import dayjs, { type Dayjs } from "dayjs";
import type {
  AdminAssignment,
  AssignmentType,
  CreateAssignmentPayload,
} from "@/apis/admin/assignments/types";

export function AssignmentFormModal({
  assignment,
  topicId,
  lessons,
  open,
  onClose,
  onSave,
}: {
  assignment: AdminAssignment | null; // null = create mode
  topicId: string;
  lessons: { id: string; title: string }[];
  open: boolean;
  onClose: () => void;
  onSave: (
    id: string | null,
    payload: CreateAssignmentPayload,
  ) => Promise<void>;
}) {
  const isEdit = !!assignment;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<AssignmentType>("EXERCISE");
  const [lessonId, setLessonId] = useState<string | undefined>();
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);
  const [points, setPoints] = useState(50);
  const [requiresLink, setRequiresLink] = useState(false);
  const [requiresFile, setRequiresFile] = useState(false);
  const [requiresText, setRequiresText] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setTitle(assignment?.title ?? "");
    setDescription(assignment?.description ?? "");
    setType(assignment?.type ?? "EXERCISE");
    setLessonId(assignment?.lessonId ?? undefined);
    setDueDate(assignment?.dueDate ? dayjs(assignment.dueDate) : null);
    setPoints(assignment?.points ?? 50);
    setRequiresLink(assignment?.requiresLink ?? false);
    setRequiresFile(assignment?.requiresFile ?? false);
    setRequiresText(assignment?.requiresText ?? true);
  }, [assignment, open]);

  const atLeastOneRequirement = requiresLink || requiresFile || requiresText;
  const isValid =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    atLeastOneRequirement;

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    try {
      await onSave(assignment?.id ?? null, {
        topicId,
        lessonId: lessonId || undefined,
        title: title.trim(),
        description: description.trim(),
        type,
        dueDate: dueDate?.toISOString(),
        points,
        requiresLink,
        requiresFile,
        requiresText,
      });
      toast.success(isEdit ? "Assignment updated" : "Assignment created");
      onClose();
    } catch {
      toast.error(
        isEdit ? "Failed to update assignment" : "Failed to create assignment",
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
      okText={isEdit ? "Save changes" : "Create assignment"}
      okButtonProps={{
        disabled: !isValid,
        loading: submitting,
        style: { background: "#3A0CA3" },
      }}
      title={isEdit ? "Edit assignment" : "New assignment"}
      width={600}
    >
      <div className="flex flex-col gap-3 mt-4">
        <div className="grid grid-cols-2 gap-3">
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
                { label: "Exercise", value: "EXERCISE" },
                { label: "Project", value: "PROJECT" },
              ]}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Points
            </label>
            <InputNumber
              value={points}
              size="large"
              onChange={(v) => setPoints(v ?? 50)}
              min={1}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Title
          </label>
          <Input
            value={title}
            size="large"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Mini Project: Build a Todo App"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Description (markdown)
          </label>
          <Input.TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
            size="large"
            placeholder="## Requirements&#10;&#10;1. ..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Attach to lesson (optional)
            </label>
            <Select
              allowClear
              value={lessonId}
              size="large"
              onChange={setLessonId}
              style={{ width: "100%" }}
              placeholder="No lesson"
              options={lessons.map((l) => ({ label: l.title, value: l.id }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Due date (optional)
            </label>
            <DatePicker
              showTime
              value={dueDate}
              size="large"
              onChange={setDueDate}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 mb-2 block">
            Submission requirements <span style={{ color: "#DC2626" }}>*</span>{" "}
            — at least one
          </label>
          <div className="flex flex-col gap-2">
            {[
              {
                key: "link",
                label: "Link (GitHub, CodePen, etc.)",
                value: requiresLink,
                set: setRequiresLink,
              },
              {
                key: "file",
                label: "File upload",
                value: requiresFile,
                set: setRequiresFile,
              },
              {
                key: "text",
                label: "Written notes",
                value: requiresText,
                set: setRequiresText,
              },
            ].map((f) => (
              <div
                key={f.key}
                className="flex items-center justify-between rounded-lg px-3.5 py-2.5"
                style={{ background: "#FAFAFA" }}
              >
                <span className="text-sm" style={{ color: "#374151" }}>
                  {f.label}
                </span>
                <Switch checked={f.value} onChange={f.set} />
              </div>
            ))}
          </div>
          {!atLeastOneRequirement && (
            <p className="text-[11px] mt-1.5" style={{ color: "#DC2626" }}>
              Enable at least one requirement so students know what to submit.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
