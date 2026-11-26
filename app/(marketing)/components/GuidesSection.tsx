import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Section from "./Section";
import type { GuideItem } from "@/apis/roadmap/home/type";

export default function GuidesSection({ guides }: { guides: GuideItem[] }) {
  return (
    <Section title="Blog">
      <div
        className="overflow-hidden rounded-2xl border bg-white"
        style={{ borderColor: "#EDE0FB" }}
      >
        {guides.map((g, i) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-[#FAF7FF]"
            style={i ? { borderTop: "1px solid #F3EBFD" } : undefined}
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <span
                className="truncate text-[14px] font-medium"
                style={{ color: "#111827" }}
              >
                {g.title}
              </span>
              {g.isNew && (
                <span
                  className="shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase"
                  style={{ background: "#DCFCE7", color: "#15803D" }}
                >
                  New
                </span>
              )}
            </span>
            <span
              className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
              style={{ background: "#F5F0FF", color: "#6B21A8" }}
            >
              {g.type}
            </span>
          </Link>
        ))}
      </div>

      <Link
        href="/blog"
        className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold text-white transition-transform hover:-translate-y-0.5"
        style={{ background: "#3A0CA3" }}
      >
        View all
        <ArrowRight size={14} />
      </Link>
    </Section>
  );
}
