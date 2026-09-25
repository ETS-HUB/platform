"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { setCredentials, setUser } from "@/store/slices/auth/authSlice";
import { setTokens } from "@/store/slices/auth/tokenSlice";
import { setAuthTokenCookie } from "@/lib/authCookies";
import type { AppDispatch } from "@/store";

const roleRedirectMap: Record<string, string> = {
  TUTOR: "/tutor/dashboard",
  PARENT: "/parent/dashboard",
  STUDENT: "/student/dashboard",
  ADMIN: "/core/admin/overview",
  SUPER_ADMIN: "/core/admin/overview",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * Fetch full user data from /api/users/me and return it.
 * Falls back to the minimal user object if the fetch fails.
 */
async function fetchFullUser(token: string, fallback: Record<string, unknown>) {
  try {
    const res = await fetch(`${API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) return await res.json();
  } catch {
    // silently fall through
  }
  return fallback;
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const error = searchParams.get("error");

    if (error) {
      toast.error(
        decodeURIComponent(error) || "Social login failed. Please try again.",
      );
      router.replace("/login");
      return;
    }

    // ── Backend redirect-flow shape: ?token=...&nextStep=... ──────────────
    const token = searchParams.get("token");
    const nextStep = searchParams.get("nextStep");

    if (token) {
      (async () => {
        try {
          // Decode JWT for minimal user info (role needed for redirect decision)
          const parts = token.split(".");
          const payload = JSON.parse(
            atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
          );

          const minimalUser = {
            id: payload.sub || payload.id,
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName,
            role: payload.role,
            avatar: payload.avatar || null,
          };

          // Set tokens first so RTK Query requests can authenticate
          dispatch(setCredentials({ user: minimalUser }));
          dispatch(setTokens({ accessToken: token, refreshToken: "" }));
          setAuthTokenCookie(token);

          // Fetch full user data (firstName, lastName, avatar, profile, etc.)
          const fullUser = await fetchFullUser(token, minimalUser);
          dispatch(setUser(fullUser));

          toast.success("Login successful!");

          const roleKey = (fullUser.role || minimalUser.role)?.toUpperCase();

          // nextStep=onboarding → assessment/onboarding flow
          if (nextStep === "onboarding" && roleKey === "STUDENT") {
            router.replace("/app/assesment");
            return;
          }

          router.replace(roleRedirectMap[roleKey] || "/");
        } catch {
          toast.error("Failed to process login. Please try again.");
          router.replace("/login");
        }
      })();
      return;
    }

    // ── Legacy Next.js proxy shape: ?accessToken=...&refreshToken=...&user=... ─
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const userParam = searchParams.get("user");
    const redirect = searchParams.get("redirect");

    if (!accessToken || !refreshToken || !userParam) {
      toast.error("Invalid callback response. Please try again.");
      router.replace("/login");
      return;
    }

    (async () => {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(userParam));

        dispatch(setCredentials({ user: parsedUser }));
        dispatch(setTokens({ accessToken, refreshToken }));
        setAuthTokenCookie(accessToken);

        // Enrich with full user data
        const fullUser = await fetchFullUser(accessToken, parsedUser);
        dispatch(setUser(fullUser));

        toast.success("Login successful!");

        const roleKey = (fullUser.role || parsedUser.role)?.toUpperCase();

        if (nextStep === "onboarding" && roleKey === "STUDENT") {
          router.replace("/app/assesment");
          return;
        }

        const roleRedirect = roleKey ? roleRedirectMap[roleKey] : null;
        router.replace(redirect || roleRedirect || "/");
      } catch {
        toast.error("Failed to process login. Please try again.");
        router.replace("/login");
      }
    })();
  }, [searchParams, dispatch, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-r-transparent"
          style={{ borderColor: "#3A0CA3 transparent transparent transparent" }}
        />
        <p className="mt-4 text-sm text-gray-500">Completing sign in...</p>
      </div>
    </div>
  );
}
