"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import {
  CalendarMortarboardFreeIcons,
  DashboardSquare02Icon,
  FolderIcon,
  NotebookPen,
  ResourcesAddFreeIcons,
  StudentCardFreeIcons,
} from "@hugeicons/core-free-icons";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useGetBookmarksQuery } from "@/apis/lessons/lessonsService";
import { useGetMyCertificatesQuery } from "@/apis/profile/profileService";
import type { RootState } from "@/store";

const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { accessToken } = useSelector((s: RootState) => s.tokens);

  const { data: bookmarks = [] } = useGetBookmarksQuery(undefined, {
    skip: !accessToken,
  });
  const { data: certificates = [] } = useGetMyCertificatesQuery(undefined, {
    skip: !accessToken,
  });

  if (pathname && pathname.startsWith("/login")) {
    return <>{children}</>;
  }

  const savedCount = bookmarks.length || undefined;
  const certCount = certificates.length || undefined;

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
        {
          label: "Saved Courses",
          path: "/student/learn/saved",
          ...(savedCount !== undefined ? { badge: savedCount } : {}),
        },
        {
          label: "My Certificates",
          path: "/student/learn/certificates",
          ...(certCount !== undefined ? { badge: certCount } : {}),
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
