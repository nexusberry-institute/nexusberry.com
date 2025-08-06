import React, { Suspense } from 'react'
import { LoginForm } from '@/app/(frontend)/(auth)/_components/LoginForm'

export default async function Login() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-primary-500 to-secondary-500 p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}

