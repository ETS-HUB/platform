"use client";

import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input, Select, Switch } from "antd";
import {
  ArrowLeft,
  RefreshCw,
  Save,
  Pencil,
  BookOpen,
  FolderKanban,
} from "lucide-react";
import { Node, Edge } from "@xyflow/react";

import {
  useGetRoadmapQuery,
  useUpdateRoadmapMutation,
  useSyncRoadmapMutation,
} from "@/apis/roadmap/roadmapService";
import Header from "@/components/ui/Header";
import { getApiError } from "@/lib/apiError";

const RoadmapEditor = dynamic(
  () => import("@/components/roadmap/RoadmapEditor"),
  { ssr: false },
);

export default function EditRoadmapPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const { data: roadmap, isLoading } = useGetRoadmapQuery(slug, {
    skip: !slug,
  });
  const [updateRoadmap, { isLoading: saving }] = useUpdateRoadmapMutation();
  const [syncRoadmap, { isLoading: syncing }] = useSyncRoadmapMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("role");
  const [isPublished, setIsPublished] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    if (!roadmap) return;
    setTitle(roadmap.title);
    setDescription(roadmap.description);
    setType(roadmap.type);
    setIsPublished(roadmap.isPublished);
  }, [roadmap]);

  const handleSave = async () => {
    try {
      await updateRoadmap({
        slug,
        payload: { title, description, type, isPublished },
      }).unwrap();
      toast.success("Roadmap updated");
    } catch (err) {
      toast.error(getApiError(err, "Failed to update"));
    }
  };

  const handleResync = async () => {
    try {
      await syncRoadmap(slug).unwrap();
      toast.success("Roadmap re-synced from roadmap.sh");
    } catch (err) {
      toast.error(getApiError(err, "Sync failed"));
    }
  };

  const handleSaveCanvas = async (nodes: Node[], edges: Edge[]) => {
    try {
      await updateRoadmap({
        slug,
        payload: { nodes, edges },
      }).unwrap();
      toast.success("Canvas saved successfully");
    } catch (err) {
      toast.error(getApiError(err, "Failed to save canvas"));
      throw err;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="animate-pulse text-[13px]" style={{ color: "#9CA3AF" }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <p className="text-[13px]" style={{ color: "#9CA3AF" }}>
          Roadmap not found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-xl">
      <button
        type="button"
        onClick={() => router.push("/core/admin/roadmaps")}
        className="flex items-center gap-1.5 text-[13px] font-medium mb-6"
        style={{ color: "#8A8A8A" }}
      >
        <ArrowLeft size={14} />
        Back to roadmaps
      </button>

      <div className="mb-6">
        <Header title={`Edit: ${roadmap.title}`} subtitle={`/${slug}`} />
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={() => router.push(`/core/admin/roadmaps/${slug}/content`)}
            className="flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-lg"
            style={{ background: "#F5EEFE", color: "#3A0CA3" }}
          >
            <BookOpen size={14} />
            Manage Node Content
          </button>
          <button
            type="button"
            onClick={() => router.push(`/core/admin/roadmaps/${slug}/projects`)}
            className="flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-lg"
            style={{ background: "#F5EEFE", color: "#3A0CA3" }}
          >
            <FolderKanban size={14} />
            Manage Projects
          </button>
        </div>
      </div>

      <div
        className="rounded-2xl p-6 flex flex-col gap-4 mb-4"
        style={{ background: "#FFFFFF", border: "1.5px solid #EDE0FB" }}
      >
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Title
          </label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Description
          </label>
          <Input.TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Type
          </label>
          <Select
            value={type}
            onChange={setType}
            style={{ width: "100%" }}
            options={[
              { label: "Role", value: "role" },
              { label: "Skill", value: "skill" },
              { label: "Tool", value: "tool" },
            ]}
          />
        </div>
        <div
          className="flex items-center justify-between rounded-lg px-3.5 py-2.5"
          style={{ background: "#FAFAFA" }}
        >
          <div>
            <p className="text-[13px] font-medium" style={{ color: "#374151" }}>
              Published
            </p>
            <p className="text-[11px]" style={{ color: "#9CA3AF" }}>
              Visible to all visitors when on
            </p>
          </div>
          <Switch checked={isPublished} onChange={setIsPublished} />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 text-[13px] font-semibold px-5 py-2 rounded-lg text-white disabled:opacity-50"
            style={{ background: "#3A0CA3" }}
          >
            <Save size={14} />
            {saving ? "Saving..." : "Save changes"}
          </button>
          <button
            type="button"
            onClick={handleResync}
            disabled={syncing}
            className="flex items-center gap-1.5 text-[13px] font-semibold px-5 py-2 rounded-lg disabled:opacity-50"
            style={{ background: "#F5EEFE", color: "#3A0CA3" }}
          >
            <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Syncing..." : "Re-sync from roadmap.sh"}
          </button>
        </div>
      </div>

      <div
        className="rounded-2xl px-5 py-4 flex items-center justify-between"
        style={{ background: "#F0F9FF", border: "1px solid #BAE6FD" }}
      >
        <div>
          <p
            className="text-[12.5px] font-semibold mb-1"
            style={{ color: "#0C4A6E" }}
          >
            Visual Canvas Editor
          </p>
          <p className="text-[12px]" style={{ color: "#075985" }}>
            Edit nodes and connections visually with ReactFlow
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowEditor(!showEditor)}
          className="flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-lg text-white"
          style={{ background: "#0284C7" }}
        >
          <Pencil size={14} />
          {showEditor ? "Close Editor" : "Open Editor"}
        </button>
      </div>

      {showEditor && (
        <div
          className="mt-6 rounded-2xl overflow-hidden border-2"
          style={{ border: "2px solid #EDE0FB" }}
        >
          <div className="h-[700px]">
            <RoadmapEditor
              initialNodes={roadmap.nodes}
              initialEdges={roadmap.edges}
              onSave={handleSaveCanvas}
            />
          </div>
        </div>
      )}
    </div>
  );
}
