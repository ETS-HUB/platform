"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface StartingScreenProps {
  configName: string;
}

export function StartingScreen({ configName }: StartingScreenProps) {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4"
      style={{ background: "#F5EEFE" }}
    >
      <div className="text-center">
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-5"
          style={{ background: "#EDE0FB" }}
        >
          <Loader2
            size={22}
            className="animate-spin"
            style={{ color: "#3A0CA3" }}
          />
        </div>
        <h2
          className="text-[18px] font-semibold mb-1.5"
          style={{ color: "#0e1430" }}
        >
          Preparing {configName}
        </h2>
        <p className="text-[13.5px]" style={{ color: "#6B7280" }}>
          Pulling your questions together — this only takes a moment.
        </p>
      </div>
    </div>
  );
}

export default StartingScreen;
