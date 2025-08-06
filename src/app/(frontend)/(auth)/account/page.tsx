import { headers as getHeaders } from 'next/headers.js'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { Button } from '@/components/ui/button'
import { HydrateClientUser } from '../_components/HydrateClientUser'
import { AccountForm } from './AccountForm'

export default async function Account() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { permissions, user } = await payload.auth({ headers })

  if (!user) {
    redirect(
      `/login?error=${encodeURIComponent('You must be logged in to access your account.')}&redirect=/account`,
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <HydrateClientUser permissions={permissions} user={user} />
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Account</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {`This is your account dashboard. Here you can update your account information and more. To manage all users, `}
            <Link href={`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/users`} className="text-blue-600 hover:underline">
              login to the admin dashboard
            </Link>
            .
          </p>
          <AccountForm />
          <div className="mt-6">
            <Button variant="outline" asChild>
              <Link href="/logout">Log out</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

