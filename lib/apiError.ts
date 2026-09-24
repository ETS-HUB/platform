/**
 * Extracts a human-readable error message from an RTK Query / fetch error.
 * Backend shape: { message: string; error: string; statusCode: number }
 */
export function getApiError(
  error: unknown,
  fallback = "Something went wrong",
): string {
  if (!error || typeof error !== "object") return fallback;
  const e = error as Record<string, unknown>;
  const data = e.data as Record<string, unknown> | undefined;
  if (data && typeof data.message === "string") return data.message;
  if (typeof e.message === "string") return e.message;
  return fallback;
}

/**
 * Wraps an async mutation/query call with automatic antd success/error toasts.
 */
export async function withToast<T>(
  fn: () => Promise<T>,
  opts: {
    success?: string;
    errorFallback?: string;
    messageApi: { success: (s: string) => void; error: (s: string) => void };
  },
): Promise<T | undefined> {
  try {
    const result = await fn();
    if (opts.success) opts.messageApi.success(opts.success);
    return result;
  } catch (err) {
    opts.messageApi.error(getApiError(err, opts.errorFallback));
    return undefined;
  }
}
