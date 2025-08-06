"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import LecturesSidebar from "./courses/[courseId]/LecturesSidebar";
import AppSidebar from "../components/AppSidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [courseId, setCourseId] = useState<string | undefined | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const isCoursePage = /^\/lms\/courses\/[^\/]+(?:\/lectures\/[^\/]+)?$/.test(pathname);

  useEffect(() => {
    if (isCoursePage) {
      const match = pathname.match(/\/lms\/courses\/([^\/]+)/);
      setCourseId(match ? match[1] : null);
    } else {
      setCourseId(null);
    }
  }, [isCoursePage, pathname]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  return (
    <div className="dashboard">
      <AppSidebar />
      <div className="dashboard__content">
        {isSidebarOpen &&
          <div>
            {courseId && <LecturesSidebar />}
          </div>
        }
        <div
          className={cn(
            "dashboard__main transition-all duration-500 ease-in-out",
            isCoursePage && "dashboard__main--not-course"
          )}
          style={{ height: "100vh" }}
        >
          <Navbar
            isCoursePage={isCoursePage}
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
          <div className="dashboard__body transition-all duration-700 ease-in-out">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

