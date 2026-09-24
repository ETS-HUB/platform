const TOKEN_COOKIE_KEYS = ["accessToken", "token"] as const;
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function hasDocument() {
  return typeof document !== "undefined";
}

export function setAuthTokenCookie(token: string) {
  if (!hasDocument()) {
    return;
  }

  const encodedToken = encodeURIComponent(token);

  TOKEN_COOKIE_KEYS.forEach((cookieKey) => {
    document.cookie = `${cookieKey}=${encodedToken}; Path=/; Max-Age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
  });
}

export function clearAuthTokenCookies() {
  if (!hasDocument()) {
    return;
  }

  TOKEN_COOKIE_KEYS.forEach((cookieKey) => {
    document.cookie = `${cookieKey}=; Path=/; Max-Age=0; SameSite=Lax`;
  });
}
