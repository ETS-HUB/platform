"use client";
import toast from "react-hot-toast";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input, Select, Button, Modal, Form } from "antd";
import { ArrowLeft, Plus, Edit, Trash2, Download } from "lucide-react";

import {
  useGetRoadmapQuery,
  useGetAllNodeContentsQuery,
  useCreateNodeContentMutation,
  useUpdateNodeContentMutation,
  useDeleteNodeContentMutation,
  useSyncNodeContentMutation,
  useSyncAllNodesMutation,
} from "@/apis/roadmap/roadmapService";
import type { NodeContent } from "@/apis/roadmap/types";
import Header from "@/components/ui/Header";
import { getApiError } from "@/lib/apiError";

export default function RoadmapContentPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const { data: roadmap } = useGetRoadmapQuery(slug, { skip: !slug });
  const { data: nodeContents = [], isLoading } = useGetAllNodeContentsQuery(
    slug,
    { skip: !slug },
  );

  const [createContent] = useCreateNodeContentMutation();
  const [updateContent] = useUpdateNodeContentMutation();
  const [deleteContent] = useDeleteNodeContentMutation();
  const [syncNode] = useSyncNodeContentMutation();
  const [syncAll, { isLoading: syncingAll }] = useSyncAllNodesMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<NodeContent | null>(
    null,
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string>("");
  const [form] = Form.useForm();

  // Get nodes that don't have content yet
  const nodesWithoutContent = (roadmap?.nodes || []).filter(
    (node) => !nodeContents.some((content) => content.nodeId === node.id),
  );

  const handleOpenModal = (nodeId?: string, content?: NodeContent) => {
    if (content) {
      setEditingContent(content);
      form.setFieldsValue({
        nodeId: content.nodeId,
        description: content.description,
        resources: JSON.stringify(content.resources, null, 2),
        lessonPacks: JSON.stringify(content.lessonPacks, null, 2),
        videos: JSON.stringify(content.videos, null, 2),
        paidResources: JSON.stringify(content.paidResources, null, 2),
        contributionUrl: content.contributionUrl,
      });
    } else if (nodeId) {
      setSelectedNodeId(nodeId);
      form.setFieldsValue({
        nodeId,
        description: "",
        resources: "[]",
        lessonPacks: "[]",
        videos: "[]",
        paidResources: "[]",
        contributionUrl: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContent(null);
    setSelectedNodeId("");
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    try {
      const resources = values.resources ? JSON.parse(values.resources) : [];
      const lessonPacks = values.lessonPacks
        ? JSON.parse(values.lessonPacks)
        : [];
      const videos = values.videos ? JSON.parse(values.videos) : [];
      const paidResources = values.paidResources
        ? JSON.parse(values.paidResources)
        : [];

      if (editingContent) {
        await updateContent({
          slug,
          nodeId: editingContent.nodeId,
          payload: {
            description: values.description,
            resources,
            lessonPacks,
            videos,
            paidResources,
            contributionUrl: values.contributionUrl,
          },
        }).unwrap();
        toast.success("Content updated successfully");
      } else {
        await createContent({
          roadmapSlug: slug,
          nodeId: values.nodeId,
          description: values.description,
          resources,
          lessonPacks,
          videos,
          paidResources,
          contributionUrl: values.contributionUrl,
        }).unwrap();
        toast.success("Content created successfully");
      }
      handleCloseModal();
    } catch (err) {
      toast.error(getApiError(err, "Failed to save content"));
    }
  };

  const handleDelete = (content: NodeContent) => {
    Modal.confirm({
      title: "Delete node content?",
      content: `This will remove all content for node: ${getNodeLabel(content.nodeId)}`,
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteContent({ slug, nodeId: content.nodeId }).unwrap();
          toast.success("Content deleted");
        } catch (err) {
          toast.error(getApiError(err, "Failed to delete"));
        }
      },
    });
  };

  const handleSyncNode = async (nodeId: string) => {
    try {
      await syncNode({ slug, nodeId }).unwrap();
      toast.success("Node synced from roadmap.sh");
    } catch (err) {
      toast.error(getApiError(err, "Failed to sync node"));
    }
  };

  const handleSyncAll = async () => {
    try {
      const result = await syncAll(slug).unwrap();
      toast.success(`Synced ${result.synced} nodes from roadmap.sh`);
    } catch (err) {
      toast.error(getApiError(err, "Failed to sync all nodes"));
    }
  };

  const getNodeLabel = (nodeId: string) => {
    const node = roadmap?.nodes.find((n) => n.id === nodeId);
    return (node?.data as any)?.label || nodeId;
  };

  return (
    <div className="min-h-screen w-full">
      <button
        type="button"
        onClick={() => router.push(`/core/admin/roadmaps/${slug}/edit`)}
        className="flex items-center gap-1.5 text-[13px] font-medium mb-6"
        style={{ color: "#8A8A8A" }}
      >
        <ArrowLeft size={14} />
        Back to edit roadmap
      </button>

      <div className="mb-6 flex items-start justify-between">
        <Header
          title="Node Content Management"
          subtitle={`${roadmap?.title || slug} - ${nodeContents.length} nodes with content`}
        />
        <button
          type="button"
          onClick={handleSyncAll}
          disabled={syncingAll}
          className="flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-lg text-white disabled:opacity-50"
          style={{ background: "#2B78E4" }}
        >
          <Download size={14} />
          {syncingAll ? "Syncing..." : "Sync All from roadmap.sh"}
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-[15px] font-bold mb-4" style={{ color: "#0e1430" }}>
          Nodes with Content ({nodeContents.length})
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {nodeContents.map((content) => (
            <div
              key={content.id}
              className="rounded-xl p-4 flex items-start justify-between"
              style={{ background: "#FFFFFF", border: "1.5px solid #EDE0FB" }}
            >
              <div className="flex-1">
                <h3
                  className="text-[14px] font-semibold mb-1"
                  style={{ color: "#111827" }}
                >
                  {getNodeLabel(content.nodeId)}
                </h3>
                <p className="text-[12px] mb-2" style={{ color: "#6B7280" }}>
                  Node ID:{" "}
                  <code className="font-mono text-[11px]">
                    {content.nodeId}
                  </code>
                </p>
                <div
                  className="flex items-center gap-3 text-[11px]"
                  style={{ color: "#9CA3AF" }}
                >
                  <span>{(content.resources || []).length} resources</span>
                  {(content.lessonPacks || []).length > 0 && (
                    <span>• {content.lessonPacks.length} lesson packs</span>
                  )}
                  {(content.videos || []).length > 0 && (
                    <span>• {content.videos.length} videos</span>
                  )}
                  {(content.paidResources || []).length > 0 && (
                    <span>• {content.paidResources.length} paid resources</span>
                  )}
                  {content.description && <span>• Has description</span>}
                  {content.contributionUrl && (
                    <span>• Has contribution link</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSyncNode(content.nodeId)}
                  className="p-2 rounded-lg hover:bg-blue-50"
                  title="Sync from roadmap.sh"
                >
                  <Download size={16} style={{ color: "#2B78E4" }} />
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenModal(undefined, content)}
                  className="p-2 rounded-lg hover:bg-purple-50"
                  title="Edit"
                >
                  <Edit size={16} style={{ color: "#3A0CA3" }} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(content)}
                  className="p-2 rounded-lg hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 size={16} style={{ color: "#DC2626" }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {nodesWithoutContent.length > 0 && (
        <div>
          <h2
            className="text-[15px] font-bold mb-4"
            style={{ color: "#0e1430" }}
          >
            Nodes without Content ({nodesWithoutContent.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {nodesWithoutContent.map((node) => (
              <div
                key={node.id}
                className="rounded-xl p-4 flex items-center justify-between"
                style={{ background: "#F9FAFB", border: "1.5px solid #E5E7EB" }}
              >
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[13px] font-medium truncate"
                    style={{ color: "#374151" }}
                  >
                    {(node.data as any)?.label || node.id}
                  </p>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <button
                    type="button"
                    onClick={() => handleSyncNode(node.id)}
                    className="p-1.5 rounded-lg hover:bg-blue-100"
                    title="Sync from roadmap.sh"
                  >
                    <Download size={14} style={{ color: "#2B78E4" }} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenModal(node.id)}
                    className="p-1.5 rounded-lg hover:bg-purple-100"
                    title="Add content"
                  >
                    <Plus size={14} style={{ color: "#3A0CA3" }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal
        title={editingContent ? "Edit Node Content" : "Create Node Content"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Node"
            name="nodeId"
            rules={[{ required: true, message: "Please select a node" }]}
          >
            <Select
              placeholder="Select node"
              disabled={!!editingContent}
              options={(roadmap?.nodes || []).map((node) => ({
                label: (node.data as any)?.label || node.id,
                value: node.id,
              }))}
            />
          </Form.Item>

          <Form.Item label="Description (Markdown)" name="description">
            <Input.TextArea
              rows={6}
              placeholder="# Node Title&#10;&#10;Description goes here..."
            />
          </Form.Item>

          <Form.Item
            label="Resources (JSON Array)"
            name="resources"
            rules={[
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  try {
                    JSON.parse(value);
                    return Promise.resolve();
                  } catch {
                    return Promise.reject(new Error("Invalid JSON format"));
                  }
                },
              },
            ]}
          >
            <Input.TextArea
              rows={6}
              placeholder='[&#10;  {&#10;    "type": "official",&#10;    "title": "Resource Title",&#10;    "url": "https://..."&#10;  }&#10;]'
              style={{ fontFamily: "monospace", fontSize: "12px" }}
            />
          </Form.Item>

          <Form.Item
            label="Lesson Packs (JSON Array)"
            name="lessonPacks"
            rules={[
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  try {
                    JSON.parse(value);
                    return Promise.resolve();
                  } catch {
                    return Promise.reject(new Error("Invalid JSON format"));
                  }
                },
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="[]"
              style={{ fontFamily: "monospace", fontSize: "12px" }}
            />
          </Form.Item>

          <Form.Item
            label="Videos (JSON Array)"
            name="videos"
            rules={[
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  try {
                    JSON.parse(value);
                    return Promise.resolve();
                  } catch {
                    return Promise.reject(new Error("Invalid JSON format"));
                  }
                },
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="[]"
              style={{ fontFamily: "monospace", fontSize: "12px" }}
            />
          </Form.Item>

          <Form.Item
            label="Paid Resources (JSON Array)"
            name="paidResources"
            rules={[
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  try {
                    JSON.parse(value);
                    return Promise.resolve();
                  } catch {
                    return Promise.reject(new Error("Invalid JSON format"));
                  }
                },
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="[]"
              style={{ fontFamily: "monospace", fontSize: "12px" }}
            />
          </Form.Item>

          <Form.Item label="Contribution URL" name="contributionUrl">
            <Input placeholder="https://github.com/..." />
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editingContent ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
