import { api } from "../api";
import type {
  Conversation,
  MessagesResponse,
  UnreadCountResponse,
  ChatMessage,
} from "./types";

export const chatService = api.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query<Conversation[], void>({
      query: () => "/api/chat/conversations",
      providesTags: ["Chat"],
    }),

    getMessages: builder.query<
      MessagesResponse,
      { conversationId: string; page?: number }
    >({
      query: ({ conversationId, page = 1 }) =>
        `/api/chat/messages/${conversationId}?page=${page}`,
      providesTags: (_r, _e, { conversationId }) => [
        { type: "Chat", id: conversationId },
      ],
    }),

    getMessagesWithUser: builder.query<MessagesResponse, string>({
      query: (otherUserId) => `/api/chat/messages/with/${otherUserId}`,
      providesTags: (_r, _e, userId) => [{ type: "Chat", id: userId }],
    }),

    sendMessage: builder.mutation<
      ChatMessage,
      { recipientId: string; content: string }
    >({
      query: (body) => ({
        url: "/api/chat/send",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Chat"],
    }),

    markRead: builder.mutation<void, string>({
      query: (conversationId) => ({
        url: `/api/chat/read/${conversationId}`,
        method: "POST",
      }),
      invalidatesTags: ["Chat"],
    }),

    getUnreadCount: builder.query<UnreadCountResponse, void>({
      query: () => "/api/chat/unread",
      providesTags: ["Chat"],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useGetMessagesWithUserQuery,
  useSendMessageMutation,
  useMarkReadMutation,
  useGetUnreadCountQuery,
} = chatService;
