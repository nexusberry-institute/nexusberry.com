'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

import { useAuth } from '../../_providers/Auth'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export const LogoutPage: React.FC = () => {
  const { logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout()
        toast({
          title: 'Success',
          description: 'Logged out successfully.',
        })
      } catch (_) {
        toast({
          title: 'Error',
          description: 'You are already logged out.',
          variant: 'destructive',
        })
      } finally {
        setIsLoggingOut(false)
      }
    }

    void performLogout()
  }, [logout, toast])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
      <Card className="max-w-md w-full shadow-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            {isLoggingOut ? 'Logging out...' : 'You have been logged out.'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoggingOut ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-400" />
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center">
              What would you like to do next?
            </p>
          )}
        </CardContent>
        {!isLoggingOut && (
          <CardFooter className="flex justify-center space-x-4">
            <Link href="/login" className="text-blue-600 hover:underline">
              Log back in
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

