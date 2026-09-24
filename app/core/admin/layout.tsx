"use client";

import React from "react";
import { App } from "antd";
import { usePathname } from "next/navigation";
import {
  CalendarMortarboardFreeIcons,
  DashboardSquare02Icon,
  FolderIcon,
  NotebookPen,
  ResourcesAddFreeIcons,
  Users,
} from "@hugeicons/core-free-icons";

import DashboardLayout from "@/components/layout/DashboardLayout";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  if (pathname && pathname.startsWith("/login")) {
    return <>{children}</>;
  }

  const adminSidebarItems = [
    {
      icon: DashboardSquare02Icon,
      label: "Overview",
      path: "/core/admin/overview",
    },
    {
      icon: Users,
      label: "Users",
      path: "/core/admin/users",
    },
    {
      icon: FolderIcon,
      label: "Courses",
      path: "/core/admin/courses",
    },
    {
      icon: CalendarMortarboardFreeIcons,
      label: "Assessment Bank",
      path: "/core/admin/assessment-bank",
    },

    {
      icon: ResourcesAddFreeIcons,
      label: "Assessment Configs",
      path: "/core/admin/configs",
    },
    {
      icon: CalendarMortarboardFreeIcons,
      label: "Assignments",
      path: "/core/admin/assignments",
    },
    {
      icon: CalendarMortarboardFreeIcons,
      label: "Resources",
      path: "/core/admin/resources",
    },
    {
      icon: CalendarMortarboardFreeIcons,
      label: "Badges",
      path: "/core/admin/badges",
    },
    {
      icon: CalendarMortarboardFreeIcons,
      label: "Tracks",
      path: "/core/admin/tracks",
    },
    {
      icon: CalendarMortarboardFreeIcons,
      label: "Certificates",
      path: "/core/admin/certificates",
    },
  ];

  return (
    <App>
      <DashboardLayout sidebarItems={adminSidebarItems}>
        {children}
      </DashboardLayout>
    </App>
  );
};

export default AdminLayout;
