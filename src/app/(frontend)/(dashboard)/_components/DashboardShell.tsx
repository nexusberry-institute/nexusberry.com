'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  CalendarDays,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Video,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { User } from '@/payload-types'

type NavItem = { href: string; label: string; icon: React.ReactNode }

function getNavItems(roles: string[]): NavItem[] {
  const items: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  ]

  if (roles.includes('student')) {
    items.push(
      { href: '/lms/dashboard', label: 'My Courses', icon: <BookOpen size={18} /> },
      { href: '/tutorials', label: 'Tutorials', icon: <Video size={18} /> },
    )
  }

  if (roles.includes('teacher')) {
    items.push(
      { href: '/teacher/dashboard', label: 'My Batches', icon: <Users size={18} /> },
    )
  }

  items.push(
    { href: '/account', label: 'Account', icon: <UserIcon size={18} /> },
  )

  return items
}

export function DashboardShell({ user, children }: { user: User; children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const roles = (user.roles as string[]) ?? []
  const displayRole = roles.find(r => r !== 'authenticated') ?? 'user'
  const navItems = getNavItems(roles)

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-gray-200 transition-transform lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Logo / brand */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link href="/">
            <Image
              src="/logos/nexusberry-transparant-1712x450.png"
              alt="NexusBerry"
              width={140}
              height={37}
              className="h-8 w-auto"
            />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User info + logout */}
        <div className="border-t border-gray-200 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
              {(user.email?.[0] ?? 'U').toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
              <Badge variant="outline" className="text-[10px] capitalize bg-white text-gray-700 border-secondary">
                {displayRole}
              </Badge>
            </div>
          </div>
          <Link href="/logout" className="block">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-gray-600 hover:text-gray-900">
              <LogOut size={16} />
              Logout
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="sticky top-0 z-30 flex items-center h-16 px-4 bg-white border-b border-gray-200 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
          <Link href="/" className="ml-3">
            <Image
              src="/logos/nexusberry-transparant-1712x450.png"
              alt="NexusBerry"
              width={120}
              height={32}
              className="h-7 w-auto"
            />
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
