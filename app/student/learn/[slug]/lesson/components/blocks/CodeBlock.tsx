"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CodeBlock({
  content,
  overview,
  metadata,
}: {
  content: string;
  overview?: string | null;
  metadata?: { language?: string };
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="rounded-xl overflow-hidden mb-3 bg-[#0e1430] border border-[#E5E7EB]">
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <span
            className="text-sm font-semibold uppercase tracking-wide"
            style={{ color: "#8B84A0" }}
          >
            {metadata?.language ?? "code"}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-sm font-medium transition-colors"
            style={{ color: copied ? "#4ADE80" : "#8B84A0" }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre
          className="text-base p-4 overflow-x-auto text-[#E5E7EB]"
        >
          <code>{content}</code>
        </pre>
      </div>
      {overview && (
        <p className="text-base font-noto mt-2" style={{ color: "#6B7280" }}>
          {overview}
        </p>
      )}
    </div>
  );
}
