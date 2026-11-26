import { Node, Edge } from "@xyflow/react";

export interface RoadmapLegend {
  id: string;
  color: string;
  label: string;
  position: "left-center" | "right-center" | "top-center" | "bottom-center";
}

export interface RoadmapNodeStyle {
  fontSize?: number;
  justifyContent?: string;
  textAlign?: "left" | "center" | "right";
  borderColor?: string;
  backgroundColor?: string;
  color?: string;
  padding?: number;
  strokeDasharray?: string;
  strokeLinecap?: string;
  strokeWidth?: number;
  stroke?: string;
  width?: number | string;
  height?: number | string;
}

export interface RoadmapNodeData {
  label: string;
  style?: RoadmapNodeStyle;
  legend?: RoadmapLegend;
  href?: string;
  oldId?: string;
  links?: Array<{
    id: string;
    label: string;
    url: string;
    href?: string;
  }>;
  legends?: Array<{
    id: string;
    color: string;
    label: string;
  }>;
}

export type RoadmapNodeType =
  | "title"
  | "topic"
  | "subtopic"
  | "paragraph"
  | "button"
  | "label"
  | "section"
  | "vertical"
  | "horizontal"
  | "legend"
  | "linksgroup";

export interface RoadmapNode extends Omit<Node, "data" | "type"> {
  type: RoadmapNodeType;
  data: RoadmapNodeData;
}

export interface RoadmapEdge extends Edge {
  data?: {
    edgeStyle?: "solid" | "dashed";
  };
}

export interface RoadmapTitle {
  card: string;
  page: string;
  _id: string;
}

export interface RoadmapQuestion {
  type: "main" | "faq";
  title: string;
  description: any; // TipTap JSON format
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapPartner {
  description: string;
  linkText: string;
  link: string;
  _id: string;
}

export interface RoadmapSEO {
  title: string;
  description: string;
  keywords: string[];
  _id: string;
}

export interface RoadmapDimensions {
  height: number;
  width: number;
}

export interface Roadmap {
  _id: string;
  title: RoadmapTitle;
  description: string;
  slug: string;
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  draft?: any;
  createdAt: string;
  updatedAt: string;
  dimensions: RoadmapDimensions;
  order: number;
  partner?: RoadmapPartner;
  questions: RoadmapQuestion[];
  relatedRoadmaps: string[];
  seo: RoadmapSEO;
  type: "role" | "skill" | "tool";
  courses: any[];
  status: "draft" | "published" | "archived";
  aiCourses: string[];
}

export interface RoadmapCreateInput {
  title: {
    card: string;
    page: string;
  };
  description: string;
  slug: string;
  type: "role" | "skill" | "tool";
}

export interface RoadmapUpdateInput extends Partial<RoadmapCreateInput> {
  nodes?: RoadmapNode[];
  edges?: RoadmapEdge[];
  status?: "draft" | "published" | "archived";
}
