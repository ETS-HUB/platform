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
  Sparkles,
  BookMarked,
  MessageCircle,
  Compass,
} from "lucide-react";
import toast from "react-hot-toast";

import { useGetContentQuery } from "@/apis/ai/aiService";
import type { RootState } from "@/store";
import RoadmapNode, {
  edgeTypes,
} from "@/components/roadmap/public/RoadmapNode";
import NodeSidebar from "@/app/roadmap/components/NodeSidebar";
import HomeFooter from "@/app/(marketing)/components/HomeFooter";
import RoadmapNav from "@/app/roadmap/[slug]/components/RoadmapNav";

const nodeTypes: NodeTypes = {
  topic: RoadmapNode,
  subtopic: RoadmapNode,
  title: RoadmapNode,
  paragraph: RoadmapNode,
  button: RoadmapNode,
  section: RoadmapNode,
  label: RoadmapNode,
  vertical: RoadmapNode,
  horizontal: RoadmapNode,
  legend: RoadmapNode,
  linksgroup: RoadmapNode,
};

const VIEW_ZOOM = 1;
const NODE_W = 220;
const NODE_H = 44;
const TOPIC_X = 0;
const SUB_LEFT_X = -330;
const SUB_RIGHT_X = 330;
const GAP_BETWEEN_GROUPS = 24;
const GAP_SUB_Y = 12;

function relayout(rawNodes: any[]): { nodes: Node[]; edges: any[] } {
  const rawTopics = rawNodes
    .filter((n) => n.type === "topic")
    .sort((a, b) => (a.position?.y ?? 0) - (b.position?.y ?? 0));
  const rawSubtopics = rawNodes.filter((n) => n.type === "subtopic");
  const rawTitle = rawNodes.find((n) => n.type === "title");

  const groups = new Map<string, any[]>();
  for (const topic of rawTopics) groups.set(topic.id, []);
  for (const sub of rawSubtopics) {
    let closest = rawTopics[0];
    let minD = Infinity;
    for (const t of rawTopics) {
      const d = Math.abs((sub.position?.y ?? 0) - (t.position?.y ?? 0));
      if (d < minD) {
        minD = d;
        closest = t;
      }
    }
    if (closest) groups.get(closest.id)?.push(sub);
  }

  for (const [tid, subs] of groups) {
    const topic = rawTopics.find((t) => t.id === tid);
    if (!topic) continue;
    const topicX = topic.position?.x ?? 0;
    subs.sort((a, b) => {
      const aLeft = (a.position?.x ?? 0) < topicX;
      const bLeft = (b.position?.x ?? 0) < topicX;
      if (aLeft !== bLeft) return aLeft ? -1 : 1;
      return (a.position?.y ?? 0) - (b.position?.y ?? 0);
    });
  }

  const nodes: Node[] = [];
  const edges: any[] = [];
  let idx = 0;
  const eid = () => `ae-${idx++}`;
  const solid = { stroke: "#2B78E4", strokeWidth: 2 };
  const dashed = {
    stroke: "#2B78E4",
    strokeWidth: 1.5,
    strokeDasharray: "6 5",
  };
  const cleanData = (n: any, fontSize = 12) => ({
    ...n.data,
    legend: undefined,
    style: { ...(n.data?.style ?? {}), fontSize },
  });

  let curY = 0;
  let titleNodeId: string | null = null;
  if (rawTitle) {
    titleNodeId = rawTitle.id;
    nodes.push({
      id: rawTitle.id,
      type: "title",
      position: { x: TOPIC_X - NODE_W / 2, y: curY },
      width: NODE_W,
      height: NODE_H,
      data: cleanData(rawTitle, 17),
      draggable: false,
      selectable: true,
    });
    curY += NODE_H + 24;
  }

  const topicNodeIds: string[] = [];
  for (const topic of rawTopics) {
    const subs = groups.get(topic.id) ?? [];
    const leftSubs = subs.filter(
      (s) => (s.position?.x ?? 0) < (topic.position?.x ?? 0),
    );
    const rightSubs = subs.filter(
      (s) => (s.position?.x ?? 0) >= (topic.position?.x ?? 0),
    );
    const groupCount = Math.max(leftSubs.length, rightSubs.length, 1);
    const groupH = groupCount * NODE_H + (groupCount - 1) * GAP_SUB_Y;
    const topicY = curY + (groupH - NODE_H) / 2;

    nodes.push({
      id: topic.id,
      type: "topic",
      position: { x: TOPIC_X - NODE_W / 2, y: topicY },
      width: NODE_W,
      height: NODE_H,
      data: cleanData(topic, 14),
      draggable: false,
      selectable: true,
    });
    topicNodeIds.push(topic.id);

    let leftY = curY;
    for (const sub of leftSubs) {
      nodes.push({
        id: sub.id,
        type: "subtopic",
        position: { x: SUB_LEFT_X - NODE_W / 2, y: leftY },
        width: NODE_W,
        height: NODE_H,
        data: cleanData(sub, 14),
        draggable: false,
        selectable: true,
      });
      edges.push({
        id: eid(),
        source: topic.id,
        target: sub.id,
        sourceHandle: "y2",
        targetHandle: "z1",
        type: "step",
        animated: false,
        style: dashed,
      });
      leftY += NODE_H + GAP_SUB_Y;
    }

    let rightY = curY;
    for (const sub of rightSubs) {
      nodes.push({
        id: sub.id,
        type: "subtopic",
        position: { x: SUB_RIGHT_X - NODE_W / 2, y: rightY },
        width: NODE_W,
        height: NODE_H,
        data: cleanData(sub, 14),
        draggable: false,
        selectable: true,
      });
      edges.push({
        id: eid(),
        source: topic.id,
        target: sub.id,
        sourceHandle: "z2",
        targetHandle: "y1",
        type: "step",
        animated: false,
        style: dashed,
      });
      rightY += NODE_H + GAP_SUB_Y;
    }

    curY += groupH + GAP_BETWEEN_GROUPS;
  }

  if (titleNodeId && topicNodeIds[0]) {
    edges.push({
      id: eid(),
      source: titleNodeId,
      target: topicNodeIds[0],
      sourceHandle: "x2",
      targetHandle: "w1",
      type: "straight",
      animated: false,
      style: solid,
    });
  }
  for (let i = 0; i < topicNodeIds.length - 1; i++) {
    edges.push({
      id: eid(),
      source: topicNodeIds[i],
      target: topicNodeIds[i + 1],
      sourceHandle: "x2",
      targetHandle: "w1",
      type: "straight",
      animated: false,
      style: solid,
    });
  }

  return { nodes, edges };
}

const NAV_TABS = [
  { id: "generate", label: "Generate", icon: Sparkles },
  { id: "learning", label: "My Learning", icon: BookMarked },
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "community", label: "Community", icon: Compass },
] as const;

function AiNavStrip({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <div className="bg-white border-b" style={{ borderColor: "#EDE0FB" }}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex gap-1 overflow-x-auto py-2">
          {NAV_TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onNavigate(t.id)}
                className="flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-all hover:bg-[#F5F0FF]"
                style={{ color: "#4B5563" }}
              >
                <Icon size={14} style={{ color: "#3A0CA3" }} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function AiRoadmapPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { accessToken } = useSelector((s: RootState) => s.tokens);
  const isAuthenticated = !!accessToken;

  const { data: content, isLoading } = useGetContentQuery(id, { skip: !id });

  const containerRef = useRef<HTMLDivElement>(null);
  const rfRef = useRef<ReactFlowInstance | null>(null);
  const didCenter = useRef(false);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  useEffect(() => {
    if (!content?.content) return;
    const { nodes: rawNodes = [] } = content.content as any;
    const { nodes: laid, edges: laid_e } = relayout(rawNodes);
    setNodes(laid);
    setEdges(laid_e);
    didCenter.current = false;
  }, [content]);

  const bounds = useMemo(
    () => (nodes.length ? getNodesBounds(nodes) : null),
    [nodes],
  );

  const canvasHeight = bounds
    ? Math.max(500, bounds.height * VIEW_ZOOM + 80)
    : undefined;

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

  const handleNodeClick: NodeMouseHandler = useCallback((_e, node) => {
    setSelectedNode(node);
  }, []);

  // Navigate to /ai with the selected tab
  const handleNavTab = (tab: string) => {
    router.push(`/ai?tab=${tab}`);
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ background: "#FAFAFA" }}
      >
        <section className="relative overflow-hidden bg-[#151c31]/95">
          <RoadmapNav />
          <div className="relative max-w-4xl mx-auto px-6 pt-28 pb-14 text-center">
            <span
              className="inline-flex items-center text-[12px] font-semibold px-3 py-1 rounded-full mb-5"
              style={{
                background: "rgba(255,255,255,0.14)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              AI Roadmap
            </span>
            <div
              className="h-12 w-80 max-w-full mx-auto rounded-lg animate-pulse mb-4"
              style={{ background: "rgba(255,255,255,0.15)" }}
            />
          </div>
        </section>
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

  if (!content) {
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
      <section className="relative overflow-hidden bg-[#151c31]/95 font-family-outfit">
        <RoadmapNav />
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ background: "#A78BFA" }}
        />
        <div className="relative mx-auto max-w-5xl px-6 pt-28 pb-14 sm:pt-32 sm:pb-20">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-1.5 text-[13px] font-medium transition-colors hover:text-white"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            <ArrowLeft size={14} />
            Back
          </button>
          <span
            className="inline-flex items-center text-[12px] font-semibold px-3 py-1 rounded-full mb-5"
            style={{
              background: "rgba(255,255,255,0.14)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          >
            AI Roadmap
          </span>
          <h1 className="mt-3 text-[32px] font-extrabold leading-tight tracking-tight text-white sm:text-[44px]">
            {content.title}
          </h1>
          <p
            className="mt-3 max-w-2xl text-[15px] leading-relaxed sm:text-[17px]"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            {content.description}
          </p>
        </div>
      </section>

      <AiNavStrip onNavigate={handleNavTab} />

      <div className="w-full flex flex-col bg-[#FAFAFA]">
        <div className="flex-1">
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
                      [bounds.x - 60, bounds.y - 60],
                      [
                        bounds.x + bounds.width + 60,
                        bounds.y + bounds.height + 60,
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
        </div>

        {selectedNode && (
          <div
            className="fixed inset-0 bg-black/30 z-5 transition-opacity"
            onClick={() => setSelectedNode(null)}
            aria-label="Close sidebar"
          />
        )}
        {selectedNode && (
          <NodeSidebar
            slug={id}
            node={selectedNode}
            currentStatus={null}
            isAuthenticated={isAuthenticated}
            onClose={() => setSelectedNode(null)}
            onSetStatus={() =>
              toast("Sign in to track progress on official roadmaps")
            }
            onUnset={() => {}}
            onAuthRequired={() => {}}
          />
        )}
      </div>

      <HomeFooter />
    </>
  );
}
