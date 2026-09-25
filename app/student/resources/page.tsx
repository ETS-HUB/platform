"use client";

import { useState } from "react";
import { Pagination, Skeleton } from "antd";
import { RecommendedResourcesSection } from "./components/RecommendedResourcesSection";
import { ResourceFilters } from "./components/ResourceFilters";
import { ResourceListCard } from "./components/ResourceListCard";
import type {
  ResourceType,
  Difficulty,
  LearningStyle,
} from "@/apis/resources/types";
import { useGetResourcesQuery } from "@/apis/resources/resourcesService";
import { useGetDashboardQuery } from "@/apis/dashboard/dashboardService";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import Header from "@/components/ui/Header";
import Image from "next/image";
import { IMAGES } from "@/constants/images";

interface FilterState {
  topicId?: string;
  type?: ResourceType;
  difficulty?: Difficulty;
  learningStyle?: LearningStyle;
}

const PAGE_SIZE = 20;

export default function ResourceLibraryPage() {
  const { accessToken } = useSelector((s: RootState) => s.tokens);
  const [filters, setFilters] = useState<FilterState>({});
  const [page, setPage] = useState(1);

  const { data: resourcesData, isLoading } = useGetResourcesQuery({
    ...filters,
    page,
    limit: PAGE_SIZE,
  });

  // Use enrolled courses as topic options for the topic filter
  const { data: dashData } = useGetDashboardQuery(undefined, {
    skip: !accessToken,
  });
  const topics = (dashData?.enrolledCourses ?? []).map((c) => ({
    id: c.courseId,
    name: c.courseName,
  }));

  const resources = resourcesData?.resources ?? [];
  const total = resourcesData?.pagination.total ?? 0;

  return (
    <div className="min-h-screen w-full">
      <div className="mb-8">
        <Header
          title="Resource library"
          subtitle="Curated tutorials, videos, and docs to supplement your courses."
        />
      </div>

      <div className="mb-10">
        <RecommendedResourcesSection />
      </div>

      <ResourceFilters
        topics={topics}
        value={filters}
        onChange={(f) => {
          setFilters(f);
          setPage(1);
        }}
      />

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-5 bg-white border border-[#EDE0FB]"
            >
              <Skeleton active paragraph={{ rows: 2 }} />
            </div>
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Image
            src={IMAGES.EmptyImageTwo}
            width={300}
            height={300}
            alt="No resources"
          />
          <p className="text-base text-gray-600 mt-4">
            No resources match these filters.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 mb-8">
            {resources.map((r) => (
              <ResourceListCard key={r.id} resource={r} />
            ))}
          </div>

          {total > PAGE_SIZE && (
            <div className="flex justify-center">
              <Pagination
                current={page}
                onChange={setPage}
                total={total}
                pageSize={PAGE_SIZE}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
