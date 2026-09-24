"use client";
import toast from "react-hot-toast";

import { useEffect, useState } from "react";
import { Modal, Input } from "antd";
import { Lock, Unlock } from "lucide-react";
import { useSelector } from "react-redux";
import { slugify } from "@/utils/slugify";
import type { Track, TrackPayload } from "@/apis/admin/tracks/types";
import type { RootState } from "@/store";
import { uploadFile } from "@/apis/upload/uploadService";

export function TrackFormModal({
  track,
  existingSlugs,
  open,
  onClose,
  onSave,
}: {
  track: Track | null;
  existingSlugs: string[];
  open: boolean;
  onClose: () => void;
  onSave: (id: string | null, payload: TrackPayload) => Promise<void>;
}) {
  const isEdit = !!track;
  const { accessToken } = useSelector((state: RootState) => state.tokens);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugLocked, setSlugLocked] = useState(false);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setName(track?.name ?? "");
    setSlug(track?.slug ?? "");
    setSlugLocked(isEdit);
    setDescription(track?.description ?? "");
    setImageUrl(track?.imageUrl);
  }, [track, open, isEdit]);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugLocked) setSlug(slugify(value));
  };

  const handleSlugChange = (value: string) => {
    setSlug(slugify(value));
    setSlugLocked(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !accessToken) return;
    setUploading(true);
    try {
      const result = await uploadFile(file, accessToken, "tracks");
      setImageUrl(result.url);
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const slugTaken = !isEdit && existingSlugs.includes(slug);
  const isValid = name.trim().length > 0 && slug.length > 0 && !slugTaken;

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    try {
      await onSave(track?.id ?? null, {
        slug,
        name: name.trim(),
        description: description.trim() || undefined,
        imageUrl,
      });
      toast.success(isEdit ? "Track updated" : "Track created");
      onClose();
    } catch {
      toast.error(isEdit ? "Failed to update track" : "Failed to create track");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText={isEdit ? "Save changes" : "Create track"}
      okButtonProps={{
        disabled: !isValid,
        loading: submitting,
        style: { background: "#3A0CA3" },
      }}
      title={isEdit ? "Edit track" : "New track"}
      width={460}
    >
      <div className="flex flex-col gap-3 mt-4">
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Track image
          </label>
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center shrink-0"
              style={{ background: "#F5EEFE", border: "1.5px solid #DDC9F0" }}
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
              className="cursor-pointer text-sm font-medium px-3 py-1.5 rounded-lg"
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

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Name
          </label>
          <Input
            size="large"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Mobile Developer"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1.5">
            Slug
            {isEdit ? (
              <span className="inline-flex items-center gap-1 text-xs text-[#9CA3AF]">
                <Lock size={9} /> locked
              </span>
            ) : slugLocked ? (
              <span className="inline-flex items-center gap-1 text-xs text-[#9CA3AF]">
                <Unlock size={9} /> manually set
              </span>
            ) : (
              <span className="text-xs text-[#C9BEDD]">
                auto-generated from name
              </span>
            )}
          </label>
          <Input
            size="large"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            disabled={isEdit}
            status={slugTaken ? "error" : undefined}
            style={{ fontFamily: "monospace" }}
          />
          {slugTaken && (
            <p className="text-xs mt-1" style={{ color: "#DC2626" }}>
              This slug is already in use.
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Description
          </label>
          <Input.TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            size="large"
            placeholder="Optional"
          />
        </div>
      </div>
    </Modal>
  );
}
