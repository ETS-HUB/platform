"use client";

import { Input, Select, Button } from "antd";
import { Plus, Search } from "lucide-react";
import type { UserRole } from "@/apis/admin/users/types";

export interface UserListFilters {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
}

export function UsersFilterBar({
  filters,
  onChange,
  onCreateClick,
}: {
  filters: UserListFilters;
  onChange: (next: UserListFilters) => void;
  onCreateClick: () => void;
}) {
  return (
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      <Input
        placeholder="Search name or email"
        prefix={<Search size={14} className="text-gray-400" />}
        style={{ width: 240 }}
        value={filters.search}
        size="large"
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        allowClear
      />
      <Select
        allowClear
        placeholder="Role"
        style={{ width: 140 }}
        value={filters.role}
        size="large"
        onChange={(role) => onChange({ ...filters, role })}
        options={[
          { label: "Student", value: "STUDENT" },
          { label: "Tutor", value: "TUTOR" },
          { label: "Recruiter", value: "RECRUITER" },
          { label: "Admin", value: "ADMIN" },
        ]}
      />
      <Select
        allowClear
        placeholder="Status"
        style={{ width: 130 }}
        value={filters.isActive}
        size="large"
        onChange={(isActive) => onChange({ ...filters, isActive })}
        options={[
          { label: "Active", value: true },
          { label: "Deactivated", value: false },
        ]}
      />
      <Button
        type="primary"
        icon={<Plus size={14} />}
        onClick={onCreateClick}
        style={{ background: "#3A0CA3", marginLeft: "auto" }}
      >
        Create user
      </Button>
    </div>
  );
}
