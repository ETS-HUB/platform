"use client";
import React from "react";
import { usePathname } from "next/navigation";
import {
  CalendarMortarboardFreeIcons,
  DashboardSquare02Icon,
  FolderIcon,
  NotebookPen,
  ResourcesAddFreeIcons,
  StudentCardFreeIcons,
} from "@hugeicons/core-free-icons";

import DashboardLayout from "@/components/layout/DashboardLayout";

const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  if (pathname && pathname.startsWith("/login")) {
    return <>{children}</>;
  }

  const studentSidebarItems = [
    {
      icon: DashboardSquare02Icon,
      label: "Dashboard",
      path: "/student/dashboard",
    },
    {
      icon: FolderIcon,
      label: "My Courses",
      path: "/student/courses",
      children: [
        { label: "All Courses", path: "/student/learn/all" },
        { label: "Enrolled Courses", path: "/student/learn/my-courses" },
        { label: "Saved Courses", path: "/student/learn/saved", badge: 2 },
        {
          label: "My Certificates",
          path: "/student/learn/certificates",
          badge: 2,
        },
      ],
    },
    {
      icon: NotebookPen,
      label: "Assignments",
      path: "/student/assignments",
    },
    {
      icon: CalendarMortarboardFreeIcons,
      label: "Practice",
      path: "/student/practice",
    },

    {
      icon: ResourcesAddFreeIcons,
      label: "Resources",
      path: "/student/resources",
    },
    {
      icon: StudentCardFreeIcons,
      label: "Profile",
      path: "/student/profile",
    },
  ];

  return (
    <DashboardLayout sidebarItems={studentSidebarItems}>
      {children}
    </DashboardLayout>
  );
};

export default StudentLayout;
