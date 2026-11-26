"use client";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Modal, Input } from "antd";
import { useSelector } from "react-redux";
import type {
  CourseNode,
  CreateCategoryPayload,
  UpdateTopicPayload,
} from "@/apis/admin/courses/types";
import type { RootState } from "@/store";
import { uploadFile } from "@/apis/upload/uploadService";

export function CategoryModal({
  category,
  open,
  onClose,
  onCreate,
  onUpdate,
}: {
  category: CourseNode | null;
  open: boolean;
  onClose: () => void;
  onCreate: (payload: CreateCategoryPayload) => Promise<void>;
  onUpdate: (id: string, payload: UpdateTopicPayload) => Promise<void>;
}) {
  const isEdit = !!category;
  const { accessToken } = useSelector((state: RootState) => state.tokens);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setName(category?.name ?? "");
    setDescription(category?.description ?? "");
    setImageUrl(category?.imageUrl);
  }, [category, open]);

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

  const isValid = name.trim().length > 0;

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    try {
      if (isEdit) {
        await onUpdate(category.id, {
          name: name.trim(),
          description: description.trim(),
          imageUrl,
        });
        toast.success("Category updated");
      } else {
        await onCreate({
          name: name.trim(),
          description: description.trim() || undefined,
          imageUrl,
        });
        toast.success("Category created");
      }
      onClose();
    } catch {
      toast.error(
        isEdit ? "Failed to update category" : "Failed to create category",
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
      okText={isEdit ? "Save changes" : "Create category"}
      okButtonProps={{
        disabled: !isValid,
        loading: submitting,
        style: { background: "#3A0CA3" },
      }}
      title={isEdit ? "Edit category" : "New category"}
    >
      <div className="flex flex-col gap-3 mt-4">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Web Development"
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
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Category image
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
                <span className="text-2xl">🗂️</span>
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
      </div>
    </Modal>
  );
}
