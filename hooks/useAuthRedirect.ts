"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

export function useAuthRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accessToken } = useSelector((s: RootState) => s.tokens);
  const isAuthenticated = !!accessToken;

  useEffect(() => {
    if (!isAuthenticated) return;

    const redirectPath = searchParams.get("redirect");

    if (redirectPath) {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete("redirect");

      window.history.replaceState({}, "", currentUrl.toString());

      router.push(redirectPath);
    }
  }, [isAuthenticated, searchParams, router]);
}
