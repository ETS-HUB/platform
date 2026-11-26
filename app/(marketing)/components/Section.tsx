import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  children: React.ReactNode;
}

export default function Section({
  title,
  subtitle,
  href,
  linkLabel,
  children,
}: SectionProps) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <h2 className="text-[22px] font-bold" style={{ color: "#0e1430" }}>
            {title}
          </h2>
          {subtitle && (
            <p className="text-[13.5px] mt-1" style={{ color: "#6B7280" }}>
              {subtitle}
            </p>
          )}
        </div>
        {href && (
          <Link
            href={href}
            className="group flex items-center gap-1 text-[13px] font-semibold shrink-0"
            style={{ color: "#3A0CA3" }}
          >
            {linkLabel ?? "View all"}
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
