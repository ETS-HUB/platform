import { BookOpen, FileText, ListChecks, Map } from "lucide-react";
import type { ContentType } from "./types";

export const TYPE_META: Record<
  ContentType,
  {
    label: string;
    hint: string;
    icon: React.ElementType;
    tint: string;
    color: string;
    placeholder: string;
    examples: string[];
  }
> = {
  roadmap: {
    label: "Roadmap",
    hint: "A path from where you are to where you want to be",
    icon: Map,
    tint: "#F3E8FF",
    color: "#7C3AED",
    placeholder: "I know HTML and CSS and want to become a frontend developer.",
    examples: [
      "Frontend developer",
      "Data analyst",
      "Cybersecurity",
      "Mobile developer",
    ],
  },
  course: {
    label: "Course",
    hint: "Structured lessons you can follow step by step",
    icon: BookOpen,
    tint: "#EAF2FF",
    color: "#2B78E4",
    placeholder: "I use React daily but state management still confuses me.",
    examples: [
      "React state management",
      "REST APIs",
      "SQL basics",
      "Git workflows",
    ],
  },
  guide: {
    label: "Guide",
    hint: "A focused explanation of a single concept",
    icon: FileText,
    tint: "#ECFDF5",
    color: "#059669",
    placeholder: "Explain how authentication tokens work and when they expire.",
    examples: ["Event loops", "Docker vs VMs", "Big-O notation", "CORS"],
  },
  quiz: {
    label: "Quiz",
    hint: "Test what you know and find the gaps",
    icon: ListChecks,
    tint: "#FFF7ED",
    color: "#EA580C",
    placeholder: "Quiz me on JavaScript closures and the event loop.",
    examples: ["JavaScript basics", "HTML & CSS", "Python", "Networking"],
  },
};
