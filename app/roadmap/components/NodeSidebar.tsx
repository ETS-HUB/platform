"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Link from "next/link";
import type { Node } from "@xyflow/react";
import {
  X,
  CheckCircle2,
  Clock,
  SkipForward,
  LogIn,
  BadgeCheck,
  FileText,
  PlayCircle,
  Link2,
  ExternalLink,
  Sparkles,
  ArrowUp,
  Lightbulb,
  GraduationCap,
  HelpCircle,
  BookOpen,
  Library,
  Bot,
  type LucideIcon,
} from "lucide-react";

import { useLazyGetNodeContentQuery } from "@/apis/roadmap/roadmapService";
import type { NodeStatus } from "@/apis/roadmap/types";

const BRAND = "#3A0CA3";
const INK = "#0e1430";
const LINE = "#EDE0FB";
const LINE_STRONG = "#CDB8F2"; // darker border so cards are easy to see
const BODY = "#111827"; // darker body text

// ── Progress options ─────────────────────────────────────────────────────
const STATUS_OPTIONS: {
  value: NodeStatus;
  label: string;
  Icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
}[] = [
  {
    value: "IN_PROGRESS",
    label: "Learning",
    Icon: Clock,
    color: "#92400E",
    bg: "#FFFBEB",
    border: "#F59E0B",
  },
  {
    value: "DONE",
    label: "Done",
    Icon: CheckCircle2,
    color: "#065F46",
    bg: "#ECFDF5",
    border: "#34D399",
  },
  {
    value: "SKIP",
    label: "Skip",
    Icon: SkipForward,
    color: "#374151",
    bg: "#F3F4F6",
    border: "#9CA3AF",
  },
];

// ── Resource types ───────────────────────────────────────────────────────
const RESOURCE_TYPES = {
  official: {
    plural: "Official docs",
    Icon: BadgeCheck,
    color: "#065F46",
    bg: "#D1FAE5",
  },
  article: {
    plural: "Articles",
    Icon: FileText,
    color: "#1E40AF",
    bg: "#DBEAFE",
  },
  video: {
    plural: "Videos",
    Icon: PlayCircle,
    color: "#9F1239",
    bg: "#FFE4E6",
  },
  other: { plural: "More links", Icon: Link2, color: "#374151", bg: "#E5E7EB" },
} as const;

type ResourceKind = keyof typeof RESOURCE_TYPES;
const KIND_ORDER: ResourceKind[] = ["official", "article", "video", "other"];

const kindOf = (type?: string): ResourceKind => {
  const k = (type ?? "").toLowerCase();
  return k === "official" || k === "article" || k === "video" ? k : "other";
};

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

// ── Title from the "# Heading" at the start of the description ───────────
const decode = (s: string) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");

/**
 * Looks for a leading "# Title" in the description. Works for plain text
 * ("# Title\n...") and for HTML where the hash sits inside the first tag
 * (<p># Title</p>, <h1># Title</h1>, "# Title<br>...").
 * Returns the title and the description with that heading removed.
 */
const splitTitle = (html?: string | null) => {
  if (!html) return { title: null as string | null, body: "" };
  const m = html.match(
    /^\s*(?:<(p|h[1-6]|div)[^>]*>\s*)?#{1,6}[ \t]*([^<\n\r]+?)\s*(?:<\/\1>|<br\s*\/?>|\r?\n|$)/i,
  );
  if (!m) return { title: null, body: html };
  const title = decode(m[2]).trim();
  return { title: title || null, body: html.slice(m[0].length).trim() };
};

// ── Smart Tutor quick prompts ────────────────────────────────────────────
const PROMPTS: {
  label: string;
  hint: string;
  Icon: LucideIcon;
  text: (t: string) => string;
}[] = [
  {
    label: "Explain simply",
    hint: "Plain-language explanation with an example",
    Icon: Lightbulb,
    text: (t) => `Explain "${t}" in simple terms with an example.`,
  },
  {
    label: "Teach me",
    hint: "Step by step, starting from the basics",
    Icon: GraduationCap,
    text: (t) => `Teach me "${t}" step by step, starting from the basics.`,
  },
  {
    label: "Quiz me",
    hint: "5 questions to check what you know",
    Icon: HelpCircle,
    text: (t) => `Quiz me on "${t}" with 5 questions.`,
  },
];

export type ChatMessage = { role: "user" | "assistant"; content: string };
type Tab = "resources" | "tutor";

interface NodeSidebarProps {
  slug: string;
  node: Node;
  currentStatus: NodeStatus | null;
  isAuthenticated: boolean;
  onClose: () => void;
  onSetStatus: (s: NodeStatus) => void;
  onUnset: () => void;
  onAuthRequired?: (action: string) => void;
  /** Called with the user's question. Wire this to your AI endpoint. */
  onAskAI?: (question: string) => void;
  /**
   * Optional: the full conversation, if you manage it outside this component.
   * When omitted, the sidebar just lists the questions the user has asked.
   */
  messages?: ChatMessage[];
  /** Optional: show the "thinking" indicator while your AI endpoint responds. */
  aiLoading?: boolean;
}

export default function NodeSidebar({
  slug,
  node,
  currentStatus,
  isAuthenticated,
  onClose,
  onSetStatus,
  onUnset,
  onAuthRequired,
  onAskAI,
  messages,
  aiLoading = false,
}: NodeSidebarProps) {
  const fallbackLabel = ((node.data as any)?.label as string) || node.id;

  const [fetchNodeContent, { data: nodeContent, isFetching }] =
    useLazyGetNodeContentQuery();

  const [tab, setTab] = useState<Tab>("resources");
  const [question, setQuestion] = useState("");
  const [localHistory, setLocalHistory] = useState<ChatMessage[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (node?.id) fetchNodeContent({ slug, nodeId: node.id });
  }, [node?.id, slug, fetchNodeContent]);

  // Fresh question box + conversation for each topic
  useEffect(() => {
    setQuestion("");
    setLocalHistory([]);
    if (inputRef.current) inputRef.current.style.height = "auto";
  }, [node.id]);

  // Esc closes the panel
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Title comes from the "# ..." in the description; fall back to node label
  const { title: hashTitle, body: descriptionHtml } = useMemo(
    () => splitTitle(nodeContent?.description),
    [nodeContent?.description],
  );
  const title = hashTitle || fallbackLabel;

  const groups = useMemo(() => {
    const list = (nodeContent?.resources ?? []) as any[];
    return KIND_ORDER.map((kind) => ({
      kind,
      items: list.filter((r) => kindOf(r.type) === kind),
    })).filter((g) => g.items.length > 0);
  }, [nodeContent]);

  const resourceCount = groups.reduce((n, g) => n + g.items.length, 0);

  const chat = messages ?? localHistory;

  // Keep the newest message in view
  useEffect(() => {
    if (tab !== "tutor") return;
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [tab, chat.length, aiLoading]);

  const grow = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  };

  const submit = () => {
    const q = question.trim();
    if (!q) return;
    onAskAI?.(q);
    if (!messages) {
      setLocalHistory((h) => [...h, { role: "user", content: q }]);
    }
    setQuestion("");
    if (inputRef.current) inputRef.current.style.height = "auto";
  };

  const applyPrompt = (text: string) => {
    setQuestion(text);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      if (inputRef.current) grow(inputRef.current);
    });
  };

  const TABS: {
    id: Tab;
    label: string;
    Icon: LucideIcon;
    ai?: boolean;
  }[] = [
    { id: "resources", label: "Resources", Icon: Library },
    { id: "tutor", label: "Smart Tutor", Icon: Sparkles, ai: true },
  ];

  return (
    <aside
      className="fixed inset-y-0 right-0 z-40 flex w-full flex-col bg-white shadow-2xl sm:w-[620px]"
      style={{ borderLeft: `1px solid ${LINE_STRONG}` }}
    >
      <header
        className="px-6 pt-4 pb-4"
        style={{ borderBottom: `1px solid ${LINE_STRONG}` }}
      >
        {/* Toggle: Resources / Smart Tutor */}
        <div className="flex items-center gap-3">
          <div
            role="tablist"
            aria-label="Topic view"
            className="grid flex-1 grid-cols-2 gap-1 rounded-xl p-1"
            style={{ background: "#E9E1F8" }}
          >
            {TABS.map(({ id, label, Icon, ai }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(id)}
                  className="flex items-center justify-center gap-2 rounded-lg py-2.5 text-[14px] font-bold transition-all"
                  style={
                    active
                      ? {
                          background: "#fff",
                          color: BRAND,
                          boxShadow: "0 1px 4px rgba(58,12,163,0.25)",
                        }
                      : { color: "#374151" }
                  }
                >
                  <Icon size={16} />
                  {label}
                  {ai && (
                    <span
                      className="rounded px-1.5 py-px text-[10px] font-extrabold leading-4 text-white"
                      style={{ background: BRAND }}
                    >
                      AI
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
          >
            <X size={20} className="text-gray-700" />
          </button>
        </div>

        {/* Title (from the "# ..." in the description) */}
        <div className="mt-4 min-w-0">
          {isFetching ? (
            <div className="h-9 w-2/3 animate-pulse rounded bg-gray-200" />
          ) : (
            <h2
              className="break-words text-[35px] font-extrabold leading-tight tracking-[0]"
              style={{ color: INK }}
            >
              {title}
            </h2>
          )}
        </div>

        {isAuthenticated ? (
          <>
            <div
              role="group"
              aria-label="Progress"
              className="mt-4 grid grid-cols-3 gap-1 rounded-xl p-1"
              style={{ background: "#E9E1F8" }}
            >
              {STATUS_OPTIONS.map((o) => {
                const active = currentStatus === o.value;
                const Icon = o.Icon;
                return (
                  <button
                    key={o.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => (active ? onUnset() : onSetStatus(o.value))}
                    className="flex items-center justify-center gap-1.5 rounded-lg py-2 text-[13px] font-semibold transition-all"
                    style={
                      active
                        ? {
                            background: o.bg,
                            color: o.color,
                            boxShadow: `inset 0 0 0 1.5px ${o.border}`,
                          }
                        : { color: "#374151" }
                    }
                  >
                    <Icon size={15} />
                    {o.label}
                  </button>
                );
              })}
            </div>
            {currentStatus && (
              <p className="mt-2 text-[12px] text-gray-800">
                Tap the active status again to clear it.
              </p>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={() => onAuthRequired?.("track your progress")}
            className="mt-4 flex items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: BRAND }}
          >
            <LogIn size={14} />
            Sign in to track your progress
          </button>
        )}
      </header>

      {tab === "resources" ? (
        /* ───────────── Resources view ───────────── */
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {isFetching ? (
            <div className="animate-pulse space-y-3">
              <div className="h-3 w-full rounded bg-gray-200" />
              <div className="h-3 w-11/12 rounded bg-gray-200" />
              <div className="h-3 w-4/5 rounded bg-gray-200" />
              <div className="mt-6 h-16 w-full rounded-xl bg-gray-200" />
              <div className="h-16 w-full rounded-xl bg-gray-200" />
            </div>
          ) : nodeContent ? (
            <div className="flex flex-col gap-8">
              {descriptionHtml && (
                <div
                  className="prose max-w-none font-medium text-[15.5px] leading-7"
                  style={
                    {
                      color: BODY,
                      "--tw-prose-body": BODY,
                      "--tw-prose-headings": INK,
                      "--tw-prose-bold": INK,
                      "--tw-prose-links": BRAND,
                      "--tw-prose-bullets": "#4B5563",
                      "--tw-prose-counters": "#4B5563",
                    } as CSSProperties
                  }
                  // Sanitize this HTML (e.g. with DOMPurify) if it can be user-authored.
                  dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                />
              )}

              {groups.length > 0 && (
                <section className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <h3
                      className="text-[17px] font-extrabold"
                      style={{ color: INK }}
                    >
                      Free resources
                    </h3>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[13px] font-bold"
                      style={{ background: "#E9DDFB", color: BRAND }}
                    >
                      {resourceCount}
                    </span>
                  </div>

                  {groups.map(({ kind, items }) => {
                    const t = RESOURCE_TYPES[kind];
                    const GroupIcon = t.Icon;
                    return (
                      <div key={kind}>
                        <h4
                          className="mb-3 flex items-center gap-2 text-[14px] font-bold"
                          style={{ color: t.color }}
                        >
                          <GroupIcon size={16} />
                          {t.plural}
                        </h4>
                        <ul className="flex flex-col gap-3">
                          {items.map((r: any, i: number) => (
                            <li key={`${r.url}-${i}`}>
                              <a
                                href={r.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-4 rounded-xl border-2 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                style={{ borderColor: LINE_STRONG }}
                              >
                                <span
                                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                                  style={{ background: t.bg, color: t.color }}
                                >
                                  <GroupIcon size={22} />
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span
                                    className="line-clamp-2 block text-[15.5px] font-bold leading-snug"
                                    style={{ color: INK }}
                                  >
                                    {r.title}
                                  </span>
                                  {hostOf(r.url) && (
                                    <span className="mt-1 block truncate text-[13px] font-medium text-gray-700">
                                      {hostOf(r.url)}
                                    </span>
                                  )}
                                </span>
                                <ExternalLink
                                  size={18}
                                  className="shrink-0 text-gray-500 transition-colors group-hover:text-[#3A0CA3]"
                                />
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </section>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: "#E9DDFB", color: BRAND }}
              >
                <BookOpen size={22} />
              </span>
              <p className="text-[15px] font-bold" style={{ color: INK }}>
                No content for this topic yet
              </p>
              <p className="max-w-[280px] text-[13.5px] text-gray-700">
                You can still open the Smart Tutor tab and ask it to explain
                this topic.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <div ref={chatRef} className="flex-1 overflow-y-auto px-6 py-5">
            {chat.length === 0 ? (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-3 pt-2 text-center">
                  <h3
                    className="text-[20px] font-extrabold"
                    style={{ color: INK }}
                  >
                    Your Smart Tutor
                  </h3>
                  <p className="max-w-[360px] text-[14.5px] leading-6 text-gray-800">
                    Ask anything about {title}. Pick a starter below or write
                    your own question.
                  </p>
                </div>

                <ul className="flex flex-col gap-3">
                  {PROMPTS.map(({ label, hint, Icon, text }) => (
                    <li key={label}>
                      <button
                        type="button"
                        onClick={() => applyPrompt(text(title))}
                        className="group flex w-full items-center gap-4 rounded-xl border-2 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        style={{ borderColor: LINE_STRONG }}
                      >
                        <span
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                          style={{ background: "#E9DDFB", color: BRAND }}
                        >
                          <Icon size={21} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className="block text-[15px] font-bold"
                            style={{ color: INK }}
                          >
                            {label}
                          </span>
                          <span className="block text-[13px] text-gray-700">
                            {hint}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {chat.map((m, i) =>
                  m.role === "user" ? (
                    <div key={i} className="flex justify-end">
                      <p
                        className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md px-4 py-2.5 text-[14.5px] leading-6 text-white"
                        style={{ background: BRAND }}
                      >
                        {m.content}
                      </p>
                    </div>
                  ) : (
                    <div key={i} className="flex items-start gap-2.5">
                      <span
                        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white"
                        style={{ background: BRAND }}
                      >
                        <Bot size={17} />
                      </span>
                      <p
                        className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tl-md px-4 py-2.5 text-[14.5px] leading-6"
                        style={{ background: "#EFE6FC", color: BODY }}
                      >
                        {m.content}
                      </p>
                    </div>
                  ),
                )}

                {aiLoading && (
                  <div className="flex items-center gap-2.5">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white"
                      style={{ background: BRAND }}
                    >
                      <Bot size={17} />
                    </span>
                    <span
                      className="flex gap-1 rounded-2xl px-4 py-3"
                      style={{ background: "#EFE6FC" }}
                      aria-label="Smart Tutor is thinking"
                    >
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#3A0CA3]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#3A0CA3] [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#3A0CA3] [animation-delay:300ms]" />
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <footer
            className="px-5 pt-3 pb-4"
            style={{
              borderTop: `1px solid ${LINE_STRONG}`,
              background: "#FCFBFF",
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="flex items-end gap-2 rounded-2xl border-2 bg-white p-2 transition-shadow focus-within:ring-2 focus-within:ring-[#3A0CA3]/25"
              style={{ borderColor: LINE_STRONG }}
            >
              <textarea
                ref={inputRef}
                rows={1}
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                  grow(e.target);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit();
                  }
                }}
                placeholder={`Ask anything about ${title}…`}
                className="max-h-32 min-h-[36px] flex-1 resize-none bg-transparent px-2 py-1.5 text-[14.5px] text-gray-900 outline-none placeholder:text-gray-500"
              />
              <button
                type="submit"
                disabled={!question.trim()}
                aria-label="Send question"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white transition-opacity disabled:opacity-30"
                style={{ background: BRAND }}
              >
                <ArrowUp size={17} />
              </button>
            </form>
          </footer>
        </div>
      )}
    </aside>
  );
}
