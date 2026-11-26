"use client";
import toast from "react-hot-toast";

import { useState } from "react";
import { Button } from "antd";
import { useAdminModal } from "@/hooks/useAdminModal";

import { Plus } from "lucide-react";
import { BadgesGrid } from "./components/BadgesGrid";
import { BadgeFormModal } from "./components/BadgeFormModal";
import type { BadgeDefinition, BadgePayload } from "@/apis/admin/badges/types";
import type { CourseNode } from "@/apis/admin/courses/types";
import {
  useGetBadgeDefinitionsQuery,
  useCreateBadgeDefinitionMutation,
  useUpdateBadgeDefinitionMutation,
  useDeleteBadgeDefinitionMutation,
} from "@/apis/admin/badges/badgesService";
import { useGetTopicsQuery } from "@/apis/admin/courses/coursesService";
import Header from "@/components/ui/Header";
import { getApiError } from "@/lib/apiError";

export default function AdminBadgesPage() {
  const modal = useAdminModal();
  const [formOpen, setFormOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<BadgeDefinition | null>(
    null,
  );

  const { data: badgesData } = useGetBadgeDefinitionsQuery();
  const { data: topicsData = [] } = useGetTopicsQuery();
  const [createBadge] = useCreateBadgeDefinitionMutation();
  const [updateBadge] = useUpdateBadgeDefinitionMutation();
  const [deleteBadge] = useDeleteBadgeDefinitionMutation();

  const badges = badgesData?.definitions ?? [];

  const topics = topicsData.flatMap((cat: CourseNode) =>
    (cat.children ?? []).map((c: CourseNode) => ({ id: c.id, name: c.name })),
  );

  const handleSave = async (id: string | null, payload: BadgePayload) => {
    try {
      if (id) {
        await updateBadge({ id, payload }).unwrap();
        toast.success("Badge updated");
      } else {
        await createBadge(payload).unwrap();
        toast.success("Badge created");
      }
    } catch (err) {
      toast.error(getApiError(err, "Failed to save badge"));
    }
  };

  const handleToggleActive = (badge: BadgeDefinition) => {
    const isDeactivating = badge.isActive;
    modal.confirm({
      title: isDeactivating
        ? `Deactivate "${badge.name}"?`
        : `Reactivate "${badge.name}"?`,
      content: isDeactivating
        ? "Students who already earned this badge keep it — this only stops it from being awarded going forward."
        : "This badge will start being awarded again.",
      okText: isDeactivating ? "Deactivate" : "Reactivate",
      okButtonProps: { danger: isDeactivating },
      onOk: async () => {
        try {
          await updateBadge({
            id: badge.id,
            payload: { isActive: !badge.isActive },
          }).unwrap();
          toast.success(
            isDeactivating ? "Badge deactivated" : "Badge reactivated",
          );
        } catch (err) {
          toast.error(getApiError(err, "Failed to update badge"));
        }
      },
    });
  };

  const handleDelete = (badge: BadgeDefinition) => {
    modal.confirm({
      title: `Permanently delete "${badge.name}"?`,
      content:
        "This cannot be undone. All references to this badge will be removed.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteBadge(badge.id).unwrap();
          toast.success("Badge deleted");
        } catch (err) {
          toast.error(getApiError(err, "Failed to delete badge"));
        }
      },
    });
  };

  return (
    <div className="min-h-screen w-full">
      <div className="flex items-start justify-between mb-6">
        <Header
          title="Badges"
          subtitle={`${badgesData?.pagination.total ?? 0} badge definition${badgesData?.pagination.total === 1 ? "" : "s"}.`}
        />
        <Button
          icon={<Plus size={14} />}
          onClick={() => {
            setEditingBadge(null);
            setFormOpen(true);
          }}
          style={{ background: "#3A0CA3", color: "#FFFFFF" }}
        >
          New badge
        </Button>
      </div>
      <BadgesGrid
        badges={badges}
        onEdit={(b) => {
          setEditingBadge(b);
          setFormOpen(true);
        }}
        onToggleActive={handleToggleActive}
        onDelete={handleDelete}
      />
      <BadgeFormModal
        badge={editingBadge}
        topics={topics}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
