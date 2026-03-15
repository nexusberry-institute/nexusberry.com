'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  BookOpen,
  LogOut,
  Menu,
  X,
  Video,
  Users,
  ClipboardCheck,
  BarChart3,
  ChevronDown,
  DollarSign,
  GraduationCap,
  CalendarCheck,
  Target,
  Megaphone,
  Briefcase,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import type { User } from '@/payload-types'

type NavItem = { href: string; label: string; icon: React.ReactNode; exact?: boolean }
type NavGroup = {
  label: string
  icon: React.ReactNode
  children: NavItem[]
  roles?: string[]
}

function getNavItems(roles: string[]): NavItem[] {
  const items: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  ]

  if (roles.includes('student')) {
    items.push(
      { href: '/lms/dashboard', label: 'My Courses', icon: <BookOpen size={18} />, exact: true },
      { href: '/lms/dashboard/tutorials', label: 'Tutorials', icon: <Video size={18} /> },
    )
  }

  if (roles.includes('teacher')) {
    items.push(
      { href: '/teacher/dashboard', label: 'My Batches', icon: <Users size={18} /> },
      { href: '/teacher/attendance', label: 'Attendance', icon: <ClipboardCheck size={18} /> },
      { href: '/teacher/tutorials', label: 'Tutorials', icon: <Video size={18} /> },
    )
  }

  return items
}

function getNavGroups(roles: string[]): NavGroup[] {
  const groups: NavGroup[] = []

  if (roles.includes('superadmin') || roles.includes('admin')) {
    groups.push({
      label: 'Analytics',
      icon: <BarChart3 size={18} />,
      roles: ['superadmin', 'admin'],
      children: [
        { href: '/analytics', label: 'Overview', icon: <BarChart3 size={16} />, exact: true },
        { href: '/analytics/revenue', label: 'Revenue & Fees', icon: <DollarSign size={16} /> },
        { href: '/analytics/students', label: 'Students', icon: <GraduationCap size={16} /> },
        { href: '/analytics/attendance', label: 'Attendance', icon: <CalendarCheck size={16} /> },
        { href: '/analytics/leads', label: 'Lead Pipeline', icon: <Target size={16} /> },
        { href: '/analytics/marketing', label: 'Marketing', icon: <Megaphone size={16} /> },
        { href: '/analytics/staff', label: 'Staff & Payroll', icon: <Briefcase size={16} /> },
      ],
    })
  }

  return groups
}

export function DashboardShell({ user, children }: { user: User; children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const roles = (user.roles as string[]) ?? []
  const displayRole = roles.find(r => r !== 'authenticated') ?? 'user'
  const navItems = getNavItems(roles)
  const navGroups = getNavGroups(roles)

  const isLinkActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + '/')

  const isGroupActive = (group: NavGroup) =>
    group.children.some((child) => isLinkActive(child))

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
            const isActive = isLinkActive(item)
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

          {/* Collapsible nav groups */}
          {navGroups.map((group) => (
            <Collapsible key={group.label} defaultOpen={isGroupActive(group)}>
              <CollapsibleTrigger className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                {group.icon}
                <span className="flex-1 text-left">{group.label}</span>
                <ChevronDown size={14} className="transition-transform [[data-state=open]>&]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="ml-3 mt-1 space-y-0.5 border-l border-gray-200 pl-3">
                  {group.children.map((child) => {
                    const isActive = isLinkActive(child)
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${isActive
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        {child.icon}
                        {child.label}
                      </Link>
                    )
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
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
