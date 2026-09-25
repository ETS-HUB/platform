import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const clientId = process.env.FACEBOOK_APP_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "Facebook OAuth is not configured" },
      { status: 500 },
    );
  }

  const redirect = request.nextUrl.searchParams.get("redirect");

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    request.nextUrl.origin;
  const callbackUri = `${appUrl}/api/auth/facebook/callback`;

  const state = JSON.stringify({ redirect });

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUri,
    scope: "email,public_profile",
    response_type: "code",
    state,
  });

  const facebookAuthUrl = `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`;

  return NextResponse.redirect(facebookAuthUrl);
}
