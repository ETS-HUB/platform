"use client";

import { useMemo, useState } from "react";
import { Library } from "lucide-react";
import { Pagination } from "antd";
import { RecommendedResourcesSection } from "./components/RecommendedResourcesSection";
import { ResourceFilters } from "./components/ResourceFilters";
import { ResourceListCard } from "./components/ResourceListCard";
import type {
  LibraryResource,
  ResourceType,
  Difficulty,
} from "@/apis/resources/types";
import Header from "@/components/ui/Header";
import Image from "next/image";
import { IMAGES } from "@/constants/images";

const MOCK_TOPICS = [
  { id: "js-id", name: "JavaScript" },
  { id: "react-id", name: "React" },
];

// Replace with useGetResourcesQuery({ topicId, type, difficulty }) — shape matches exactly
const MOCK_RESOURCES: LibraryResource[] = [
  {
    id: "r2",
    topicId: "js-id",
    title: "Traversy Media JS Crash Course",
    url: "https://youtube.com/watch?v=example",
    type: "VIDEO",
    difficulty: "EASY",
    learningStyle: "VISUAL",
    description:
      "Video crash course covering variables, functions, and DOM basics.",
    topic: { name: "JavaScript Fundamentals" },
  },
];

interface FilterState {
  topicId?: string;
  type?: ResourceType;
  difficulty?: Difficulty;
}

const PAGE_SIZE = 20;

export default function ResourceLibraryPage() {
  const [filters, setFilters] = useState<FilterState>({});
  const [page, setPage] = useState(1);

  const resources = MOCK_RESOURCES; // swap for real query using filters + page
  const total = resources.length; // comes from pagination.total in real response

  return (
    <div className="min-h-screen w-full">
      <div className="mb-8">
        <Header
          title=" Resource library"
          subtitle="Curated tutorials, videos, and docs to supplement your courses."
        />
      </div>

      <div className="mb-10">
        <RecommendedResourcesSection />
      </div>

      <ResourceFilters
        topics={MOCK_TOPICS}
        value={filters}
        onChange={(f) => {
          setFilters(f);
          setPage(1);
        }}
      />

      {resources.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Image
            src={IMAGES.EmptyImageTwo}
            width={300}
            height={300}
            alt="No practice topics available"
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
