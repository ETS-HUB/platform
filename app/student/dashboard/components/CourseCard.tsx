"use client";

import { useState } from "react";
import { Bookmark, Check } from "lucide-react";
import type { DashboardCourse } from "@/apis/dashboard/types";
import {
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
} from "@/apis/lessons/lessonsService";
import Image from "next/image";

export type { DashboardCourse };

const CARD_THEMES = [
  { bg: "#2547F4", text: "#FFFFFF", track: "rgba(255,255,255,0.25)" },
  { bg: "#FF5B39", text: "#FFFFFF", track: "rgba(255,255,255,0.3)" },
  { bg: "#121212", text: "#FFFFFF", track: "rgba(255,255,255,0.2)" },
];

const AVATAR_SEEDS = [
  "Sophia",
  "Alex",
  "Emily",
  "Daniel",
  "Sarah",
  "Mike",
  "Olivia",
];

interface CourseCardProps {
  course: DashboardCourse;
  index: number;
  onContinue: (courseId: string) => void;
}

export function CourseCard({ course, index, onContinue }: CourseCardProps) {
  const theme = CARD_THEMES[index % CARD_THEMES.length];
  const isCompleted = course.status === "completed";
  const totalEnrolled = course.totalEnrolled;
  const [bookmarked, setBookmarked] = useState(false);
  const [addBookmark] = useAddBookmarkMutation();
  const [removeBookmarkMut] = useRemoveBookmarkMutation();

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (bookmarked) {
        await removeBookmarkMut(course.courseId).unwrap();
        setBookmarked(false);
      } else {
        await addBookmark(course.courseId).unwrap();
        setBookmarked(true);
      }
    } catch (err) {
      console.error("Bookmark error:", err);
    }
  };

  return (
    <div
      className="rounded-2xl p-5 flex flex-col justify-between min-h-[220px]"
      style={{ background: theme.bg }}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <span
            className="inline-block text-[12px] font-semibold px-3 py-1 rounded-full"
            style={{ background: "#000000", color: "#FFFFFF" }}
          >
            {course.category}
          </span>
          <button
            type="button"
            onClick={handleBookmark}
            className="p-1 rounded-md transition-colors hover:bg-white/10"
          >
            <Bookmark
              size={18}
              fill={bookmarked ? theme.text : "none"}
              style={{ color: theme.text, opacity: bookmarked ? 1 : 0.85 }}
            />
          </button>
        </div>
        <Image
          src={course?.courseIcon}
          alt={course?.courseName}
          width={400}
          height={200}
          className="w-full h-45 my-4 object-cover rounded-lg"
        />
        <h3
          className="text-[19px] font-semibold leading-snug"
          style={{ color: theme.text }}
        >
          {course.courseName}
        </h3>
        <p
          className="text-sm font-medium mb-4 mt-2"
          style={{ color: theme.text, opacity: 0.8 }}
        >
          {course.courseDescription}
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span
            className="text-[12.5px] font-medium"
            style={{ color: theme.text, opacity: 0.75 }}
          >
            Progress
          </span>
          <span
            className="text-[12.5px] font-medium"
            style={{ color: theme.text, opacity: 0.9 }}
          >
            {course.completedLessons}/{course.totalLessons} lessons
          </span>
        </div>
        <div
          className="h-1.5 rounded-full mb-4"
          style={{ background: theme.track }}
        >
          <div
            className="h-full rounded-full"
            style={{ width: `${course.percentage}%`, background: "#FFFFFF" }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {totalEnrolled === 0 ? (
              <span
                className="text-[11px] font-medium italic"
                style={{ color: theme.text, opacity: 0.6 }}
              >
                Be the first to enroll!
              </span>
            ) : (
              <>
                {AVATAR_SEEDS.slice(0, Math.min(3, totalEnrolled)).map(
                  (seed, i) => (
                    <img
                      key={seed}
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
                      alt=""
                      className="w-7 h-7 rounded-full border-2 bg-white"
                      style={{
                        borderColor: theme.bg,
                        marginLeft: i === 0 ? 0 : -8,
                      }}
                    />
                  ),
                )}
                {totalEnrolled > 3 && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold border-2"
                    style={{
                      background: "#FFFFFF",
                      color: "#111",
                      borderColor: theme.bg,
                      marginLeft: -8,
                    }}
                  >
                    +{totalEnrolled - 3}
                  </div>
                )}
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => onContinue(course.courseId)}
            disabled={isCompleted}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-full"
            style={{
              background: isCompleted ? "#FFFFFF" : "#C6F135",
              color: "#111111",
            }}
          >
            {isCompleted ? (
              <>
                <Check size={14} strokeWidth={3} />
                Done
              </>
            ) : course.status === "not_started" ? (
              "Start"
            ) : (
              "Continue"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
