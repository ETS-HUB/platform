"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Table, Tag, Select, Modal, Form, Input } from "antd";
import { Plus, ArrowLeft, Pencil, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";

import {
  useGetAdminProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  usePublishProjectMutation,
  useArchiveProjectMutation,
  useDeleteProjectMutation,
} from "@/apis/roadmap/projectService";
import { useGetRoadmapQuery } from "@/apis/roadmap/roadmapService";
import type {
  ProjectAdminItem,
  ProjectDifficulty,
  ProjectType,
  CreateProjectPayload,
  UpdateProjectPayload,
} from "@/apis/roadmap/projectTypes";
import Header from "@/components/ui/Header";
import { getApiError } from "@/lib/apiError";
import { useAdminModal } from "@/hooks/useAdminModal";

const DIFFICULTY_COLOR: Record<ProjectDifficulty, string> = {
  BEGINNER: "green",
  INTERMEDIATE: "gold",
  ADVANCED: "red",
};

const STATUS_COLOR: Record<string, string> = {
  DRAFT: "default",
  PUBLISHED: "blue",
  ARCHIVED: "gray",
};

const PROJECT_TYPES: ProjectType[] = [
  "FRONTEND",
  "BACKEND",
  "API",
  "FULLSTACK",
  "DEVOPS",
  "OTHER",
];
const DIFFICULTIES: ProjectDifficulty[] = [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
];

interface ProjectFormValues {
  title: string;
  description: string;
  requirements: string;
  submissionSteps: string;
  projectType: ProjectType;
  difficulty: ProjectDifficulty;
}

function ProjectFormModal({
  open,
  onClose,
  initial,
  onSubmit,
  saving,
}: {
  open: boolean;
  onClose: () => void;
  initial?: Partial<ProjectFormValues>;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
  saving: boolean;
}) {
  const [form] = Form.useForm<ProjectFormValues>();

  const handleOk = async () => {
    const values = await form.validateFields();
    await onSubmit(values);
  };

  return (
    <Modal
      open={open}
      title={initial ? "Edit project" : "New project"}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={saving}
      okText={initial ? "Save changes" : "Create"}
      okButtonProps={{
        style: { background: "#3A0CA3", borderColor: "#3A0CA3" },
      }}
      destroyOnClose
      width={640}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initial}
        className="mt-4"
      >
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input placeholder="Build a Task Manager API" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={2} placeholder="Short description" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="projectType"
            label="Project Type"
            rules={[{ required: true }]}
          >
            <Select
              options={PROJECT_TYPES.map((t) => ({ label: t, value: t }))}
              placeholder="Select type"
            />
          </Form.Item>

          <Form.Item
            name="difficulty"
            label="Difficulty"
            rules={[{ required: true }]}
          >
            <Select
              options={DIFFICULTIES.map((d) => ({ label: d, value: d }))}
              placeholder="Select difficulty"
            />
          </Form.Item>
        </div>

        <Form.Item
          name="requirements"
          label="Requirements (Markdown)"
          rules={[{ required: true }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="## Requirements&#10;- Feature 1"
          />
        </Form.Item>

        <Form.Item
          name="submissionSteps"
          label="Submission Steps (one per line)"
          rules={[{ required: true }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Fork the starter repo&#10;Implement all endpoints&#10;Submit your GitHub repo"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default function AdminRoadmapProjectsPage() {
  const params = useParams();
  const router = useRouter();
  const modal = useAdminModal();
  const slug = params.slug as string;

  const [createOpen, setCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState<ProjectAdminItem | null>(null);

  const { data: roadmap } = useGetRoadmapQuery(slug, { skip: !slug });
  const roadmapId = roadmap?.id ?? "";

  const { data, isLoading } = useGetAdminProjectsQuery({});
  const [createProject, { isLoading: creating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: updating }] = useUpdateProjectMutation();
  const [publishProject] = usePublishProjectMutation();
  const [archiveProject] = useArchiveProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();

  const projects = (data?.data ?? []).filter((p) => p.roadmap.slug === slug);

  const handleCreate = async (values: ProjectFormValues) => {
    try {
      await createProject({
        title: values.title,
        description: values.description,
        requirements: values.requirements,
        submissionSteps: values.submissionSteps
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        projectType: values.projectType,
        difficulty: values.difficulty,
        roadmapId: roadmapId,
      } as CreateProjectPayload).unwrap();
      toast.success("Project created");
      setCreateOpen(false);
    } catch (err) {
      toast.error(getApiError(err, "Failed to create"));
    }
  };

  const handleUpdate = async (values: ProjectFormValues) => {
    if (!editProject) return;
    try {
      await updateProject({
        id: editProject.id,
        payload: {
          title: values.title,
          description: values.description,
          requirements: values.requirements,
          submissionSteps: values.submissionSteps
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
          projectType: values.projectType,
          difficulty: values.difficulty,
        } as UpdateProjectPayload,
      }).unwrap();
      toast.success("Project updated");
      setEditProject(null);
    } catch (err) {
      toast.error(getApiError(err, "Failed to update"));
    }
  };

  const handlePublish = async (project: ProjectAdminItem) => {
    try {
      await publishProject(project.id).unwrap();
      toast.success(`"${project.title}" published`);
    } catch (err) {
      toast.error(getApiError(err, "Failed to publish"));
    }
  };

  const handleArchive = async (project: ProjectAdminItem) => {
    try {
      await archiveProject(project.id).unwrap();
      toast.success(`"${project.title}" archived`);
    } catch (err) {
      toast.error(getApiError(err, "Failed to archive"));
    }
  };

  const handleDelete = (project: ProjectAdminItem) => {
    modal.confirm({
      title: `Delete "${project.title}"?`,
      content: "This will delete the project and all student submissions.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteProject(project.id).unwrap();
          toast.success("Project deleted");
        } catch (err) {
          toast.error(getApiError(err, "Failed to delete"));
        }
      },
    });
  };

  const columns = [
    {
      title: "Title",
      key: "title",
      render: (_: unknown, p: ProjectAdminItem) => (
        <div>
          <p className="text-sm font-semibold text-gray-900">{p.title}</p>
          <p className="text-xs text-gray-400">{p.projectType}</p>
        </div>
      ),
    },
    {
      title: "Difficulty",
      key: "difficulty",
      width: 120,
      render: (_: unknown, p: ProjectAdminItem) => (
        <Tag color={DIFFICULTY_COLOR[p.difficulty]} bordered={false}>
          {p.difficulty}
        </Tag>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 110,
      render: (_: unknown, p: ProjectAdminItem) => (
        <Tag color={STATUS_COLOR[p.status]} bordered={false}>
          {p.status}
        </Tag>
      ),
    },
    {
      title: "Submissions",
      key: "count",
      width: 100,
      render: (_: unknown, p: ProjectAdminItem) => (
        <span className="text-sm text-gray-500">{p._count.userProjects}</span>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 180,
      render: (_: unknown, p: ProjectAdminItem) => (
        <div className="flex items-center gap-1">
          <a
            href={`/roadmap/${slug}?tab=projects`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-full hover:bg-gray-100"
            title="View public page"
          >
            <Eye size={15} style={{ color: "#6B7280" }} />
          </a>
          <button
            type="button"
            onClick={() => setEditProject(p)}
            className="p-1.5 rounded-full hover:bg-gray-100"
            title="Edit"
          >
            <Pencil size={15} style={{ color: "#6B7280" }} />
          </button>
          {p.status === "DRAFT" && (
            <button
              type="button"
              onClick={() => handlePublish(p)}
              className="px-2.5 py-1 rounded-lg text-[12px] font-medium"
              style={{ background: "#F0FDF4", color: "#16A34A" }}
            >
              Publish
            </button>
          )}
          {p.status === "PUBLISHED" && (
            <button
              type="button"
              onClick={() => handleArchive(p)}
              className="px-2.5 py-1 rounded-lg text-[12px] font-medium"
              style={{ background: "#F9FAFB", color: "#6B7280" }}
            >
              Archive
            </button>
          )}
          <button
            type="button"
            onClick={() => handleDelete(p)}
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
      <button
        type="button"
        onClick={() => router.push(`/core/admin/roadmaps/${slug}/edit`)}
        className="flex items-center gap-1.5 text-[13px] font-medium mb-6"
        style={{ color: "#8A8A8A" }}
      >
        <ArrowLeft size={14} />
        Back to edit
      </button>

      <div className="mb-6 flex items-start justify-between">
        <Header
          title="Projects"
          subtitle={`${projects.length} project${projects.length === 1 ? "" : "s"} · ${slug}`}
        />
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-lg text-white"
          style={{ background: "#3A0CA3" }}
        >
          <Plus size={14} />
          New project
        </button>
      </div>

      <Table
        dataSource={projects}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={false}
        locale={{ emptyText: "No projects yet. Create one above." }}
      />

      <ProjectFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        saving={creating}
      />

      {editProject && (
        <ProjectFormModal
          open
          onClose={() => setEditProject(null)}
          initial={{
            title: editProject.title,
            description: "",
            requirements: "",
            submissionSteps: "",
            projectType: editProject.projectType,
            difficulty: editProject.difficulty,
          }}
          onSubmit={handleUpdate}
          saving={updating}
        />
      )}
    </div>
  );
}
