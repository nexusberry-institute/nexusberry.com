'use client'

import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'
import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Mail, Lock, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

import { useToast } from '@/hooks/use-toast'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkUser, createUser } from '../uploadRegistration'
import { useAuth } from '../../_providers/Auth'

const registerSchema = z.object({
  name: z.string().min(3, 'Name must have at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Confirm Password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // This targets the error to the confirmPassword field
})

export const RegisterForm2: React.FC = () => {
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()

  const form = useForm<z.infer<typeof registerSchema>>({
    mode: 'onChange',
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const handleGoogleSignup = async () => {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!, // ✅ Must be defined
      redirect_uri: `${process.env.NEXT_PUBLIC_SERVER_URL}/oauth/callback/google`,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    })
    redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`)
  }

  const onSubmit = useCallback(
    async (data: z.infer<typeof registerSchema>) => {
      try {
        // Remove confirmPassword before sending to API
        const { confirmPassword, ...registerData } = data

        // First check if user exists with this email
        const checkUserResponse = await checkUser(registerData.email)

        if (checkUserResponse.success) {
          // User already exists, show error toast
          toast({
            title: 'Account Creation Failed',
            description: checkUserResponse.message,
            variant: 'destructive',
          })
          return // Stop execution here
        }

        // If user doesn't exist, create the account
        const createUserResponse = await createUser(registerData)

        toast({
          title: createUserResponse.success ? 'Account Created' : 'Account Creation Failed',
          description: createUserResponse.message,
          variant: createUserResponse.success ? 'success' : 'destructive',
        })

        if (!createUserResponse.success) {
          return
        }

        router.push('/login')
      } catch (error) {
        toast({
          title: 'Error',
          description: 'There was an error creating your account. Please try again.',
          variant: 'destructive',
        })
      }
    },
    [toast],
  )

  return (
    <Card className="w-full max-w-md mx-auto rounded-xl bg-white/10 dark:bg-black/20 glassEffect shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]">
      <CardHeader>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center text-black dark:text-white"
        >
          Create Account
        </motion.div>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardContent>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Google Login Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignup}
                disabled={form.formState.isSubmitting}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
                Sign up with Google
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className='required'>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} />
                        <Input
                          type="text"
                          placeholder="i.e Ali Kaleem"
                          className="pl-10 bg-white dark:bg-gray-900 rounded-md"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className='required'>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} />
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          className="pl-10 bg-white dark:bg-gray-900 rounded-md"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className='required'>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} />
                        <Input
                          type="password"
                          placeholder="Create a password"
                          className="pl-10 bg-white dark:bg-gray-900 rounded-md"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className='required'>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} />
                        <Input
                          type="password"
                          placeholder="Re-enter your password"
                          className="pl-10 bg-white dark:bg-gray-900 rounded-md"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-gray-50 rounded-md"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Processing...' : 'Create Account'}
              </Button>
            </motion.div>
          </CardContent>
        </form>
      </Form >
      <CardFooter className="flex flex-col space-y-2 text-sm text-center">
        <p>
          Already have an account?{' '}
          <Link href={`/login`} className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </CardFooter>
      {
        form.formState.isSubmitting && (
          <div className='loadingBlock'>
            <div className='loadingSpinner' />
          </div>
        )
      }
    </Card >
  )
}
