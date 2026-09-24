import { Table, Dropdown, Modal } from "antd";
import { useAdminModal } from "@/hooks/useAdminModal";

import {
  MoreHorizontal,
  Eye,
  Pencil,
  UserX,
  UserCheck,
  KeyRound,
} from "lucide-react";
import { RoleTag } from "./RoleTag";
import { StatusTag } from "./StatusTag";
import type {
  AdminUserListItem,
  UsersPagination,
} from "@/apis/admin/users/types";

export function UsersTable({
  users,
  pagination,
  loading,
  onPageChange,
  onView,
  onEdit,
  onToggleActive,
  onResetPassword,
}: {
  users: AdminUserListItem[];
  pagination: UsersPagination;
  loading: boolean;
  onPageChange: (page: number) => void;
  onView: (user: AdminUserListItem) => void;
  onEdit: (user: AdminUserListItem) => void;
  onToggleActive: (user: AdminUserListItem) => void;
  onResetPassword: (user: AdminUserListItem) => void;
}) {
  const modal = useAdminModal();
  const columns = [
    {
      title: "Name",
      key: "name",
      render: (_: unknown, u: AdminUserListItem) => (
        <div>
          <p className="text-base font-semibold" style={{ color: "#0e1430" }}>
            {u.firstName} {u.lastName}
          </p>
          <p className="text-sm text-gray-600">{u.email}</p>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: AdminUserListItem["role"]) => <RoleTag role={role} />,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => <StatusTag isActive={isActive} />,
    },
    {
      title: "XP / Level",
      key: "xp",
      render: (_: unknown, u: AdminUserListItem) =>
        u.profile ? (
          <span className="text-base" style={{ color: "#374151" }}>
            {u.profile.xp} XP · Lv {u.profile.level}
          </span>
        ) : (
          <span className="text-s" style={{ color: "#C4C4C4" }}>
            —
          </span>
        ),
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <span className="text-base" style={{ color: "#6B7280" }}>
          {new Date(date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 50,
      render: (_: unknown, u: AdminUserListItem) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "view",
                label: "View details",
                icon: <Eye size={13} />,
                onClick: () => onView(u),
              },
              {
                key: "edit",
                label: "Edit",
                icon: <Pencil size={13} />,
                onClick: () => onEdit(u),
              },
              {
                key: "toggle",
                label: u.isActive ? "Deactivate" : "Activate",
                icon: u.isActive ? (
                  <UserX size={13} />
                ) : (
                  <UserCheck size={13} />
                ),
                danger: u.isActive,
                onClick: () =>
                  modal.confirm({
                    title: u.isActive
                      ? "Deactivate this user?"
                      : "Reactivate this user?",
                    content: u.isActive
                      ? `${u.firstName} will lose access until reactivated.`
                      : `${u.firstName} will regain access immediately.`,
                    okText: u.isActive ? "Deactivate" : "Activate",
                    okButtonProps: {
                      danger: u.isActive,
                      style: !u.isActive
                        ? { background: "#3A0CA3" }
                        : undefined,
                    },
                    onOk: () => onToggleActive(u),
                  }),
              },
              {
                key: "reset",
                label: "Reset password",
                icon: <KeyRound size={13} />,
                onClick: () =>
                  modal.confirm({
                    title: "Reset this user's password?",
                    content: `${u.firstName} will need to use a new temporary password to log in.`,
                    okText: "Reset password",
                    onOk: () => onResetPassword(u),
                  }),
              },
            ],
          }}
          trigger={["click"]}
        >
          <button
            type="button"
            className="p-1.5 rounded-full hover:bg-gray-100"
          >
            <MoreHorizontal size={16} style={{ color: "#6B7280" }} />
          </button>
        </Dropdown>
      ),
    },
  ];

  return (
    <Table
      dataSource={users}
      columns={columns}
      rowKey="id"
      loading={loading}
      pagination={{
        current: pagination.page,
        pageSize: pagination.limit,
        total: pagination.total,
        onChange: onPageChange,
        showSizeChanger: false,
      }}
    />
  );
}
