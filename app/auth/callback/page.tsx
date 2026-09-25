"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { setCredentials } from "@/store/slices/auth/authSlice";
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
      try {
        // Decode the JWT payload to extract user info (no verification needed —
        // backend already validated it)
        const parts = token.split(".");
        const payload = JSON.parse(
          atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
        );

        const user = {
          id: payload.sub || payload.id,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          role: payload.role,
          avatar: payload.avatar || null,
        };

        dispatch(setCredentials({ user }));
        dispatch(setTokens({ accessToken: token, refreshToken: "" }));
        setAuthTokenCookie(token);

        toast.success("Login successful!");

        // nextStep=onboarding → assessment flow; otherwise role-based redirect
        if (nextStep === "onboarding" && user.role === "STUDENT") {
          router.replace("/app/assesment");
          return;
        }

        const roleKey = user.role?.toUpperCase();
        router.replace(roleRedirectMap[roleKey] || "/");
      } catch {
        toast.error("Failed to process login. Please try again.");
        router.replace("/login");
      }
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

    try {
      const user = JSON.parse(decodeURIComponent(userParam));

      dispatch(setCredentials({ user }));
      dispatch(setTokens({ accessToken, refreshToken }));
      setAuthTokenCookie(accessToken);

      toast.success("Login successful!");

      if (nextStep === "onboarding" && user.role === "STUDENT") {
        router.replace("/app/assesment");
        return;
      }

      const roleKey = user.role?.toUpperCase();
      const roleRedirect = roleKey ? roleRedirectMap[roleKey] : null;
      router.replace(redirect || roleRedirect || "/");
    } catch {
      toast.error("Failed to process login. Please try again.");
      router.replace("/login");
    }
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
