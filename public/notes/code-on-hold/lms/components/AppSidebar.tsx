
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  PanelLeft,
  Settings,
  User,
  CreditCard,
  Calendar
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useLMSAuth } from "../lmsAuth";

const AppSidebar = () => {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const { hasCompletedProfile } = useLMSAuth()

  const navLinks = {
    student: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/lms/dashboard" },
      { icon: BookOpen, label: "My Courses", href: "/lms/courses" },
      { icon: Calendar, label: "My Events", href: "/lms/events" },
      { icon: CreditCard, label: "Fees & Payments", href: "/lms/payments" },
      { icon: User, label: "Profile", href: "/lms/profile" },
      { icon: Settings, label: "Settings", href: "/lms/settings" },
    ],
  };

  return (
    <Sidebar
      collapsible="icon"
      style={{ height: "100vh" }}
      className="bg-customgreys-primarybg border-none shadow-lg"
    >
      {hasCompletedProfile || <div className="loadingBlock" />}
      <SidebarHeader>
        <SidebarMenu className="app-sidebar__menu">
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={() => toggleSidebar()}
              className="group hover:gray-500"
            >
              <div className="app-sidebar__logo-container group mx-auto">
                <div className="app-sidebar__logo-wrapper">
                  <Image
                    src="/logo.png"
                    alt="logo"
                    width={100}
                    height={80}
                    className="app-sidebar__logo"
                  />
                </div>
                <PanelLeft className="app-sidebar__collapse-icon" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuSubItem>
            <p className="app-sidebar__title">NexusBerry</p>
          </SidebarMenuSubItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="app-sidebar__nav-menu">
          {navLinks.student.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <SidebarMenuItem
                key={link.href}
                className={cn(
                  "app-sidebar__nav-item",
                  isActive && "bg-gray-800"
                )}
              >
                <SidebarMenuButton
                  asChild
                  size="lg"
                  className={cn(
                    "app-sidebar__nav-button",
                    !isActive && "text-white"
                  )}
                >
                  <Link
                    href={link.href}
                    className="app-sidebar__nav-link"
                    scroll={false}
                  >
                    <link.icon
                      className={isActive ? "text-white" : "text-gray-500"}
                    />
                    <span
                      className={cn(
                        "app-sidebar__nav-text",
                        isActive ? "text-white" : "text-gray-500"
                      )}
                    >
                      {link.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
                {isActive && <div className="app-sidebar__active-indicator" />}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                className="app-sidebar__signout"
                onClick={() => router.push("/logout")}
              >
                <LogOut className="mr-2 h-6 w-6" />
                <span >Sign out</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
