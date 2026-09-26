"use client";

import { useSelector } from "react-redux";
import { ExternalLink, Award } from "lucide-react";
import { Skeleton } from "antd";
import Link from "next/link";
import CertificateSvg from "../components/CertificateSvg";
import { useGetMyCertificatesQuery } from "@/apis/profile/profileService";
import Header from "@/components/ui/Header";
import type { RootState } from "@/store";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

const CERT_BASE = "https://www.etshub.org/certification";

export default function MyCertificatesPage() {
  const { accessToken } = useSelector((s: RootState) => s.tokens);
  const user = useSelector((s: RootState) => s.auth.user);

  const { data: certificates = [], isLoading } = useGetMyCertificatesQuery(
    undefined,
    { skip: !accessToken },
  );

  const studentName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : "Student";

  return (
    <div className="min-h-screen w-full">
      <div className="mb-8">
        <Header
          title="My Certificates"
          subtitle={
            isLoading
              ? "Loading..."
              : certificates.length === 0
                ? "No certificates earned yet — complete a course to get one."
                : `${certificates.length} certificate${certificates.length === 1 ? "" : "s"} earned`
          }
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-6 bg-white border border-[#EDE0FB]"
            >
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          ))}
        </div>
      ) : certificates.length === 0 ? (
        <div
          className="rounded-2xl p-10 flex flex-col items-center text-center gap-3"
          style={{ background: "#F5EEFE", border: "1.5px dashed #DDC9F0" }}
        >
          <Award size={36} style={{ color: "#C9BEDD" }} />
          <p className="text-[15px] font-semibold" style={{ color: "#0e1430" }}>
            No certificates yet
          </p>
          <p className="text-[13px] max-w-xs" style={{ color: "#8B84A0" }}>
            Complete all lessons, get your projects approved, and maintain the
            required quiz average to earn a certificate.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {certificates.map((cert) => {
            const courseName = cert.topic.name;
            const viewUrl = `${CERT_BASE}/${slugify(studentName)}/${slugify(courseName)}`;

            return (
              <div
                key={cert.certificateId}
                className="rounded-2xl overflow-hidden"
                style={{ border: "1.5px solid #EDE0FB" }}
              >
                {/* Certificate preview */}
                <div className="bg-white p-4">
                  <CertificateSvg
                    recipientName={studentName}
                    courseName={courseName}
                    instructorName="ETS Academy"
                  />
                </div>

                {/* Certificate details + actions */}
                <div
                  className="px-6 py-4 flex items-center justify-between gap-4 flex-wrap"
                  style={{ background: "#F5EEFE" }}
                >
                  <div>
                    <p
                      className="text-[14px] font-bold"
                      style={{ color: "#0e1430" }}
                    >
                      {courseName}
                    </p>
                    {cert.topic.parent && (
                      <p className="text-[11.5px]" style={{ color: "#8B84A0" }}>
                        {cert.topic.parent.name}
                      </p>
                    )}
                    <div
                      className="flex items-center gap-3 mt-1.5 text-[12px]"
                      style={{ color: "#6B7280" }}
                    >
                      <span>
                        Grade{" "}
                        <span
                          className="font-bold"
                          style={{ color: "#3A0CA3" }}
                        >
                          {cert.grade}
                        </span>
                      </span>
                      <span>·</span>
                      <span>
                        Avg score{" "}
                        <span
                          className="font-semibold"
                          style={{ color: "#059669" }}
                        >
                          {cert.averageQuizScore}%
                        </span>
                      </span>
                      <span>·</span>
                      <span>
                        {new Date(cert.issuedAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <p
                      className="text-[10.5px] mt-1 font-mono"
                      style={{ color: "#9CA3AF" }}
                    >
                      ID: {cert.certificateId}
                    </p>
                  </div>

                  <Link
                    href={viewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-full shrink-0"
                    style={{ background: "#3A0CA3", color: "#FFFFFF" }}
                  >
                    <ExternalLink size={13} />
                    View certificate
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
