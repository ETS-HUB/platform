"use client";

import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export function AuthRedirectHandler() {
  useAuthRedirect();
  return null;
}
