"use client";

import { X, LogIn, ArrowRight } from "lucide-react";
import { useEffect } from "react";

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  action?: string;
}

export default function AuthRequiredModal({
  isOpen,
  onClose,
  action = "access this feature",
}: AuthRequiredModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRedirect = () => {
    const currentPath = window.location.pathname + window.location.search;
    const encodedPath = encodeURIComponent(currentPath);

    window.location.href = `https://learn.etshub.org/login?redirect=${encodedPath}`;
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={18} className="text-gray-500" />
          </button>

          <div className="px-8 py-10">
            <div
              className="flex items-center justify-center w-14 h-14 rounded-full mb-5 mx-auto"
              style={{ background: "#EDE0FB" }}
            >
              <LogIn size={24} style={{ color: "#3A0CA3" }} />
            </div>

            <h2
              className="text-[22px] font-bold text-center mb-3"
              style={{ color: "#0e1430" }}
            >
              Sign in required
            </h2>

            <p
              className="text-[15px] text-center leading-relaxed mb-7"
              style={{ color: "#6B7280" }}
            >
              You need to sign in to {action}. Create an account or sign in to
              continue your learning journey.
            </p>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleRedirect}
                className="flex items-center justify-center gap-2 text-[14px] font-semibold px-6 py-3.5 rounded-xl transition-opacity hover:opacity-90 w-full"
                style={{ background: "#3A0CA3", color: "#FFFFFF" }}
              >
                Sign in to continue
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="text-[14px] font-medium px-6 py-3 rounded-xl transition-colors hover:bg-gray-50 w-full"
                style={{ color: "#6B7280" }}
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
