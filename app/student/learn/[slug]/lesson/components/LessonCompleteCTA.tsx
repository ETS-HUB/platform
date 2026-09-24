"use client";

import { useState } from "react";
import { ArrowRight, Award, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components";
import Image from "next/image";
import { IMAGES } from "@/constants/images";
import { useClaimCertificateMutation } from "@/apis/lessons/lessonsService";

type CertCriteria = {
  lessonsComplete: { done: number; total: number; met: boolean };
  projectsApproved: { done: number; total: number; met: boolean };
  averageQuizScore: { score: number; required: number; met: boolean };
};

export function LessonCompleteCTA({
  calculatedScore,
  totalPossiblePoints,
  onComplete,
  hasNextLesson,
  onGoNext,
  courseId,
}: {
  canComplete?: boolean;
  calculatedScore: number | null;
  totalPossiblePoints: number;
  onComplete: () => Promise<{ xpEarned: number }>;
  hasNextLesson: boolean;
  onGoNext: () => void;
  courseId?: string;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [xp, setXp] = useState(0);
  const [certStatus, setCertStatus] = useState<
    "idle" | "claiming" | "claimed" | "not_eligible"
  >("idle");
  const [certCriteria, setCertCriteria] = useState<CertCriteria | null>(null);
  const [claimCert] = useClaimCertificateMutation();

  const runComplete = async () => {
    setStatus("submitting");
    const res = await onComplete();
    setXp(res.xpEarned);
    setStatus("done");
  };

  const handleClaimCertificate = async () => {
    if (!courseId) return;
    setCertStatus("claiming");
    try {
      await claimCert(courseId).unwrap();
      setCertStatus("claimed");
    } catch (err: any) {
      const errData = err?.data;
      setCertCriteria(errData?.criteria ?? null);
      setCertStatus("not_eligible");
    }
  };

  if (status === "done") {
    return (
      <div
        className="rounded-2xl p-6 flex flex-col items-center text-center gap-2 mb-4"
        style={{ background: "#F0FDF4", border: "1.5px solid #BBF7D0" }}
      >
        <Image src={IMAGES.BadgeImage} alt="Success" width={150} height={100} />
        <p className="text-base mb-3 text-[#0e1430] font-semibold">
          Lesson Complete!
        </p>

        {totalPossiblePoints > 0 && calculatedScore !== null ? (
          <p className="text-[13px]" style={{ color: "#6B7280" }}>
            Scored {calculatedScore}% · +{xp} XP earned
          </p>
        ) : xp > 0 ? (
          <p className="text-[13px]" style={{ color: "#6B7280" }}>
            +{xp} XP earned
          </p>
        ) : null}

        {hasNextLesson ? (
          <Button
            type="button"
            size="lg"
            variant="outline"
            fullWidth
            onClick={onGoNext}
          >
            Next lesson
            <ArrowRight size={13} />
          </Button>
        ) : (
          <div className="w-full flex flex-col gap-2 mt-2">
            {certStatus === "claimed" ? (
              <div className="rounded-xl p-4" style={{ background: "#EDE0FB" }}>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Award size={18} style={{ color: "#3A0CA3" }} />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "#3A0CA3" }}
                  >
                    Certificate Earned!
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  View it from your course page.
                </p>
              </div>
            ) : certStatus === "not_eligible" ? (
              <div
                className="rounded-xl overflow-hidden text-left font-noto"
                style={{ border: "1px solid #E5E7EB" }}
              >
                <div className="px-4 py-3">
                  <span className="text-base font-medium">
                    Not eligible for certificate yet
                  </span>
                  <p className="text-sm mt-0.5">
                    Complete the requirements below to unlock it
                  </p>
                </div>

                {certCriteria && (
                  <div className="bg-white">
                    {[
                      {
                        key: "lessonsComplete",
                        label: "Lessons complete",
                        met: certCriteria.lessonsComplete?.met,
                        progress: `${certCriteria.lessonsComplete?.done}/${certCriteria.lessonsComplete?.total}`,
                      },
                      {
                        key: "projectsApproved",
                        label: "Projects approved",
                        met: certCriteria.projectsApproved?.met,
                        progress: `${certCriteria.projectsApproved?.done}/${certCriteria.projectsApproved?.total}`,
                      },
                      {
                        key: "averageQuizScore",
                        label: "Average quiz score",
                        met: certCriteria.averageQuizScore?.met,
                        progress: `${certCriteria.averageQuizScore?.score}% (min ${certCriteria.averageQuizScore?.required}%)`,
                      },
                    ].map((item, i) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between gap-3 px-4 py-2.5"
                        style={{
                          borderTop: i === 0 ? "none" : "1px solid #F3F4F6",
                          background: item.met ? "transparent" : "",
                        }}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {item.met ? (
                            <CheckCircle2
                              size={16}
                              style={{ color: "#16A34A" }}
                            />
                          ) : (
                            <XCircle size={16} style={{ color: "#D97706" }} />
                          )}
                          <span
                            className="text-sm truncate"
                            style={{
                              color: item.met ? "#374151" : "#92400E",
                              fontWeight: item.met ? 400 : 600,
                            }}
                          >
                            {item.label}
                          </span>
                        </div>
                        <span
                          className="text-sm whitespace-nowrap"
                          style={{ color: item.met ? "#6B7280" : "#92400E" }}
                        >
                          {item.progress}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  type="button"
                  onClick={handleClaimCertificate}
                  className="w-full text-center text-sm font-medium py-2.5"
                  style={{
                    color: "#3A0CA3",
                    background: "#F9FAFB",
                    borderTop: "1px solid #F3F4F6",
                  }}
                >
                  Check again
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                size="lg"
                variant="primary"
                fullWidth
                onClick={handleClaimCertificate}
                loading={certStatus === "claiming"}
              >
                <Award size={15} />
                Claim Certificate
              </Button>
            )}

            <Button
              type="button"
              size="lg"
              variant="outline"
              fullWidth
              onClick={onGoNext}
            >
              Back to course
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-6 flex flex-col items-center text-center gap-3 mb-4"
      style={{ background: "#F5EEFE", border: "1.5px solid #DDC9F0" }}
    >
      <Image src={IMAGES.SuccessImage} alt="Success" width={200} height={100} />
      <p className="text-base text-[#0e1430] font-medium">
        You&apos;ve reached the end of this lesson
      </p>
      <Button
        size="lg"
        variant="outline"
        type="button"
        fullWidth
        onClick={runComplete}
        loading={status === "submitting"}
        disabled={status === "submitting"}
      >
        Complete Lesson
      </Button>
    </div>
  );
}
