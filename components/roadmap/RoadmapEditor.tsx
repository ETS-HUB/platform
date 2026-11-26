"use client";

import { useCallback, useRef, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  Panel,
  ConnectionMode,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Plus,
  Save,
  Trash2,
  Copy,
  Download,
  Upload,
  X,
  ArrowLeft,
  Maximize2,
} from "lucide-react";
import toast from "react-hot-toast";

import RoadmapNode, {
  EditModeContext,
  edgeTypes,
} from "@/components/roadmap/public/RoadmapNode";

const nodeTypes: NodeTypes = {
  topic: RoadmapNode,
  subtopic: RoadmapNode,
  paragraph: RoadmapNode,
  title: RoadmapNode,
  section: RoadmapNode,
  label: RoadmapNode,
  button: RoadmapNode,
  vertical: RoadmapNode,
  horizontal: RoadmapNode,
  legend: RoadmapNode,
  linksgroup: RoadmapNode,
};

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID().replace(/-/g, "").slice(0, 21)
    : Math.random().toString(36).slice(2, 23);

const LINE = {
  strokeDasharray: "0.8 8",
  strokeLinecap: "round",
  strokeWidth: 3.5,
  stroke: "#2B78E4",
};

const NODE_DEFAULTS: Record<
  string,
  { name: string; w: number; h: number; z: number; data: any }
> = {
  topic: {
    name: "Topic",
    w: 240,
    h: 49,
    z: 10,
    data: { label: "New topic", style: { fontSize: 17, textAlign: "center" } },
  },
  subtopic: {
    name: "Subtopic",
    w: 240,
    h: 49,
    z: 10,
    data: {
      label: "New subtopic",
      style: { fontSize: 17, textAlign: "center" },
    },
  },
  paragraph: {
    name: "Paragraph",
    w: 300,
    h: 80,
    z: 10,
    data: {
      label: "Write something here",
      style: { fontSize: 15, textAlign: "left" },
    },
  },
  title: {
    name: "Title",
    w: 300,
    h: 50,
    z: 10,
    data: {
      label: "Roadmap title",
      style: { fontSize: 28, textAlign: "center" },
    },
  },
  section: {
    name: "Section box",
    w: 220,
    h: 140,
    z: -1,
    data: {
      label: "",
      style: { backgroundColor: "#ffffff", borderColor: "#000000" },
    },
  },
  label: {
    name: "Label",
    w: 160,
    h: 40,
    z: 10,
    data: {
      label: "Label",
      color: "#000000",
      href: "",
      style: { fontSize: 18 },
    },
  },
  button: {
    name: "Button",
    w: 150,
    h: 42,
    z: 10,
    data: {
      label: "Open",
      href: "",
      color: "#FFFFFF",
      backgroundColor: "#4136D6",
      borderColor: "#4136D6",
      style: { fontSize: 16 },
    },
  },
  vertical: {
    name: "Vertical line",
    w: 20,
    h: 100,
    z: 10,
    data: { label: "vertical node", style: { ...LINE } },
  },
  horizontal: {
    name: "Horizontal line",
    w: 120,
    h: 20,
    z: 10,
    data: { label: "horizontal node", style: { ...LINE } },
  },
  legend: {
    name: "Legend",
    w: 260,
    h: 110,
    z: 10,
    data: {
      label: "",
      legends: [
        { id: "l1", label: "Recommended", color: "#874efe" },
        { id: "l2", label: "Alternative", color: "#4f7a28" },
      ],
    },
  },
  linksgroup: {
    name: "Links group",
    w: 260,
    h: 150,
    z: 10,
    data: {
      label: "Related",
      links: [{ id: "k1", label: "Link one", url: "https://" }],
    },
  },
};

const EDGE_STYLE = {
  stroke: "#2b78e4",
  strokeWidth: 3.5,
  strokeLinecap: "round" as const,
  strokeDasharray: "0",
};
const DASH = "0.8 8";

const EDITOR_CSS = `
.rm-editing .rm-handle{width:12px;height:12px;background:#2B78E4;border:2px solid #fff;opacity:0;transition:opacity .12s}
.rm-editing .rm-node:hover .rm-handle,.rm-editing .rm-node.rm-sel .rm-handle{opacity:1}
.rm-editing .react-flow__edge.selected .react-flow__edge-path{stroke-width:6}
`;

const inputCls =
  "w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm bg-white";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-600 block mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

const toHex = (v: any, fb: string) =>
  typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v) ? v : fb;

function ColorField({
  label,
  value,
  fallback,
  onChange,
  onReset,
}: {
  label: string;
  value?: string;
  fallback: string;
  onChange: (v: string) => void;
  onReset?: () => void;
}) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={toHex(value, fallback)}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-12 rounded border border-gray-200 bg-white"
        />
        <span className="text-xs text-gray-500">{value ?? "default"}</span>
        {value && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-gray-400 hover:text-gray-700 ml-auto"
          >
            reset
          </button>
        )}
      </div>
    </Field>
  );
}

function NumField({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: number | undefined;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <Field label={label}>
      <input
        type="number"
        step={step}
        value={value ?? ""}
        onChange={(e) => onChange(Number(e.target.value))}
        className={inputCls}
      />
    </Field>
  );
}

interface Meta {
  title: { card: string; page: string };
  slug: string;
  description: string;
}

interface RoadmapEditorProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  initialMeta?: Partial<Meta>;
  onSave?: (nodes: Node[], edges: Edge[], meta: Meta) => Promise<void>;
  onExit?: () => void;
}

const normalize = (n: Node): Node =>
  n.type === "section" && !n.zIndex ? { ...n, zIndex: -1 } : n;

const cleanNode = (n: Node) => {
  const { selected, dragging, resizing, measured, positionAbsolute, ...rest } =
    n as any;
  return rest;
};
const cleanEdge = (e: Edge) => {
  const { selected, ...rest } = e as any;
  return rest;
};

function EditorInner({
  initialNodes = [],
  initialEdges = [],
  initialMeta,
  onSave,
  onExit,
}: RoadmapEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(
    initialNodes.map(normalize),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
  const [sel, setSel] = useState<{ kind: "node" | "edge"; id: string } | null>(
    null,
  );
  const [snap, setSnap] = useState(true);
  const [saving, setSaving] = useState(false);
  const [meta, setMeta] = useState<Meta>({
    title: {
      card: initialMeta?.title?.card ?? "",
      page: initialMeta?.title?.page ?? "",
    },
    slug: initialMeta?.slug ?? "",
    description: initialMeta?.description ?? "",
  });

  const rootRef = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const rf = useReactFlow();

  const node =
    sel?.kind === "node" ? nodes.find((n) => n.id === sel.id) : undefined;
  const edge =
    sel?.kind === "edge" ? edges.find((e) => e.id === sel.id) : undefined;
  const dt = (node?.data ?? {}) as any;
  const st = (dt.style ?? {}) as Record<string, any>;

  const patchNode = (id: string, fn: (n: Node) => Node) =>
    setNodes((nds) => nds.map((n) => (n.id === id ? fn(n) : n)));
  const setData = (id: string, patch: Record<string, any>) =>
    patchNode(id, (n) => ({ ...n, data: { ...n.data, ...patch } }));
  const setStyle = (id: string, patch: Record<string, any>) =>
    patchNode(id, (n) => ({
      ...n,
      data: {
        ...n.data,
        style: { ...((n.data as any).style ?? {}), ...patch },
      },
    }));
  const resetStyleKey = (id: string, key: string) =>
    patchNode(id, (n) => {
      const style = { ...((n.data as any).style ?? {}) };
      delete style[key];
      return { ...n, data: { ...n.data, style } };
    });
  const resetDataKey = (id: string, key: string) =>
    patchNode(id, (n) => {
      const data = { ...n.data } as any;
      delete data[key];
      return { ...n, data };
    });
  const setSize = (id: string, patch: { width?: number; height?: number }) =>
    patchNode(id, (n) => {
      const style = { ...(n.style ?? {}) } as any;
      if (patch.width != null) delete style.width;
      if (patch.height != null) delete style.height;
      return { ...n, ...patch, measured: undefined, style };
    });

  const addNode = (type: string) => {
    const d = NODE_DEFAULTS[type];
    const rect = wrapper.current?.getBoundingClientRect();
    const p = rf.screenToFlowPosition({
      x: (rect?.left ?? 0) + (rect?.width ?? 600) / 2,
      y: (rect?.top ?? 0) + (rect?.height ?? 400) / 2,
    });
    const jitter = (nodes.length % 6) * 14;
    const id = uid();
    const n: Node = {
      id,
      type,
      position: {
        x: Math.round(p.x - d.w / 2 + jitter),
        y: Math.round(p.y - d.h / 2 + jitter),
      },
      width: d.w,
      height: d.h,
      zIndex: d.z,
      data: JSON.parse(JSON.stringify(d.data)),
      selected: true,
    };
    setNodes((nds) => [...nds.map((x) => ({ ...x, selected: false })), n]);
    setSel({ kind: "node", id });
  };

  const duplicateNode = () => {
    if (!node) return;
    const id = uid();
    const copy: Node = {
      ...(JSON.parse(JSON.stringify(cleanNode(node))) as Node),
      id,
      position: { x: node.position.x + 30, y: node.position.y + 30 },
      selected: true,
    };
    setNodes((nds) => [...nds.map((x) => ({ ...x, selected: false })), copy]);
    setSel({ kind: "node", id });
  };

  const deleteSelected = () => {
    if (node) {
      setNodes((nds) => nds.filter((n) => n.id !== node.id));
      setEdges((eds) =>
        eds.filter((e) => e.source !== node.id && e.target !== node.id),
      );
      toast.success("Node deleted");
    } else if (edge) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      toast.success("Connection deleted");
    }
    setSel(null);
  };

  const onConnect = useCallback(
    (c: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...c,
            id: uid(),
            style: { ...EDGE_STYLE },
            data: { edgeStyle: "solid" },
          },
          eds,
        ),
      ),
    [setEdges],
  );
  const patchEdge = (id: string, fn: (e: Edge) => Edge) =>
    setEdges((eds) => eds.map((e) => (e.id === id ? fn(e) : e)));

  const buildDoc = () => ({
    ...meta,
    nodes: nodes.map(cleanNode),
    edges: edges.map(cleanEdge),
  });

  const handleSave = async () => {
    if (!onSave) return;
    setSaving(true);
    try {
      await onSave(nodes.map(cleanNode), edges.map(cleanEdge), meta);
      toast.success("Roadmap saved");
    } catch {
      toast.error("Failed to save roadmap");
    } finally {
      setSaving(false);
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(buildDoc(), null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${meta.slug || "roadmap"}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importJson = async (file: File) => {
    try {
      const doc = JSON.parse(await file.text());
      if (!Array.isArray(doc.nodes)) throw new Error("no nodes");
      setNodes(
        doc.nodes.map((n: Node) => normalize({ ...n, selected: false })),
      );
      setEdges((doc.edges ?? []).map((e: Edge) => ({ ...e, selected: false })));
      setMeta({
        title: { card: doc.title?.card ?? "", page: doc.title?.page ?? "" },
        slug: doc.slug ?? "",
        description: doc.description ?? "",
      });
      setSel(null);
      setTimeout(() => rf.fitView({ padding: 0.1 }), 50);
      toast.success("Imported");
    } catch {
      toast.error("That file isn't a valid roadmap JSON");
    }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else rootRef.current?.requestFullscreen();
  };

  const type = node?.type ?? "";
  const isLine = type === "vertical" || type === "horizontal";
  const hasLabel = [
    "topic",
    "subtopic",
    "paragraph",
    "title",
    "section",
    "label",
    "button",
    "linksgroup",
  ].includes(type);
  const hasFont = [
    "topic",
    "subtopic",
    "paragraph",
    "title",
    "section",
    "label",
    "button",
  ].includes(type);
  const hasAlign = ["topic", "subtopic", "paragraph", "title"].includes(type);
  const legendOptions: any[] = nodes
    .filter((n) => n.type === "legend")
    .flatMap((n) => ((n.data as any).legends ?? []) as any[]);
  const dashed = (st.strokeDasharray ?? "0") !== "0";

  return (
    <div ref={rootRef} className="fixed inset-0 z-50 flex bg-white rm-editing">
      <style>{EDITOR_CSS}</style>

      <div className="w-64 bg-white border-r p-4 flex flex-col gap-3 overflow-y-auto">
        {onExit && (
          <button
            type="button"
            onClick={onExit}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800"
          >
            <ArrowLeft size={14} /> Back
          </button>
        )}
        <h3 className="font-semibold text-sm text-gray-700">Roadmap details</h3>
        <Field label="Page title">
          <input
            className={inputCls}
            value={meta.title.page}
            onChange={(e) =>
              setMeta({
                ...meta,
                title: { ...meta.title, page: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Card title">
          <input
            className={inputCls}
            value={meta.title.card}
            onChange={(e) =>
              setMeta({
                ...meta,
                title: { ...meta.title, card: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Slug">
          <input
            className={inputCls}
            value={meta.slug}
            onChange={(e) => setMeta({ ...meta, slug: e.target.value })}
          />
        </Field>
        <Field label="Description">
          <textarea
            rows={3}
            className={inputCls}
            value={meta.description}
            onChange={(e) => setMeta({ ...meta, description: e.target.value })}
          />
        </Field>

        <h3 className="font-semibold text-sm text-gray-700 mt-2">Add</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(NODE_DEFAULTS).map(([t, d]) => (
            <button
              key={t}
              type="button"
              onClick={() => addNode(t)}
              className="flex items-center gap-1.5 px-2.5 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-xs font-medium text-left"
            >
              <Plus size={13} />
              {d.name}
            </button>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t flex flex-col gap-2">
          <label className="flex items-center gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={snap}
              onChange={(e) => setSnap(e.target.checked)}
            />
            Snap to grid
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={exportJson}
              className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-medium"
            >
              <Download size={14} /> Export
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-medium"
            >
              <Upload size={14} /> Import
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-medium"
            >
              <Maximize2 size={14} /> Full
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) importJson(f);
                e.target.value = "";
              }}
            />
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !onSave}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Roadmap"}
          </button>
        </div>
      </div>

      <div className="flex-1 relative min-w-0" ref={wrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(_, n) => setSel({ kind: "node", id: n.id })}
          onEdgeClick={(_, e) => setSel({ kind: "edge", id: e.id })}
          onPaneClick={() => setSel(null)}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionMode={ConnectionMode.Loose}
          snapToGrid={snap}
          snapGrid={[10, 10]}
          deleteKeyCode={["Backspace", "Delete"]}
          minZoom={0.2}
          maxZoom={2}
          fitView
          className="bg-[#FAFAFA]"
        >
          <Background gap={24} color="#EDE0FB" />
          <Controls />
          <MiniMap pannable zoomable />
          <Panel
            position="top-center"
            className="bg-white px-4 py-2 rounded-lg shadow-sm"
          >
            <p className="text-xs text-gray-600">
              Select to edit • Hover a node and drag from a dot to connect •
              Drag corners to resize • Delete removes
            </p>
          </Panel>
        </ReactFlow>
      </div>

      {(node || edge) && (
        <div className="w-80 bg-white border-l p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-gray-700">
              {node ? `Edit ${type}` : "Edit connection"}
            </h3>
            <button type="button" onClick={() => setSel(null)}>
              <X size={16} className="text-gray-400" />
            </button>
          </div>

          <div className="space-y-3">
            {node && (
              <>
                {hasLabel && (
                  <Field label={type === "linksgroup" ? "Heading" : "Text"}>
                    <textarea
                      rows={type === "paragraph" ? 4 : 2}
                      className={inputCls}
                      value={dt.label ?? ""}
                      onChange={(e) =>
                        setData(node.id, { label: e.target.value })
                      }
                    />
                  </Field>
                )}

                {hasFont && (
                  <NumField
                    label="Font size"
                    value={st.fontSize ?? 17}
                    onChange={(v) => setStyle(node.id, { fontSize: v })}
                  />
                )}

                {hasAlign && (
                  <Field label="Text align">
                    <div className="flex gap-1">
                      {["left", "center", "right"].map((a) => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => setStyle(node.id, { textAlign: a })}
                          className={`flex-1 py-1.5 rounded-lg border text-xs ${(st.textAlign ?? "center") === a ? "bg-indigo-50 border-indigo-300 text-indigo-700" : "border-gray-200"}`}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </Field>
                )}

                {["topic", "subtopic", "paragraph", "section"].includes(
                  type,
                ) && (
                  <>
                    <ColorField
                      label="Background"
                      value={st.backgroundColor}
                      fallback="#FFE599"
                      onChange={(v) =>
                        setStyle(node.id, { backgroundColor: v })
                      }
                      onReset={() => resetStyleKey(node.id, "backgroundColor")}
                    />
                    <ColorField
                      label="Border"
                      value={st.borderColor}
                      fallback="#0F172A"
                      onChange={(v) => setStyle(node.id, { borderColor: v })}
                      onReset={() => resetStyleKey(node.id, "borderColor")}
                    />
                  </>
                )}
                {["topic", "subtopic", "paragraph", "title"].includes(type) && (
                  <ColorField
                    label="Text color"
                    value={st.color}
                    fallback="#0F172A"
                    onChange={(v) => setStyle(node.id, { color: v })}
                    onReset={() => resetStyleKey(node.id, "color")}
                  />
                )}

                {type === "button" && (
                  <>
                    <Field label="Link (href)">
                      <input
                        className={inputCls}
                        value={dt.href ?? ""}
                        onChange={(e) =>
                          setData(node.id, { href: e.target.value })
                        }
                        placeholder="https://"
                      />
                    </Field>
                    <ColorField
                      label="Text color"
                      value={dt.color}
                      fallback="#FFFFFF"
                      onChange={(v) => setData(node.id, { color: v })}
                    />
                    <ColorField
                      label="Background"
                      value={dt.backgroundColor}
                      fallback="#4136D6"
                      onChange={(v) => setData(node.id, { backgroundColor: v })}
                    />
                    <ColorField
                      label="Border"
                      value={dt.borderColor}
                      fallback="#4136D6"
                      onChange={(v) => setData(node.id, { borderColor: v })}
                      onReset={() => resetDataKey(node.id, "borderColor")}
                    />
                  </>
                )}

                {type === "label" && (
                  <>
                    <Field label="Link (href)">
                      <input
                        className={inputCls}
                        value={dt.href ?? ""}
                        onChange={(e) =>
                          setData(node.id, { href: e.target.value })
                        }
                        placeholder="https://"
                      />
                    </Field>
                    <ColorField
                      label="Text color"
                      value={dt.color}
                      fallback="#000000"
                      onChange={(v) => setData(node.id, { color: v })}
                    />
                  </>
                )}

                {isLine && (
                  <>
                    <ColorField
                      label="Line color"
                      value={st.stroke}
                      fallback="#2B78E4"
                      onChange={(v) => setStyle(node.id, { stroke: v })}
                    />
                    <NumField
                      label="Thickness"
                      step={0.5}
                      value={st.strokeWidth ?? 3.5}
                      onChange={(v) => setStyle(node.id, { strokeWidth: v })}
                    />
                    <Field label="Line style">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setStyle(node.id, { strokeDasharray: "0" })
                          }
                          className={`flex-1 py-1.5 rounded-lg border text-xs ${!dashed ? "bg-indigo-50 border-indigo-300 text-indigo-700" : "border-gray-200"}`}
                        >
                          Solid
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setStyle(node.id, {
                              strokeDasharray: DASH,
                              strokeLinecap: "round",
                            })
                          }
                          className={`flex-1 py-1.5 rounded-lg border text-xs ${dashed ? "bg-indigo-50 border-indigo-300 text-indigo-700" : "border-gray-200"}`}
                        >
                          Dashed
                        </button>
                      </div>
                    </Field>
                  </>
                )}

                {(type === "topic" || type === "subtopic") &&
                  legendOptions.length > 0 && (
                    <Field label="Legend marker">
                      <select
                        className={inputCls}
                        value={dt.legend?.id ?? ""}
                        onChange={(e) => {
                          const o = legendOptions.find(
                            (l) => l.id === e.target.value,
                          );
                          if (o)
                            setData(node.id, {
                              legend: {
                                id: o.id,
                                label: o.label,
                                color: o.color,
                                position: "left-center",
                              },
                            });
                          else resetDataKey(node.id, "legend");
                        }}
                      >
                        <option value="">None</option>
                        {legendOptions.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                  )}

                {type === "legend" && (
                  <Field label="Legend items">
                    <div className="space-y-2">
                      {((dt.legends ?? []) as any[]).map((l, i) => (
                        <div key={l.id} className="flex items-center gap-2">
                          <input
                            type="color"
                            value={toHex(l.color, "#874efe")}
                            onChange={(e) =>
                              setData(node.id, {
                                legends: dt.legends.map((x: any, j: number) =>
                                  j === i ? { ...x, color: e.target.value } : x,
                                ),
                              })
                            }
                            className="h-8 w-10 rounded border border-gray-200"
                          />
                          <input
                            className={inputCls}
                            value={l.label}
                            onChange={(e) =>
                              setData(node.id, {
                                legends: dt.legends.map((x: any, j: number) =>
                                  j === i ? { ...x, label: e.target.value } : x,
                                ),
                              })
                            }
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setData(node.id, {
                                legends: dt.legends.filter(
                                  (_: any, j: number) => j !== i,
                                ),
                              })
                            }
                          >
                            <X size={14} className="text-gray-400" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          setData(node.id, {
                            legends: [
                              ...(dt.legends ?? []),
                              {
                                id: uid(),
                                label: "New item",
                                color: "#874efe",
                              },
                            ],
                          })
                        }
                        className="text-xs text-indigo-600"
                      >
                        + Add item
                      </button>
                    </div>
                  </Field>
                )}

                {type === "linksgroup" && (
                  <Field label="Links">
                    <div className="space-y-2">
                      {((dt.links ?? []) as any[]).map((l, i) => (
                        <div
                          key={l.id}
                          className="space-y-1 p-2 border border-gray-100 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              className={inputCls}
                              placeholder="Label"
                              value={l.label}
                              onChange={(e) =>
                                setData(node.id, {
                                  links: dt.links.map((x: any, j: number) =>
                                    j === i
                                      ? { ...x, label: e.target.value }
                                      : x,
                                  ),
                                })
                              }
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setData(node.id, {
                                  links: dt.links.filter(
                                    (_: any, j: number) => j !== i,
                                  ),
                                })
                              }
                            >
                              <X size={14} className="text-gray-400" />
                            </button>
                          </div>
                          <input
                            className={inputCls}
                            placeholder="https://"
                            value={l.url ?? ""}
                            onChange={(e) =>
                              setData(node.id, {
                                links: dt.links.map((x: any, j: number) =>
                                  j === i ? { ...x, url: e.target.value } : x,
                                ),
                              })
                            }
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          setData(node.id, {
                            links: [
                              ...(dt.links ?? []),
                              { id: uid(), label: "New link", url: "https://" },
                            ],
                          })
                        }
                        className="text-xs text-indigo-600"
                      >
                        + Add link
                      </button>
                    </div>
                  </Field>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <NumField
                    label="Width"
                    value={Math.round(
                      (node.width ?? node.measured?.width ?? 0) as number,
                    )}
                    onChange={(v) =>
                      setSize(node.id, { width: Math.max(10, v) })
                    }
                  />
                  <NumField
                    label="Height"
                    value={Math.round(
                      (node.height ?? node.measured?.height ?? 0) as number,
                    )}
                    onChange={(v) =>
                      setSize(node.id, { height: Math.max(10, v) })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-xs">
                    X: {Math.round(node.position.x)}
                  </div>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-xs">
                    Y: {Math.round(node.position.y)}
                  </div>
                </div>
                <NumField
                  label="Layer (z-index)"
                  value={node.zIndex ?? 0}
                  onChange={(v) =>
                    patchNode(node.id, (n) => ({ ...n, zIndex: v }))
                  }
                />

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={duplicateNode}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-medium"
                  >
                    <Copy size={14} /> Duplicate
                  </button>
                  <button
                    type="button"
                    onClick={deleteSelected}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </>
            )}

            {edge && (
              <>
                <Field label="Line style">
                  <div className="flex gap-1">
                    {(["solid", "dashed"] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() =>
                          patchEdge(edge.id, (e) => ({
                            ...e,
                            data: { ...e.data, edgeStyle: s },
                            style: {
                              ...e.style,
                              strokeDasharray: s === "dashed" ? DASH : "0",
                              strokeLinecap: "round",
                            },
                          }))
                        }
                        className={`flex-1 py-1.5 rounded-lg border text-xs capitalize ${((edge.data as any)?.edgeStyle ?? "solid") === s ? "bg-indigo-50 border-indigo-300 text-indigo-700" : "border-gray-200"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </Field>
                <ColorField
                  label="Color"
                  value={(edge.style as any)?.stroke}
                  fallback="#2b78e4"
                  onChange={(v) =>
                    patchEdge(edge.id, (e) => ({
                      ...e,
                      style: { ...e.style, stroke: v },
                    }))
                  }
                />
                <NumField
                  label="Thickness"
                  step={0.5}
                  value={(edge.style as any)?.strokeWidth ?? 3.5}
                  onChange={(v) =>
                    patchEdge(edge.id, (e) => ({
                      ...e,
                      style: { ...e.style, strokeWidth: v },
                    }))
                  }
                />
                <Field label="Shape">
                  <select
                    className={inputCls}
                    value={edge.type ?? "default"}
                    onChange={(e) =>
                      patchEdge(edge.id, (ed) => ({
                        ...ed,
                        type:
                          e.target.value === "default"
                            ? undefined
                            : e.target.value,
                      }))
                    }
                  >
                    <option value="default">Curved</option>
                    <option value="straight">Straight</option>
                    <option value="step">Right-angled</option>
                    <option value="smoothstep">Right-angled (rounded)</option>
                  </select>
                </Field>
                <button
                  type="button"
                  onClick={deleteSelected}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium"
                >
                  <Trash2 size={14} /> Delete connection
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RoadmapEditor(props: RoadmapEditorProps) {
  return (
    <ReactFlowProvider>
      <EditModeContext.Provider value={true}>
        <EditorInner {...props} />
      </EditModeContext.Provider>
    </ReactFlowProvider>
  );
}
