// ../components/RoadmapNav.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  User,
  ChevronDown,
  LogOut,
  Settings,
  CreditCard,
  UserCircle,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import type { RootState, AppDispatch } from "@/store";
import { logoutUser } from "@/store/slices/auth/authThunks";
import { clearAuth } from "@/store/slices/auth/authSlice";
import { clearTokens } from "@/store/slices/auth/tokenSlice";
import { clearAuthTokenCookies } from "@/lib/authCookies";

const LINKS = [
  { label: "Study Buddy", href: "/ai" },
  { label: "Courses", href: "/courses" },
  { label: "Videos", href: "/videos" },
  { label: "Blog", href: "/blog" },
];

const DROPDOWN_ITEMS = [
  { label: "My Profile", href: "/profile", icon: UserCircle },
  { label: "Account", href: "/account", icon: User },
  { label: "Billing", href: "/billing", icon: CreditCard },
  { label: "Settings", href: "/settings", icon: Settings },
];

function ProfileDropdown({
  user,
}: {
  user: {
    firstName?: string;
    lastName?: string;
    avatar?: string | null;
    email?: string;
  };
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    try {
      await dispatch(logoutUser()).unwrap();
    } catch {
      // ignore logout errors
    } finally {
      dispatch(clearAuth());
      dispatch(clearTokens());
      clearAuthTokenCookies();
      toast.success("Logged out");
      router.push("/login");
    }
  };

  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() ||
    "?";
  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.email ||
    "Account";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-2 py-1.5 transition-colors hover:bg-white/20"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={displayName}
            className="h-7 w-7 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3A0CA3] text-[11px] font-bold text-white">
            {initials}
          </span>
        )}
        <span className="hidden text-[13px] font-medium text-white sm:block max-w-24 truncate">
          {user.firstName ?? "Account"}
        </span>
        <ChevronDown size={13} className="text-white/70" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-2xl border bg-white py-1 shadow-xl"
          style={{ borderColor: "#EDE0FB", zIndex: 50 }}
        >
          {/* User info header */}
          <div
            className="border-b px-4 py-3"
            style={{ borderColor: "#F3F4F6" }}
          >
            <p
              className="text-[13.5px] font-semibold truncate"
              style={{ color: "#0e1430" }}
            >
              {displayName}
            </p>
            {user.email && (
              <p
                className="text-[11.5px] truncate"
                style={{ color: "#9CA3AF" }}
              >
                {user.email}
              </p>
            )}
          </div>

          {/* Menu items */}
          {DROPDOWN_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] font-medium transition-colors hover:bg-[#FAF7FF]"
                style={{ color: "#374151" }}
              >
                <Icon size={15} style={{ color: "#6B7280" }} />
                {item.label}
              </Link>
            );
          })}

          {/* Divider + Logout */}
          <div className="my-1 border-t" style={{ borderColor: "#F3F4F6" }} />
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[13.5px] font-medium transition-colors hover:bg-red-50"
            style={{ color: "#DC2626" }}
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default function RoadmapNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);

  const currentPath =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.pathname + window.location.search)
      : "";

  const isActive = (href: string) =>
    href === "/roadmaps"
      ? pathname === "/roadmaps" || pathname.startsWith("/roadmaps/")
      : pathname.startsWith(href);

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-8">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="ETS logo"
              width={100}
              height={100}
              className="h-10 w-40 rounded-xl object-contain"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[14px] sm:text-base font-medium transition-colors hover:text-white"
                style={{
                  color: isActive(l.href) ? "#FFFFFF" : "rgba(255,255,255,0.7)",
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <ProfileDropdown user={user} />
          ) : (
            <>
              <Link
                href={`/login`}
                className="text-[14px] sm:text-base font-medium text-white/80 transition-colors hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-white px-4 py-2 text-[13.5px] font-semibold transition-transform hover:-translate-y-0.5"
                style={{ color: "#3A0CA3" }}
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="md:hidden text-white"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden mx-4 rounded-2xl border border-white/15 bg-[#151c31]/95 p-4 backdrop-blur">
          <nav className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-[14px] sm:text-base font-medium text-white/85 hover:bg-white/10"
              >
                {l.label}
              </Link>
            ))}

            {isAuthenticated && user ? (
              <>
                <div className="mt-2 border-t border-white/10 pt-3 space-y-1">
                  {DROPDOWN_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13.5px] font-medium text-white/85 hover:bg-white/10"
                    >
                      <item.icon size={14} />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="mt-2 flex gap-2 border-t border-white/10 pt-3">
                <Link
                  href={`/login`}
                  className="flex-1 rounded-full border border-white/30 py-2 text-center text-[13.5px] font-semibold text-white"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="flex-1 rounded-full bg-white py-2 text-center text-[13.5px] font-semibold"
                  style={{ color: "#3A0CA3" }}
                  onClick={() => setOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
