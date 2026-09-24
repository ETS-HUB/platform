"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { setCredentials } from "@/store/slices/auth/authSlice";
import { setTokens } from "@/store/slices/auth/tokenSlice";
import { setAuthTokenCookie } from "@/lib/authCookies";
import type { AppDispatch } from "@/store";

const redirectMap: Record<string, string> = {
  TUTOR: "/tutor/dashboard",
  PARENT: "/parent/dashboard",
  STUDENT: "/student/dashboard",
};

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const userParam = searchParams.get("user");
    const error = searchParams.get("error");
    const redirect = searchParams.get("redirect");

    if (error) {
      toast.error(error || "Social login failed. Please try again.");
      router.replace("/login");
      return;
    }

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

      const roleKey = user.role?.toUpperCase();
      const roleRedirect = roleKey ? redirectMap[roleKey] : null;
      const targetUrl = redirect || roleRedirect || "/";

      router.replace(targetUrl);
    } catch {
      toast.error("Failed to process login. Please try again.");
      router.replace("/login");
    }
  }, [searchParams, dispatch, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1F5226] border-r-transparent" />
        <p className="mt-4 text-sm text-gray-500">Completing sign in...</p>
      </div>
    </div>
  );
}
