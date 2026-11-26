import Section from "./Section";
import RoadmapCard from "./RoadmapCard";
import type { RoadmapItem } from "@/apis/roadmap/home/type";

interface RoadmapGridProps {
  title: string;
  subtitle?: string;
  items: RoadmapItem[];
  href?: string;
  linkLabel?: string;
}

export default function RoadmapGrid({
  title,
  subtitle,
  items,
  href,
  linkLabel,
}: RoadmapGridProps) {
  if (!items.length) return null;
  return (
    <Section
      title={title}
      subtitle={subtitle}
      href={href}
      linkLabel={linkLabel}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <RoadmapCard key={item.slug} item={item} />
        ))}
      </div>
    </Section>
  );
}
