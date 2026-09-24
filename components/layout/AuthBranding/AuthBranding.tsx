"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { IMAGES } from "@/constants/images";
import { authTestimonials, stats } from "@/constants";
import "./auth.css";

const BG_IMAGES = [
  IMAGES.AUTH_BG_ONE,
  IMAGES.AUTH_BG_TWO,
  IMAGES.AUTH_BG_THREE,
  IMAGES.AUTH_BG_FOUR,
  IMAGES.AUTH_BG_FIVE,
  IMAGES.AUTH_BG_SIX,
  IMAGES.AUTH_BG_SEVEN,
];

const BG_INTERVAL = 6000;
const FADE_DURATION = 1200;
const TESTIMONIAL_FADE = 400;

const BgSlideshow = ({ active }: { active: number }) => (
  <>
    {BG_IMAGES.map((src, i) => (
      <Image
        key={i}
        src={src}
        alt=""
        aria-hidden
        fill
        priority={i === 0}
        className="object-cover object-center pointer-events-none select-none"
        style={{
          opacity: i === active ? 1 : 0,
          transition: `opacity ${FADE_DURATION}ms ease-in-out`,
          zIndex: i === active ? 2 : 1,
        }}
      />
    ))}
  </>
);

const TestimonialCarousel = ({
  active,
  intervalMs = 6000,
}: {
  active: number;
  intervalMs?: number;
}) => {
  const tIndex = active % authTestimonials.length;

  return (
    <div className="relative max-w-md">
      <span
        className="absolute -top-2 left-1 z-20 font-bebas-neue text-white/10 select-none pointer-events-none"
        style={{ fontSize: "110px", lineHeight: 1 }}
        aria-hidden
      >
        &ldquo;
      </span>

      <div className="relative rounded-2xl bg-white/[0.06] border border-white/10 p-6 pt-8 backdrop-blur-sm overflow-hidden">
        <div className="relative" style={{ minHeight: "132px" }}>
          {authTestimonials.map((t, i) => {
            const isActive = i === tIndex;
            const isPrev =
              i ===
              (tIndex - 1 + authTestimonials.length) % authTestimonials.length;

            return (
              <div
                key={i}
                className="absolute inset-0 pt-4"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive
                    ? "translateX(0)"
                    : isPrev
                      ? "translateX(-16px)"
                      : "translateX(16px)",
                  transition:
                    "opacity 500ms ease-out, transform 500ms ease-out",
                  pointerEvents: isActive ? "auto" : "none",
                }}
              >
                <p className="text-white/90 text-[15px] font-medium leading-relaxed mb-5">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white ring-1 ring-white/25 shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.name}</p>
                    <p className="text-white/45 text-xs">{t.title}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 mt-6">
          {authTestimonials.map((_, i) => (
            <div
              key={i}
              className="h-[3px] flex-1 rounded-full bg-white/15 overflow-hidden"
            >
              <div
                key={i === tIndex ? `${i}-${active}` : i}
                className="h-full rounded-full bg-white/80"
                style={{
                  width:
                    i < tIndex % authTestimonials.length
                      ? "100%"
                      : i === tIndex
                        ? undefined
                        : "0%",
                  animation:
                    i === tIndex
                      ? `testimonial-progress ${intervalMs}ms linear forwards`
                      : "none",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AuthBranding = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % BG_IMAGES.length);
    }, BG_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="hidden lg:flex lg:w-[52%] flex-col justify-center font-bebas-neue p-12 relative overflow-hidden"
      style={{ backgroundColor: "#1F5226" }}
    >
      <BgSlideshow active={active} />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: "rgba(13, 20, 61, 0.72)", zIndex: 3 }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 30%, rgba(58,12,163,0.45) 0%, transparent 75%)",
          mixBlendMode: "screen",
          zIndex: 3,
        }}
      />

      <div className="relative space-y-5 mb-20" style={{ zIndex: 4 }}>
        <div>
          <h2 className="text-4xl font-bold font-lora text-white leading-tight mb-4">
            Empowering students, one session at a time.
          </h2>
          <p className="text-white/60 text-base font-medium leading-relaxed max-w-lg">
            A trusted platform connecting dedicated tutors with families who
            care about their children&apos;s academic success.
          </p>
        </div>
        <TestimonialCarousel active={active} />
      </div>
    </div>
  );
};

export default AuthBranding;
