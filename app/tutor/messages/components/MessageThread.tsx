"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Paperclip, FileText, ImageIcon } from "lucide-react";
import type {
  ChatMessage,
  ChatUser,
  ParsedMessageContent,
} from "@/apis/tutor/messages/types";

function formatDateSeparator(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (isSameDay(date, today)) return "Today";
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (isSameDay(date, yesterday)) return "Yesterday";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Message bubble variants ────────────────────────────────────────────────

function TextBubble({ content, isOwn }: { content: string; isOwn: boolean }) {
  return (
    <span className="text-[13px] leading-relaxed whitespace-pre-wrap">
      {content}
    </span>
  );
}

function ImageBubble({
  parsed,
  isOwn,
}: {
  parsed: ParsedMessageContent;
  isOwn: boolean;
}) {
  return (
    <a href={parsed.url} target="_blank" rel="noopener noreferrer">
      <img
        src={parsed.url}
        alt={parsed.fileName}
        className="rounded-xl max-w-[220px] max-h-[200px] object-cover block"
      />
      <p
        className={`text-[10px] mt-1 ${isOwn ? "text-white/60" : "text-gray-400"}`}
      >
        {parsed.fileName}
      </p>
    </a>
  );
}

function DocumentBubble({
  parsed,
  isOwn,
}: {
  parsed: ParsedMessageContent;
  isOwn: boolean;
}) {
  return (
    <a
      href={parsed.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5"
    >
      <div
        className="flex items-center justify-center rounded-lg w-9 h-9 shrink-0"
        style={{ background: isOwn ? "rgba(255,255,255,0.15)" : "#EDE0FB" }}
      >
        <FileText size={16} style={{ color: isOwn ? "#FFFFFF" : "#3A0CA3" }} />
      </div>
      <div>
        <p
          className={`text-[12.5px] font-medium ${isOwn ? "text-white" : "text-gray-900"}`}
        >
          {parsed.fileName}
        </p>
        {parsed.fileSize && (
          <p
            className={`text-[10.5px] ${isOwn ? "text-white/60" : "text-gray-400"}`}
          >
            {formatFileSize(parsed.fileSize)}
          </p>
        )}
      </div>
    </a>
  );
}

function MessageBubble({ msg, isOwn }: { msg: ChatMessage; isOwn: boolean }) {
  const timestamp = (
    <p
      className={`text-[10px] mt-1.5 ${isOwn ? "text-white/60" : "text-gray-400"}`}
    >
      {new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </p>
  );

  const bubbleBase = `max-w-[65%] px-3.5 py-2.5 rounded-2xl ${
    isOwn ? "rounded-br-md text-white" : "rounded-bl-md text-gray-900"
  }`;

  const bubbleBg = isOwn ? "#3A0CA3" : "#F3F4F6";

  if (msg.parsed?.type === "image") {
    return (
      <div
        className={bubbleBase}
        style={{ background: bubbleBg, padding: "6px" }}
      >
        <ImageBubble parsed={msg.parsed} isOwn={isOwn} />
        {timestamp}
      </div>
    );
  }

  if (msg.parsed?.type === "document") {
    return (
      <div className={bubbleBase} style={{ background: bubbleBg }}>
        <DocumentBubble parsed={msg.parsed} isOwn={isOwn} />
        {timestamp}
      </div>
    );
  }

  return (
    <div className={bubbleBase} style={{ background: bubbleBg }}>
      <TextBubble content={msg.content} isOwn={isOwn} />
      {timestamp}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export function MessageThread({
  otherUser,
  isOnline,
  isTyping,
  messages,
  currentUserId,
  onSend,
  onSendFile,
  onTypingChange,
}: {
  otherUser: ChatUser;
  isOnline: boolean;
  isTyping: boolean;
  messages: ChatMessage[];
  currentUserId: string;
  onSend: (content: string) => void;
  onSendFile: (file: File) => Promise<void>;
  onTypingChange: (typing: boolean) => void;
}) {
  const [draft, setDraft] = useState("");
  const [uploading, setUploading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setDraft("");
    onTypingChange(false);
  };

  const handleChange = (value: string) => {
    setDraft(value);
    onTypingChange(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => onTypingChange(false), 2000);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setUploading(true);
    try {
      await onSendFile(file);
    } finally {
      setUploading(false);
    }
  };

  let lastDateLabel = "";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-3.5"
        style={{ borderBottom: "1px solid #EDEDED" }}
      >
        <img
          src={
            otherUser.avatar ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser.firstName}`
          }
          alt=""
          className="w-9 h-9 rounded-full object-cover"
        />
        <div>
          <p className="text-[13.5px] font-bold" style={{ color: "#0e1430" }}>
            {otherUser.firstName} {otherUser.lastName}
          </p>
          <p
            className="text-[11px]"
            style={{
              color: isTyping ? "#3A0CA3" : isOnline ? "#22C55E" : "#9CA3AF",
            }}
          >
            {isTyping ? "typing..." : isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-1">
        {messages.map((msg) => {
          const dateLabel = formatDateSeparator(msg.createdAt);
          const showSeparator = dateLabel !== lastDateLabel;
          lastDateLabel = dateLabel;
          const isOwn = msg.senderId === currentUserId;

          return (
            <div key={msg.id}>
              {showSeparator && (
                <div className="flex items-center gap-2 my-3">
                  <div
                    className="flex-1 h-px"
                    style={{ background: "#F0F0F0" }}
                  />
                  <span
                    className="text-[10.5px] font-medium"
                    style={{ color: "#B0B0B0" }}
                  >
                    {dateLabel}
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ background: "#F0F0F0" }}
                  />
                </div>
              )}
              <div
                className={`flex mb-2 ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <MessageBubble msg={msg} isOwn={isOwn} />
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3" style={{ borderTop: "1px solid #EDEDED" }}>
        <div
          className="flex items-center gap-2 rounded-full px-3.5 py-1.5"
          style={{ background: "#F5F5F5" }}
        >
          {/* Attach file */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center justify-center shrink-0 rounded-full w-7 h-7 disabled:opacity-40"
            style={{ color: "#8B84A0" }}
            title="Attach file"
          >
            {uploading ? (
              <span className="text-[10px]">...</span>
            ) : (
              <Paperclip size={15} />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx,.zip,.txt"
            className="hidden"
            onChange={handleFileSelect}
          />

          <input
            value={draft}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-[13px] outline-none py-1.5"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!draft.trim()}
            className="flex items-center justify-center rounded-full w-7 h-7 shrink-0 disabled:opacity-30"
            style={{ background: "#3A0CA3" }}
          >
            <Send size={12} style={{ color: "#FFFFFF" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
