"use client";
import toast from "react-hot-toast";

import { useEffect, useState } from "react";
import { Modal, Input } from "antd";
import { useSelector } from "react-redux";
import { CriteriaBuilder } from "./CriteriaBuilder";
import type {
  BadgeDefinition,
  BadgePayload,
  BadgeCriteria,
} from "@/apis/admin/badges/types";
import type { RootState } from "@/store";
import { uploadFile } from "@/apis/upload/uploadService";

export function BadgeFormModal({
  badge,
  topics,
  open,
  onClose,
  onSave,
}: {
  badge: BadgeDefinition | null;
  topics: { id: string; name: string }[];
  open: boolean;
  onClose: () => void;
  onSave: (id: string | null, payload: BadgePayload) => Promise<void>;
}) {
  const isEdit = !!badge;
  const { accessToken } = useSelector((state: RootState) => state.tokens);

  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [description, setDescription] = useState("");
  const [criteria, setCriteria] = useState<BadgeCriteria>({
    type: "quiz_score",
    minScore: 75,
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setName(badge?.name ?? "");
    setImageUrl(badge?.imageUrl);
    setDescription(badge?.description ?? "");
    setCriteria(badge?.criteria ?? { type: "quiz_score", minScore: 75 });
  }, [badge, open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !accessToken) return;
    setUploading(true);
    try {
      const result = await uploadFile(file, accessToken, "badges");
      setImageUrl(result.url);
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const criteriaValid =
    (criteria.type === "quiz_score" &&
      !!criteria.topic &&
      !!criteria.minScore) ||
    (criteria.type === "practice_count" && !!criteria.count) ||
    (criteria.type === "overall_score" && !!criteria.minScore);
  const isValid = name.trim().length > 0 && criteriaValid;

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    try {
      await onSave(badge?.id ?? null, {
        name: name.trim(),
        imageUrl,
        description: description.trim() || undefined,
        criteria,
      });
      toast.success(isEdit ? "Badge updated" : "Badge created");
      onClose();
    } catch {
      toast.error(isEdit ? "Failed to update badge" : "Failed to create badge");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText={isEdit ? "Save changes" : "Create badge"}
      okButtonProps={{
        disabled: !isValid,
        loading: submitting,
        style: { background: "#3A0CA3" },
      }}
      title={isEdit ? "Edit badge" : "New badge"}
      width={480}
    >
      <div className="flex flex-col gap-3 mt-4">
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Badge image
          </label>
          <div className="flex items-center gap-3">
            <div className="flex w-14 h-14 bg-[#FFFBEB] border border-[#FDE68A] items-center justify-center rounded-2xl shrink-0 overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="badge"
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-2xl">🏅</span>
              )}
            </div>
            <label className="cursor-pointer bg-[#F5EEFE] text-[#3A0CA3] text-sm font-medium px-3 py-1.5 rounded-lg">
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

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Name
          </label>
          <Input
            size="large"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. React Pro"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Description (optional)
          </label>
          <Input
            size="large"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Shown to students on their profile"
          />
        </div>
        <CriteriaBuilder
          criteria={criteria}
          onChange={setCriteria}
          topics={topics}
        />
      </div>
    </Modal>
  );
}
