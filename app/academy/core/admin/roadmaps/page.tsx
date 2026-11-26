"use client";

import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Table, Switch, Tag } from "antd";
import { Plus, Pencil, Trash2, RefreshCw, Eye, Upload } from "lucide-react";

import { useAdminModal } from "@/hooks/useAdminModal";
import {
  useGetAdminRoadmapsQuery,
  useUpdateRoadmapMutation,
  useDeleteRoadmapMutation,
  useSyncRoadmapMutation,
} from "@/apis/roadmap/roadmapService";
import type { AdminRoadmapListItem } from "@/apis/roadmap/types";
import Header from "@/components/ui/Header";
import { getApiError } from "@/lib/apiError";

export default function AdminRoadmapsPage() {
  const router = useRouter();
  const modal = useAdminModal();
  const [syncingSlug, setSyncingSlug] = useState<string | null>(null);

  const { data: roadmaps = [], isLoading } = useGetAdminRoadmapsQuery();
  const [updateRoadmap] = useUpdateRoadmapMutation();
  const [deleteRoadmap] = useDeleteRoadmapMutation();
  const [syncRoadmap] = useSyncRoadmapMutation();

  const handleTogglePublish = async (r: AdminRoadmapListItem) => {
    try {
      await updateRoadmap({
        slug: r.slug,
        payload: { isPublished: !r.isPublished },
      }).unwrap();
      toast.success(r.isPublished ? "Unpublished" : "Published");
    } catch (err) {
      toast.error(getApiError(err, "Failed to update"));
    }
  };

  const handleDelete = (r: AdminRoadmapListItem) => {
    modal.confirm({
      title: `Delete "${r.title}"?`,
      content: "This will remove the roadmap and all user progress data.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteRoadmap(r.slug).unwrap();
          toast.success("Roadmap deleted");
        } catch (err) {
          toast.error(getApiError(err, "Failed to delete"));
        }
      },
    });
  };

  const handleSync = async (slug: string) => {
    setSyncingSlug(slug);
    try {
      await syncRoadmap(slug).unwrap();
      toast.success(`Synced "${slug}" from roadmap.sh`);
    } catch (err) {
      toast.error(getApiError(err, "Sync failed"));
    } finally {
      setSyncingSlug(null);
    }
  };

  const columns = [
    {
      title: "Title",
      key: "title",
      render: (_: unknown, r: AdminRoadmapListItem) => (
        <div>
          <p className="text-sm font-semibold text-gray-900">{r.title}</p>
          <p className="text-xs text-gray-400 font-mono">{r.slug}</p>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 90,
      render: (t: string) => (
        <Tag bordered={false} color="purple" style={{ fontSize: 12 }}>
          {t}
        </Tag>
      ),
    },
    {
      title: "Users",
      key: "users",
      width: 80,
      render: (_: unknown, r: AdminRoadmapListItem) => (
        <span className="text-sm text-gray-500">{r._count.nodeStatuses}</span>
      ),
    },
    {
      title: "Published",
      key: "isPublished",
      width: 100,
      render: (_: unknown, r: AdminRoadmapListItem) => (
        <Switch
          size="small"
          checked={r.isPublished}
          onChange={() => handleTogglePublish(r)}
        />
      ),
    },
    {
      title: "",
      key: "actions",
      width: 130,
      render: (_: unknown, r: AdminRoadmapListItem) => (
        <div className="flex items-center gap-1">
          <a
            href={`/roadmap/${r.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-full hover:bg-gray-100"
            title="View public page"
          >
            <Eye size={15} style={{ color: "#6B7280" }} />
          </a>
          <button
            type="button"
            onClick={() => router.push(`/core/admin/roadmaps/${r.slug}/edit`)}
            className="p-1.5 rounded-full hover:bg-gray-100"
            title="Edit"
          >
            <Pencil size={15} style={{ color: "#6B7280" }} />
          </button>
          <button
            type="button"
            onClick={() => handleSync(r.slug)}
            disabled={syncingSlug === r.slug}
            className="p-1.5 rounded-full hover:bg-blue-50 disabled:opacity-40"
            title="Sync from roadmap.sh"
          >
            <RefreshCw
              size={15}
              style={{ color: "#3A0CA3" }}
              className={syncingSlug === r.slug ? "animate-spin" : ""}
            />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(r)}
            className="p-1.5 rounded-full hover:bg-red-50"
            title="Delete"
          >
            <Trash2 size={15} style={{ color: "#DC2626" }} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen w-full">
      <div className="mb-6 flex items-start justify-between">
        <Header
          title="Roadmaps"
          subtitle={`${roadmaps.length} roadmap${roadmaps.length === 1 ? "" : "s"}`}
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.push("/core/admin/roadmaps/import")}
            className="flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-lg"
            style={{ background: "#F5EEFE", color: "#3A0CA3" }}
          >
            <Upload size={14} />
            Import JSON
          </button>
          <button
            type="button"
            onClick={() => router.push("/core/admin/roadmaps/new")}
            className="flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-lg text-white"
            style={{ background: "#3A0CA3" }}
          >
            <Plus size={14} />
            New roadmap
          </button>
        </div>
      </div>

      <Table
        dataSource={roadmaps}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={false}
        locale={{
          emptyText: "No roadmaps yet. Create one or sync from roadmap.sh.",
        }}
      />
    </div>
  );
}
