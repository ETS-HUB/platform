import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import Image from "next/image";

const LOGO_SRC: string | null = "/logo.png";

const EXPLORE = [
  { label: "Roadmaps", href: "/roadmaps" },
  { label: "Study Buddy", href: "/study-buddy" },
  { label: "Courses", href: "/courses" },
  { label: "Videos", href: "/videos" },
  { label: "Blog", href: "/blog" },
];

const COMMUNITY = [
  { label: "Events", href: "/events" },
  { label: "Join ETS", href: "/signup" },
  { label: "Login", href: "/login" },
];

const LEGAL = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
];

function Column({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-[14px] font-semibold uppercase tracking-wider text-white">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-[15px] transition-colors text-white"
              // style={{ color: "#A5B4FC" }}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function HomeFooter() {
  return (
    <footer className="bg-[#0C1020] h-fit">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:py-20 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            {LOGO_SRC ? (
              <Image
                src={LOGO_SRC}
                alt="ETS logo"
                width={100}
                height={100}
                className="h-40 w-40 rounded-xl object-contain"
              />
            ) : (
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl text-[15px] font-extrabold text-white"
                style={{
                  background: "linear-gradient(135deg, #3A0CA3, #7C3AED)",
                }}
              >
                ETS
              </span>
            )}
          </Link>

          <p
            className="-mt-10 max-w-sm text-base leading-relaxed"
            style={{ color: "#9CA3AF" }}
          >
            An organization training students through hands-on tech tracks,
            mentorship and community events, built to help you learn, build and
            grow your career.
          </p>

          <Link
            href="mailto:hello@ets.com"
            className="mt-5 inline-flex items-center gap-2 text-[15px] transition-colors hover:text-white"
            style={{ color: "#9CA3AF" }}
          >
            <Mail size={14} style={{ color: "#A78BFA" }} />
            etshub@gmail.com
          </Link>
        </div>

        <Column title="Explore" links={EXPLORE} />
        <Column title="Community" links={COMMUNITY} />
        <Column title="Legal" links={LEGAL} />
      </div>

      <div
        className="border-t px-6 py-5 text-center text-[14px]"
        style={{ borderColor: "#1F2547", color: "#6B7280" }}
      >
        © {new Date().getFullYear()} ETS. All rights reserved.
      </div>
    </footer>
  );
}
