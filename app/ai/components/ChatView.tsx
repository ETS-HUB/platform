"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Send, ArrowLeft } from "lucide-react";

import { CHAT_PROMPTS } from "@/constants";
import type { ChatMessage } from "@/apis/roadmap/tutor/types";
import type { MyLearningItem } from "@/apis/ai/types";

interface ChatViewProps {
  isAuthenticated: boolean;
  onAuthRequired?: () => void;
  myItems?: MyLearningItem[];
  apiUrl?: string;
  token?: string;
}

export default function ChatView({
  isAuthenticated,
  onAuthRequired,
  myItems = [],
  apiUrl = "",
  token,
}: ChatViewProps) {
  const topics = Object.keys(CHAT_PROMPTS);
  const [topic, setTopic] = useState(topics[0]);
  const [selectedContent, setSelectedContent] = useState<MyLearningItem | null>(
    null,
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [showContentSelector, setShowContentSelector] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, thinking]);

  const sendMessage = async (text: string) => {
    const content = text.trim();
    if (!content || thinking) return;
    if (!isAuthenticated) return onAuthRequired?.();

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };

    setMessages((m) => [...m, userMessage]);
    setInput("");
    setThinking(true);

    try {
      const endpoint = selectedContent
        ? `${apiUrl}/api/ai/chat`
        : `${apiUrl}/api/ai/chat/general`;

      const body = selectedContent
        ? { contentId: selectedContent.id, message: content }
        : { message: content };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
      };

      setMessages((m) => [...m, assistantMessage]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);

            if (data === "[DONE]") {
              setThinking(false);
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.token) {
                assistantContent += parsed.token;
                setMessages((m) => {
                  const updated = [...m];
                  updated[updated.length - 1] = {
                    ...assistantMessage,
                    content: assistantContent,
                  };
                  return updated;
                });
              }
            } catch (e) {}
          }
        }
      }
    } catch (error) {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setThinking(false);
    }
  };

  if (showContentSelector && myItems.length > 0) {
    return (
      <div className="mx-auto max-w-2xl text-center py-12">
        <h3 className="text-[22px] font-bold" style={{ color: "#0e1430" }}>
          Choose content to chat about
        </h3>
        <p className="mt-2 text-[14.5px]" style={{ color: "#6B7280" }}>
          Select one of your generated items for focused discussion
        </p>

        <div className="mt-8 space-y-3">
          {myItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setSelectedContent(item);
                setShowContentSelector(false);
              }}
              className="w-full rounded-xl border bg-white p-4 text-left transition-colors hover:bg-[#FAF7FF]"
              style={{ borderColor: "#EDE0FB" }}
            >
              <h4 className="font-semibold" style={{ color: "#0e1430" }}>
                {item.title}
              </h4>
              <p
                className="mt-1 text-[13px] line-clamp-1"
                style={{ color: "#6B7280" }}
              >
                {item.description}
              </p>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowContentSelector(false)}
          className="mt-6 text-[14px] font-medium transition-colors hover:text-[#3A0CA3]"
          style={{ color: "#6B7280" }}
        >
          ← Back to general chat
        </button>
      </div>
    );
  }

  return (
    <div
      className="mx-auto flex h-160 max-w-3xl flex-col overflow-hidden rounded-3xl border bg-white"
      style={{ borderColor: "#EDE0FB" }}
    >
      {/* Header */}
      {selectedContent && (
        <div
          className="flex items-center justify-between border-b px-5 py-3"
          style={{ borderColor: "#EDE0FB" }}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedContent(null)}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[#F5F0FF]"
            >
              <ArrowLeft size={18} style={{ color: "#6B7280" }} />
            </button>
            <div>
              <h4
                className="text-[14px] font-semibold"
                style={{ color: "#0e1430" }}
              >
                {selectedContent.title}
              </h4>
              <p className="text-[12px]" style={{ color: "#9CA3AF" }}>
                Chatting about this{" "}
                {(selectedContent.contentType ?? "").toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-5 py-6">
        {messages.length === 0 ? (
          <div>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-900 text-white">
              <Bot size={22} />
            </span>
            <h3 className="mt-4 text-[22px] font-semibold tracking-tight text-neutral-900">
              How can I help you?
            </h3>

            {myItems.length > 0 && !selectedContent && (
              <button
                type="button"
                onClick={() => setShowContentSelector(true)}
                className="mt-3 inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-[13px] font-medium text-neutral-800 transition-colors hover:bg-neutral-50"
              >
                Chat about your generated content
              </button>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {topics.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTopic(t)}
                  className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${
                    topic === t
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-2">
              {CHAT_PROMPTS[topic].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => sendMessage(p)}
                  className="block w-full rounded-lg border border-neutral-200 px-4 py-3 text-left text-[14px] text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-[14px] leading-relaxed ${
                    m.role === "user"
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-800"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {thinking && (
              <div className="flex gap-1.5 px-2">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-2 w-2 animate-bounce rounded-full bg-neutral-400"
                    style={{ animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}
      </div>
      <div className="border-t p-3" style={{ borderColor: "#EDE0FB" }}>
        <div
          className="flex items-end gap-2 rounded-2xl border bg-white px-4 py-2.5 focus-within:border-[#A78BFA]"
          style={{ borderColor: "#EDE0FB" }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            rows={1}
            maxLength={2000}
            placeholder="Ask me anything..."
            className="max-h-32 flex-1 resize-none bg-transparent py-1 text-[14px] outline-none placeholder:text-[#9CA3AF]"
          />
          <button
            type="button"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || thinking}
            aria-label="Send"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-opacity disabled:opacity-40"
            style={{ background: "#3A0CA3" }}
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
