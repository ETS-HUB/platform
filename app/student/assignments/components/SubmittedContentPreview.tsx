import { Link2, FileText, ExternalLink } from "lucide-react";
import type { MySubmission } from "@/apis/assignments/types";
import Link from "next/link";

export function SubmittedContentPreview({
  submission,
}: {
  submission: MySubmission;
}) {
  const hasContent =
    submission.link ||
    (submission.files && submission.files.length > 0) ||
    submission.text;
  if (!hasContent) return null;

  return (
    <div className="rounded-xl p-4 mb-4 bg-[#FAFAFA] border border-[#E5E7EB]">
      <h4 className="text-sm font-semibold uppercase tracking-wide mb-3 text-[#9CA3AF]">
        Your submission
      </h4>

      {submission.link && (
        <Link
          href={submission.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-base mb-2 hover:underline text-primary"
        >
          <Link2 size={13} />
          <span className="truncate">{submission.link}</span>
          <ExternalLink size={11} className="shrink-0" />
        </Link>
      )}

      {submission.files && submission.files.length > 0 && (
        <div className="flex flex-col gap-1.5 mb-2">
          {submission.files.map((f, i) => (
            <Link
              key={i}
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-base text-gray-700 hover:underline"
            >
              <FileText size={12} style={{ color: "#8B84A0" }} />
              {f.fileName}
              <span style={{ color: "#9CA3AF" }}>
                ({(f.fileSize / 1024).toFixed(0)} KB)
              </span>
            </Link>
          ))}
        </div>
      )}

      {submission.text && (
        <p className="text-base leading-relaxed text-[#374151]">
          {submission.text}
        </p>
      )}
    </div>
  );
}
