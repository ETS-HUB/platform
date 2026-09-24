import axiosInstance from "@/apis/axios";
import type {
  AuthResponse,
  ChangePasswordRequest,
  CreateProfileRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RegisterRequest,
  UserProfile,
} from "./types";

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await axiosInstance.post<AuthResponse>("/api/auth/login", {
    email,
    password,
  });
  return response.data;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await axiosInstance.post<AuthResponse>(
    "/api/auth/register",
    data,
  );
  return response.data;
}

export async function logout(refreshToken: string): Promise<void> {
  await axiosInstance.post("/api/auth/logout", { refreshToken });
}

export async function changePassword(
  data: ChangePasswordRequest,
): Promise<{ message: string }> {
  const response = await axiosInstance.post<{ message: string }>(
    "/api/auth/change-password",
    data,
  );
  return response.data;
}

export async function forgotPassword(
  data: ForgotPasswordRequest,
): Promise<{ message: string }> {
  const response = await axiosInstance.post<{ message: string }>(
    "/api/auth/forgot-password",
    data,
  );
  return response.data;
}

export async function resetPassword(
  data: ResetPasswordRequest,
): Promise<{ message: string }> {
  const response = await axiosInstance.post<{ message: string }>(
    "/api/auth/reset-password",
    data,
  );
  return response.data;
}

export async function createProfile(
  data: CreateProfileRequest,
  accessToken: string,
): Promise<UserProfile> {
  const response = await axiosInstance.post<UserProfile>(
    "/api/users/profile",
    data,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  return response.data;
}
