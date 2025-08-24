'use client'

import Link from 'next/link'
import { useRouter, useSearchParams, redirect as nextRedirect } from 'next/navigation'
import React, { useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Mail, Lock } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

import { useToast } from '@/hooks/use-toast'
import { useAuth } from '../../_providers/Auth'
import { roleDefaultPaths } from '@/constants'

type FormData = {
  email: string
  password: string
}

export const LoginForm: React.FC = () => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const redirect = useRef(searchParams.get('redirect'))
  const { login } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      email: 'user@gmail.com',
      password: '12345678',
    },
  })

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        const { success, message, user } = await login(data)

        toast({
          title: success ? "Successfully Logged In" : "Login Failed!",
          variant: success ? "success" : "destructive",
          description: message
        })

        if (!success) {
          return;
        }

        if (redirect?.current) {
          router.push(redirect.current)
        } else {
          const primaryRole = Object.keys(roleDefaultPaths).find(role => user?.roles?.includes(role as keyof typeof roleDefaultPaths)) || 'user'
          const redirectPath = roleDefaultPaths[primaryRole as keyof typeof roleDefaultPaths]
          router.push(redirectPath)
        }

      } catch (_) {
        toast({
          title: 'Error',
          description: "Login failed. If you created your account with Google, please use the 'Sign in with Google' option instead.",
          variant: 'destructive',
        })
      }
    },
    [router],
  )

  const handleGoogleLogin = useCallback(async () => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!, // ✅ Must be defined
      redirect_uri: `${process.env.NEXT_PUBLIC_SERVER_URL}/oauth/callback/google`,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    })
    nextRedirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`)
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto rounded-xl bg-white/10 glassEffect shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]">
      <CardHeader>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center text-black "
        >
          Welcome Back
        </motion.div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium ">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="pl-10 bg-white rounded-md"
                {...register('email', { required: 'Email is required' })}
              />
            </div>
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="pl-10 bg-white rounded-md"
                {...register('password', { required: 'Password is required' })}
              />
            </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-gray-50 rounded-md" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Login'}
          </Button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-300 w-full"></div>
            <span className="bg-white px-2 text-xs text-gray-500 ">OR</span>
            <div className="border-t border-gray-300  w-full"></div>
          </div>

          <Button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 rounded-md flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            Login with Google
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 text-sm text-center">
        <Link href={`/recover-password${allParams}`} className="text-blue-600 hover:underline">
          Forgot your password?
        </Link>
      </CardFooter>
      {isSubmitting && (
        <div className="loadingBlock">
          <div className="loadingSpinner"></div>
        </div>
      )}
    </Card>
  )
}