"use client";
import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Tabs } from "antd";
import { ArrowLeft, Upload, FileJson, Package } from "lucide-react";

import {
  useImportRoadmapMutation,
  useImportNodeContentMutation,
  useImportNodeContentsBulkMutation,
} from "@/apis/roadmap/roadmapService";
import Header from "@/components/ui/Header";
import { getApiError } from "@/lib/apiError";

export default function ImportRoadmapPage() {
  const router = useRouter();
  const [importRoadmap, { isLoading: importingRoadmap }] =
    useImportRoadmapMutation();
  const [importNodeContent, { isLoading: importingNode }] =
    useImportNodeContentMutation();
  const [importNodeContentsBulk, { isLoading: importingBulk }] =
    useImportNodeContentsBulkMutation();

  const [roadmapJson, setRoadmapJson] = useState("");
  const [nodeContentJson, setNodeContentJson] = useState("");
  const [bulkJson, setBulkJson] = useState("");

  const handleImportRoadmap = async () => {
    if (!roadmapJson.trim()) {
      toast.error("Please paste roadmap JSON");
      return;
    }

    try {
      const data = JSON.parse(roadmapJson);
      await importRoadmap(data).unwrap();
      toast.success(`Roadmap "${data.slug}" imported successfully!`);
      setRoadmapJson("");
      router.push("/core/admin/roadmaps");
    } catch (err: any) {
      if (err.message?.includes("JSON")) {
        toast.error("Invalid JSON format");
      } else {
        toast.error(getApiError(err, "Failed to import roadmap"));
      }
    }
  };

  const handleImportNodeContent = async () => {
    if (!nodeContentJson.trim()) {
      toast.error("Please paste node content JSON");
      return;
    }

    try {
      const data = JSON.parse(nodeContentJson);
      await importNodeContent(data).unwrap();
      toast.success(`Node content for "${data.nodeId}" imported successfully!`);
      setNodeContentJson("");
    } catch (err: any) {
      if (err.message?.includes("JSON")) {
        toast.error("Invalid JSON format");
      } else {
        toast.error(getApiError(err, "Failed to import node content"));
      }
    }
  };

  const handleImportBulk = async () => {
    if (!bulkJson.trim()) {
      toast.error("Please paste bulk JSON array");
      return;
    }

    try {
      const data = JSON.parse(bulkJson);
      if (!Array.isArray(data)) {
        toast.error("JSON must be an array");
        return;
      }

      const result = await importNodeContentsBulk(data).unwrap();
      toast.success(
        `Imported ${result.imported}/${result.total} node contents. ${result.failed} failed.`,
      );
      if (result.errors.length > 0) {
        console.error("Import errors:", result.errors);
      }
      setBulkJson("");
    } catch (err: any) {
      if (err.message?.includes("JSON")) {
        toast.error("Invalid JSON format");
      } else {
        toast.error(getApiError(err, "Failed to bulk import"));
      }
    }
  };

  const tabItems = [
    {
      key: "roadmap",
      label: (
        <span className="flex items-center gap-2">
          <FileJson size={16} />
          Full Roadmap
        </span>
      ),
      children: (
        <div className="space-y-4">
          <div
            className="rounded-xl p-4"
            style={{ background: "#F0F9FF", border: "1px solid #BAE6FD" }}
          >
            <p
              className="text-[13px] font-medium mb-2"
              style={{ color: "#0C4A6E" }}
            >
              Import from roadmap.sh
            </p>
            <p className="text-[12px]" style={{ color: "#075985" }}>
              Visit{" "}
              <code className="font-mono">https://roadmap.sh/backend.json</code>{" "}
              (or any roadmap slug), copy the entire JSON, and paste below.
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              Roadmap JSON
            </label>
            <Input.TextArea
              value={roadmapJson}
              onChange={(e) => setRoadmapJson(e.target.value)}
              rows={16}
              placeholder={`{
  "slug": "backend",
  "title": { "page": "Backend Developer", "card": "Backend" },
  "description": "Step by step guide...",
  "nodes": [...],
  "edges": [...],
  "type": "role"
}`}
              style={{ fontFamily: "monospace", fontSize: "12px" }}
            />
          </div>

          <button
            type="button"
            onClick={handleImportRoadmap}
            disabled={!roadmapJson.trim() || importingRoadmap}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold text-white disabled:opacity-50"
            style={{ background: "#3A0CA3" }}
          >
            <Upload size={14} />
            {importingRoadmap ? "Importing..." : "Import Roadmap"}
          </button>
        </div>
      ),
    },
    {
      key: "node",
      label: (
        <span className="flex items-center gap-2">
          <FileJson size={16} />
          Single Node Content
        </span>
      ),
      children: (
        <div className="space-y-4">
          <div
            className="rounded-xl p-4"
            style={{ background: "#FFF7ED", border: "1px solid #FED7AA" }}
          >
            <p
              className="text-[13px] font-medium mb-2"
              style={{ color: "#9A3412" }}
            >
              Import node content
            </p>
            <p className="text-[12px]" style={{ color: "#C2410C" }}>
              Paste a single node content JSON object to create or update its
              content.
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              Node Content JSON
            </label>
            <Input.TextArea
              value={nodeContentJson}
              onChange={(e) => setNodeContentJson(e.target.value)}
              rows={16}
              placeholder={`{
  "roadmapSlug": "backend",
  "nodeId": "HQrxxDxKN8gizvXRU5psW",
  "description": "# Copilot\\n\\nCopilot is...",
  "resources": [...],
  "lessonPacks": [],
  "videos": [],
  "paidResources": [],
  "contribution": "https://github.com/..."
}`}
              style={{ fontFamily: "monospace", fontSize: "12px" }}
            />
          </div>

          <button
            type="button"
            onClick={handleImportNodeContent}
            disabled={!nodeContentJson.trim() || importingNode}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold text-white disabled:opacity-50"
            style={{ background: "#3A0CA3" }}
          >
            <Upload size={14} />
            {importingNode ? "Importing..." : "Import Node Content"}
          </button>
        </div>
      ),
    },
    {
      key: "bulk",
      label: (
        <span className="flex items-center gap-2">
          <Package size={16} />
          Bulk Node Contents
        </span>
      ),
      children: (
        <div className="space-y-4">
          <div
            className="rounded-xl p-4"
            style={{ background: "#F5F3FF", border: "1px solid #DDD6FE" }}
          >
            <p
              className="text-[13px] font-medium mb-2"
              style={{ color: "#5B21B6" }}
            >
              Bulk import multiple node contents
            </p>
            <p className="text-[12px]" style={{ color: "#7C3AED" }}>
              Paste an array of node content objects to import many at once.
              Safe to run multiple times!
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              Bulk JSON Array
            </label>
            <Input.TextArea
              value={bulkJson}
              onChange={(e) => setBulkJson(e.target.value)}
              rows={16}
              placeholder={`[
  {
    "roadmapSlug": "backend",
    "nodeId": "node1",
    "description": "...",
    "resources": [...]
  },
  {
    "roadmapSlug": "backend",
    "nodeId": "node2",
    "description": "...",
    "resources": [...]
  }
]`}
              style={{ fontFamily: "monospace", fontSize: "12px" }}
            />
          </div>

          <button
            type="button"
            onClick={handleImportBulk}
            disabled={!bulkJson.trim() || importingBulk}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold text-white disabled:opacity-50"
            style={{ background: "#3A0CA3" }}
          >
            <Upload size={14} />
            {importingBulk ? "Importing..." : "Bulk Import Node Contents"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen w-full max-w-4xl">
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
          title="Import Roadmap Data"
          subtitle="Paste JSON from roadmap.sh or your own data to import"
        />
      </div>

      <div
        className="rounded-2xl p-6"
        style={{ background: "#FFFFFF", border: "1.5px solid #EDE0FB" }}
      >
        <Tabs items={tabItems} />
      </div>
    </div>
  );
}
