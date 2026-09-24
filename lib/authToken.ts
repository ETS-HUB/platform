type JwtPayload = {
  exp?: number;
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

export function normalizeToken(token: string): string {
  const trimmed = token.trim();

  if (trimmed.length >= 2 && trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

export function isTokenExpired(token: string): boolean {
  const normalizedToken = normalizeToken(token);
  const parts = normalizedToken.split(".");

  if (parts.length < 2) {
    return true;
  }

  const payloadJson = decodeBase64Url(parts[1]);
  if (!payloadJson) {
    return true;
  }

  try {
    const payload = JSON.parse(payloadJson) as JwtPayload;
    if (typeof payload.exp !== "number") {
      return true;
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);
    return payload.exp <= nowInSeconds;
  } catch {
    return true;
  }
}
