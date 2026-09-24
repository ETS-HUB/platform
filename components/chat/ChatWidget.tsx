"use client";

import { useState, useRef, useEffect } from "react";
import { Drawer, Badge, Input } from "antd";
import { MessageCircle, Send, X } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import {
  useGetMessagesWithUserQuery,
  useSendMessageMutation,
} from "@/apis/chat/chatService";
import type { ChatMessage } from "@/apis/chat/types";

interface ChatWidgetProps {
  recipientId: string;
  recipientName: string;
  recipientAvatar: string | null;
  unreadCount?: number;
}

export function ChatWidget({
  recipientId,
  recipientName,
  recipientAvatar,
  unreadCount = 0,
}: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: initialMessages } = useGetMessagesWithUserQuery(recipientId, {
    skip: !open,
  });
  const [sendMessageRest] = useSendMessageMutation();

  const {
    messages: realtimeMessages,
    setMessages,
    sendMessage,
    emitTyping,
    emitStopTyping,
    isTyping,
    connected,
  } = useChat({ recipientId });

  // Load initial messages when drawer opens
  useEffect(() => {
    if (initialMessages?.messages) {
      setMessages(initialMessages.messages);
    }
  }, [initialMessages, setMessages]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [realtimeMessages]);

  const handleSend = async () => {
    const content = inputValue.trim();
    if (!content) return;
    setInputValue("");
    emitStopTyping();

    // Use socket if connected, otherwise fall back to REST
    if (connected) {
      sendMessage(content);
    } else {
      try {
        await sendMessageRest({ recipientId, content }).unwrap();
      } catch (err) {
        console.error("Failed to send message:", err);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    emitTyping();

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      emitStopTyping();
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 bg-primary-hover right-6 z-40 flex items-center gap-2.5 pl-2 pr-4 py-2 rounded-full shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.97]"
        aria-label={`Open chat with ${recipientName}`}
      >
        <div className="relative shrink-0">
          <img
            src={
              recipientAvatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${recipientName}`
            }
            alt=""
            className="w-9 h-9 rounded-full object-cover"
            style={{ border: "2px solid rgba(255,255,255,0.25)" }}
          />
          <span
            className="absolute bottom-0 right-0 rounded-full"
            style={{
              width: 10,
              height: 10,
              background: connected ? "#22C55E" : "#9CA3AF",
              border: "2px solid #3A0CA3",
            }}
          />
          {unreadCount > 0 && (
            <span
              className="absolute -top-1 -right-1 flex items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{
                minWidth: 17,
                height: 17,
                padding: "0 3px",
                background: "#F52593",
                border: "2px solid #3A0CA3",
              }}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>

        <div className="flex flex-col items-start leading-tight">
          <span className="text-[13px] font-semibold text-white">
            {recipientName}
          </span>
          <span
            className="text-[10.5px]"
            style={{ color: connected ? "#86EFAC" : "rgba(255,255,255,0.55)" }}
          >
            {connected ? "Online" : "Message"}
          </span>
        </div>

        <MessageCircle size={16} color="#FFFFFF" className="ml-0.5" />
      </button>

      {/* Chat Drawer */}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        placement="right"
        width={380}
        closable={false}
        styles={{
          body: {
            padding: 0,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          },
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-3 border-b border-gray-100"
          style={{ background: "#FAFAFA" }}
        >
          <img
            src={
              recipientAvatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${recipientName}`
            }
            alt={recipientName}
            className="w-9 h-9 rounded-full bg-white"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {recipientName}
            </p>
            {isTyping && (
              <p className="text-xs text-[#3A0CA3] animate-pulse">typing...</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {realtimeMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isFromMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                  msg.isFromMe
                    ? "rounded-br-md text-white"
                    : "rounded-bl-md text-gray-900"
                }`}
                style={{
                  background: msg.isFromMe ? "#3A0CA3" : "#F3F4F6",
                }}
              >
                {msg.content}
                <p
                  className={`text-[10px] mt-1 ${msg.isFromMe ? "text-white/60" : "text-gray-400"}`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          className="px-4 py-3 border-t border-gray-100"
          style={{ background: "#FAFAFA" }}
        >
          <div className="flex items-center gap-2">
            <Input
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="rounded-full"
              size="large"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors disabled:opacity-40"
              style={{ background: "#3A0CA3" }}
            >
              <Send size={16} color="#FFFFFF" />
            </button>
          </div>
        </div>
      </Drawer>
    </>
  );
}
