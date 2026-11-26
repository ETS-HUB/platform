"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { DashboardSquare02Icon, MessageSecureIcon } from "@hugeicons/core-free-icons";

import DashboardLayout from "@/components/layout/DashboardLayout";

const TutorLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  if (pathname && pathname.startsWith("/login")) {
    return <>{children}</>;
  }

  const tutorSidebarItems = [
    {
      icon: DashboardSquare02Icon,
      label: "Dashboard",
      path: "/tutor/dashboard",
    },
    {
      icon: DashboardSquare02Icon,
      label: "My Courses",
      path: "/tutor/courses",
    },
    {
      icon: DashboardSquare02Icon,
      label: "Review Queue",
      path: "/tutor/review-queue",
    },
    {
      icon: DashboardSquare02Icon,
      label: "Review History",
      path: "/tutor/review-history",
    },
       {
      icon: MessageSecureIcon,
      label: "Messages",
      path: "/tutor/messages",
    },
  ];

  return (
    <DashboardLayout sidebarItems={tutorSidebarItems}>
      {children}
    </DashboardLayout>
  );
};

export default TutorLayout;
