export type Category =
  | "all"
  | "ai"
  | "web"
  | "data"
  | "devops"
  | "languages"
  | "interview";
export type RoadmapKind = "role" | "skill" | "practice";

export interface RoadmapItem {
  slug: string;
  title: string;
  category: Exclude<Category, "all">;
  kind: RoadmapKind;
  topics?: number;
  popular?: boolean;
  isNew?: boolean;
}

export interface CourseItem {
  slug: string;
  title: string;
  description: string;
  type: "video" | "lessons";
  count: number;
  duration?: string;
  isNew?: boolean;
}

export interface VideoItem {
  slug: string;
  title: string;
  duration: string;
}

export interface GuideItem {
  slug: string;
  title: string;
  type: "Textual" | "Question";
  isNew?: boolean;
}
