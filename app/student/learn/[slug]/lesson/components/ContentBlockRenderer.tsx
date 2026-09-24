"use client";

import { useState } from "react";
import {
  FileText,
  Video,
  Code2,
  Link2,
  ChevronUp,
  ChevronDown,
  HelpCircle,
  FolderGit2,
} from "lucide-react";
import type {
  ContentBlock,
  LessonQuestion,
  AnswerResult,
} from "@/apis/lessons/types";
import { VideoBlock } from "./blocks/VideoBlock";
import { CodeBlock } from "./blocks/CodeBlock";
import { ResourceLinkBlock } from "./blocks/ResourceLinkBlock";
import { ProjectBlock } from "./blocks/ProjectBlock";
import { InlineQuestion } from "./InlineQuestion";
import { TextBlock } from "./blocks/TextBlock";

const BLOCK_META: Record<
  ContentBlock["type"],
  { icon: typeof FileText; label: string; color: string }
> = {
  TEXT: { icon: FileText, label: "Read", color: "#3A0CA3" },
  VIDEO: { icon: Video, label: "Watch", color: "#F52593" },
  CODE: { icon: Code2, label: "Practice", color: "#059669" },
  RESOURCE_LINK: { icon: Link2, label: "Resource", color: "#D97706" },
  PROJECT: { icon: FolderGit2, label: "Project", color: "#7C3AED" },
};

export interface ContentBlockRendererProps {
  block: ContentBlock;
  onAnswer: (
    questionId: string,
    selectedOptionId: string,
  ) => Promise<AnswerResult>;
}

export function ContentBlockRenderer({
  block,
  onAnswer,
}: ContentBlockRendererProps) {
  const meta = BLOCK_META[block.type];
  const Icon = meta?.icon;
  const [collapsed, setCollapsed] = useState(false);

  const questions = (block.questions ?? [])
    .slice()
    .sort((a, b) => a.order - b.order);
  const questionCount = questions.length;

  return (
    <div
      className="rounded-2xl p-6 mb-4"
      style={{ background: "#FFFFFF", border: "1.5px solid #EDE0FB" }}
    >
      {/* <div className="flex items-center gap-2 mb-4">
        <div
          className="flex items-center justify-center rounded-full w-7 h-7"
          style={{ background: `${meta?.color}15` }}
        >
          <Icon size={13} style={{ color: meta?.color }} />
        </div>
        <span
          className="text-base font-medium uppercase tracking-wide"
          style={{ color: meta?.color }}
        >
          {meta?.label}
        </span>
        <h4 className="text-lg font-semibold" style={{ color: "#0e1430" }}>
          {block.title}
        </h4>
      </div> */}

      {block.type === "TEXT" && <TextBlock content={block.content} />}
      {block.type === "VIDEO" && (
        <VideoBlock
          content={block.content}
          overview={block.overview}
          metadata={block.metadata}
        />
      )}
      {block.type === "CODE" && (
        <CodeBlock
          content={block.content}
          overview={block.overview}
          metadata={block.metadata}
        />
      )}
      {block.type === "RESOURCE_LINK" && (
        <ResourceLinkBlock
          title={block.title}
          content={block.content}
          overview={block.overview}
        />
      )}
      {block.type === "PROJECT" && (
        <ProjectBlock
          content={block.content}
          overview={block.overview}
          assignmentId={block.id}
        />
      )}

      {questionCount > 0 && (
        <div
          className="mt-5 pl-4"
          style={{ borderLeft: `2px solid ${meta?.color}30` }}
        >
          {/* <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="flex items-center gap-2 text-[12px] font-semibold mb-3"
            style={{ color: meta?.color }}
          >
            <HelpCircle size={13} />
            {questionCount} {questionCount === 1 ? "question" : "questions"}
            {collapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
          </button> */}

          {!collapsed && (
            <div className="flex flex-col gap-3">
              {questions.map((q: LessonQuestion, i) => (
                <InlineQuestion
                  key={q.id}
                  question={q}
                  index={questionCount > 1 ? i + 1 : undefined}
                  onAnswer={onAnswer}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
