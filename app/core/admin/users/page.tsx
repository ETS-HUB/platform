"use client";
import toast from "react-hot-toast";

import { useState } from "react";
import { Tabs, message } from "antd";
import {
  UsersFilterBar,
  type UserListFilters,
} from "./components/UsersFilterBar";
import { UsersTable } from "./components/UsersTable.tsx";
import { CandidatesFilterBar } from "./components/CandidatesFilterBar";
import { CandidatesTable } from "./components/CandidatesTable";
import { CreateUserModal } from "./components/CreateUserModal";
import { EditUserModal } from "./components/EditUserModal";
import { UserDetailDrawer } from "./components/UserDetailDrawer";
import type {
  AdminUserListItem,
  CandidateFilters,
  CreateUserPayload,
  UpdateUserPayload,
} from "@/apis/admin/users/types";
import {
  useGetAdminUsersQuery,
  useGetAdminUserDetailQuery,
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useDeactivateUserMutation,
  useActivateUserMutation,
  useResetUserPasswordMutation,
  useGetCandidatesQuery,
} from "@/apis/admin/users/usersService";
import Header from "@/components/ui/Header";
import { getApiError } from "@/lib/apiError";

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState("all");

  const [userFilters, setUserFilters] = useState<UserListFilters>({});
  const [userPage, setUserPage] = useState(1);
  const [candidateFilters, setCandidateFilters] = useState<CandidateFilters>(
    {},
  );

  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<AdminUserListItem | null>(null);
  const [detailUserId, setDetailUserId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Queries
  const { data: usersData, isLoading: usersLoading } = useGetAdminUsersQuery({
    ...userFilters,
    page: userPage,
  });
  const { data: candidatesData, isLoading: candidatesLoading } =
    useGetCandidatesQuery(candidateFilters, {
      skip: activeTab !== "candidates",
    });
  const { data: detailUser } = useGetAdminUserDetailQuery(detailUserId ?? "", {
    skip: !detailUserId,
  });

  // Mutations
  const [createUser] = useCreateAdminUserMutation();
  const [updateUser] = useUpdateAdminUserMutation();
  const [deactivate] = useDeactivateUserMutation();
  const [activate] = useActivateUserMutation();
  const [resetPassword] = useResetUserPasswordMutation();

  const users = usersData?.users ?? [];
  const usersPagination = usersData?.pagination ?? {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  };
  const candidates = candidatesData?.candidates ?? [];
  const candidatesPagination = candidatesData?.pagination ?? {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  };

  const handleView = (user: AdminUserListItem) => {
    setDetailUserId(user.id);
    setDetailOpen(true);
  };

  const handleCreate = async (payload: CreateUserPayload) => {
    try {
      await createUser(payload).unwrap();
      toast.success("User created");
    } catch (err) {
      toast.error(getApiError(err, "Failed to create user"));
    }
  };

  const handleEditSave = async (userId: string, payload: UpdateUserPayload) => {
    try {
      await updateUser({ userId, payload }).unwrap();
      toast.success("User updated");
    } catch (err) {
      toast.error(getApiError(err, "Failed to update user"));
    }
  };

  const handleToggleActive = async (user: AdminUserListItem) => {
    try {
      if (user.isActive) {
        await deactivate(user.id).unwrap();
        toast.success("User deactivated");
      } else {
        await activate(user.id).unwrap();
        toast.success("User activated");
      }
    } catch (err) {
      toast.error(getApiError(err, "Failed to update user status"));
    }
  };

  const handleResetPassword = async (user: AdminUserListItem) => {
    try {
      await resetPassword(user.id).unwrap();
      toast.success("Password reset — temporary credentials sent");
    } catch (err) {
      toast.error(getApiError(err, "Failed to reset password"));
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="mb-6">
        <Header
          title="Users"
          subtitle="Manage accounts across every role, or browse assessed candidates."
        />
      </div>

      <Tabs
        size="large"
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "all",
            label: "All users",
            children: (
              <>
                <UsersFilterBar
                  filters={userFilters}
                  onChange={setUserFilters}
                  onCreateClick={() => setCreateOpen(true)}
                />
                <UsersTable
                  users={users}
                  pagination={usersPagination}
                  loading={usersLoading}
                  onPageChange={setUserPage}
                  onView={handleView}
                  onEdit={setEditUser}
                  onToggleActive={handleToggleActive}
                  onResetPassword={handleResetPassword}
                />
              </>
            ),
          },
          {
            key: "candidates",
            label: "Candidates",
            children: (
              <>
                <CandidatesFilterBar
                  filters={candidateFilters}
                  onChange={setCandidateFilters}
                />
                <CandidatesTable
                  candidates={candidates}
                  pagination={candidatesPagination}
                  loading={candidatesLoading}
                  onPageChange={(page) =>
                    setCandidateFilters({ ...candidateFilters, page })
                  }
                />
              </>
            ),
          },
        ]}
      />

      <CreateUserModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />
      <EditUserModal
        user={editUser}
        open={!!editUser}
        onClose={() => setEditUser(null)}
        onSave={handleEditSave}
      />
      <UserDetailDrawer
        user={detailUser ?? null}
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setDetailUserId(null);
        }}
      />
    </div>
  );
}
