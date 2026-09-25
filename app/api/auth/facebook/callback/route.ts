import { NextRequest, NextResponse } from "next/server";
import {
  getBackendUrl,
  buildFrontendCallbackUrl,
  buildFrontendErrorUrl,
} from "@/lib/oauth";

interface FacebookTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface FacebookUserInfo {
  id: string;
  email?: string;
  first_name: string;
  last_name: string;
  picture?: {
    data?: {
      url?: string;
    };
  };
}

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const code = request.nextUrl.searchParams.get("code");
  const stateParam = request.nextUrl.searchParams.get("state");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      buildFrontendErrorUrl("Facebook authentication was cancelled", origin),
    );
  }

  if (!code) {
    return NextResponse.redirect(
      buildFrontendErrorUrl(
        "No authorization code received from Facebook",
        origin,
      ),
    );
  }

  let redirect: string | null = null;
  try {
    const state = JSON.parse(stateParam || "{}");
    redirect = state.redirect || null;
  } catch {
    // ignore invalid state
  }

  const appId = process.env.FACEBOOK_APP_ID!;
  const appSecret = process.env.FACEBOOK_APP_SECRET!;

  // Must exactly match the redirect_uri sent in the initial auth request
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || origin;
  const redirectUri = `${appUrl}/api/auth/facebook/callback`;

  try {
    // Exchange code for access token
    const tokenParams = new URLSearchParams({
      client_id: appId,
      client_secret: appSecret,
      redirect_uri: redirectUri,
      code,
    });

    const tokenRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?${tokenParams.toString()}`,
    );

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error("Facebook token exchange failed:", err);
      return NextResponse.redirect(
        buildFrontendErrorUrl("Failed to authenticate with Facebook", origin),
      );
    }

    const tokens: FacebookTokenResponse = await tokenRes.json();

    // Fetch user info
    const userInfoParams = new URLSearchParams({
      fields: "id,email,first_name,last_name,picture.type(large)",
      access_token: tokens.access_token,
    });

    const userInfoRes = await fetch(
      `https://graph.facebook.com/v19.0/me?${userInfoParams.toString()}`,
    );

    if (!userInfoRes.ok) {
      return NextResponse.redirect(
        buildFrontendErrorUrl("Failed to fetch Facebook profile", origin),
      );
    }

    const fbUser: FacebookUserInfo = await userInfoRes.json();

    if (!fbUser.email) {
      return NextResponse.redirect(
        buildFrontendErrorUrl(
          "Email permission is required. Please try again and grant email access.",
          origin,
        ),
      );
    }

    // Send to backend to create/find user and get app tokens
    const backendRes = await fetch(
      `${getBackendUrl()}/api/auth/social/facebook`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fbUser.email,
          firstName: fbUser.first_name,
          lastName: fbUser.last_name,
          facebookId: fbUser.id,
          avatar: fbUser.picture?.data?.url || null,
        }),
      },
    );

    if (!backendRes.ok) {
      const errData = await backendRes.json().catch(() => null);
      const message =
        errData?.message || "Failed to complete Facebook authentication";
      return NextResponse.redirect(buildFrontendErrorUrl(message, origin));
    }

    const authData = await backendRes.json();

    return NextResponse.redirect(
      buildFrontendCallbackUrl({
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
        user: authData.user,
        redirect,
        requestOrigin: origin,
      }),
    );
  } catch (err) {
    console.error("Facebook OAuth error:", err);
    return NextResponse.redirect(
      buildFrontendErrorUrl(
        "An unexpected error occurred during Facebook login",
        origin,
      ),
    );
  }
}
