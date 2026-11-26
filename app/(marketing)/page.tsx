"use client";

import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";

import HomeHero from "./components/HomeHero";
import RoadmapGrid from "./components/RoadmapGrid";
import CoursesSection from "./components/CoursesSection";
import GuidesSection from "./components/GuidesSection";
import AllRoadmaps from "./components/AllRoadmaps";
import CommunitySection from "./components/CommunitySection";
import HomeFooter from "./components/HomeFooter";
import { COURSES, GUIDES } from "@/constants";
import { Category, RoadmapItem } from "@/apis/roadmap/home/type";
import { useGetRoadmapsQuery } from "@/apis/roadmap/roadmapService";
import RoadmapNav from "../roadmap/[slug]/components/RoadmapNav";

const TYPE_TO_CATEGORY: Record<string, Exclude<Category, "all">> = {
  role: "web",
  skill: "languages",
  practice: "interview",
};

const POPULAR_SLUGS = new Set([
  "frontend",
  "backend",
  "devops",
  "full-stack",
  "react",
  "nodejs",
  "python",
  "javascript",
]);

const isNewRoadmap = (createdAt: string): boolean => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return new Date(createdAt) > thirtyDaysAgo;
};

export default function RoadmapsHomePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("all");

  const { data: apiRoadmaps = [], isLoading } = useGetRoadmapsQuery();

  // Transform API data to UI format
  const roadmaps: RoadmapItem[] = useMemo(() => {
    return apiRoadmaps.map((r) => ({
      slug: r.slug,
      title: r.title,
      category: TYPE_TO_CATEGORY[r.type] || "web",
      kind: (r.type as "role" | "skill" | "practice") || "role",
      topics: 0, // Will be populated from full roadmap data if needed
      popular: POPULAR_SLUGS.has(r.slug),
      isNew: isNewRoadmap(r.createdAt),
    }));
  }, [apiRoadmaps]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return roadmaps.filter((r) => r.title.toLowerCase().includes(q));
  }, [query, roadmaps]);

  const featured = useMemo(
    () =>
      category === "all"
        ? roadmaps.filter((r) => r.popular)
        : roadmaps.filter((r) => r.category === category),
    [category, roadmaps],
  );

  const fresh = useMemo(() => roadmaps.filter((r) => r.isNew), [roadmaps]);

  return (
    <div className="min-h-screen" style={{ background: "#FAFAFA" }}>
      <RoadmapNav />
      <HomeHero
        total={roadmaps.length}
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
      />

      {results ? (
        results.length ? (
          <RoadmapGrid
            title={`${results.length} result${results.length > 1 ? "s" : ""}`}
            items={results}
          />
        ) : (
          <div className="max-w-6xl mx-auto px-6 py-24 text-center">
            <SearchX
              size={32}
              className="mx-auto mb-3"
              style={{ color: "#9CA3AF" }}
            />
            <p className="text-[15px]" style={{ color: "#6B7280" }}>
              No roadmaps match "{query}".
            </p>
          </div>
        )
      ) : isLoading ? (
        <div className="max-w-6xl mx-auto px-6 py-24 flex justify-center">
          <div
            className="inline-block w-12 h-12 rounded-full border-4 border-solid animate-spin"
            style={{
              borderColor: "#3A0CA3 transparent transparent transparent",
            }}
          />
        </div>
      ) : (
        <>
          <RoadmapGrid
            title={category === "all" ? "Most popular" : "Roadmaps"}
            items={featured}
            href="#all-roadmaps"
            linkLabel={`All ${roadmaps.length} roadmaps`}
          />
          <RoadmapGrid title="New roadmaps" items={fresh} />
          <CoursesSection courses={COURSES} />
          <GuidesSection guides={GUIDES} />
          <div id="all-roadmaps">
            <AllRoadmaps items={roadmaps} />
          </div>
          <CommunitySection />
        </>
      )}

      <HomeFooter />
    </div>
  );
}
