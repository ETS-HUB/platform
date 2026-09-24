import { ContentBlock } from "@/apis/lessons/types";
import {
  FileText,
  Video,
  Code2,
  Link2,
  FolderGit2,
  ClipboardCheck,
  Check,
  Lock,
} from "lucide-react";

const BLOCK_ICON: Record<ContentBlock["type"], typeof FileText> = {
  TEXT: FileText,
  VIDEO: Video,
  CODE: Code2,
  RESOURCE_LINK: Link2,
  PROJECT: FolderGit2,
};

interface BlockStepperProps {
  blocks: ContentBlock[];
  hasQuiz: boolean;
  currentIndex: number;
  maxReached: number;
  onSelect: (index: number) => void;
}

export function BlockStepper({
  blocks,
  hasQuiz,
  currentIndex,
  maxReached,
  onSelect,
}: BlockStepperProps) {
  const renderStep = (index: number, Icon: typeof FileText) => {
    const isCurrent = index === currentIndex;
    const isReachable = index <= maxReached + 1; // one step ahead of furthest = allowed
    const isVisited = index <= maxReached;

    return (
      <button
        key={index}
        type="button"
        disabled={!isReachable}
        onClick={() => isReachable && onSelect(index)}
        className="group flex-1 flex flex-col gap-1.5 disabled:cursor-not-allowed"
      >
        <div
          className="h-1.5 rounded-full transition-colors"
          style={{
            background: isCurrent
              ? "#3A0CA3"
              : isVisited
                ? "#C9BEDD"
                : "#EDE0FB",
          }}
        />
        <div className="flex items-center justify-center gap-1">
          {isVisited && !isCurrent ? (
            <Check size={20} style={{ color: "#8B84A0" }} />
          ) : !isReachable ? (
            <Lock size={20} style={{ color: "#D1D5DB" }} />
          ) : (
            <Icon
              size={20}
              style={{ color: isCurrent ? "#3A0CA3" : "#C9BEDD" }}
            />
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="flex items-center gap-1.5 mb-6">
      {blocks.map((block, i) =>
        renderStep(i, BLOCK_ICON[block.type] || FileText),
      )}
      {hasQuiz && renderStep(blocks.length, ClipboardCheck)}
    </div>
  );
}
