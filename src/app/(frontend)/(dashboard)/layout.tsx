import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { User } from '@/payload-types'
import { HydrateClientUser } from '../_components/HydrateClientUser'
import { DashboardShell } from './_components/DashboardShell'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { permissions, user } = await payload.auth({ headers })

  if (!user || user.collection !== 'users') {
    redirect(`/login?error=${encodeURIComponent('You must be logged in to access this page.')}`)
  }

  return (
    <>
      <HydrateClientUser permissions={permissions} user={user} />
      <DashboardShell user={user as User}>{children}</DashboardShell>
    </>
  )
}
