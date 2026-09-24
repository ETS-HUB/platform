"use client";

import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Input, Select, message } from "antd";
import type { UserProfile } from "@/apis/profile/types";

export function SettingsTab({ user }: { user: UserProfile }) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [goal, setGoal] = useState(user.profile.goal ?? "");
  const [trackSlug, setTrackSlug] = useState(
    user.profile.trackSlug ?? undefined,
  );
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.avatar,
  );
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const passwordsMatch =
    newPassword.length === 0 || newPassword === confirmPassword;
  const canChangePassword =
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    newPassword === confirmPassword;

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file)); // instant local preview
    setUploadingAvatar(true);
    try {
      // Stub — replace with POST /api/upload?folder=avatars then PATCH /api/users/profile
      await new Promise((r) => setTimeout(r, 800));
      message.success("Avatar updated");
    } catch {
      message.error("Avatar upload failed");
      setAvatarPreview(user.avatar);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      // Stub — replace with PATCH /api/users/profile
      await new Promise((r) => setTimeout(r, 500));
      message.success("Profile updated");
    } catch {
      message.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!canChangePassword) return;
    setChangingPassword(true);
    try {
      // Stub — replace with POST /api/auth/change-password
      await new Promise((r) => setTimeout(r, 500));
      message.success("Password changed");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      message.error("Failed to change password — check your current password");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-lg">
      {/* avatar */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={
              avatarPreview ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`
            }
            alt=""
            className="w-16 h-16 rounded-full object-cover"
          />
          {uploadingAvatar && (
            <div
              className="absolute inset-0 flex items-center justify-center rounded-full"
              style={{ background: "rgba(0,0,0,0.4)" }}
            >
              <Loader2 size={16} className="animate-spin text-white" />
            </div>
          )}
        </div>
        <label
          className="flex items-center gap-1.5 text-[12.5px] font-semibold px-3.5 py-2 rounded-full cursor-pointer"
          style={{ border: "1.5px solid #EDE0FB", color: "#3A0CA3" }}
        >
          <Upload size={13} />
          Change photo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarSelect}
          />
        </label>
      </div>

      {/* profile fields */}
      <div>
        <h3
          className="text-[13px] font-bold uppercase tracking-wide mb-3"
          style={{ color: "#8A8A8A" }}
        >
          Profile
        </h3>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                First name
              </label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Last name
              </label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              Learning goal
            </label>
            <Input.TextArea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              rows={2}
              placeholder="What are you working toward?"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              Track
            </label>
            <Select
              value={trackSlug}
              onChange={setTrackSlug}
              style={{ width: "100%" }}
              placeholder="Select a track"
              options={[
                { label: "Frontend", value: "frontend" },
                { label: "Backend", value: "backend" },
                { label: "Full Stack", value: "fullstack" },
              ]}
            />
          </div>
          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="self-start text-[13px] font-semibold px-5 py-2 rounded-full text-white disabled:opacity-60"
            style={{ background: "#3A0CA3" }}
          >
            {savingProfile ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      {/* password */}
      <div>
        <h3
          className="text-[13px] font-bold uppercase tracking-wide mb-3"
          style={{ color: "#8A8A8A" }}
        >
          Password
        </h3>
        <div className="flex flex-col gap-3">
          <Input.Password
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input.Password
            placeholder="New password (min. 8 characters)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input.Password
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            status={!passwordsMatch ? "error" : undefined}
          />
          {!passwordsMatch && (
            <p className="text-[11px]" style={{ color: "#DC2626" }}>
              Passwords don&apos;t match
            </p>
          )}
          <button
            type="button"
            onClick={handleChangePassword}
            disabled={!canChangePassword || changingPassword}
            className="self-start text-[13px] font-semibold px-5 py-2 rounded-full text-white disabled:opacity-40"
            style={{ background: "#3A0CA3" }}
          >
            {changingPassword ? "Changing..." : "Change password"}
          </button>
        </div>
      </div>
    </div>
  );
}
