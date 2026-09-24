"use client";

import React from "react";
import { BookOpen, Users } from "lucide-react";

export interface CourseCardData {
  id: string;
  name: string;
  imageUrl?: string | null;
  categoryName: string;
  totalLessons: number;
  totalEnrollments: number;
  isEnrolled?: boolean;
  progress?: {
    completedLessons: number;
    totalLessons: number;
    percentage: number;
  };
}

interface CourseCardProps {
  course: CourseCardData;
  index?: number;
  onClick: (id: string) => void;
}

// Accent tied to category, not array position — so color means something
// (every Programming course shares an accent) instead of being arbitrary.
const CATEGORY_ACCENTS: Record<string, string> = {
  Programming: "#F52593",
  Design: "#7408B3",
  "DevOps & Tools": "#3A0CA3",
};
const DEFAULT_ACCENT = "#3A0CA3";

function getAccent(category: string) {
  return CATEGORY_ACCENTS[category] ?? DEFAULT_ACCENT;
}

function DummyIllustration({ accent }: { accent: string }) {
  return (
    <svg
      viewBox="0 0 240 200"
      className="absolute -right-4 -bottom-6 pointer-events-none select-none"
      style={{ width: "220px", height: "auto" }}
      aria-hidden
    >
      <circle cx="150" cy="90" r="70" fill="#F5EEFE" />
      <circle cx="190" cy="60" r="34" fill="#EDE0FB" />
      <rect
        x="90"
        y="110"
        width="90"
        height="90"
        rx="20"
        fill="#EDE0FB"
        transform="rotate(18 135 155)"
      />
      <path
        d="M120 70 L150 40 L180 70 L150 100 Z"
        fill={accent}
        opacity="0.85"
      />
      <circle cx="200" cy="140" r="10" fill={accent} opacity="0.9" />
    </svg>
  );
}

export function CourseCard({ course, onClick }: CourseCardProps) {
  const accent = getAccent(course.categoryName);

  return (
    <button
      type="button"
      onClick={() => onClick(course.id)}
      className="relative text-left cursor-pointer rounded-2xl p-6 pr-8 flex items-center justify-between gap-6 w-full overflow-hidden transition-shadow hover:shadow-md"
      style={{
        background: "#FBFAFE",
        border: "1.5px solid #EDE0FB",
        minHeight: "180px",
      }}
    >
      <div className="relative z-10 flex flex-col gap-3 max-w-[60%]">
        <span
          className="inline-block w-fit text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full"
          style={{ color: "#FFFFFF", background: accent }}
        >
          {course.categoryName}
        </span>

        <div className="flex items-center gap-2.5">
          {course.imageUrl ? (
            <img
              src={course.imageUrl}
              alt={course.name}
              className="w-7 h-7 rounded object-contain"
            />
          ) : (
            <span className="text-[22px] leading-none">📚</span>
          )}
          <h3
            className="text-[19px] font-bold leading-snug"
            style={{ color: "#0e1430" }}
          >
            {course.name}
          </h3>
        </div>

        <div
          className="flex items-center gap-4 text-[12.5px]"
          style={{ color: "#8B84A0" }}
        >
          <span className="inline-flex items-center gap-1.5">
            <BookOpen size={14} />
            {course.totalLessons} lessons
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users size={14} />
            {course.totalEnrollments}
          </span>
        </div>

        {course.isEnrolled && course.progress && (
          <div className="max-w-[220px]">
            <div className="flex justify-between mb-1">
              <span
                className="text-[11.5px] font-medium"
                style={{ color: "#8B84A0" }}
              >
                {course.progress.completedLessons}/
                {course.progress.totalLessons} done
              </span>
              <span
                className="text-[11.5px] font-medium"
                style={{ color: accent }}
              >
                {course.progress.percentage}%
              </span>
            </div>
            <div
              className="h-1.5 rounded-full"
              style={{ background: "#EDE0FB" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${course.progress.percentage}%`,
                  background: accent,
                }}
              />
            </div>
          </div>
        )}
      </div>

      <DummyIllustration accent={accent} />
    </button>
  );
}

export default CourseCard;
