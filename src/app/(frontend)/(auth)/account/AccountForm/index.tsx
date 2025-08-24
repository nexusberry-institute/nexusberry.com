'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '../../_providers/Auth'
import { useToast } from '@/hooks/use-toast'

type FormData = {
  email: string
  name: string
  password: string
  passwordConfirm: string
}

export const AccountForm: React.FC = () => {
  const [changePassword, setChangePassword] = useState(false)
  const { setUser, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm<FormData>()

  const password = useRef({})
  password.current = watch('password', '')

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (user) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user.id}`, {
            body: JSON.stringify(data),
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'PATCH',
          })

          if (response.ok) {
            const json = await response.json()
            setUser(json.doc)
            toast({
              title: 'Success',
              description: 'Successfully updated account.',
            })
            setChangePassword(false)
            reset({
              name: json.doc.name,
              email: json.doc.email,
              password: '',
              passwordConfirm: '',
            })
          } else {
            throw new Error('Failed to update account')
          }
        } catch (error) {
          toast({
            title: 'Error',
            description: 'There was a problem updating your account.',
            variant: 'destructive',
          })
        }
      }
    },
    [user, setUser, reset, toast],
  )

  useEffect(() => {
    if (!user) {
      router.push(`/login?unauthorized=account`)
    }

    if (user) {
      reset({
        email: user.email,
        password: '',
        passwordConfirm: '',
      })
    }
  }, [user, router, reset, changePassword])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {!changePassword ? (
        <>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {'To change your password, '}
            <button
              className="text-blue-600 hover:underline"
              onClick={() => setChangePassword(!changePassword)}
              type="button"
            >
              click here
            </button>
            .
          </p>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {'Change your password below, or '}
            <button
              className="text-blue-600 hover:underline"
              onClick={() => setChangePassword(!changePassword)}
              type="button"
            >
              cancel
            </button>
            .
          </p>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="passwordConfirm">Confirm Password</Label>
            <Input
              id="passwordConfirm"
              type="password"
              {...register('passwordConfirm', {
                required: 'Please confirm your password',
                validate: (value) => value === password.current || 'The passwords do not match'
              })}
              className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
            />
            {errors.passwordConfirm && <p className="text-sm text-red-500">{errors.passwordConfirm.message}</p>}
          </div>
        </>
      )}
      <Button type="submit" className="bg-black hover:bg-gray-800 text-gray-50" disabled={isSubmitting}>
        {isSubmitting ? 'Processing...' : changePassword ? 'Change password' : 'Update account'}
      </Button>
    </form>
  )
}

