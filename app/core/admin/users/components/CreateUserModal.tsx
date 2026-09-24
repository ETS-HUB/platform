"use client";
import toast from "react-hot-toast";

import { useState } from "react";
import { Modal, Input, Select, message } from "antd";
import type { CreateUserPayload, UserRole } from "@/apis/admin/users/types";

export function CreateUserModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: CreateUserPayload) => Promise<void>;
}) {
  const [form, setForm] = useState<CreateUserPayload>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "STUDENT",
  });
  const [submitting, setSubmitting] = useState(false);

  const isValid =
    form.email.trim().length > 0 &&
    form.password.trim().length >= 8 &&
    form.firstName.trim().length > 0 &&
    form.lastName.trim().length > 0;

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    try {
      await onCreate(form);
      toast.success("User created");
      setForm({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "STUDENT",
      });
      onClose();
    } catch {
      toast.error("Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Create user"
      okButtonProps={{
        disabled: !isValid,
        loading: submitting,
        style: { background: "#3A0CA3" },
      }}
      title="Create user"
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
            Email
          </label>
          <Input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="name@example.com"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Temporary password
          </label>
          <Input.Password
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Min. 8 characters"
          />
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
      </div>
    </Modal>
  );
}
