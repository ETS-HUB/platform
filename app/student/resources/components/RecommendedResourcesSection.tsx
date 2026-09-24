"use client";

import { Sparkles } from "lucide-react";
import { RecommendedResourceCard } from "./RecommendedResourceCard";
import type { RecommendedResource } from "@/apis/resources/types";

// Replace with useGetRecommendedResourcesQuery() — shape matches exactly
const MOCK_RECOMMENDED: RecommendedResource[] = [
  {
    id: "r1",
    title: "JavaScript.info",
    url: "https://javascript.info/",
    type: "TUTORIAL",
    topic: "JavaScript",
    difficulty: "EASY",
  },
  {
    id: "r2",
    title: "Traversy Media JS Crash Course",
    url: "https://youtube.com/watch?v=example",
    type: "VIDEO",
    topic: "JavaScript",
    difficulty: "EASY",
  },
  {
    id: "r3",
    title: "React Official Docs",
    url: "https://react.dev/learn",
    type: "DOCUMENTATION",
    topic: "React",
    difficulty: "MEDIUM",
  },
];

export function RecommendedResourcesSection() {
  const resources = MOCK_RECOMMENDED;

  if (resources.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={26} style={{ color: "#3A0CA3" }} />
        <h2 className="text-base font-semibold text-primary">Picked for you</h2>
      </div>
      <p className="text-base mb-4 text-gray-600">
        Based on topics you&apos;ve struggled with and how you learn best.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {resources.map((r) => (
          <RecommendedResourceCard key={r.id} resource={r} />
        ))}
      </div>
    </div>
  );
}
