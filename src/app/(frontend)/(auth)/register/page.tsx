import React from 'react'
import { RegisterForm } from './components/RegisterForm'
import { RegisterForm2 } from './components/RegisterForm2'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-primary-500 to-secondary-500 p-4">
      {/* <RegisterForm /> */}
      <RegisterForm2 />
    </div>
  )
}
