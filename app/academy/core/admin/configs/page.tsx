"use client";
import toast from "react-hot-toast";

import { useState } from "react";
import { Button, Select, Modal, message } from "antd";import { useAdminModal } from "@/hooks/useAdminModal";

import { Plus } from "lucide-react";
import { ConfigsTable } from "./components/ConfigsTable";
import { ConfigFormModal } from "./components/ConfigFormModal";
import type {
  AssessmentConfig,
  ConfigPayload,
} from "@/apis/admin/configs/types";
import {
  useGetAdminConfigsQuery,
  useCreateConfigMutation,
  useUpdateConfigMutation,
  useDeleteConfigMutation,
} from "@/apis/admin/configs/configsService";
import { useGetTopicsQuery } from "@/apis/admin/courses/coursesService";
import Header from "@/components/ui/Header";
import { getApiError } from "@/lib/apiError";

export default function AdminConfigsPage() {
  const modal = useAdminModal();
  const [trackFilter, setTrackFilter] = useState<string | undefined>();
  const [formOpen, setFormOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<AssessmentConfig | null>(
    null,
  );

  const { data: configs = [], isLoading } = useGetAdminConfigsQuery(
    trackFilter ? { track: trackFilter } : undefined,
  );
  const { data: topicsData = [] } = useGetTopicsQuery();
  const [createConfig] = useCreateConfigMutation();
  const [updateConfig] = useUpdateConfigMutation();
  const [deleteConfig] = useDeleteConfigMutation();

  const topics = topicsData.flatMap((cat) =>
    (cat.children ?? []).map((c) => ({ id: c.id, name: c.name })),
  );

  const handleSave = async (id: string | null, payload: ConfigPayload) => {
    try {
      if (id) {
        await updateConfig({ id, payload }).unwrap();
        toast.success("Config updated");
      } else {
        await createConfig(payload).unwrap();
        toast.success("Config created");
      }
    } catch (err) {
      toast.error(getApiError(err, "Failed to save config"));
    }
  };

  const handleDelete = (config: AssessmentConfig) => {
    modal.confirm({
      title: `Delete "${config.name}"?`,
      content:
        "Students won't be able to start this assessment anymore. Existing completed attempts are unaffected.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteConfig(config.id).unwrap();
          toast.success("Config deleted");
        } catch (err) {
          toast.error(getApiError(err, "Failed to delete config"));
        }
      },
    });
  };

  return (
    <div className="min-h-screen w-full">
      <div className="flex items-start justify-between mb-6">
        <Header
          title="Assessment configs"
          subtitle="Define the assessments students can take — question mix, timing, and track."
        />
        <Button
          icon={<Plus size={14} />}
          onClick={() => {
            setEditingConfig(null);
            setFormOpen(true);
          }}
          style={{ background: "#3A0CA3", color: "#FFFFFF" }}
        >
          New config
        </Button>
      </div>
      <div className="mb-4">
        <Select
          allowClear
          placeholder="All tracks"
          style={{ width: 160 }}
          size="large"
          value={trackFilter}
          onChange={setTrackFilter}
          options={[
            { label: "Frontend", value: "frontend" },
            { label: "Backend", value: "backend" },
            { label: "Full Stack", value: "fullstack" },
          ]}
        />
      </div>
      <ConfigsTable
        configs={configs}
        onEdit={(c) => {
          setEditingConfig(c);
          setFormOpen(true);
        }}
        onDelete={handleDelete}
      />
      <ConfigFormModal
        config={editingConfig}
        topics={topics}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
