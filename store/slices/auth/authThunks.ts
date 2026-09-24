import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import {
  login,
  logout,
  register,
  changePassword,
  forgotPassword,
  resetPassword,
  createProfile,
} from "@/apis/auth";
import type {
  AuthResponse,
  ChangePasswordRequest,
  CreateProfileRequest,
  ForgotPasswordRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UserProfile,
} from "@/apis/auth/types";
import { clearAuthTokenCookies, setAuthTokenCookie } from "@/lib/authCookies";
import type { RootState } from "@/store";
import { setCredentials, clearAuth } from "./authSlice";
import { setTokens, clearTokens } from "./tokenSlice";

interface LoginPayload {
  email: string;
  password: string;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const responseData = error.response?.data;

    if (typeof responseData === "string") {
      return responseData;
    }

    if (
      responseData &&
      typeof responseData === "object" &&
      "message" in responseData &&
      typeof responseData.message === "string"
    ) {
      return responseData.message;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginPayload,
  { rejectValue: string }
>("auth/loginUser", async (payload, { dispatch, rejectWithValue }) => {
  try {
    const response = await login(
      payload.email.trim().toLowerCase(),
      payload.password,
    );

    dispatch(setCredentials({ user: response.user }));
    dispatch(
      setTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      }),
    );
    setAuthTokenCookie(response.accessToken);

    return response;
  } catch (error) {
    const message = getErrorMessage(error, "Login failed");
    return rejectWithValue(message);
  }
});

export const logoutUser = createAsyncThunk<
  { success: true },
  void,
  { state: RootState; rejectValue: string }
>("auth/logoutUser", async (_, { dispatch, getState, rejectWithValue }) => {
  try {
    const refreshToken = getState().tokens.refreshToken;

    if (refreshToken) {
      await logout(refreshToken);
    }

    dispatch(clearTokens());
    dispatch(clearAuth());
    clearAuthTokenCookies();

    return { success: true };
  } catch (error) {
    const message = getErrorMessage(error, "Logout failed");
    return rejectWithValue(message);
  }
});

export const changePasswordUser = createAsyncThunk<
  { message: string },
  ChangePasswordRequest,
  { rejectValue: string }
>("auth/changePasswordUser", async (payload, { rejectWithValue }) => {
  try {
    return await changePassword(payload);
  } catch (error) {
    const message = getErrorMessage(error, "Change password failed");
    return rejectWithValue(message);
  }
});

export const forgotPasswordUser = createAsyncThunk<
  { message: string },
  ForgotPasswordRequest,
  { rejectValue: string }
>("auth/forgotPasswordUser", async (payload, { rejectWithValue }) => {
  try {
    return await forgotPassword(payload);
  } catch (error) {
    const message = getErrorMessage(error, "Forgot password request failed");
    return rejectWithValue(message);
  }
});

export const resetPasswordUser = createAsyncThunk<
  { message: string },
  ResetPasswordRequest,
  { rejectValue: string }
>("auth/resetPasswordUser", async (payload, { rejectWithValue }) => {
  try {
    return await resetPassword(payload);
  } catch (error) {
    const message = getErrorMessage(error, "Reset password failed");
    return rejectWithValue(message);
  }
});

export const registerUser = createAsyncThunk<
  AuthResponse,
  RegisterRequest,
  { rejectValue: string }
>("auth/registerUser", async (payload, { dispatch, rejectWithValue }) => {
  try {
    const response = await register({
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
    });

    dispatch(setCredentials({ user: response.user }));
    dispatch(
      setTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      }),
    );
    setAuthTokenCookie(response.accessToken);

    return response;
  } catch (error) {
    const message = getErrorMessage(error, "Registration failed");
    return rejectWithValue(message);
  }
});

export const createUserProfile = createAsyncThunk<
  UserProfile,
  CreateProfileRequest,
  { state: RootState; rejectValue: string }
>("auth/createUserProfile", async (payload, { getState, rejectWithValue }) => {
  try {
    const accessToken = getState().tokens.accessToken;
    if (!accessToken) {
      return rejectWithValue("Not authenticated");
    }
    return await createProfile(payload, accessToken);
  } catch (error) {
    const message = getErrorMessage(error, "Failed to create profile");
    return rejectWithValue(message);
  }
});
