"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Image from "next/image";

import { forgotPasswordUser } from "@/store/slices/auth/authThunks";
import type { AppDispatch, RootState } from "@/store";
import { Button } from "@/components";
import { AuthBranding } from "@/components/";

interface ForgotPasswordFormValues {
  email: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const [emailSent, setEmailSent] = useState(false);

  const { forgotPasswordLoading } = useSelector(
    (state: RootState) => state.auth,
  );

  async function handleSubmit(values: ForgotPasswordFormValues) {
    try {
      await dispatch(
        forgotPasswordUser({ email: values.email.trim().toLowerCase() }),
      ).unwrap();
      setEmailSent(true);
      toast.success("Reset link sent! Check your email.");
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error instanceof Error
            ? error.message
            : "Failed to send reset link. Please try again.";
      toast.error(errorMessage);
      form.setFields([{ name: "email", errors: [errorMessage] }]);
    }
  }

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
          {!emailSent ? (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 leading-tight">
                  Forgot your password?
                </h1>
                <p className="text-sm text-gray-500 mt-2">
                  Enter your email address and we&apos;ll send you a link to
                  reset your password.
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
                        Email
                      </span>
                    }
                    name="email"
                    rules={[
                      { required: true, message: "Please enter your email" },
                      {
                        type: "email",
                        message: "Please enter a valid email",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter your email"
                      autoComplete="email"
                      className="rounded-xl"
                    />
                  </Form.Item>

                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button
                      loading={forgotPasswordLoading}
                      variant="primary"
                      fullWidth
                      size="lg"
                      type="submit"
                    >
                      Send reset link
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
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">
                Check your email
              </h1>
              <p className="text-sm text-gray-500 mb-8">
                We&apos;ve sent a password reset link to your email. Click the
                link to create a new password.
              </p>
              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={() => setEmailSent(false)}
              >
                Didn&apos;t receive it? Resend
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
