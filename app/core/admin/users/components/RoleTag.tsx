import { Tag } from "antd";
import type { UserRole } from "@/apis/admin/users/types";

const ROLE_META: Record<UserRole, { label: string; color: string }> = {
  STUDENT: { label: "Student", color: "blue" },
  TUTOR: { label: "Tutor", color: "purple" },
  RECRUITER: { label: "Recruiter", color: "gold" },
  ADMIN: { label: "Admin", color: "red" },
};

export function RoleTag({ role }: { role: UserRole }) {
  const meta = ROLE_META[role];
  return (
    <Tag className="text-sm! font-medium" color={meta.color} bordered={false}>
      {meta.label}
    </Tag>
  );
}