import { NextRequest, NextResponse } from "next/server";
import { getBaseUrl } from "@/lib/oauth";

export async function GET(request: NextRequest) {
  const clientId = process.env.FACEBOOK_APP_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "Facebook OAuth is not configured" },
      { status: 500 },
    );
  }

  const redirect = request.nextUrl.searchParams.get("redirect");
  const callbackUrl = `${getBaseUrl()}/api/auth/facebook/callback`;

  const state = JSON.stringify({ redirect });

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl,
    scope: "email,public_profile",
    response_type: "code",
    state,
  });

  const facebookAuthUrl = `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`;

  return NextResponse.redirect(facebookAuthUrl);
}
