/**
 * Shared OAuth utilities for Google and Facebook authentication.
 */

export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export function getBackendUrl(): string {
  return process.env.BACKEND_API_URL || "http://localhost:4000";
}

/**
 * Build the frontend callback URL that users land on after OAuth completes.
 */
export function buildFrontendCallbackUrl(params: {
  accessToken: string;
  refreshToken: string;
  user: object;
  redirect?: string | null;
}): string {
  const url = new URL("/auth/callback", getBaseUrl());
  url.searchParams.set("accessToken", params.accessToken);
  url.searchParams.set("refreshToken", params.refreshToken);
  url.searchParams.set("user", encodeURIComponent(JSON.stringify(params.user)));
  if (params.redirect) {
    url.searchParams.set("redirect", params.redirect);
  }
  return url.toString();
}

export function buildFrontendErrorUrl(error: string): string {
  const url = new URL("/auth/callback", getBaseUrl());
  url.searchParams.set("error", error);
  return url.toString();
}
