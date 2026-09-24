import React, { useEffect, useRef } from "react";

type HeaderInsightType = "warning" | "success" | "tip" | "info";

interface HeaderInsight {
  type: HeaderInsightType;
  message: string;
}

interface HeaderProps {
  title: string;
  subtitle?: string;
  insight?: HeaderInsight;
  reserveInsightSpace?: boolean;
}

const insightClasses: Record<HeaderInsightType, string> = {
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  tip: "border-blue-200 bg-blue-50 text-blue-800",
  info: "border-sky-200 bg-sky-50 text-sky-800",
};

const Header = ({
  title,
  subtitle,
  insight,
  reserveInsightSpace = false,
}: HeaderProps) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const insightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const titleEl = titleRef.current;
    const subtitleEl = subtitleRef.current;
    const insightEl = insightRef.current;

    const animate = (el: HTMLElement | null, delay: number) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(16px)";
      el.style.transition = "none";

      setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          });
        });
      }, delay);
    };

    animate(titleEl, 120);
    animate(subtitleEl, 280);
    animate(insightEl, 290);
  }, [title, subtitle, insight?.message]);

  return (
    <div
      className={`py-1 my-4 sm:mt-3 sm:mb-3 ${reserveInsightSpace ? "relative pb-16" : ""}`}
    >
      <h1
        ref={titleRef}
        className="text-2xl font-medium font-noto text-[#102A43]"
      >
        {title}
      </h1>
      {subtitle && (
        <p ref={subtitleRef} className="mt-1 text-base font-medium text-gray-500">
          {subtitle}
        </p>
      )}
      {(reserveInsightSpace || insight?.message) && (
        <div
          className={
            reserveInsightSpace
              ? "absolute left-0 right-0 bottom-0 min-h-[52px]"
              : "mt-3"
          }
        >
          {insight?.message && (
            <div
              ref={insightRef}
              className={`rounded-xl border px-3 py-2 text-sm font-medium ${insightClasses[insight.type]}`}
            >
              {insight.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
