"use client";
import { useEffect, useState } from "react";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Badge, Dropdown, type MenuProps } from "antd";
import { HugeiconsIcon, HugeiconsIconProps } from "@hugeicons/react";
import {
  ArrowDownIcon,
  Cancel01Icon,
  DashboardSquare02Icon,
  Menu01FreeIcons,
  Notification01Icon,
  UserIcon,
  PinIcon,
  PinOffIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import logo from "@/assets/images/logo.png";
import { logoutUser } from "@/store/slices/auth/authThunks";
import { AppDispatch, RootState } from "@/store";
// import { useGetUnreadNotificationsCountQuery } from "@/apis/notification/notificationService";
import "./style.css";
import Link from "next/link";

interface SidebarSubItem {
  label: string;
  path: string;
  badge?: number;
}

interface SidebarItem {
  icon: HugeiconsIconProps["icon"];
  label: string;
  path?: string;
  active?: boolean;
  children?: SidebarSubItem[];
}

interface DashboardLayoutProps {
  userImage?: string;
  userRole?: string;
  userEmail?: string;
  sidebarItems?: SidebarItem[];
  supportEmail?: string;
  children: React.ReactNode;
}

const SIDEBAR_PIN_KEY = "sidebar-pinned";

export default function DashboardLayout({
  userImage,
  userRole,
  userEmail,
  sidebarItems = [],
  supportEmail,
  children,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const displayUserImage = user?.avatar;
  const displayUserName = user ? `${user.firstName} ${user.lastName}` : "";
  console.log(user)
  const displayUserRole = userRole ?? user?.role;
  const displayUserEmail = userEmail ?? user?.email;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<number, boolean>>({});
  const normalizedRole = (displayUserRole || "")
    .toUpperCase()
    .replace(/\s+/g, "_");
  const isSuperAdmin = normalizedRole === "SUPER_ADMIN";

  useEffect(() => {
    const stored = window.localStorage.getItem(SIDEBAR_PIN_KEY);
    if (stored === "true") setIsPinned(true);
  }, []);

  const togglePin = () => {
    setIsPinned((prev) => {
      const next = !prev;
      window.localStorage.setItem(SIDEBAR_PIN_KEY, String(next));
      return next;
    });
  };

  const isExpanded = isPinned || isHovered;

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch {
    } finally {
      router.replace("/login");
    }
  };

  const accountMenuItems: MenuProps["items"] = [
    ...(!isSuperAdmin
      ? [
          {
            key: "view-profile",
            label: <span className="font-medium">View profile</span>,
          },
          {
            type: "divider" as const,
          },
        ]
      : []),
    // {
    //   key: "Notifications",
    //   label: <span className="font-medium">Notifications</span>,
    // },
    ...(isSuperAdmin
      ? [
          {
            key: "Deleted users",
            label: <span className="font-medium">Deleted users</span>,
          },
        ]
      : []),
    ...(isSuperAdmin
      ? [
          {
            key: "User activity tracking",
            label: <span className="font-medium">User activity tracking</span>,
          },
        ]
      : []),
    {
      key: "logout",
      label: (
        <span className="text-red-600 sm:text-base text-sm font-medium">
          Logout
        </span>
      ),
    },
  ];

  const defaultSidebarItems: SidebarItem[] = [
    {
      icon: DashboardSquare02Icon,
      label: "Dashboard",
      path: "/core/admin/dashboard",
    },
  ];

  const menuItems =
    sidebarItems.length > 0 ? sidebarItems : defaultSidebarItems;

  // auto-open any parent whose child matches the current path
  useEffect(() => {
    const next: Record<number, boolean> = {};
    menuItems.forEach((item, index) => {
      if (
        item.children?.some(
          (child) =>
            pathname === child.path || pathname.startsWith(child.path + "/"),
        )
      ) {
        next[index] = true;
      }
    });
    setOpenMenus((prev) => ({ ...prev, ...next }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleMenu = (index: number) => {
    setOpenMenus((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden flex-col">
      <div className="flex flex-1 overflow-hidden">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <aside
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            fixed md:static inset-y-0 py-10 left-0 z-50
            bg-gray-100 shadow-lg transform transition-all duration-300 ease-in-out
            flex flex-col overflow-hidden
            ${isSidebarOpen ? "translate-x-0 w-68" : "-translate-x-full md:translate-x-0"}
            ${isExpanded ? "md:w-68" : "md:w-20"}
          `}
        >
          <div className="p-4 py-2 shrink-0 relative flex items-center justify-center h-16">
            <div
              className={`
                absolute inset-0 flex items-center justify-center transition-opacity duration-200
                ${isExpanded ? "opacity-0 pointer-events-none" : "opacity-100 md:flex hidden"}
              `}
            >
              <Image
                src="/logo-icon.png"
                width={300}
                height={200}
                alt="Genius Tutors"
                className="h-auto w-30"
              />
            </div>

            <div
              className={`
                flex items-center justify-center transition-opacity duration-200
                ${isExpanded ? "opacity-100" : "opacity-100 md:opacity-0"}
              `}
            >
              <Image
                src="/logoblue.webp"
                width={200}
                height={200}
                alt="ETS Academy"
                className="h-auto w-50"
              />
            </div>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1 rounded-md hover:bg-gray-100 absolute top-3 right-2"
            >
              <HugeiconsIcon
                icon={Cancel01Icon}
                size={20}
                strokeWidth={2}
                className="text-white"
              />
            </button>

            <button
              onClick={togglePin}
              className={`
                hidden md:flex cursor-pointer text-gray-600 absolute -top-5 right-3 p-1.5 rounded-full ${isPinned ? "hover:text-white hover:bg-secondary" : ""} transition-all
                ${isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"}
              `}
              title={isPinned ? "Unpin sidebar" : "Keep sidebar open"}
            >
              <HugeiconsIcon
                icon={isPinned ? PinOffIcon : PinIcon}
                size={20}
                strokeWidth={2.2}
              />
            </button>
          </div>

          <nav className="flex-1 px-3 mt-10 pb-10 overflow-y-auto overflow-x-hidden gap-4 flex flex-col">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const hasChildren = !!item.children?.length;
              const isMenuOpen = isExpanded && !!openMenus[index];

              const isParentActive =
                (item.path &&
                  (pathname === item.path ||
                    pathname.startsWith(item.path + "/"))) ||
                item.children?.some(
                  (child) =>
                    pathname === child.path ||
                    pathname.startsWith(child.path + "/"),
                );

              const handleParentClick = () => {
                if (hasChildren) {
                  if (isExpanded) {
                    toggleMenu(index);
                  } else {
                    // collapsed rail: go straight to the item's own path,
                    // or the first child if it has no path of its own
                    router.push(item.path ?? item.children![0].path);
                  }
                } else if (item.path) {
                  router.push(item.path);
                }
              };

              return (
                <div key={index}>
                  <button
                    title={!isExpanded ? item.label : undefined}
                    className={`
                      w-full flex cursor-pointer items-center py-3 rounded-full text-left transition-colors
                      ${isExpanded ? "px-3 justify-between" : "px-0 justify-center"}
                      ${
                        isParentActive && !hasChildren
                          ? "bg-white text-gray-900 shadow-sm"
                          : isParentActive && hasChildren
                            ? "text-gray-900 font-semibold"
                            : "text-gray-700 hover:bg-gray-200 cursor-pointer"
                      }
                    `}
                    onClick={handleParentClick}
                  >
                    <span className="flex items-center">
                      <HugeiconsIcon
                        icon={Icon}
                        size={22}
                        className={
                          isExpanded ? "mr-3 flex-shrink-0" : "flex-shrink-0"
                        }
                      />
                      <span
                        className={`
                          font-semibold text-base whitespace-nowrap transition-all duration-200
                          ${isExpanded ? "opacity-100 max-w-[160px]" : "opacity-0 max-w-0 overflow-hidden"}
                        `}
                      >
                        {item.label}
                      </span>
                    </span>

                    {hasChildren && (
                      <span
                        className={`
                          transition-all duration-200
                          ${isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}
                        `}
                      >
                        <HugeiconsIcon
                          icon={ArrowRight01Icon}
                          size={16}
                          className={`transition-transform duration-200 ${
                            isMenuOpen ? "rotate-90" : ""
                          }`}
                        />
                      </span>
                    )}
                  </button>

                  {/* children — only ever rendered when the rail is expanded */}
                  {hasChildren && (
                    <div
                      className={`
                        overflow-hidden transition-all duration-200
                        ${isExpanded && isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                      `}
                    >
                      <div className="flex flex-col gap-1 pl-11 pr-1 pb-2">
                        {item.children!.map((child) => {
                          const isChildActive =
                            pathname === child.path ||
                            pathname.startsWith(child.path + "/");

                          return (
                            <button
                              key={child.path}
                              className={`
                                flex items-center justify-between mt-1 w-full text-left px-3 py-1.5 rounded-full text-[15px] cursor-pointer transition-colors
                                ${
                                  isChildActive
                                    ? "bg-white text-gray-900 font-semibold shadow-sm"
                                    : "text-gray-500 hover:bg-gray-200 hover:text-gray-800"
                                }
                              `}
                              onClick={() => router.push(child.path)}
                            >
                              <span>{child.label}</span>
                              {typeof child.badge === "number" && (
                                <span
                                  className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                                  style={{
                                    background: "#E5E7EB",
                                    color: "#4B5563",
                                  }}
                                >
                                  {child.badge}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {supportEmail && (
            <div className="px-3 pb-6 flex-shrink-0">
              <Link
                href={`mailto:${supportEmail}`}
                title={!isExpanded ? "Contact Support" : undefined}
                className={`
                  flex items-center gap-2 w-full py-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors text-white text-sm font-semibold
                  ${isExpanded ? "px-4 justify-start" : "px-0 justify-center"}
                `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span
                  className={`
                    truncate transition-all duration-200
                    ${isExpanded ? "opacity-100 max-w-[160px]" : "opacity-0 max-w-0 overflow-hidden"}
                  `}
                >
                  Contact Support
                </span>
              </Link>
            </div>
          )}
        </aside>

        <div className="flex-1 flex flex-col min-w-0 h-screen">
          <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0 z-30">
            <div className="px-2 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between gap-x-4 h-20">
                <div className="flex items-center flex-1">
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 mr-2"
                  >
                    <HugeiconsIcon icon={Menu01FreeIcons} size={20} />
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  {/* <button
                    onClick={() => router.push("notifications")}
                    className="hover:scale-90 transition-all cursor-pointer relative p-2 text-gray-500 bg-gray-100 rounded-full hover:text-gray-500"
                  >
                    <HugeiconsIcon icon={Notification01Icon} size={22} />
                  </button> */}

                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 flex items-center gap-2 rounded-md px-2 py-1">
                      {displayUserImage ? (
                        <Image
                          src={displayUserImage}
                          alt={displayUserRole || "User"}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <HugeiconsIcon
                          icon={UserIcon}
                          size={32}
                          className="text-gray-400"
                        />
                      )}
                      <Dropdown
                        menu={{
                          items: accountMenuItems,
                          onClick: ({ key }) => {
                            if (key === "view-profile") {
                              router.push("profile");
                            }
                            // if (key === "Notifications") {
                            //   router.push("notifications");
                            // }
                            if (key === "Deleted users") {
                              router.push("/core/admin/users/deleted");
                            }
                            if (key === "User activity tracking") {
                              router.push("activity");
                            }
                            if (key === "logout") {
                              handleLogout();
                            }
                          },
                        }}
                        trigger={["click"]}
                        placement="bottomRight"
                      >
                        <HugeiconsIcon
                          icon={ArrowDownIcon}
                          size={32}
                          className="text-gray-400 md:hidden"
                        />
                      </Dropdown>
                    </div>

                    <Dropdown
                      menu={{
                        items: accountMenuItems,
                        onClick: ({ key }) => {
                          if (key === "view-profile") {
                            router.push("profile");
                          }
                          // if (key === "Notifications") {
                          //   router.push("notifications");
                          // }
                          if (key === "Deleted users") {
                            router.push("/core/admin/users/deleted");
                          }
                          if (key === "User activity tracking") {
                            router.push("/core/admin/users/activity");
                          }
                          if (key === "logout") {
                            handleLogout();
                          }
                        },
                      }}
                      trigger={["click"]}
                      placement="bottomRight"
                    >
                      <button className="hidden sm:flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-2">
                          <div className="text-left">
                            <div className="text-base truncate mb-1 text-[#102A43] capitalize font-semibold leading-tight">
                              {displayUserName}
                            </div>
                            <div className="text-sm text-gray-500 font-medium leading-tight">
                              {displayUserEmail}
                            </div>
                          </div>
                          <HugeiconsIcon icon={ArrowDownIcon} color="#000000" />
                        </div>
                      </button>
                    </Dropdown>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 bg-[#f0fdff]/50 overflow-y-auto">
            <div className="p-4 animate-slide-in-bottom sm:p-8 lg:p-10">
              {children || (
                <div className="bg-white rounded-lg shadow-sm p-6 min-h-96">
                  <div className="text-center text-gray-500 py-12">
                    <HugeiconsIcon
                      icon={DashboardSquare02Icon}
                      size={48}
                      className="mx-auto mb-4 text-gray-300"
                    />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Page Content
                    </h3>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
