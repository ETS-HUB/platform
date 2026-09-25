"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, Input, Select, InputNumber } from "antd";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Image from "next/image";

import {
  registerUser,
  createUserProfile,
} from "@/store/slices/auth/authThunks";
import type { AppDispatch, RootState } from "@/store";
import { Button } from "@/components";
import { AuthBranding } from "@/components/";

interface SignupFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ProfileFormValues {
  goal: string;
  experienceLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  learningStyle: "VISUAL" | "AUDITORY" | "READING" | "KINESTHETIC";
  weeklyHours: number;
}

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [signupForm] = Form.useForm();
  const [profileForm] = Form.useForm();
  const [step, setStep] = useState<"register" | "profile">("register");

  const { registerLoading, profileLoading } = useSelector(
    (state: RootState) => state.auth,
  );

  const handleSocialLogin = (provider: "google" | "facebook") => {
    window.location.href = `/api/auth/${provider}`;
  };

  async function handleSignup(values: SignupFormValues) {
    try {
      await dispatch(
        registerUser({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
        }),
      ).unwrap();
      toast.success("Account created!");
      setStep("profile");
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error instanceof Error
            ? error.message
            : "Registration failed. Please try again.";
      toast.error(errorMessage);
      signupForm.setFields([{ name: "email", errors: [errorMessage] }]);
    }
  }

  async function handleProfile(values: ProfileFormValues) {
    try {
      await dispatch(createUserProfile(values)).unwrap();
      toast.success("Profile saved!");
      router.replace("/app/assesment");
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error instanceof Error
            ? error.message
            : "Failed to save profile. Please try again.";
      toast.error(errorMessage);
    }
  }

  function handleSkipProfile() {
    router.replace("/app/assesment");
  }

  return (
    <div className="flex min-h-screen relative">
      <AuthBranding />

      <div className="absolute -top-10 sm:top-5 sm:left-10 z-20">
        <Image
          src="/logo.png"
          alt="Genius Tutors Logo"
          width={210}
          height={40}
          className="object-contain cursor-pointer"
          onClick={() => router.push("/")}
        />
      </div>

      <div className="flex flex-1 items-center justify-center bg-white mt-20 px-4 sm:px-8 py-12 lg:px-16">
        <div className="w-full max-w-lg animate-slide-in-bottom">
          {step === "register" && (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 leading-tight">
                  Create your account
                </h1>
                <p className="text-sm text-gray-500 mt-2">
                  Join us and start your learning journey today.
                </p>
              </div>

              <div className="mb-8">
                <Form
                  form={signupForm}
                  layout="vertical"
                  onFinish={handleSignup}
                  requiredMark={false}
                  size="large"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                      label={
                        <span className="text-sm font-medium text-gray-700">
                          First Name
                        </span>
                      }
                      name="firstName"
                      rules={[
                        { required: true, message: "First name is required" },
                      ]}
                    >
                      <Input
                        placeholder="John"
                        autoComplete="given-name"
                        className="rounded-xl"
                      />
                    </Form.Item>

                    <Form.Item
                      label={
                        <span className="text-sm font-medium text-gray-700">
                          Last Name
                        </span>
                      }
                      name="lastName"
                      rules={[
                        { required: true, message: "Last name is required" },
                      ]}
                    >
                      <Input
                        placeholder="Doe"
                        autoComplete="family-name"
                        className="rounded-xl"
                      />
                    </Form.Item>
                  </div>

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
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="rounded-xl"
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span className="text-sm font-medium text-gray-700">
                        Password
                      </span>
                    }
                    name="password"
                    rules={[
                      { required: true, message: "Please enter a password" },
                      {
                        min: 8,
                        message: "Password must be at least 8 characters",
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="At least 8 characters"
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
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      className="rounded-xl"
                    />
                  </Form.Item>

                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button
                      loading={registerLoading}
                      variant="primary"
                      fullWidth
                      size="lg"
                      type="submit"
                    >
                      Create account
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
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-[#1F5226] hover:underline"
                  >
                    Sign in
                  </Link>
                </span>
              </div>
            </>
          )}

          {step === "profile" && (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 leading-tight">
                  Set up your profile
                </h1>
                <p className="text-sm text-gray-500 mt-2">
                  Help us personalize your learning experience.
                </p>
              </div>

              <div className="mb-8">
                <Form
                  form={profileForm}
                  layout="vertical"
                  onFinish={handleProfile}
                  requiredMark={false}
                  size="large"
                  initialValues={{ weeklyHours: 10 }}
                >
                  <Form.Item
                    label={
                      <span className="text-sm font-medium text-gray-700">
                        What&apos;s your goal?
                      </span>
                    }
                    name="goal"
                    rules={[
                      { required: true, message: "Please enter your goal" },
                    ]}
                  >
                    <Input
                      placeholder="e.g. Frontend Developer, Data Scientist"
                      className="rounded-xl"
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span className="text-sm font-medium text-gray-700">
                        Experience Level
                      </span>
                    }
                    name="experienceLevel"
                    rules={[
                      {
                        required: true,
                        message: "Please select your experience level",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select your level"
                      options={[
                        { value: "BEGINNER", label: "Beginner" },
                        { value: "INTERMEDIATE", label: "Intermediate" },
                        { value: "ADVANCED", label: "Advanced" },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span className="text-sm font-medium text-gray-700">
                        Learning Style
                      </span>
                    }
                    name="learningStyle"
                    rules={[
                      {
                        required: true,
                        message: "Please select your learning style",
                      },
                    ]}
                  >
                    <Select
                      placeholder="How do you learn best?"
                      options={[
                        { value: "VISUAL", label: "Visual (videos, diagrams)" },
                        {
                          value: "AUDITORY",
                          label: "Auditory (lectures, discussions)",
                        },
                        {
                          value: "READING",
                          label: "Reading (articles, documentation)",
                        },
                        {
                          value: "KINESTHETIC",
                          label: "Kinesthetic (hands-on projects)",
                        },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span className="text-sm font-medium text-gray-700">
                        Hours per week you can dedicate
                      </span>
                    }
                    name="weeklyHours"
                    rules={[
                      {
                        required: true,
                        message: "Please enter weekly hours",
                      },
                    ]}
                    style={{ marginBottom: 28 }}
                  >
                    <InputNumber
                      min={1}
                      max={80}
                      placeholder="15"
                      className="w-full! rounded-xl"
                      suffix="hrs/week"
                    />
                  </Form.Item>

                  <Form.Item style={{ marginBottom: 12 }}>
                    <Button
                      loading={profileLoading}
                      variant="primary"
                      fullWidth
                      size="lg"
                      type="submit"
                    >
                      Continue to assessment
                    </Button>
                  </Form.Item>

                  <button
                    type="button"
                    onClick={handleSkipProfile}
                    className="w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Skip for now
                  </button>
                </Form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
