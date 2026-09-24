"use client";
import toast from "react-hot-toast";

import { useEffect, useState } from "react";
import { Modal, Input, Select, Switch, message } from "antd";
import type {
  AdminUserListItem,
  UpdateUserPayload,
  UserRole,
} from "@/apis/admin/users/types";

export function EditUserModal({
  user,
  open,
  onClose,
  onSave,
}: {
  user: AdminUserListItem | null;
  open: boolean;
  onClose: () => void;
  onSave: (userId: string, payload: UpdateUserPayload) => Promise<void>;
}) {
  const [form, setForm] = useState<UpdateUserPayload>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
      });
    }
  }, [user]);

  if (!user) return null;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSave(user.id, form);
      toast.success("User updated");
      onClose();
    } catch {
      toast.error("Failed to update user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Save changes"
      okButtonProps={{ loading: submitting, style: { background: "#3A0CA3" } }}
      title={`Edit ${user.firstName} ${user.lastName}`}
    >
      <div className="flex flex-col gap-3 mt-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              First name
            </label>
            <Input
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              Last name
            </label>
            <Input
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Role
          </label>
          <Select
            value={form.role}
            onChange={(role: UserRole) => setForm({ ...form, role })}
            style={{ width: "100%" }}
            options={[
              { label: "Student", value: "STUDENT" },
              { label: "Tutor", value: "TUTOR" },
              { label: "Recruiter", value: "RECRUITER" },
              { label: "Admin", value: "ADMIN" },
            ]}
          />
        </div>
        <div
          className="flex items-center justify-between rounded-lg px-3.5 py-2.5"
          style={{ background: "#FAFAFA" }}
        >
          <span
            className="text-[13px] font-medium"
            style={{ color: "#374151" }}
          >
            Account active
          </span>
          <Switch
            checked={form.isActive}
            onChange={(isActive) => setForm({ ...form, isActive })}
          />
        </div>
      </div>
    </Modal>
  );
}
