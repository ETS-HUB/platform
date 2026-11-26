import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Play, PlayCircle } from "lucide-react";

import Section from "./Section";
import type { CourseItem } from "@/apis/roadmap/home/type";

function CourseMeta({ course }: { course: CourseItem }) {
  const Icon = course.type === "video" ? PlayCircle : BookOpen;
  return (
    <span
      className="flex items-center gap-1.5 text-[12px]"
      style={{ color: "#6B7280" }}
    >
      <Icon size={13} />
      <b style={{ color: "#0e1430" }}>{course.count}</b>
      {course.type === "video" ? "videos" : "lessons"}
    </span>
  );
}

export default function CoursesSection({ courses }: { courses: CourseItem[] }) {
  const [featured, ...rest] = courses;
  if (!featured) return null;

  return (
    <Section
      title="Courses"
      href="/courses"
      linkLabel={`All ${courses.length} courses`}
    >
      <Link
        href={`/courses/${featured.slug}`}
        className="group grid overflow-hidden rounded-3xl border bg-white md:grid-cols-[1.1fr_1.4fr] transition-shadow hover:shadow-xl hover:shadow-[#3A0CA3]/10"
        style={{ borderColor: "#EDE0FB" }}
      >
        <div
          className="relative flex min-h-[200px] items-center justify-center"
          style={{ background: "linear-gradient(135deg, #1E1B4B, #3A0CA3)" }}
        >
          <p className="px-6 text-center text-[22px] font-semibold text-white">
            {featured.title}
          </p>
          <span className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white">
            <Play size={16} fill="#3A0CA3" style={{ color: "#3A0CA3" }} />
          </span>
        </div>

        <div className="flex flex-col justify-center gap-3 p-6 sm:p-8">
          <div className="flex items-center gap-2">
            {featured.isNew && (
              <span
                className="rounded-md px-2 py-0.5 text-[10.5px] font-bold uppercase"
                style={{ background: "#FEF3C7", color: "#B45309" }}
              >
                New
              </span>
            )}
            <span className="text-[12px]" style={{ color: "#6B7280" }}>
              {featured.type === "video" ? "Video course" : "Course"}
            </span>
          </div>
          <h3 className="text-[22px] font-bold" style={{ color: "#0e1430" }}>
            {featured.title}
          </h3>
          <p
            className="text-[14px] leading-relaxed"
            style={{ color: "#6B7280" }}
          >
            {featured.description}
          </p>
          <div className="mt-1 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CourseMeta course={featured} />
              {featured.duration && (
                <span
                  className="flex items-center gap-1.5 text-[12px]"
                  style={{ color: "#6B7280" }}
                >
                  <Clock size={13} />
                  <b style={{ color: "#0e1430" }}>{featured.duration}</b>
                </span>
              )}
            </div>
            <span
              className="flex items-center gap-1 text-[13.5px] font-semibold"
              style={{ color: "#3A0CA3" }}
            >
              Start course
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </span>
          </div>
        </div>
      </Link>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {rest.map((c) => (
          <Link
            key={c.slug}
            href={`/courses/${c.slug}`}
            className="flex min-h-[170px] flex-col justify-between rounded-2xl border bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#3A0CA3]/10"
            style={{ borderColor: "#EDE0FB" }}
          >
            <div>
              <h3
                className="text-[15px] font-bold"
                style={{ color: "#0e1430" }}
              >
                {c.title}
              </h3>
              <p
                className="mt-2 text-[13px] leading-relaxed"
                style={{ color: "#6B7280" }}
              >
                {c.description}
              </p>
            </div>
            <div className="mt-4">
              <CourseMeta course={c} />
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
