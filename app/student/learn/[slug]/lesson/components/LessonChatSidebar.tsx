"use client";

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";

import { ChatMessageBubble } from "./ChatMessageBubble";

import type { NavLessonItem, ChatMessage } from "@/apis/lessons/types";
export function LessonChatSidebar({
  messages,
  tutorName,
  onSend,
}: {
  messages: ChatMessage[];
  tutorName: string;
  onSend: (text: string) => void;
}) {
  const [draft, setDraft] = useState("");

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setDraft("");
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ borderLeft: "1px solid #EDEDED" }}
    >
      {/* header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid #EDEDED" }}
      >
        <div className="flex items-center gap-2">
          <MessageCircle size={16} style={{ color: "#3A0CA3" }} />
          <h3 className="text-[13.5px] font-bold" style={{ color: "#0e1430" }}>
            Chat with {tutorName}
          </h3>
        </div>
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center text-center mt-10 gap-2">
            <div
              className="flex items-center justify-center rounded-full w-10 h-10"
              style={{ background: "#F5EEFE" }}
            >
              <MessageCircle size={16} style={{ color: "#3A0CA3" }} />
            </div>
            <p className="text-[12.5px]" style={{ color: "#9CA3AF" }}>
              Ask {tutorName} anything about this lesson.
            </p>
          </div>
        ) : (
          messages.map((m) => <ChatMessageBubble key={m.id} message={m} />)
        )}
      </div>

      {/* composer */}
      <div className="p-3.5" style={{ borderTop: "1px solid #EDEDED" }}>
        <div
          className="flex items-center gap-2 rounded-full px-3.5 py-1.5"
          style={{ background: "#F5F5F5" }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Message your tutor..."
            className="flex-1 bg-transparent text-[13px] outline-none py-1.5"
            style={{ color: "#1A1A1A" }}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!draft.trim()}
            className="flex items-center justify-center rounded-full w-7 h-7 shrink-0 transition-opacity disabled:opacity-30"
            style={{ background: "#3A0CA3" }}
          >
            <Send size={12} style={{ color: "#FFFFFF" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
