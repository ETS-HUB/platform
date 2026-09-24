import { NextRequest, NextResponse } from "next/server";
import {
  getBaseUrl,
  getBackendUrl,
  buildFrontendCallbackUrl,
  buildFrontendErrorUrl,
} from "@/lib/oauth";

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const stateParam = request.nextUrl.searchParams.get("state");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      buildFrontendErrorUrl("Google authentication was cancelled"),
    );
  }

  if (!code) {
    return NextResponse.redirect(
      buildFrontendErrorUrl("No authorization code received from Google"),
    );
  }

  let redirect: string | null = null;
  try {
    const state = JSON.parse(stateParam || "{}");
    redirect = state.redirect || null;
  } catch {
    // ignore invalid state
  }

  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
  const redirectUri = `${getBaseUrl()}/api/auth/google/callback`;

  try {
    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error("Google token exchange failed:", err);
      return NextResponse.redirect(
        buildFrontendErrorUrl("Failed to authenticate with Google"),
      );
    }

    const tokens: GoogleTokenResponse = await tokenRes.json();

    // Fetch user info
    const userInfoRes = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      },
    );

    if (!userInfoRes.ok) {
      return NextResponse.redirect(
        buildFrontendErrorUrl("Failed to fetch Google profile"),
      );
    }

    const googleUser: GoogleUserInfo = await userInfoRes.json();

    // Send to backend to create/find user and get app tokens
    const backendRes = await fetch(
      `${getBackendUrl()}/api/auth/social/google`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: googleUser.email,
          firstName: googleUser.given_name,
          lastName: googleUser.family_name,
          googleId: googleUser.sub,
          avatar: googleUser.picture,
          emailVerified: googleUser.email_verified,
        }),
      },
    );

    if (!backendRes.ok) {
      const errData = await backendRes.json().catch(() => null);
      const message =
        errData?.message || "Failed to complete Google authentication";
      return NextResponse.redirect(buildFrontendErrorUrl(message));
    }

    const authData = await backendRes.json();

    return NextResponse.redirect(
      buildFrontendCallbackUrl({
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
        user: authData.user,
        redirect,
      }),
    );
  } catch (err) {
    console.error("Google OAuth error:", err);
    return NextResponse.redirect(
      buildFrontendErrorUrl("An unexpected error occurred during Google login"),
    );
  }
}
