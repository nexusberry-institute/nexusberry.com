"use client";

import { Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from "next/link";
import { useAuth } from '../../_providers/Auth';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ModeToggle } from './toggle';

interface NavbarProps {
  isCoursePage: boolean;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  isCoursePage,
  toggleSidebar,
  isSidebarOpen,
}) => {
  const { user } = useAuth();

  return (
    <nav className="dashboard-navbar">
      <div className="dashboard-navbar__container">
        <div className="dashboard-navbar__search">
          <div className="md:hidden">
            <SidebarTrigger className="dashboard-navbar__sidebar-trigger" />
          </div>
          <div className="flex items-center gap-4">
            {isCoursePage && (
              <button className="navbar__toggle" onClick={toggleSidebar}>
                {isSidebarOpen ? (
                  <ChevronLeft className="navbar__icon" />
                ) : (
                  <ChevronRight className="navbar__icon" />
                )}
              </button>
            )}
          </div>
        </div>

        <div className="dashboard-navbar__actions">
          {/* <ModeToggle /> */}
          <button className="nondashboard-navbar__notification-button">
            <span className="nondashboard-navbar__notification-indicator"></span>
            <Bell className="nondashboard-navbar__notification-icon" />

          </button>

          {user ? (
            <div>
              <Link href="/lms/profile">
                <span>Welcome, {user.email}</span>
              </Link>
            </div>

          ) : (
            <div>
              <Link href="/login">
                <span>Login</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

