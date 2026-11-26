import type { Node, Edge } from "@xyflow/react";

export type NodeStatus = "DONE" | "IN_PROGRESS" | "SKIP";

export interface NodeResource {
  _id?: string;
  type: "official" | "article" | "video" | "course" | "opensource";
  title: string;
  url: string;
}

export interface NodeContent {
  id: string;
  roadmapSlug: string;
  nodeId: string;
  description?: string;
  resources: NodeResource[];
  lessonPacks: any[];
  videos: any[];
  paidResources: any[];
  contributionUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNodeContentPayload {
  roadmapSlug: string;
  nodeId: string;
  description?: string;
  resources?: NodeResource[];
  lessonPacks?: any[];
  videos?: any[];
  paidResources?: any[];
  contributionUrl?: string;
}

export interface UpdateNodeContentPayload {
  description?: string;
  resources?: NodeResource[];
  lessonPacks?: any[];
  videos?: any[];
  paidResources?: any[];
  contributionUrl?: string;
}

export interface ImportRoadmapPayload {
  slug: string;
  title: { page: string; card: string };
  description: string;
  nodes: Node[];
  edges: Edge[];
  type: string;
  relatedRoadmaps?: string[];
  aiCourses?: string[];
  questions?: RoadmapQuestion[];
  seo?: { title?: string; description?: string; keywords?: string[] };
}

export interface ImportNodeContentPayload {
  roadmapSlug: string;
  nodeId: string;
  description?: string;
  resources?: NodeResource[];
  lessonPacks?: any[];
  videos?: any[];
  paidResources?: any[];
  contribution?: string;
}

export interface BulkImportResult {
  total: number;
  imported: number;
  failed: number;
  errors: string[];
}

export interface RoadmapSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: string;
  relatedRoadmaps: string[];
  aiCourses: string[];
  seo: { title: string; description: string; keywords: string[] };
  createdAt: string;
}

export interface RoadmapQuestion {
  type: "main" | "faq";
  title: string;
  description: {
    type: "doc";
    content: unknown[];
  };
}

export interface RoadmapDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: string;
  isPublished: boolean;
  nodes: Node[];
  edges: Edge[];
  questions: RoadmapQuestion[];
  relatedRoadmaps: string[];
  aiCourses: string[];
  seo: { title: string; description: string; keywords: string[] };
  createdAt: string;
  updatedAt: string;
}

export interface NodeProgressEntry {
  status: NodeStatus;
  updatedAt: string;
}

export interface RoadmapWithProgress extends RoadmapDetail {
  progress: Record<string, NodeProgressEntry>; // keyed by nodeId
  stats: {
    totalNodes: number;
    done: number;
    inProgress: number;
    skipped: number;
    percentage: number;
  };
}

export interface NodeStatusRecord {
  id: string;
  userId: string;
  roadmapId: string;
  nodeId: string;
  status: NodeStatus;
  updatedAt: string;
}

export interface AdminRoadmapListItem {
  id: string;
  slug: string;
  title: string;
  type: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  _count: { nodeStatuses: number };
}

export interface CreateRoadmapPayload {
  slug: string;
  title: string;
  description: string;
  type: string;
  nodes?: Node[];
  edges?: Edge[];
  questions?: RoadmapQuestion[];
  relatedRoadmaps?: string[];
  aiCourses?: string[];
  seo?: { title?: string; description?: string; keywords?: string[] };
  isPublished?: boolean;
}

export interface UpdateRoadmapPayload {
  title?: string;
  description?: string;
  type?: string;
  nodes?: Node[];
  edges?: Edge[];
  questions?: RoadmapQuestion[];
  relatedRoadmaps?: string[];
  aiCourses?: string[];
  seo?: { title?: string; description?: string; keywords?: string[] };
  isPublished?: boolean;
}
