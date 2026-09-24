import { NextRequest, NextResponse } from "next/server";
import { canAccessRoute, type AppRole } from "@/constants/roles";

const LOGIN_ROUTE = "/login";
const ADMIN_LOGIN_ROUTE = "/core/admin/login";
const UNAUTHORIZED_ROUTE = "/unauthorized";
const DEFAULT_AUTH_REDIRECT = "/";
const protectedPrefixes = ["/core/admin", "/parent", "/tutor", "/student"];

const roleRedirectMap: Record<AppRole, string> = {
  TUTOR: "/tutor/dashboard",
  PARENT: "/parent/dashboard",
  SUPER_ADMIN: "/core/admin/dashboard",
  STUDENT: "/student/dashboard",
};

type JwtPayload = {
  role?: string;
  exp?: number;
  user?: { role?: string };
};

type TokenAuth = {
  role: AppRole;
  isExpired: boolean;
};

function decodeBase64Url(value: string): string | null {
  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    return atob(padded);
  } catch {
    return null;
  }
}

function getTokenAuth(token: string): TokenAuth | null {
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  const payloadJson = decodeBase64Url(parts[1]);
  if (!payloadJson) {
    return null;
  }

  try {
    const payload = JSON.parse(payloadJson) as JwtPayload;
    const roleRaw = (payload.role || payload.user?.role || "").toUpperCase();
    const role = roleRaw === "ADMIN" ? "SUPER_ADMIN" : roleRaw;
    if (["TUTOR", "PARENT", "SUPER_ADMIN", "STUDENT"].includes(role)) {
      const nowInSeconds = Math.floor(Date.now() / 1000);
      const isExpired =
        typeof payload.exp === "number" && payload.exp <= nowInSeconds;
      return { role: role as AppRole, isExpired };
    }
  } catch {
    return null;
  }

  return null;
}

function isProtectedRoute(pathname: string): boolean {
  return protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/"),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token =
    request.cookies.get("accessToken")?.value ||
    request.cookies.get("token")?.value;
  const tokenAuth = token ? getTokenAuth(token) : null;
  const role = tokenAuth?.role ?? null;
  const hasValidToken = Boolean(token && tokenAuth && !tokenAuth.isExpired);

  if (pathname === LOGIN_ROUTE) {
    if (hasValidToken && role) {
      if (role === "SUPER_ADMIN") {
        return NextResponse.redirect(
          new URL(DEFAULT_AUTH_REDIRECT, request.url),
        );
      }

      const redirectPath = roleRedirectMap[role] || DEFAULT_AUTH_REDIRECT;
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    return NextResponse.next();
  }

  if (pathname === ADMIN_LOGIN_ROUTE) {
    if (hasValidToken && role === "SUPER_ADMIN") {
      return NextResponse.redirect(
        new URL(roleRedirectMap.SUPER_ADMIN, request.url),
      );
    }

    return NextResponse.next();
  }

  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  if (!hasValidToken) {
    if (
      tokenAuth?.role === "SUPER_ADMIN" &&
      tokenAuth.isExpired &&
      (pathname === "/core/admin" || pathname.startsWith("/core/admin/"))
    ) {
      const adminLoginUrl = new URL(ADMIN_LOGIN_ROUTE, request.url);
      adminLoginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(adminLoginUrl);
    }

    const loginUrl = new URL(LOGIN_ROUTE, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!role || !canAccessRoute(role, pathname)) {
    return NextResponse.redirect(new URL(UNAUTHORIZED_ROUTE, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization)getRoleFromAdminInfo
     * - favicon.ico, sitemap, robots
     * - public assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
