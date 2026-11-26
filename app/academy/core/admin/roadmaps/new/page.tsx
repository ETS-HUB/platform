"use client";
import toast from "react-hot-toast";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Select } from "antd";
import { ArrowLeft, Download } from "lucide-react";

import {
  useCreateRoadmapMutation,
  useSyncRoadmapMutation,
} from "@/apis/roadmap/roadmapService";
import Header from "@/components/ui/Header";
import { getApiError } from "@/lib/apiError";

const KNOWN_SLUGS = [
  "frontend",
  "backend",
  "fullstack",
  "devops",
  "android",
  "ios",
  "react",
  "vue",
  "angular",
  "nodejs",
  "python",
  "java",
  "golang",
  "typescript",
  "javascript",
  "docker",
  "kubernetes",
  "aws",
  "postgresql",
  "mongodb",
  "redis",
  "graphql",
  "system-design",
];

export default function NewRoadmapPage() {
  const router = useRouter();
  const [createRoadmap, { isLoading: creating }] = useCreateRoadmapMutation();
  const [syncRoadmap, { isLoading: syncing }] = useSyncRoadmapMutation();

  const [mode, setMode] = useState<"sync" | "manual">("sync");
  const [syncSlug, setSyncSlug] = useState("");
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("role");

  const handleSync = async () => {
    if (!syncSlug.trim()) return;
    try {
      await syncRoadmap(syncSlug.trim()).unwrap();
      toast.success(`Synced "${syncSlug}" — saved as draft`);
      router.push("/core/admin/roadmaps");
    } catch (err) {
      toast.error(getApiError(err, "Sync failed"));
    }
  };

  const handleCreate = async () => {
    if (!slug.trim() || !title.trim()) return;
    try {
      const result = await createRoadmap({
        slug: slug.trim(),
        title: title.trim(),
        description: description.trim(),
        type,
        nodes: [],
        edges: [],
        isPublished: false,
      }).unwrap();
      toast.success("Roadmap created! Opening editor...");
      router.push(`/core/admin/roadmaps/${result.slug}/edit`);
    } catch (err) {
      toast.error(getApiError(err, "Failed to create roadmap"));
    }
  };

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
        <Header
          title="New roadmap"
          subtitle="Sync from roadmap.sh or create manually."
        />
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2 mb-6">
        {(["sync", "manual"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className="text-[13px] font-semibold px-4 py-2 rounded-full"
            style={{
              background: mode === m ? "#3A0CA3" : "#F5F5F5",
              color: mode === m ? "#FFFFFF" : "#6B7280",
            }}
          >
            {m === "sync" ? "Sync from roadmap.sh" : "Create manually"}
          </button>
        ))}
      </div>

      {mode === "sync" ? (
        <div
          className="rounded-2xl p-6 flex flex-col gap-4"
          style={{ background: "#FFFFFF", border: "1.5px solid #EDE0FB" }}
        >
          <p className="text-[13px]" style={{ color: "#6B7280" }}>
            Enter a roadmap.sh slug (e.g.{" "}
            <code className="font-mono text-[#3A0CA3]">frontend</code>). The
            backend will import the nodes, edges and content automatically.
          </p>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              Roadmap slug
            </label>
            <Select
              showSearch
              allowClear
              placeholder="e.g. frontend, backend, devops"
              style={{ width: "100%" }}
              value={syncSlug || undefined}
              onChange={(v) => setSyncSlug(v ?? "")}
              options={KNOWN_SLUGS.map((s) => ({ label: s, value: s }))}
            />
            <p className="text-[11px] mt-1" style={{ color: "#9CA3AF" }}>
              Or type any roadmap.sh slug not in the list.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSync}
            disabled={!syncSlug.trim() || syncing}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold text-white disabled:opacity-50"
            style={{ background: "#3A0CA3" }}
          >
            <Download size={14} />
            {syncing ? "Importing..." : "Import roadmap"}
          </button>
        </div>
      ) : (
        <div
          className="rounded-2xl p-6 flex flex-col gap-4"
          style={{ background: "#FFFFFF", border: "1.5px solid #EDE0FB" }}
        >
          <p className="text-[13px]" style={{ color: "#6B7280" }}>
            Create a blank roadmap. After creation, you&apos;ll be able to use
            the visual canvas editor to add nodes and connections.
          </p>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              Slug
            </label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. frontend"
              style={{ fontFamily: "monospace" }}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Frontend Developer"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              Description
            </label>
            <Input.TextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Step by step guide to..."
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
          <button
            type="button"
            onClick={handleCreate}
            disabled={!slug.trim() || !title.trim() || creating}
            className="py-2.5 rounded-xl text-[13px] font-semibold text-white disabled:opacity-50"
            style={{ background: "#3A0CA3" }}
          >
            {creating ? "Creating..." : "Create & Open Editor"}
          </button>
        </div>
      )}
    </div>
  );
}
