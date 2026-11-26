"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  GraduationCap,
  Layers,
  Users,
} from "lucide-react";

import { Button } from "@/components";

const STATS = [
  { value: 1000, label: "Community Reach", icon: Users },
  { value: 200, label: "Students Trained", icon: GraduationCap },
  { value: 10, label: "Tech Tracks Offered", icon: Layers },
  { value: 10, label: "Community Events", icon: CalendarDays },
];

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return n;
}

function StatItem({
  value,
  label,
  icon: Icon,
  active,
}: {
  value: number;
  label: string;
  icon: React.ElementType;
  active: boolean;
}) {
  const n = useCountUp(value, active);
  return (
    <div className="flex flex-col items-center px-4 py-8 text-center">
      <span
        className="flex h-12 w-12 items-center justify-center rounded-2xl"
        style={{ background: "#F3E8FF", color: "#7C3AED" }}
      >
        <Icon size={22} strokeWidth={2} />
      </span>
      <p
        className="mt-5 text-[44px] sm:text-[56px] font-extrabold leading-none tracking-tight"
        style={{ color: "#0e1430" }}
      >
        {n.toLocaleString()}
        <span style={{ color: "#7C3AED" }}>+</span>
      </p>
      <p className="mt-2 text-[14px] font-medium" style={{ color: "#6B7280" }}>
        {label}
      </p>
    </div>
  );
}

export default function CommunitySection({ name = "ETS" }: { name?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative font-family-outfit w-full overflow-hidden bg-white">
      {/* soft accents */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: "#EDE0FB" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[14px] uppercase tracking-[1] font-semibold"
            style={{color: "#6B21A8" }}
          >
            Our impact
          </span>
          <h2
            className="mt-5 text-[34px] sm:text-[48px] font-extrabold leading-[1.08] tracking-tight"
            style={{ color: "#0e1430" }}
          >
            Join the <span style={{ color: "#7C3AED" }}>{name}</span> community
          </h2>
          <p
            className="mt-4 text-[15px] sm:text-[17px] leading-relaxed"
            style={{ color: "#6B7280" }}
          >
            Learn alongside hundreds of students, pick a tech track, and show up
            to events that move your career forward.
          </p>
        </div>

        <div
          className="mt-14 grid grid-cols-2 lg:grid-cols-4 rounded-3xl border bg-white shadow-xl shadow-[#3A0CA3]/5 [&>*]:border-[#EDE0FB] [&>*:not(:last-child)]:border-b lg:[&>*:not(:last-child)]:border-b-0 lg:[&>*:not(:last-child)]:border-r [&>*:nth-child(odd)]:border-r lg:[&>*:nth-child(odd)]:border-r"
          style={{ borderColor: "#EDE0FB" }}
        >
          {STATS.map((s) => (
            <StatItem key={s.label} {...s} active={visible} />
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center">
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 rounded-full px-7 py-3 text-[14px] font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            <Button variant="tertiary" size="lg" className="rounded-full!">
              Join {name}
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Button>
          </Link>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-[14px] font-semibold transition-colors hover:bg-[#FAF7FF]"
          >
            <Button variant="outline" size="lg" className="rounded-full!">
              See events
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
