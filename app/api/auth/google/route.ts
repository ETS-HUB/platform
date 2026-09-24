import { NextRequest, NextResponse } from "next/server";
import { getBaseUrl } from "@/lib/oauth";

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "Google OAuth is not configured" },
      { status: 500 },
    );
  }

  const redirect = request.nextUrl.searchParams.get("redirect");
  const callbackUrl = new URL("/api/auth/google/callback", getBaseUrl());

  if (redirect) {
    callbackUrl.searchParams.set("redirect", redirect);
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl.origin + callbackUrl.pathname,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
    state: JSON.stringify({ redirect }),
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  return NextResponse.redirect(googleAuthUrl);
}
