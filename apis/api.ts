import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/apis/baseQueryWithReauth";

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Users",
    "Assessment",
    "Dashboard",
    "Lessons",
    "Bookmarks",
    "Practice",
    "Chat",
    "Assignments",
    "Analytics",
    "Courses",
    "Questions",
    "Resources",
    "Badges",
    "Tracks",
    "Certificates",
    "Leaderboard",
  ] as const,
  endpoints: () => ({}),
  refetchOnMountOrArgChange: 1,
});
