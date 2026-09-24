export type AppRole = "TUTOR" | "PARENT" | "SUPER_ADMIN" | "STUDENT";

export const roleRouteAccess: Record<AppRole, string[]> = {
  TUTOR: ["/tutor"],
  PARENT: ["/parent"],
  SUPER_ADMIN: ["/core/admin"],
  STUDENT: ["/student"],
};

export function canAccessRoute(role: string, pathname: string): boolean {
  const prefixes = roleRouteAccess[role as AppRole];

  if (!prefixes) {
    return false;
  }

  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/"),
  );
}
