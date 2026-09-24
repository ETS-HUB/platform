import { ExternalLink } from "lucide-react";
import Link from "next/link";

export function ResourceLinkBlock({
  title,
  content,
  overview,
}: {
  title: string;
  content: string;
  overview?: string | null;
}) {
  return (
    <Link
      href={content}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-4 rounded-xl transition-colors hover:bg-[#F5EEFE]"
      style={{ border: "1.5px solid #EDE0FB" }}
    >
      <div
        className="flex items-center justify-center rounded-full w-9 h-9 shrink-0"
        style={{ background: "#F5EEFE" }}
      >
        <ExternalLink size={15} style={{ color: "#3A0CA3" }} />
      </div>
      <div className="min-w-0">
        <p
          className="text-[13.5px] font-semibold truncate"
          style={{ color: "#0e1430" }}
        >
          {title}
        </p>
        {overview && (
          <p className="text-[12px] truncate" style={{ color: "#8B84A0" }}>
            {overview}
          </p>
        )}
      </div>
    </Link>
  );
}
