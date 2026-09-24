import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type { RootState } from "@/store";
import { logout } from "@/store/slices/auth/authSlice";
import {
  clearTokens,
  setAccessToken,
  setRefreshToken,
  setTokens,
} from "@/store/slices/auth/tokenSlice";
import { clearAuthTokenCookies, setAuthTokenCookie } from "@/lib/authCookies";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type RefreshResponse = {
  accessToken: string;
  refreshToken?: string;
};

type RefreshResult = RefreshResponse | null | "transient_error";

function extractRefreshResponse(payload: unknown): RefreshResponse | null {
  if (!payload || typeof payload !== "object") return null;

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

  if (!accessToken) return null;
  return { accessToken, refreshToken };
}

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as RootState).tokens.accessToken;
    if (accessToken) {
      headers.set("authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

let refreshPromise: Promise<RefreshResult> | null = null;

async function doRefresh(
  currentRefreshToken: string | null,
  api: Parameters<BaseQueryFn>[1],
  extraOptions: Parameters<BaseQueryFn>[2],
): Promise<RefreshResult> {
  const refreshResult = await baseQuery(
    {
      url: "/auth/refresh",
      method: "POST",
      ...(currentRefreshToken
        ? { body: { refreshToken: currentRefreshToken } }
        : {}),
    },
    api,
    extraOptions,
  );

  if (refreshResult.error) {
    const status = refreshResult.error.status;
    if (status === 401 || status === 403) return null;
    return "transient_error";
  }

  return refreshResult.data ? extractRefreshResponse(refreshResult.data) : null;
}

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const currentRefreshToken = (api.getState() as RootState).tokens
      .refreshToken;

    if (!refreshPromise) {
      refreshPromise = doRefresh(
        currentRefreshToken,
        api,
        extraOptions,
      ).finally(() => {
        refreshPromise = null;
      });
    }

    const refreshData = await refreshPromise;

    if (refreshData !== null && refreshData !== "transient_error") {
      if (refreshData.refreshToken) {
        api.dispatch(
          setTokens({
            accessToken: refreshData.accessToken,
            refreshToken: refreshData.refreshToken,
          }),
        );
      } else {
        api.dispatch(setAccessToken(refreshData.accessToken));
        if (currentRefreshToken) {
          api.dispatch(setRefreshToken(currentRefreshToken));
        }
      }
      setAuthTokenCookie(refreshData.accessToken);
      result = await baseQuery(args, api, extraOptions);
    } else if (refreshData === null) {
      api.dispatch(clearTokens());
      api.dispatch(logout());
      clearAuthTokenCookies();
    }
  }

  return result;
};
