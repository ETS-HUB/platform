"use client";
import toast from "react-hot-toast";

import { useState } from "react";
import { Button, Select, Modal, message } from "antd";import { useAdminModal } from "@/hooks/useAdminModal";

import { Plus, UploadCloud } from "lucide-react";
import { ResourcesTable } from "./components/ResourcesTable";
import { ResourceFormModal } from "./components/ResourceFormModal";
import { BulkResourceUploadModal } from "./components/BulkResourceUploadModal";
import type {
  AdminResource,
  ResourceType,
  Difficulty,
  ResourcePayload,
} from "@/apis/admin/resources/types";
import {
  useGetAdminResourcesQuery,
  useCreateResourceMutation,
  useBulkCreateResourcesMutation,
  useUpdateResourceMutation,
  useDeleteResourceMutation,
} from "@/apis/admin/resources/resourcesService";
import { useGetTopicsQuery } from "@/apis/admin/courses/coursesService";
import Header from "@/components/ui/Header";
import { getApiError } from "@/lib/apiError";

export default function AdminResourcesPage() {
  const modal = useAdminModal();
  const [topicFilter, setTopicFilter] = useState<string | undefined>();
  const [typeFilter, setTypeFilter] = useState<ResourceType | undefined>();
  const [difficultyFilter, setDifficultyFilter] = useState<
    Difficulty | undefined
  >();
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<AdminResource | null>(
    null,
  );
  const [bulkOpen, setBulkOpen] = useState(false);

  const { data: resourcesData, isLoading } = useGetAdminResourcesQuery({
    topicId: topicFilter,
    type: typeFilter,
    difficulty: difficultyFilter,
    page,
    limit: 20,
  });
  const { data: topicsData = [] } = useGetTopicsQuery();
  const [createResource] = useCreateResourceMutation();
  const [bulkCreate] = useBulkCreateResourcesMutation();
  const [updateResource] = useUpdateResourceMutation();
  const [deleteResource] = useDeleteResourceMutation();

  const resources = resourcesData?.resources ?? [];
  const pagination = resourcesData?.pagination ?? {
    page: 1,
    limit: 20,
    total: 0,
  };
  const topics = topicsData.flatMap((cat) =>
    (cat.children ?? []).map((c) => ({ id: c.id, name: c.name })),
  );

  const handleSave = async (id: string | null, payload: ResourcePayload) => {
    try {
      if (id) {
        await updateResource({ id, payload }).unwrap();
        toast.success("Resource updated");
      } else {
        await createResource(payload).unwrap();
        toast.success("Resource created");
      }
    } catch (err) {
      toast.error(getApiError(err, "Failed to save resource"));
    }
  };

  const handleDelete = (r: AdminResource) => {
    modal.confirm({
      title: `Delete "${r.title}"?`,
      content:
        "This resource will be soft-deleted and removed from student recommendations.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteResource(r.id).unwrap();
          toast.success("Resource deleted");
        } catch (err) {
          toast.error(getApiError(err, "Failed to delete resource"));
        }
      },
    });
  };

  const handleBulkUpload = async (bulkResources: ResourcePayload[]) => {
    try {
      const result = await bulkCreate({ resources: bulkResources }).unwrap();
      toast.success(`${result.uploaded} resources uploaded`);
      return result;
    } catch (err) {
      toast.error(getApiError(err, "Bulk upload failed"));
      return { uploaded: 0 };
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="flex items-start justify-between mb-6">
        <Header
          title="Resources"
          subtitle={`${pagination.total} resource${pagination.total === 1 ? "" : "s"} in the library.`}
        />
        <div className="flex items-center gap-2">
          <Button
            icon={<UploadCloud size={14} />}
            onClick={() => setBulkOpen(true)}
          >
            Bulk upload
          </Button>
          <Button
            icon={<Plus size={14} />}
            onClick={() => {
              setEditingResource(null);
              setFormOpen(true);
            }}
            style={{ background: "#3A0CA3", color: "#FFFFFF" }}
          >
            New resource
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <Select
          allowClear
          placeholder="All topics"
          style={{ width: 160 }}
          size="large"
          value={topicFilter}
          onChange={(v) => {
            setTopicFilter(v);
            setPage(1);
          }}
          options={topics.map((t) => ({ label: t.name, value: t.id }))}
        />
        <Select
          allowClear
          placeholder="All types"
          style={{ width: 150 }}
          size="large"
          value={typeFilter}
          onChange={(v) => {
            setTypeFilter(v);
            setPage(1);
          }}
          options={[
            { label: "Tutorial", value: "TUTORIAL" },
            { label: "Video", value: "VIDEO" },
            { label: "Documentation", value: "DOCUMENTATION" },
          ]}
        />
        <Select
          allowClear
          placeholder="All difficulties"
          style={{ width: 160 }}
          size="large"
          value={difficultyFilter}
          onChange={(v) => {
            setDifficultyFilter(v);
            setPage(1);
          }}
          options={[
            { label: "Easy", value: "EASY" },
            { label: "Medium", value: "MEDIUM" },
            { label: "Hard", value: "HARD" },
          ]}
        />
      </div>
      <ResourcesTable
        resources={resources}
        loading={isLoading}
        pagination={pagination}
        onPageChange={setPage}
        onEdit={(r) => {
          setEditingResource(r);
          setFormOpen(true);
        }}
        onDelete={handleDelete}
      />
      <ResourceFormModal
        resource={editingResource}
        topics={topics}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />
      <BulkResourceUploadModal
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        onUpload={handleBulkUpload}
      />
    </div>
  );
}
