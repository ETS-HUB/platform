"use client";
import toast from "react-hot-toast";

import { useEffect, useState } from "react";
import { Modal, Input, InputNumber, Switch, Select } from "antd";
import { useSelector } from "react-redux";
import type {
  CourseNode,
  CreateCoursePayload,
  UpdateTopicPayload,
} from "@/apis/admin/courses/types";
import type { RootState } from "@/store";
import { uploadFile } from "@/apis/upload/uploadService";

export function CourseModal({
  course,
  parentOptions,
  defaultParentId,
  open,
  onClose,
  onCreate,
  onUpdate,
}: {
  course: CourseNode | null;
  parentOptions: { id: string; name: string }[];
  defaultParentId?: string;
  open: boolean;
  onClose: () => void;
  onCreate: (payload: CreateCoursePayload) => Promise<void>;
  onUpdate: (id: string, payload: UpdateTopicPayload) => Promise<void>;
}) {
  const isEdit = !!course;
  const { accessToken } = useSelector((state: RootState) => state.tokens);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState<string | undefined>(defaultParentId);
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [isSequential, setIsSequential] = useState(false);
  const [minQuizScore, setMinQuizScore] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setName(course?.name ?? "");
    setDescription(course?.description ?? "");
    setParentId(course?.parentId ?? defaultParentId);
    setImageUrl(course?.imageUrl);
    setIsSequential(course?.isSequential ?? false);
    setMinQuizScore(course?.minQuizScore ?? null);
  }, [course, defaultParentId, open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !accessToken) return;
    setUploading(true);
    try {
      const result = await uploadFile(file, accessToken, "courses");
      setImageUrl(result.url);
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const isValid = name.trim().length > 0 && (isEdit || !!parentId);

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    try {
      if (isEdit) {
        await onUpdate(course.id, {
          name: name.trim(),
          description: description.trim(),
          imageUrl,
          isSequential,
          minQuizScore: minQuizScore ?? undefined,
        });
        toast.success("Course updated");
      } else {
        await onCreate({
          name: name.trim(),
          description: description.trim() || undefined,
          parentId: parentId!,
          imageUrl,
        });
        toast.success("Course created");
      }
      onClose();
    } catch {
      toast.error(
        isEdit ? "Failed to update course" : "Failed to create course",
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
      okText={isEdit ? "Save changes" : "Create course"}
      okButtonProps={{
        disabled: !isValid,
        loading: submitting,
        style: { background: "#3A0CA3" },
      }}
      title={isEdit ? "Edit course" : "New course"}
    >
      <div className="flex flex-col gap-3 mt-4">
        {!isEdit && (
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              Category
            </label>
            <Select
              value={parentId}
              onChange={setParentId}
              style={{ width: "100%" }}
              placeholder="Select a category"
              options={parentOptions.map((p) => ({
                label: p.name,
                value: p.id,
              }))}
            />
          </div>
        )}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. JavaScript"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Description
          </label>
          <Input.TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Optional"
          />
        </div>
        {/* Image upload — available on both create and edit */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Course image
          </label>
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center shrink-0"
              style={{ background: "#F5EEFE" }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl">📚</span>
              )}
            </div>
            <label
              className="cursor-pointer text-xs font-medium px-3 py-1.5 rounded-lg"
              style={{ background: "#F5EEFE", color: "#3A0CA3" }}
            >
              {uploading ? "Uploading..." : "Upload image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
          </div>
        </div>
        {isEdit && (
          <>
            <div
              className="flex items-center justify-between rounded-lg px-3.5 py-2.5"
              style={{ background: "#FAFAFA" }}
            >
              <div>
                <p
                  className="text-[13px] font-medium"
                  style={{ color: "#374151" }}
                >
                  Sequential lessons
                </p>
                <p className="text-[11px]" style={{ color: "#9CA3AF" }}>
                  Students must complete lessons in order
                </p>
              </div>
              <Switch checked={isSequential} onChange={setIsSequential} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Minimum quiz score to pass (%)
              </label>
              <InputNumber
                value={minQuizScore}
                onChange={setMinQuizScore}
                min={0}
                max={100}
                style={{ width: "100%" }}
                placeholder="No minimum"
              />
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
