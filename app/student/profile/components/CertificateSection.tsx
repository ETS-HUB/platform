import { Award, ArrowRight } from "lucide-react";
import type { Certificate } from "@/apis/profile/types";

export function CertificateSection({
  certificates,
}: {
  certificates: Certificate[];
}) {
  if (certificates.length === 0) {
    return (
      <div
        className="rounded-2xl p-6 flex flex-col items-center text-center gap-2"
        style={{ background: "#F5EEFE", border: "1.5px dashed #DDC9F0" }}
      >
        <Award size={28} style={{ color: "#C9BEDD" }} />
        <p className="text-base font-semibold" style={{ color: "#0e1430" }}>
          No certificates yet
        </p>
        <p className="text-sm max-w-xs" style={{ color: "#8B84A0" }}>
          Complete a course, get all projects approved, and keep your quiz
          participation up to earn one.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {certificates.map((cert) => (
        <div
          key={cert.certificateId}
          className="flex items-center gap-4 rounded-2xl p-5"
          style={{ background: "#FFFFFF", border: "1.5px solid #EDE0FB" }}
        >
          <div
            className="flex items-center justify-center rounded-full w-12 h-12 shrink-0"
            style={{ background: "#FFF3E0" }}
          >
            <span className="text-[22px]">🎓</span>
          </div>
          <div className="min-w-0 flex-1">
            <p
              className="text-[13.5px] font-bold truncate"
              style={{ color: "#0e1430" }}
            >
              {cert.courseName}
            </p>
            <p className="text-[11px]" style={{ color: "#9CA3AF" }}>
              Grade {cert.grade} ·{" "}
              {new Date(cert.issuedAt).toLocaleDateString(undefined, {
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <ArrowRight
            size={15}
            style={{ color: "#C9BEDD" }}
            className="shrink-0"
          />
        </div>
      ))}
    </div>
  );
}
