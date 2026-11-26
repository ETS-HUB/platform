"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Lock,
  Menu,
  X,
  List,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  useGetContentQuery,
  useFetchLessonMutation,
} from "@/apis/ai/aiService";
import type {
  AiModule,
  AiLesson,
  AiLessonBody,
  AiCourseContent,
} from "@/apis/ai/types";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h4 className="mb-3 text-[15px] font-semibold text-neutral-900">
        {title}
      </h4>
      {children}
    </section>
  );
}

function LessonBodyView({ body }: { body: AiLessonBody }) {
  return (
    <div className="space-y-8">
      {body.objectives?.length > 0 && (
        <Section title="Learning objectives">
          <ul className="space-y-2">
            {body.objectives.map((o, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-[15px] leading-relaxed text-neutral-700"
              >
                <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-neutral-400" />
                {o}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {body.explanation && (
        <p className="whitespace-pre-line text-[15px] leading-7 text-neutral-700">
          {body.explanation}
        </p>
      )}

      {body.keyPoints?.length > 0 && (
        <Section title="Key points">
          <ul className="space-y-2 rounded-lg border border-neutral-200 bg-neutral-50 p-5">
            {body.keyPoints.map((kp, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-[15px] leading-relaxed text-neutral-700"
              >
                <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-neutral-900" />
                {kp}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {body.codeExample && (
        <Section title="Code example">
          <pre className="overflow-x-auto rounded-lg bg-neutral-900 p-4 text-[13px] leading-relaxed text-neutral-100">
            <code>{body.codeExample.code}</code>
          </pre>
          {body.codeExample.explanation && (
            <p className="mt-3 text-[14px] leading-relaxed text-neutral-500">
              {body.codeExample.explanation}
            </p>
          )}
        </Section>
      )}

      {body.codeExercise && (
        <Section title="Practice exercise">
          <div className="rounded-lg border border-neutral-200 p-5">
            <p className="mb-3 text-[15px] leading-relaxed text-neutral-700">
              {body.codeExercise.instructions}
            </p>
            <pre className="overflow-x-auto rounded-lg bg-neutral-900 p-4 text-[13px] text-neutral-100">
              <code>{body.codeExercise.starterCode}</code>
            </pre>
            {body.codeExercise.hints?.length > 0 && (
              <div className="mt-4">
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-neutral-400">
                  Hints
                </p>
                <ol className="space-y-1 text-[14px] text-neutral-600">
                  {body.codeExercise.hints.map((h, i) => (
                    <li key={i}>
                      {i + 1}. {h}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </Section>
      )}

      {body.summary && (
        <Section title="Summary">
          <p className="text-[15px] leading-7 text-neutral-700">
            {body.summary}
          </p>
        </Section>
      )}

      {body.nextSteps && (
        <p className="border-t border-neutral-200 pt-5 text-[14px] text-neutral-500">
          {body.nextSteps}
        </p>
      )}
    </div>
  );
}

function NumberBadge({
  n,
  active,
  size = "sm",
}: {
  n: number;
  active?: boolean;
  size?: "sm" | "md";
}) {
  const dims = size === "md" ? "h-7 w-7 text-[12px]" : "h-5 w-5 text-[10.5px]";
  return (
    <span
      className={`flex ${dims} shrink-0 items-center justify-center rounded-full font-semibold ${
        active ? "bg-neutral-900 text-white" : "bg-neutral-200 text-neutral-600"
      }`}
    >
      {n}
    </span>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
        {label}
      </dt>
      <dd className="mt-1 text-[14px] text-neutral-900">{value}</dd>
    </div>
  );
}

function CourseInfoBar({
  category,
  difficulty,
  modulesCount,
  lessonsCount,
  doneCount,
  startLabel,
  onStart,
}: {
  category?: string;
  difficulty?: string;
  modulesCount: number;
  lessonsCount: number;
  doneCount: number;
  startLabel: string;
  onStart: () => void;
}) {
  const pct = lessonsCount ? Math.round((doneCount / lessonsCount) * 100) : 0;
  const prettyCategory = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : undefined;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-[14px] font-medium text-neutral-900">
          {doneCount} of {lessonsCount} lessons done
        </p>
        <span className="text-[12.5px] text-neutral-400">{pct}%</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-200">
        <div
          className="h-full rounded-full bg-neutral-900 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <dl className="mt-6 space-y-4 border-t border-neutral-200 pt-5">
        {prettyCategory && <MetaRow label="Category" value={prettyCategory} />}
        {difficulty && <MetaRow label="Difficulty" value={difficulty} />}
        <MetaRow
          label="Content"
          value={`${modulesCount} modules · ${lessonsCount} lessons`}
        />
      </dl>

      <button
        type="button"
        onClick={onStart}
        className="mt-6 w-full rounded-md bg-neutral-900 px-4 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-neutral-800"
      >
        {startLabel}
      </button>
    </div>
  );
}

type Selection = { type: "overview" } | { type: "lesson"; lessonId: string };

export default function AiCoursePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: content, isLoading } = useGetContentQuery(id, { skip: !id });
  const [fetchLesson] = useFetchLessonMutation();

  const [selection, setSelection] = useState<Selection>({ type: "overview" });
  const [openModules, setOpenModules] = useState<Set<string>>(new Set());
  const [bodies, setBodies] = useState<Record<string, AiLessonBody>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [paywall, setPaywall] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const course = content?.content as AiCourseContent | undefined;

  const flat = useMemo(() => {
    const out: { lesson: AiLesson; module: AiModule; moduleIndex: number }[] =
      [];
    course?.modules?.forEach((m, mi) =>
      m.lessons.forEach((l) =>
        out.push({ lesson: l, module: m, moduleIndex: mi }),
      ),
    );
    return out;
  }, [course]);

  const doneSet = useMemo(() => new Set<string>(course?.done ?? []), [course]);
  const totalLessons = flat.length;
  const doneCount = flat.filter((f) => doneSet.has(f.lesson.id)).length;

  const activeIndex =
    selection.type === "lesson"
      ? flat.findIndex((f) => f.lesson.id === selection.lessonId)
      : -1;
  const active = activeIndex >= 0 ? flat[activeIndex] : null;
  const activeBody = active
    ? (bodies[active.lesson.id] ?? active.lesson.body)
    : undefined;

  const toggleModule = (moduleId: string) =>
    setOpenModules((prev) => {
      const next = new Set(prev);
      next.has(moduleId) ? next.delete(moduleId) : next.add(moduleId);
      return next;
    });

  const openLesson = async (lesson: AiLesson, module: AiModule) => {
    setMobileOpen(false);
    setPaywall(null);
    setOpenModules((prev) => new Set(prev).add(module.id));

    if (lesson.body || bodies[lesson.id]) {
      setSelection({ type: "lesson", lessonId: lesson.id });
      window.scrollTo({ top: 0 });
      return;
    }

    try {
      setLoadingId(lesson.id);
      const result = await fetchLesson({
        contentId: id,
        moduleId: module.id,
        lessonId: lesson.id,
      }).unwrap();
      setBodies((prev) => ({ ...prev, [lesson.id]: result.lesson.body }));
      setSelection({ type: "lesson", lessonId: lesson.id });
      window.scrollTo({ top: 0 });
    } catch (err: any) {
      if (err?.status === 403) {
        setPaywall(err?.data?.message || "Upgrade to access more lessons");
      } else {
        toast.error("Failed to load lesson");
      }
    } finally {
      setLoadingId(null);
    }
  };

  const goOverview = () => {
    setSelection({ type: "overview" });
    setPaywall(null);
    setMobileOpen(false);
    window.scrollTo({ top: 0 });
  };

  const startOrContinue = () => {
    const target = flat.find((f) => !doneSet.has(f.lesson.id)) ?? flat[0];
    if (target) openLesson(target.lesson, target.module);
  };
  const startLabel = doneCount > 0 ? "Continue course" : "Start course";

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 size={24} className="animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-neutral-500">Course not found.</p>
      </div>
    );
  }

  const infoBar = (
    <CourseInfoBar
      category={course?.category}
      difficulty={course?.difficulty}
      modulesCount={course?.modulesCount ?? course?.modules?.length ?? 0}
      lessonsCount={totalLessons || course?.lessonsCount || 0}
      doneCount={doneCount}
      startLabel={startLabel}
      onStart={startOrContinue}
    />
  );

  const sidebar = (
    <nav className="flex h-full flex-col overflow-y-auto">
      <button
        type="button"
        onClick={goOverview}
        className={`flex items-center gap-3 border-b border-neutral-200 px-4 py-3.5 text-left text-[14px] font-medium transition-colors hover:bg-neutral-50 ${
          selection.type === "overview"
            ? "bg-neutral-50 text-neutral-900"
            : "text-neutral-700"
        }`}
      >
        <List size={16} className="text-neutral-400" />
        Overview
      </button>

      {course?.modules?.map((mod, mi) => {
        const open = openModules.has(mod.id);
        const hasActive = active?.module.id === mod.id;
        return (
          <div key={mod.id} className="border-b border-neutral-200">
            <button
              type="button"
              onClick={() => toggleModule(mod.id)}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-neutral-50"
            >
              <NumberBadge n={mi + 1} active={hasActive} />
              <span
                className={`flex-1 text-[13.5px] leading-snug ${
                  hasActive
                    ? "font-medium text-neutral-900"
                    : "text-neutral-700"
                }`}
              >
                {mod.title}
              </span>
              {open ? (
                <ChevronDown size={15} className="shrink-0 text-neutral-400" />
              ) : (
                <ChevronRight size={15} className="shrink-0 text-neutral-400" />
              )}
            </button>

            {open && (
              <ul className="pb-2">
                {mod.lessons.map((lesson, li) => {
                  const isActive = active?.lesson.id === lesson.id;
                  const loading = loadingId === lesson.id;
                  const isDone = doneSet.has(lesson.id);
                  return (
                    <li key={lesson.id}>
                      <button
                        type="button"
                        onClick={() => openLesson(lesson, mod)}
                        disabled={loading}
                        className={`flex w-full items-start gap-3 py-2 pl-[52px] pr-4 text-left text-[13px] leading-snug transition-colors hover:bg-neutral-50 disabled:opacity-60 ${
                          isActive
                            ? "bg-neutral-100 font-medium text-neutral-900"
                            : "text-neutral-600"
                        }`}
                      >
                        <span className="w-6 shrink-0 text-neutral-400">
                          {mi + 1}.{li + 1}
                        </span>
                        <span className="flex-1">{lesson.title}</span>
                        {loading ? (
                          <Loader2
                            size={12}
                            className="mt-0.5 shrink-0 animate-spin text-neutral-400"
                          />
                        ) : (
                          isDone && (
                            <Check
                              size={13}
                              className="mt-0.5 shrink-0 text-neutral-900"
                            />
                          )
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="fixed inset-x-0 top-0 z-30 flex h-12 items-center gap-3 border-b border-neutral-200 bg-white px-4">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100 lg:hidden"
          aria-label="Toggle course menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <button
          type="button"
          onClick={() => router.push("/ai")}
          className="flex items-center gap-1.5 text-[13px] text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <ArrowLeft size={14} />
          Study Buddy
        </button>
      </header>

      <aside className="fixed bottom-0 left-0 top-12 z-20 hidden w-72 border-r border-neutral-200 bg-white lg:block">
        {sidebar}
      </aside>

      <aside className="fixed bottom-0 right-0 top-12 z-20 hidden w-72 overflow-y-auto border-l border-neutral-200 bg-white p-5 xl:block">
        {infoBar}
      </aside>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 top-12 z-20 bg-black/30 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed bottom-0 left-0 top-12 z-30 w-72 border-r border-neutral-200 bg-white lg:hidden">
            {sidebar}
          </aside>
        </>
      )}

      <main className="pt-12 lg:pl-72 xl:pr-72">
        <div className="mx-auto max-w-5xl px-6 py-12">
          {selection.type === "overview" || !active ? (
            <Overview
              title={content.title}
              description={content.description}
              course={course}
              doneSet={doneSet}
              loadingId={loadingId}
              paywall={paywall}
              startLabel={startLabel}
              doneCount={doneCount}
              totalLessons={totalLessons}
              onStart={startOrContinue}
              onOpen={openLesson}
            />
          ) : (
            <article>
              <p className="text-[13px] text-neutral-400">
                Module {active.moduleIndex + 1} · {active.module.title}
              </p>
              <h1 className="mt-2 text-[28px] font-semibold tracking-tight">
                {active.lesson.title}
              </h1>
              {active.lesson.description && (
                <p className="mt-2 text-[16px] leading-relaxed text-neutral-500">
                  {active.lesson.description}
                </p>
              )}
              {active.lesson.concepts?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {active.lesson.concepts.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-neutral-200 px-2.5 py-0.5 text-[12px] text-neutral-600"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}

              <div className="my-8 border-t border-neutral-200" />

              {activeBody && <LessonBodyView body={activeBody} />}

              <div className="mt-12 flex items-center justify-between border-t border-neutral-200 pt-6">
                {activeIndex > 0 ? (
                  <button
                    type="button"
                    onClick={() =>
                      openLesson(
                        flat[activeIndex - 1].lesson,
                        flat[activeIndex - 1].module,
                      )
                    }
                    className="flex items-center gap-1.5 text-[14px] text-neutral-600 hover:text-neutral-900"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                ) : (
                  <span />
                )}
                {activeIndex < flat.length - 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      openLesson(
                        flat[activeIndex + 1].lesson,
                        flat[activeIndex + 1].module,
                      )
                    }
                    className="flex items-center gap-1.5 rounded-md bg-neutral-900 px-4 py-2 text-[14px] font-medium text-white hover:bg-neutral-800"
                  >
                    Next lesson
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>

              {paywall && <Paywall message={paywall} />}
            </article>
          )}
        </div>
      </main>
    </div>
  );
}

function Paywall({ message }: { message: string }) {
  return (
    <div className="mt-6 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
      <Lock size={15} className="shrink-0 text-amber-700" />
      <p className="flex-1 text-[14px] text-amber-900">{message}</p>
      <a
        href="/settings/upgrade"
        className="shrink-0 rounded-md bg-neutral-900 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-neutral-800"
      >
        Upgrade
      </a>
    </div>
  );
}

function Overview({
  title,
  description,
  course,
  doneSet,
  loadingId,
  paywall,
  startLabel,
  doneCount,
  totalLessons,
  onStart,
  onOpen,
}: {
  title: string;
  description?: string;
  course?: AiCourseContent;
  doneSet: Set<string>;
  loadingId: string | null;
  paywall: string | null;
  startLabel: string;
  doneCount: number;
  totalLessons: number;
  onStart: () => void;
  onOpen: (lesson: AiLesson, module: AiModule) => void;
}) {
  return (
    <div>
      <h1 className="text-[34px] font-semibold tracking-tight">{title}</h1>
      {description && (
        <p className="mt-3 text-[17px] leading-relaxed text-neutral-500">
          {description}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 xl:hidden">
        <button
          type="button"
          onClick={onStart}
          className="rounded-md bg-neutral-900 px-4 py-2 text-[14px] font-medium text-white hover:bg-neutral-800"
        >
          {startLabel}
        </button>
        {course && (
          <p className="text-[13.5px] text-neutral-500">
            {course.difficulty && <>{course.difficulty} · </>}
            {doneCount} of {totalLessons} lessons done
          </p>
        )}
      </div>

      {paywall && <Paywall message={paywall} />}

      {(course?.about || course?.coversList?.length) && (
        <section className="mt-10 border-t border-neutral-200 pt-8">
          <h2 className="text-[19px] font-semibold">About this course</h2>
          {course?.about && (
            <p className="mt-3 text-[15.5px] leading-7 text-neutral-600">
              {course.about}
            </p>
          )}

          {course?.coversList && course.coversList.length > 0 && (
            <div className="mt-6">
              <h3 className="text-[15px] font-semibold text-neutral-900">
                What this course covers
              </h3>
              <ul className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                {course.coversList.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[14.5px] leading-relaxed text-neutral-600"
                  >
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-neutral-900" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <section className="mt-10 space-y-4 border-t border-neutral-200 pt-8">
        <h2 className="text-[19px] font-semibold">Course content</h2>
        {course?.modules?.map((mod, mi) => {
          const modDone = mod.lessons.filter((l) => doneSet.has(l.id)).length;
          return (
            <div
              key={mod.id}
              className="overflow-hidden rounded-lg border border-neutral-200"
            >
              <div className="flex items-start gap-3 bg-neutral-50 px-5 py-4">
                <NumberBadge n={mi + 1} active size="md" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-[15.5px] font-semibold">{mod.title}</h3>
                  {mod.description && (
                    <p className="mt-1 text-[14px] leading-relaxed text-neutral-500">
                      {mod.description}
                    </p>
                  )}
                </div>
                <span className="shrink-0 rounded-full border border-neutral-200 bg-white px-2.5 py-0.5 text-[12px] text-neutral-500">
                  {modDone} / {mod.lessons.length}
                </span>
              </div>
              <ul className="divide-y divide-neutral-100">
                {mod.lessons.map((lesson, li) => {
                  const isDone = doneSet.has(lesson.id);
                  return (
                    <li key={lesson.id}>
                      <button
                        type="button"
                        onClick={() => onOpen(lesson, mod)}
                        disabled={loadingId === lesson.id}
                        className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-neutral-50 disabled:opacity-60"
                      >
                        <span className="w-8 shrink-0 text-[12.5px] text-neutral-400">
                          {mi + 1}.{li + 1}
                        </span>
                        <span className="flex-1 text-[14.5px] text-neutral-800">
                          {lesson.title}
                        </span>
                        {loadingId === lesson.id ? (
                          <Loader2
                            size={13}
                            className="animate-spin text-neutral-400"
                          />
                        ) : isDone ? (
                          <Check size={14} className="text-neutral-900" />
                        ) : (
                          lesson.duration && (
                            <span className="text-[12.5px] text-neutral-400">
                              {lesson.duration}
                            </span>
                          )
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </section>
    </div>
  );
}
