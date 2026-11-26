"use client";

import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  ReactFlow,
  Background,
  ConnectionMode,
  getNodesBounds,
  type Node,
  type NodeMouseHandler,
  type NodeTypes,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  ArrowLeft,
  LogIn,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

import {
  useGetRoadmapQuery,
  useGetRoadmapProgressQuery,
  useSetNodeStatusMutation,
  useUnsetNodeStatusMutation,
  useClearProgressMutation,
  useLazyGetNodeContentQuery,
} from "@/apis/roadmap/roadmapService";
import type {
  NodeStatus,
  RoadmapWithProgress,
  NodeContent,
} from "@/apis/roadmap/types";
import type { RootState } from "@/store";
import RoadmapNode, {
  edgeTypes,
} from "@/components/roadmap/public/RoadmapNode";
import NodeSidebar from "../components/NodeSidebar";
import { tiptapToHtml } from "@/lib/tiptapToHtml";
import AuthRequiredModal from "@/components/AuthRequiredModal";
import HomeFooter from "@/app/(marketing)/components/HomeFooter";
import RoadmapHero from "./components/RoadmapHero";
import CommunitySection from "@/app/(marketing)/components/CommunitySection";
import RoadmapHeader, { type RoadmapTab } from "./components/RoadmapHeader";
import ProjectsView from "./components/ProjectsView";
// Register custom node types
const nodeTypes: NodeTypes = {
  topic: RoadmapNode,
  subtopic: RoadmapNode,
  paragraph: RoadmapNode,
  button: RoadmapNode,
  title: RoadmapNode,
  section: RoadmapNode,
  label: RoadmapNode,
  vertical: RoadmapNode,
  horizontal: RoadmapNode,
  legend: RoadmapNode,
  linksgroup: RoadmapNode,
};

// Scale positions, sizes and fonts together so cards get bigger
// without breaking where edges attach.
const SCALE = 0.85;
const VIEW_ZOOM = 1;

// ── Status colour map (sidebar only) ─────────────────────────────────────
const STATUS_STYLES: Record<
  NodeStatus,
  { border: string; bg: string; label: string }
> = {
  DONE: { border: "#059669", bg: "#F0FDF4", label: "Done" },
  IN_PROGRESS: { border: "#D97706", bg: "#FFFBEB", label: "In Progress" },
  SKIP: { border: "#9CA3AF", bg: "#F9FAFB", label: "Skipped" },
};

// Map API statuses to the RoadmapNode component's `data.status`
const NODE_STATUS: Record<NodeStatus, "done" | "learning" | "skipped"> = {
  DONE: "done",
  IN_PROGRESS: "learning",
  SKIP: "skipped",
};

// Pass status through node data (the node component styles itself).
// Do NOT write border/background onto node.style: that styles the
// React Flow wrapper and produces a double border / offset box.
function applyProgress(
  nodes: Node[],
  progress: RoadmapWithProgress["progress"],
): Node[] {
  return nodes.map((node) => {
    const entry = progress[node.id];
    if (!entry) return node;
    return {
      ...node,
      data: { ...node.data, status: NODE_STATUS[entry.status] },
    };
  });
}

function buildEdges(nodes: Node[], rawEdges: any[]) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const size = (n: any) => ({
    w: n.width ?? n.measured?.width ?? (Number(n.style?.width) || 0),
    h: n.height ?? n.measured?.height ?? (Number(n.style?.height) || 0),
  });
  const center = (n: any) => {
    const { w, h } = size(n);
    return { x: n.position.x + w / 2, y: n.position.y + h / 2 };
  };

  return rawEdges.flatMap((edge) => {
    const s = byId.get(edge.source);
    const t = byId.get(edge.target);
    if (!s || !t) return [];

    const sc = center(s);
    const tc = center(t);
    const dx = tc.x - sc.x;
    const dy = tc.y - sc.y;
    const vertical = Math.abs(dy) >= Math.abs(dx);

    const [sourceHandle, targetHandle] = vertical
      ? dy >= 0
        ? ["bottom", "top"]
        : ["top", "bottom"]
      : dx >= 0
        ? ["right", "left"]
        : ["left", "right"];

    // Straight when aligned, right-angled otherwise (never slanted)
    const offset = vertical ? Math.abs(dx) : Math.abs(dy);

    const raw =
      edge.style?.strokeDasharray ?? edge.data?.style?.strokeDasharray;
    const dashed =
      (raw && raw !== "0" && raw !== "0 0") ||
      edge.data?.edgeStyle === "dashed" ||
      edge.data?.edgeStyle === "dotted";

    return [
      {
        ...edge,
        sourceHandle,
        targetHandle,
        type: offset < 8 ? "straight" : "step",
        animated: false,
        style: {
          stroke: "#2B78E4",
          strokeWidth: 2,
          ...(edge.style || {}),
          ...(dashed && !raw ? { strokeDasharray: "6 6" } : {}),
        },
      },
    ];
  });
}

function scaleNode(n: any): Node {
  return {
    ...n,
    position: { x: n.position.x * SCALE, y: n.position.y * SCALE },
    width: n.width != null ? n.width * SCALE : undefined,
    height: n.height != null ? n.height * SCALE : undefined,
    measured: undefined, // force re-measure after scaling
    style: n.style && {
      ...n.style,
      ...(n.style.width != null && { width: Number(n.style.width) * SCALE }),
      ...(n.style.height != null && { height: Number(n.style.height) * SCALE }),
    },
    data: {
      ...n.data,
      style: {
        ...(n.data?.style ?? {}),
        fontSize: (n.data?.style?.fontSize ?? 15) * SCALE,
        strokeWidth:
          n.data?.style?.strokeWidth != null
            ? n.data.style.strokeWidth * SCALE
            : undefined,
      },
    },
    draggable: false,
    selectable: true,
  };
}

export default function RoadmapPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { accessToken } = useSelector((s: RootState) => s.tokens);
  const [tab, setTab] = useState<RoadmapTab>("roadmap");
  const isAuthenticated = !!accessToken;

  const containerRef = useRef<HTMLDivElement>(null);
  const rfRef = useRef<ReactFlowInstance | null>(null);
  const didCenter = useRef(false);
  const HANDLE_IDS = new Set(["w1", "w2", "x1", "x2", "y1", "y2", "z1", "z2"]);

  function prepareEdges(raw: any[], nodes: Node[]) {
    const ids = new Set(nodes.map((n) => n.id));
    const problems: any[] = [];

    const edges = raw.flatMap((e) => {
      if (!ids.has(e.source) || !ids.has(e.target)) {
        problems.push({ id: e.id, why: "source or target node not found" });
        return [];
      }
      if (e.sourceHandle && !HANDLE_IDS.has(e.sourceHandle))
        problems.push({
          id: e.id,
          why: `unknown sourceHandle ${e.sourceHandle}`,
        });
      if (e.targetHandle && !HANDLE_IDS.has(e.targetHandle))
        problems.push({
          id: e.id,
          why: `unknown targetHandle ${e.targetHandle}`,
        });

      return [
        {
          ...e,
          id: e.id ?? `${e.source}-${e.target}`,
          // unknown IDs fall back to the node's first handle instead of vanishing
          sourceHandle: HANDLE_IDS.has(e.sourceHandle)
            ? e.sourceHandle
            : undefined,
          targetHandle: HANDLE_IDS.has(e.targetHandle)
            ? e.targetHandle
            : undefined,
          selected: false,
          animated: false,
          style: {
            stroke: "#2b78e4",
            strokeWidth: 3.5,
            strokeLinecap: "round",
            ...(e.style || {}),
          },
        },
      ];
    });

    if (problems.length) console.warn("Roadmap edges with problems:", problems);
    return edges;
  }
  // Fetch public roadmap
  const { data: publicRoadmap, isLoading: loadingPublic } = useGetRoadmapQuery(
    slug,
    { skip: !slug || isAuthenticated },
  );

  // Fetch with progress overlay if authenticated
  const { data: progressRoadmap, isLoading: loadingProgress } =
    useGetRoadmapProgressQuery(slug, { skip: !slug || !isAuthenticated });

  const roadmap = isAuthenticated ? progressRoadmap : publicRoadmap;
  const isLoading = isAuthenticated ? loadingProgress : loadingPublic;

  const progress = useMemo(
    () => (progressRoadmap as any)?.progress ?? {},
    [progressRoadmap],
  );
  const stats = useMemo(
    () => (progressRoadmap as any)?.stats ?? null,
    [progressRoadmap],
  );

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<any[]>([]);

  useEffect(() => {
    if (!roadmap) return;

    const withStatus = isAuthenticated
      ? applyProgress(roadmap.nodes, progress)
      : roadmap.nodes;

    const scaled = withStatus.map(scaleNode);

    setNodes(scaled);
    setEdges(prepareEdges(roadmap.edges || [], scaled));
  }, [roadmap, progress, isAuthenticated]);

  // Re-center for a new roadmap
  useEffect(() => {
    didCenter.current = false;
  }, [slug]);

  const bounds = useMemo(
    () => (nodes.length ? getNodesBounds(nodes) : null),
    [nodes],
  );

  const canvasHeight = bounds
    ? Math.max(500, bounds.height * VIEW_ZOOM + 80)
    : undefined;

  // Center once per roadmap, after nodes exist and the instance is ready.
  // Not on every progress update, or the view would jump when marking nodes.
  const centerViewport = useCallback(() => {
    const instance = rfRef.current;
    if (!instance || !bounds || didCenter.current) return;
    const containerWidth = containerRef.current?.clientWidth ?? 1000;
    instance.setViewport({
      x: (containerWidth - bounds.width * VIEW_ZOOM) / 2 - bounds.x * VIEW_ZOOM,
      y: 40 - bounds.y * VIEW_ZOOM,
      zoom: VIEW_ZOOM,
    });
    didCenter.current = true;
  }, [bounds]);

  useEffect(() => {
    centerViewport();
  }, [centerViewport]);

  const handleInit = useCallback(
    (instance: ReactFlowInstance) => {
      rfRef.current = instance;
      centerViewport();
    },
    [centerViewport],
  );

  // Selected node sidebar
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authAction, setAuthAction] = useState("track your progress");

  const handleNodeClick: NodeMouseHandler = useCallback((_e, node) => {
    setSelectedNode(node);
  }, []);

  // Mutations
  const [setNodeStatus] = useSetNodeStatusMutation();
  const [unsetNodeStatus] = useUnsetNodeStatusMutation();
  const [clearProgress] = useClearProgressMutation();

  const handleSetStatus = async (status: NodeStatus) => {
    if (!selectedNode) return;
    if (!isAuthenticated) {
      const statusLabel =
        status === "DONE"
          ? "mark as done"
          : status === "IN_PROGRESS"
            ? "mark as learning"
            : "skip this topic";
      setAuthAction(statusLabel);
      setShowAuthModal(true);
      return;
    }
    try {
      await setNodeStatus({ slug, nodeId: selectedNode.id, status }).unwrap();
      toast.success(`Marked as ${STATUS_STYLES[status].label}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleUnset = async () => {
    if (!selectedNode) return;
    if (!isAuthenticated) {
      setAuthAction("update progress");
      setShowAuthModal(true);
      return;
    }
    try {
      await unsetNodeStatus({ slug, nodeId: selectedNode.id }).unwrap();
      toast.success("Status removed");
    } catch {
      toast.error("Failed to remove status");
    }
  };

  const handleClearProgress = async () => {
    if (!isAuthenticated) {
      setAuthAction("reset progress");
      setShowAuthModal(true);
      return;
    }
    try {
      await clearProgress(slug).unwrap();
      toast.success("Progress reset");
    } catch {
      toast.error("Failed to reset progress");
    }
  };

  const currentNodeStatus: NodeStatus | null =
    selectedNode && progress[selectedNode.id]
      ? progress[selectedNode.id].status
      : null;

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ background: "#FAFAFA" }}
      >
        {/* Hero with loading skeleton */}
        <section className="relative overflow-hidden bg-[#151c31]/95 font-family-outfit">
          <div className="relative max-w-4xl mx-auto px-6 pt-28 pb-14 sm:pt-32 sm:pb-20 text-center">
            <span
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1 rounded-full mb-5"
              style={{
                background: "rgba(255,255,255,0.14)",
                color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              Learning Roadmap
            </span>

            {/* Title skeleton */}
            <div
              className="h-12 w-80 max-w-full mx-auto rounded-lg animate-pulse mb-4"
              style={{ background: "rgba(255,255,255,0.15)" }}
            />

            {/* Start button */}
            <div className="mt-8">
              <button
                type="button"
                disabled
                className="flex items-center gap-2 text-[14px] font-semibold px-6 py-3 rounded-full mx-auto opacity-50 cursor-not-allowed"
                style={{ background: "#FFFFFF", color: "#3A0CA3" }}
              >
                Loading...
              </button>
            </div>
          </div>
        </section>

        {/* Loading spinner for canvas */}
        <div className="flex-1 flex items-center justify-center">
          <div
            className="inline-block w-12 h-12 rounded-full border-4 border-solid animate-spin"
            style={{
              borderColor: "#3A0CA3 transparent transparent transparent",
            }}
          />
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-[14px]" style={{ color: "#9CA3AF" }}>
          Roadmap not found.
        </p>
      </div>
    );
  }

  return (
    <>
      <RoadmapHero
        title={roadmap.title}
        description="Master the essential skills and technologies. Track your progress through interactive learning paths designed by industry experts."
        topicCount={roadmap.nodes.length}
        isAuthenticated={isAuthenticated}
        stats={stats}
        onStart={() =>
          containerRef.current?.scrollIntoView({ behavior: "smooth" })
        }
        onReset={handleClearProgress}
        onAuthRequired={() => {
          setAuthAction("track your progress");
          setShowAuthModal(true);
        }}
      />
      <RoadmapHeader
        title={roadmap.title}
        description={(roadmap as any).description}
        activeTab={tab}
        onTabChange={setTab}
        isAuthenticated={isAuthenticated}
        learnerCount={1000}
      />
      <div className="min-h-screen w-full flex flex-col bg-[#FAFAFA]">
        {/* Wrapper for canvas and questions: no own scroll, page scrolls */}
        <div className="flex-1">
          {tab === "projects" ? (
            <div className="max-w-5xl mx-auto px-6 py-10">
              <ProjectsView
                roadmapId={roadmap.id}
                roadmapSlug={slug}
                isAuthenticated={isAuthenticated}
                onAuthRequired={() => {
                  setAuthAction("start this project");
                  setShowAuthModal(true);
                }}
              />
            </div>
          ) : (
            <>
              {/* Canvas container */}
              <div
                ref={containerRef}
                className="relative w-full touch-pan-x touch-pan-y"
                style={{ height: canvasHeight ?? "70vh", minHeight: 500 }}
              >
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  edgeTypes={edgeTypes}
                  onNodeClick={handleNodeClick}
                  nodeTypes={nodeTypes}
                  onInit={handleInit}
                  connectionMode={ConnectionMode.Loose}
                  translateExtent={
                    bounds
                      ? [
                          [bounds.x - 40, bounds.y - 40],
                          [
                            bounds.x + bounds.width + 40,
                            bounds.y + bounds.height + 40,
                          ],
                        ]
                      : undefined
                  }
                  nodesDraggable={false}
                  nodesConnectable={false}
                  elementsSelectable
                  panOnScroll={false}
                  panOnDrag
                  zoomOnScroll={false}
                  zoomOnPinch={false}
                  zoomOnDoubleClick={false}
                  zoomActivationKeyCode={null}
                  minZoom={VIEW_ZOOM}
                  maxZoom={VIEW_ZOOM}
                  preventScrolling={false}
                  className="bg-[#FAFAFA]"
                >
                  <Background gap={24} color="#EDE0FB" />
                </ReactFlow>
              </div>

              {/* Questions & FAQs Section */}
              {roadmap.questions && roadmap.questions.length > 0 && (
                <div style={{ background: "#FAFAFA" }}>
                  <div className="max-w-4xl mx-auto px-6 pt-4 pb-16">
                    <h2
                      className="text-[20px] font-bold mb-6"
                      style={{ color: "#3A0CA3" }}
                    >
                      Frequently Asked Questions
                    </h2>
                    <div className="space-y-5">
                      {roadmap.questions.map((question, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border-2 overflow-hidden transition-all"
                          style={{
                            borderColor:
                              expandedQuestion === idx ? "#3A0CA3" : "#D1D5DB",
                            background: "#FFFFFF",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedQuestion(
                                expandedQuestion === idx ? null : idx,
                              )
                            }
                            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#F9F5FF] transition-colors"
                          >
                            <span
                              className="text-[15px] font-semibold pr-4"
                              style={{ color: "#111827" }}
                            >
                              {question.title}
                            </span>
                            {expandedQuestion === idx ? (
                              <ChevronUp
                                size={18}
                                style={{ color: "#3A0CA3" }}
                                className="shrink-0"
                              />
                            ) : (
                              <ChevronDown
                                size={18}
                                style={{ color: "#7408B3" }}
                                className="shrink-0"
                              />
                            )}
                          </button>
                          {expandedQuestion === idx && (
                            <div
                              className="px-6 py-5 border-t-2"
                              style={{
                                borderColor: "#EDE0FB",
                                background: "#FAFAFA",
                              }}
                            >
                              <div
                                className="max-w-none text-[14px] leading-relaxed"
                                style={{ color: "#374151" }}
                                dangerouslySetInnerHTML={{
                                  __html: tiptapToHtml(
                                    question.description?.content,
                                  ),
                                }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Overlay when sidebar is open - covers entire page */}
        {selectedNode && (
          <div
            className="fixed inset-0 bg-black/30 z-[5] transition-opacity"
            onClick={() => setSelectedNode(null)}
            aria-label="Close sidebar"
          />
        )}

        {/* Node Sidebar */}
        {selectedNode && (
          <NodeSidebar
            slug={slug}
            node={selectedNode}
            currentStatus={currentNodeStatus}
            isAuthenticated={isAuthenticated}
            onClose={() => setSelectedNode(null)}
            onSetStatus={handleSetStatus}
            onUnset={handleUnset}
            onAuthRequired={(action) => {
              setAuthAction(action);
              setShowAuthModal(true);
            }}
          />
        )}
      </div>
      <CommunitySection />
      <HomeFooter />

      {/* Auth Required Modal */}
      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        action={authAction}
      />
    </>
  );
}
