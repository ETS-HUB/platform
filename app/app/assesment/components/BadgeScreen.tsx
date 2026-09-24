"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import type { Badge } from "@/apis/assessment/types";

interface BadgeScreenProps {
  loading: boolean;
  badges: Badge[];
  onContinue: () => void;
}

export function BadgeScreen({ loading, badges, onContinue }: BadgeScreenProps) {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-12"
      style={{ background: "#F5EEFE" }}
    >
      <div className="w-full max-w-md text-center">
        {loading ? (
          <>
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-5 animate-pulse"
              style={{ background: "#FCE3F1" }}
            >
              <span className="text-2xl">🏅</span>
            </div>
            <h2
              className="text-[18px] font-semibold mb-1.5"
              style={{ color: "#0e1430" }}
            >
              Checking for badges
            </h2>
            <p className="text-[13.5px]" style={{ color: "#6B7280" }}>
              Seeing what this attempt earned you.
            </p>
          </>
        ) : badges.length > 0 ? (
          <>
            <h2
              className="text-[20px] font-semibold mb-1.5"
              style={{ color: "#0e1430" }}
            >
              {badges.length === 1
                ? "You earned a badge!"
                : `You earned ${badges.length} badges!`}
            </h2>
            <p className="text-[13.5px] mb-8" style={{ color: "#6B7280" }}>
              Added to your profile. Recruiters can see these.
            </p>

            <div className="flex gap-4 justify-center flex-wrap mb-8">
              {badges.map((b, i) => (
                <div key={i} className="flex flex-col items-center gap-2 w-28">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center"
                    style={{ background: "#FCE3F1" }}
                  >
                    <span className="text-3xl">{b.icon}</span>
                  </div>
                  <div>
                    <p
                      className="text-[12.5px] font-semibold"
                      style={{ color: "#0e1430" }}
                    >
                      {b.name}
                    </p>
                    <p
                      className="text-[11px] leading-snug"
                      style={{ color: "#8B84A0" }}
                    >
                      {b.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div
              className="inline-flex bg-[#EDE0FB] items-center justify-center w-14 h-14 rounded-full mb-5"
            >
              <span className="text-2xl">🎯</span>
            </div>
            <h2 className="text-lg text-[#0e1430] font-semibold mb-1.5">
              No new badges this time
            </h2>
            <p className="text-[13.5px] mb-8" style={{ color: "#6B7280" }}>
              Keep taking assessments to unlock more.
            </p>
          </>
        )}

        <button
          type="button"
          disabled={loading}
          onClick={onContinue}
          className="inline-flex items-center gap-2 text-[14px] font-semibold px-5 py-3 rounded-lg mx-auto"
          style={{
            color: loading ? "#B3A8C9" : "#FFFFFF",
            background: loading ? "#EDE0FB" : "#3A0CA3",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          View your certificate
          <ArrowRight size={15} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}

export default BadgeScreen;
