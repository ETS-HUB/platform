"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Image from "next/image";

import { resetPasswordUser } from "@/store/slices/auth/authThunks";
import type { AppDispatch, RootState } from "@/store";
import { Button } from "@/components";
import { AuthBranding } from "@/components/";

interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const [resetSuccess, setResetSuccess] = useState(false);

  const token = searchParams.get("token");

  const { resetPasswordLoading } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      router.replace("/forgot-password");
    }
  }, [token, router]);

  async function handleSubmit(values: ResetPasswordFormValues) {
    if (!token) return;

    try {
      await dispatch(
        resetPasswordUser({ token, password: values.password }),
      ).unwrap();
      setResetSuccess(true);
      toast.success("Password reset successfully!");
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error instanceof Error
            ? error.message
            : "Failed to reset password. Please try again.";
      toast.error(errorMessage);
      form.setFields([{ name: "password", errors: [errorMessage] }]);
    }
  }

  if (!token) return null;

  return (
    <div className="flex min-h-screen relative">
      <AuthBranding />

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
          {!resetSuccess ? (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 leading-tight">
                  Create new password
                </h1>
                <p className="text-sm text-gray-500 mt-2">
                  Your new password must be different from your previous
                  password.
                </p>
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
                        New Password
                      </span>
                    }
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your new password",
                      },
                      {
                        min: 8,
                        message: "Password must be at least 8 characters",
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="Enter new password"
                      autoComplete="new-password"
                      className="rounded-xl"
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span className="text-sm font-medium text-gray-700">
                        Confirm Password
                      </span>
                    }
                    name="confirmPassword"
                    dependencies={["password"]}
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your password",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Passwords do not match"),
                          );
                        },
                      }),
                    ]}
                    style={{ marginBottom: 28 }}
                  >
                    <Input.Password
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                      className="rounded-xl"
                    />
                  </Form.Item>

                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button
                      loading={resetPasswordLoading}
                      variant="primary"
                      fullWidth
                      size="lg"
                      type="submit"
                    >
                      Reset password
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1F5226"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">
                Password reset complete
              </h1>
              <p className="text-sm text-gray-500 mb-8">
                Your password has been successfully reset. You can now log in
                with your new password.
              </p>
              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={() => router.push("/login")}
              >
                Go to login
              </Button>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl py-4 text-center mt-8">
            <span className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#1F5226] hover:underline"
              >
                Back to login
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
