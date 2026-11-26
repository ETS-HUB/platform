import Link from "next/link";
import { Play } from "lucide-react";

import Section from "./Section";
import type { VideoItem } from "@/apis/roadmap/home/type";

const GRADIENTS = [
  "linear-gradient(135deg, #3A0CA3, #7C3AED)",
  "linear-gradient(135deg, #1D4ED8, #2B78E4)",
  "linear-gradient(135deg, #047857, #34D399)",
  "linear-gradient(135deg, #B45309, #F59E0B)",
];

export default function VideosSection({ videos }: { videos: VideoItem[] }) {
  return (
    <Section
      title="Videos"
      subtitle="Short visual explainers, new most days"
      href="/videos"
      linkLabel={`All ${videos.length} videos`}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {videos.map((v, i) => (
          <Link
            key={v.slug}
            href={`/videos/${v.slug}`}
            className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl"
            style={{ background: GRADIENTS[i % GRADIENTS.length] }}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 backdrop-blur transition-transform group-hover:scale-110">
              <Play size={18} fill="#fff" className="text-white" />
            </span>
            <p className="absolute bottom-3 left-4 text-[14px] font-semibold text-white">
              {v.title}
            </p>
            <span className="absolute bottom-3 right-3 rounded bg-black/60 px-1.5 py-0.5 text-[11px] text-white">
              {v.duration}
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}
