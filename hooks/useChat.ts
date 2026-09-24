"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import type { RootState } from "@/store";
import type { ChatMessage } from "@/apis/chat/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface UseChatOptions {
  recipientId: string | null;
}

export function useChat({ recipientId }: UseChatOptions) {
  const { accessToken } = useSelector((state: RootState) => state.tokens);
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [connected, setConnected] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!accessToken) return;

    const socket = io(`${API_URL}/chat`, {
      auth: { token: accessToken },
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("newMessage", (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("messageSent", (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("userTyping", ({ userId }: { userId: string }) => {
      if (userId === recipientId) setIsTyping(true);
    });

    socket.on("userStopTyping", ({ userId }: { userId: string }) => {
      if (userId === recipientId) setIsTyping(false);
    });

    socket.on("userOnline", ({ userId }: { userId: string }) => {
      if (userId === recipientId) setIsOnline(true);
    });

    socket.on("userOffline", ({ userId }: { userId: string }) => {
      if (userId === recipientId) setIsOnline(false);
    });

    // Check initial online status
    socket.emit("getOnlineUsers");

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [accessToken, recipientId]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!socketRef.current || !recipientId) return;
      socketRef.current.emit("sendMessage", { recipientId, content });
    },
    [recipientId],
  );

  const emitTyping = useCallback(() => {
    if (!socketRef.current || !recipientId) return;
    socketRef.current.emit("typing", { recipientId });
  }, [recipientId]);

  const emitStopTyping = useCallback(() => {
    if (!socketRef.current || !recipientId) return;
    socketRef.current.emit("stopTyping", { recipientId });
  }, [recipientId]);

  const markRead = useCallback((conversationId: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit("markRead", { conversationId });
  }, []);

  return {
    messages,
    setMessages,
    sendMessage,
    emitTyping,
    emitStopTyping,
    markRead,
    isTyping,
    isOnline,
    connected,
  };
}
