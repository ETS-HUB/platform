/**
 * Shared OAuth utilities for Google and Facebook authentication.
 */

/**
 * The frontend app's base URL — used to build OAuth redirect URIs and
 * callback URLs that land back on the Next.js server.
 */
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
}

/**
 * The backend API base URL — used when calling the backend directly.
 */
export function getBackendUrl(): string {
  return (
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3000"
  );
}

/**
 * Build the frontend callback URL that users land on after OAuth completes.
 */
export function buildFrontendCallbackUrl(params: {
  accessToken: string;
  refreshToken: string;
  user: object;
  redirect?: string | null;
  requestOrigin?: string;
}): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    params.requestOrigin ||
    "http://localhost:3001";
  const url = new URL("/auth/callback", base);
  url.searchParams.set("accessToken", params.accessToken);
  url.searchParams.set("refreshToken", params.refreshToken);
  url.searchParams.set("user", encodeURIComponent(JSON.stringify(params.user)));
  if (params.redirect) {
    url.searchParams.set("redirect", params.redirect);
  }
  return url.toString();
}

export function buildFrontendErrorUrl(
  error: string,
  requestOrigin?: string,
): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    requestOrigin ||
    "http://localhost:3001";
  const url = new URL("/auth/callback", base);
  url.searchParams.set("error", error);
  return url.toString();
}
