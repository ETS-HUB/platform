"use client";

import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Input, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import type { AppDispatch, RootState } from "@/store";
import { setUser } from "@/store/slices/auth/authSlice";
import { changePasswordUser } from "@/store/slices/auth/authThunks";
import { useUpdateProfileMutation } from "@/apis/profile/profileService";
import { uploadFile } from "@/apis/upload/uploadService";
import { api } from "@/apis/api";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserIcon } from "@hugeicons/core-free-icons";

interface UserForSettings {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  profile: {
    goal?: string;
    trackSlug?: string | null;
    experienceLevel?: string;
    learningStyle?: string;
    weeklyHours?: number;
    xp: number;
    level: number;
  };
}

export function SettingsTab({ user }: { user: UserForSettings }) {
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken } = useSelector((s: RootState) => s.tokens);

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

  const [updateProfile] = useUpdateProfileMutation();

  const passwordsMatch =
    newPassword.length === 0 || newPassword === confirmPassword;
  const canChangePassword =
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    newPassword === confirmPassword;

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !accessToken) return;
    setAvatarPreview(URL.createObjectURL(file));
    setUploadingAvatar(true);
    try {
      const { url } = await uploadFile(file, accessToken, "avatars");
      await updateProfile({
        firstName,
        lastName,
        goal: goal || undefined,
        trackSlug,
      });
      // Invalidate the me query so sidebar/header refreshes
      dispatch(api.util.invalidateTags(["Users"]));
      // Update local Redux user state immediately
      dispatch(setUser({ ...user, avatar: url } as any));
      toast.success("Avatar updated");
    } catch {
      toast.error("Avatar upload failed");
      setAvatarPreview(user.avatar);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        goal: goal.trim() || undefined,
        trackSlug: trackSlug ?? null,
      }).unwrap();
      dispatch(api.util.invalidateTags(["Users"]));
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!canChangePassword) return;
    setChangingPassword(true);
    try {
      await dispatch(
        changePasswordUser({ currentPassword, newPassword }),
      ).unwrap();
      toast.success("Password changed");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Failed to change password — check your current password");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-lg">
      {/* avatar */}
      <div className="flex items-center gap-4">
        <div className="relative">
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt={"User"}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <HugeiconsIcon
              icon={UserIcon}
              size={32}
              className="text-gray-400"
            />
          )}
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
              allowClear
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
