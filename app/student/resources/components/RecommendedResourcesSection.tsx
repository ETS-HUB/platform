"use client";

import { Sparkles } from "lucide-react";
import { Skeleton } from "antd";
import { RecommendedResourceCard } from "./RecommendedResourceCard";
import { useGetRecommendedResourcesQuery } from "@/apis/resources/resourcesService";

export function RecommendedResourcesSection() {
  const { data: resources = [], isLoading } = useGetRecommendedResourcesQuery();

  if (!isLoading && resources.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={26} style={{ color: "#3A0CA3" }} />
        <h2 className="text-base font-semibold text-primary">Picked for you</h2>
      </div>
      <p className="text-base mb-4 text-gray-600">
        Based on topics you&apos;ve struggled with and how you learn best.
      </p>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-4 bg-white border border-[#EDE0FB]"
            >
              <Skeleton active paragraph={{ rows: 2 }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {resources.map((r) => (
            <RecommendedResourceCard key={r.id} resource={r} />
          ))}
        </div>
      )}
    </div>
  );
}
