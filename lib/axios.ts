import axios, { AxiosInstance } from "axios";
import { clearAuthTokenCookies, setAuthTokenCookie } from "@/lib/authCookies";
import { store } from "@/store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function getToken(): string | null {
  const state = store.getState();
  return state.tokens.accessToken;
}

function extractRefreshTokens(payload: unknown): {
  accessToken: string;
  refreshToken?: string;
} | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const root = payload as Record<string, unknown>;
  const nestedData =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : null;

  const accessToken =
    (typeof root.accessToken === "string" && root.accessToken) ||
    (nestedData &&
      typeof nestedData.accessToken === "string" &&
      nestedData.accessToken) ||
    null;

  const refreshToken =
    (typeof root.refreshToken === "string" && root.refreshToken) ||
    (nestedData &&
      typeof nestedData.refreshToken === "string" &&
      nestedData.refreshToken) ||
    undefined;

  if (!accessToken) {
    return null;
  }

  return { accessToken, refreshToken };
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/login"
    ) {
      originalRequest._retry = true;

      try {
        const state = store.getState();
        const refreshToken = state.tokens.refreshToken;
        const response = await axios.post(
          `${API_BASE_URL}
          /auth/refresh`,
          refreshToken ? { refreshToken } : {},
          { withCredentials: true },
        );

        const parsed = extractRefreshTokens(response.data);
        if (!parsed) {
          throw new Error("Invalid refresh response");
        }

        const { accessToken, refreshToken: newRefreshToken } = parsed;

        const { setAccessToken, setRefreshToken } = await import(
          "@/store/slices/auth/tokenSlice"
        );
        store.dispatch(setAccessToken(accessToken));
        if (newRefreshToken) {
          store.dispatch(setRefreshToken(newRefreshToken));
        }
        setAuthTokenCookie(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch {
        const { clearTokens } = await import("@/store/slices/auth/tokenSlice");
        store.dispatch(clearTokens());
        const { logout } = await import("@/store/slices/auth/authSlice");
        store.dispatch(logout());
        clearAuthTokenCookies();
      }
    }

    return Promise.reject(error);
  },
);
