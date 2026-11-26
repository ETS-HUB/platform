"use client";

import { Fragment, createContext, memo, useContext } from "react";
import {
  BaseEdge,
  EdgeProps,
  EdgeTypes,
  Handle,
  NodeProps,
  NodeResizer,
  Position,
  getBezierPath,
  getStraightPath,
} from "@xyflow/react";

/**
 * One component renders every node type in your roadmap JSON:
 * topic, subtopic, paragraph, title, section, label, button,
 * vertical, horizontal, legend, linksgroup.
 *
 * The editor wraps its canvas in <EditModeContext.Provider value={true}>,
 * which turns on resize handles and visible connection handles.
 * The public viewer does nothing, so it renders read-only.
 *
 * Handle IDs follow your JSON: w1/w2 = top, x1/x2 = bottom,
 * y1/y2 = left, z1/z2 = right (1 = target, 2 = source).
 */

export const EditModeContext = createContext(false);

const INK = "#0F172A";
const ACCENT = "#2373F4";
const TOPIC_BG = "#65D0F4";
const SUBTOPIC_BG = "#F2F7A0";
const FONT =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

type Status = "pending" | "learning" | "done" | "skipped";

const STATUS_STYLES: Record<Status, React.CSSProperties> = {
  pending: {},
  learning: { background: "#FEF3C7", borderColor: "#F59E0B" },
  done: {
    background: "#D1FAE5",
    borderColor: "#10B981",
    color: "#065F46",
  },
  skipped: {
    background: "#F3F4F6",
    borderColor: "#9CA3AF",
    color: "#6B7280",
    opacity: 0.7,
  },
};

const SIDES = [
  { pos: Position.Top, target: "w1", source: "w2" },
  { pos: Position.Bottom, target: "x1", source: "x2" },
  { pos: Position.Left, target: "y1", source: "y2" },
  { pos: Position.Right, target: "z1", source: "z2" },
];

const HIDDEN: React.CSSProperties = { opacity: 0, pointerEvents: "none" };

function Handles({ editing }: { editing: boolean }) {
  const style = editing ? undefined : HIDDEN;
  return (
    <>
      {SIDES.map((s) => (
        <Fragment key={s.pos}>
          <Handle
            id={s.target}
            type="target"
            position={s.pos}
            className="rm-handle"
            style={style}
          />
          <Handle
            id={s.source}
            type="source"
            position={s.pos}
            className="rm-handle"
            style={style}
          />
        </Fragment>
      ))}
    </>
  );
}

const RoadmapNode = ({ data, type, selected }: NodeProps) => {
  const editing = useContext(EditModeContext);
  const d = (data ?? {}) as any;
  const style = (d.style ?? {}) as Record<string, any>;
  const label = (d.label as string) ?? "";
  const status = ((d.status as Status) || "pending") as Status;

  const fontSize = style.fontSize || 17;
  const textAlign = (style.textAlign || "center") as
    | "left"
    | "center"
    | "right";
  const justify =
    textAlign === "left"
      ? "flex-start"
      : textAlign === "right"
        ? "flex-end"
        : "center";
  const ring = selected ? `0 0 0 3px ${ACCENT}, ` : "";
  const cls = `rm-node${selected ? " rm-sel" : ""}`;

  const resizer = (minW = 60, minH = 30) => (
    <NodeResizer
      isVisible={editing && !!selected}
      minWidth={minW}
      minHeight={minH}
      color={ACCENT}
    />
  );

  // ── Decorative lines (SVG so the real dash pattern is used) ────────────
  if (type === "vertical" || type === "horizontal") {
    const isV = type === "vertical";
    const dash =
      style.strokeDasharray && style.strokeDasharray !== "0"
        ? String(style.strokeDasharray)
        : undefined;
    return (
      <>
        {resizer(10, 10)}
        <div
          className={cls}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            outline: editing && selected ? `1px dashed ${ACCENT}` : undefined,
          }}
        >
          <svg
            width="100%"
            height="100%"
            style={{ position: "absolute", inset: 0, overflow: "visible" }}
          >
            <line
              x1={isV ? "50%" : 0}
              y1={isV ? 0 : "50%"}
              x2={isV ? "50%" : "100%"}
              y2={isV ? "100%" : "50%"}
              stroke={style.stroke || ACCENT}
              strokeWidth={Number(style.strokeWidth) || 3.5}
              strokeDasharray={dash}
              strokeLinecap={style.strokeLinecap || "round"}
            />
          </svg>
          <Handles editing={editing} />
        </div>
      </>
    );
  }

  const base: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: justify,
    textAlign,
    fontFamily: FONT,
    lineHeight: 1.2,
    letterSpacing: "-0.01em",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  };

  // ── Legend box: list of colour swatches + labels ───────────────────────
  if (type === "legend") {
    const items: any[] = d.legends ?? [];
    return (
      <>
        {resizer(140, 60)}
        <div
          className={cls}
          style={{
            ...base,
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            gap: 8,
            padding: 12,
            background: "#fff",
            border: `2px solid ${INK}`,
            borderRadius: 8,
            fontSize: 14,
          }}
        >
          {items.map((it) => (
            <div
              key={it.id}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  background: it.color,
                  border: `1px solid ${INK}`,
                  flexShrink: 0,
                }}
              />
              {it.label}
            </div>
          ))}
          <Handles editing={editing} />
        </div>
      </>
    );
  }

  if (type === "linksgroup") {
    const links: any[] = d.links ?? [];
    return (
      <>
        {resizer(160, 80)}
        <div
          className={cls}
          style={{
            ...base,
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            gap: 6,
            padding: 14,
            background: "#fff",
            border: `2px solid #3A0CA3`,
            borderRadius: 8,
            fontSize: 14,
          }}
        >
          <strong style={{ fontSize: 15, color: "#3A0CA3" }}>{label}</strong>
          {links.map((l) =>
            editing ? (
              <span key={l.id} style={{ color: "#3A0CA3" }}>
                {l.label}
              </span>
            ) : (
              <a
                key={l.id}
                href={l.url || l.href || "#"}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#3A0CA3", textDecoration: "underline" }}
              >
                {l.label}
              </a>
            ),
          )}
          <Handles editing={editing} />
        </div>
      </>
    );
  }

  const customBg = style.backgroundColor;
  const customBorder = style.borderColor;
  const textColor = style.color;

  const getTypeStyles = (): React.CSSProperties => {
    switch (type) {
      case "topic":
        return {
          ...base,
          padding: "6px 14px",
          background: customBg || TOPIC_BG,
          border: `2px solid ${"#000000"}`,
          borderRadius: 8,
          fontWeight: 700,
          fontSize,
          color: "#000000",
          cursor: "pointer",
        };
      case "subtopic":
        return {
          ...base,
          padding: "6px 12px",
          background: customBg || SUBTOPIC_BG,
          border: `2px solid ${"#000000"}`,
          borderRadius: 8,
          fontWeight: 700,
          fontSize,
          color: "#000000",
          cursor: "pointer",
        };
      case "paragraph":
        return {
          ...base,
          alignItems: "flex-start",
          padding: style.padding ?? "8px 12px",
          background: customBg || "transparent",
          border:
            customBg || customBorder
              ? `1.5px solid ${customBorder || "#E5E7EB"}`
              : "none",
          borderRadius: 8,
          fontWeight: 400,
          fontSize,
          color: textColor || "#475569",
          lineHeight: 1.5,
          boxShadow: selected ? `0 0 0 3px ${ACCENT}` : "none",
        };
      case "title":
        return {
          ...base,
          background: "transparent",
          border: "none",
          fontWeight: 700,
          fontSize,
          color: "#000000",
          boxShadow: selected ? `0 0 0 3px ${ACCENT}` : "none",
        };
      case "button":
        return {
          ...base,
          justifyContent: "center",
          padding: "8px 16px",
          background: "#2373F4",
          border: `2px solid ${"#000000"}`,
          borderRadius: 8,
          fontWeight: 700,
          fontSize,
          color: d.color || "#FFFFFF",
          cursor: "pointer",
        };
      case "section":
        return {
          ...base,
          padding: "8px 14px",
          background: customBg || "#FEFCFF",
          border: customBorder
            ? `2px solid ${customBorder}`
            : "2px dashed #7408B3",
          borderRadius: 10,
          fontWeight: 600,
          fontSize,
          color: "#000000",
          boxShadow: selected ? `0 0 0 3px ${ACCENT}` : "none",
        };
      case "label":
        return {
          ...base,
          justifyContent: "center",
          padding: "4px 10px",
          background: "transparent",
          fontWeight: 700,
          fontSize,
          color: "#000000",
          boxShadow: selected ? `0 0 0 3px ${ACCENT}` : "none",
          borderRadius: 6,
        };
      default:
        return {
          ...base,
          padding: "6px 14px",
          background: customBg || "#FFFFFF",
          border: `2px solid ${customBorder || "#3A0CA3"}`,
          borderRadius: 8,
          fontWeight: 600,
          fontSize,
          color: textColor || INK,
        };
    }
  };

  const interactive = ["topic", "subtopic", "button"].includes(type || "");
  const asLink = (type === "button" || type === "label") && d.href && !editing;

  const legend = d.legend;
  const legendSide = legend?.position === "right-center" ? "right" : "left";

  return (
    <>
      {resizer(
        type === "title" || type === "label" ? 40 : 80,
        type === "section" ? 40 : 28,
      )}
      <div
        className={`${cls}${interactive ? " hover:brightness-95" : ""}`}
        style={{
          ...getTypeStyles(),
          ...(interactive ? STATUS_STYLES[status] : {}),
        }}
      >
        {asLink ? (
          <a
            href={d.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {label}
          </a>
        ) : (
          label
        )}
        {legend?.color && (
          <span
            style={{
              position: "absolute",
              top: "50%",
              [legendSide]: -8,
              transform: "translateY(-50%)",
              width: 16,
              height: 16,
              borderRadius: 999,
              background: legend.color,
              border: "2px solid #fff",
              boxShadow: `0 0 0 1px ${INK}`,
            }}
          />
        )}
        <Handles editing={editing} />
      </div>
    </>
  );
};

export default memo(RoadmapNode);

/**
 * Default edge: when two cards are almost aligned (within TOLERANCE px),
 * draw a perfectly straight line instead of a slightly slanted curve.
 * Otherwise draw the normal curve. Pass `edgeTypes` to <ReactFlow>.
 */
const TOLERANCE = 24;

function AlignedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
}: EdgeProps) {
  const vertical =
    sourcePosition === Position.Top || sourcePosition === Position.Bottom;
  const offset = vertical
    ? Math.abs(targetX - sourceX)
    : Math.abs(targetY - sourceY);

  let path: string;
  if (offset <= TOLERANCE) {
    [path] = getStraightPath(
      vertical
        ? { sourceX, sourceY, targetX: sourceX, targetY }
        : { sourceX, sourceY, targetX, targetY: sourceY },
    );
  } else {
    [path] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
  }
  return <BaseEdge id={id} path={path} style={style} markerEnd={markerEnd} />;
}

export const edgeTypes: EdgeTypes = { default: AlignedEdge };
