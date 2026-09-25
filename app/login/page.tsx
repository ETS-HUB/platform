"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Image from "next/image";

import { loginUser } from "@/store/slices/auth/authThunks";
import { clearAuth } from "@/store/slices/auth/authSlice";
import { clearTokens } from "@/store/slices/auth/tokenSlice";
import { clearAuthTokenCookies } from "@/lib/authCookies";
import { isTokenExpired, normalizeToken } from "@/lib/authToken";
import type { AppDispatch, RootState } from "@/store";
import { Button } from "@/components";
import { AuthBranding } from "@/components/";

interface LoginFormValues {
  email: string;
  password: string;
}

const redirectMap: Record<string, string> = {
  TUTOR: "/tutor/dashboard",
  PARENT: "/parent/dashboard",
  STUDENT: "/student/dashboard",
  ADMIN: "/core/admin/overview",
  SUPER_ADMIN: "/core/admin/overview",
};

function getRedirectUrlFromRole(role?: string): string | null {
  const roleKey = role?.toUpperCase();
  return (roleKey && redirectMap[roleKey]) || null;
}

function getSafeRedirectPath(
  role: string | undefined,
  redirectPath: string | null,
) {
  const roleKey = role?.toUpperCase();
  if (!redirectPath || !roleKey || !redirectPath.startsWith("/")) {
    return null;
  }

  if (roleKey === "TUTOR" && redirectPath.startsWith("/tutor")) {
    return redirectPath;
  }

  if (roleKey === "STUDENT" && redirectPath.startsWith("/student")) {
    return redirectPath;
  }

  if (roleKey === "ADMIN" && redirectPath.startsWith("/core")) {
    return redirectPath;
  }

  return null;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();

  const { isAuthenticated, user, loading } = useSelector(
    (state: RootState) => state.auth,
  );
  const { accessToken } = useSelector((state: RootState) => state.tokens);
  const requestedRedirect = searchParams.get("redirect");

  useEffect(() => {
    if (!isAuthenticated || !accessToken || !user?.role) return;

    const normalizedToken = normalizeToken(accessToken);

    if (isTokenExpired(normalizedToken)) {
      dispatch(clearTokens());
      dispatch(clearAuth());
      clearAuthTokenCookies();
      return;
    }

    const safeRedirect = getSafeRedirectPath(user.role, requestedRedirect);
    const redirectUrl = safeRedirect || getRedirectUrlFromRole(user.role);
    if (redirectUrl) {
      router.replace(redirectUrl);
      return;
    }
    router.replace("/");
  }, [
    isAuthenticated,
    accessToken,
    user?.role,
    requestedRedirect,
    dispatch,
    router,
  ]);

  const handleSocialLogin = (provider: "google" | "facebook") => {
    // Redirect straight to the backend's Passport OAuth flow.
    // Backend handles the exchange and redirects to FRONTEND_URL/auth/callback?token=...&nextStep=...
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    window.location.href = `${backendUrl}/api/auth/${provider}`;
  };

  async function handleSubmit(values: LoginFormValues) {
    try {
      const response = await dispatch(loginUser(values)).unwrap();

      // Check onboarding — only redirect students to assessment if not completed
      if (
        response?.user?.role === "STUDENT" &&
        response?.onboarding?.hasCompletedAssessment === false
      ) {
        toast.success("Login successful!");
        router.replace("/app/assesment");
        return;
      }

      const safeRedirect = getSafeRedirectPath(
        response?.user?.role,
        requestedRedirect,
      );
      const redirectUrl =
        safeRedirect || getRedirectUrlFromRole(response?.user?.role);

      if (!redirectUrl) {
        dispatch(clearTokens());
        dispatch(clearAuth());
        clearAuthTokenCookies();
        router.replace("/");
        return;
      }

      toast.success("Login successful!");
      router.replace(redirectUrl);
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error instanceof Error
            ? error.message
            : error &&
                typeof error === "object" &&
                "message" in error &&
                typeof error.message === "string"
              ? error.message
              : "Login failed. Please try again.";
      toast.error(errorMessage);
      form.setFields([{ name: "password", errors: [errorMessage] }]);
    }
  }

  return (
    <div className="flex min-h-screen relative">
      <AuthBranding />
      <div className="absolute -top-10 sm:top-5 sm:left-10 z-20">
        <Image
          src="/logo.png"
          alt="Genius Tutors Logo"
          width={170}
          height={40}
          className="object-contain cursor-pointer"
          onClick={() => router.push("/")}
        />
      </div>

      <div className="absolute -top-10 sm:-top-12 sm:left-0 z-20">
        <Image
          src="/logo-dark.png"
          alt="Genius Tutors Logo"
          width={210}
          height={40}
          className="object-contain cursor-pointer"
          onClick={() => router.push("/")}
        />
      </div>

      <div className="flex flex-1 items-center justify-center bg-white mt-20 px-4 sm:px-8 py-12 lg:px-16">
        <div className="w-full max-w-lg animate-slide-in-bottom">
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 leading-tight">
              Welcome back! <br className="hidden sm:block" /> Log in to
              continue learning.
            </h1>
          </div>

          <div className="mb-8">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark={false}
              size="large"
            >
              <Form.Item
                label={
                  <span className="text-sm font-medium text-gray-700">
                    Email
                  </span>
                }
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="rounded-xl"
                />
              </Form.Item>

              <Form.Item
                label={
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-medium text-gray-700">
                      Password
                    </span>
                  </div>
                }
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
                style={{ marginBottom: 28 }}
              >
                <Input.Password
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="rounded-xl"
                />
              </Form.Item>

              <div className="flex justify-end -mt-4 mb-6">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-[#1F5226] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  loading={loading}
                  variant="primary"
                  fullWidth
                  size="lg"
                  type="submit"
                >
                  Sign in
                </Button>
              </Form.Item>
            </Form>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-sm font-medium text-gray-700"
              aria-label="Continue with Google"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
                />
              </svg>
              Google
            </button>

            {/* <button
              type="button"
              onClick={() => handleSocialLogin("facebook")}
              className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-sm font-medium text-gray-700"
              aria-label="Continue with Facebook"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#1877F2"
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
              Facebook
            </button> */}
          </div>

          <div className="bg-gray-50 rounded-xl py-4 text-center">
            <span className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-primary hover:underline"
              >
                Sign up
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
