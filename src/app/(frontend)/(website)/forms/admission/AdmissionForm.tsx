'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { redirect } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Phone, MapPin, GraduationCap, CreditCard,
  ChevronRight, ChevronLeft, Check, Upload, Loader2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/app/(frontend)/_providers/Auth'

import { admissionSchema, type AdmissionFormData } from './schema'
import { getCourses, getDepartments } from './actions'

const STEPS = [
  { title: 'Personal Details', icon: User },
  { title: 'Address', icon: MapPin },
  { title: 'Course Selection', icon: GraduationCap },
  { title: 'Payment Details', icon: CreditCard },
]

type CourseOption = {
  id: number
  title: string
  price: number | null | undefined
  duration: number | null | undefined
  department: number | null | undefined
}

type DepartmentOption = {
  id: number
  title: string
}

export default function AdmissionForm() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [courses, setCourses] = useState<CourseOption[]>([])
  const [departments, setDepartments] = useState<DepartmentOption[]>([])
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)

  const form = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      fatherName: '',
      email: user?.email || '',
      phoneNumber: '',
      guardianPhone: '',
      cnic: '',
      education: '',
      dateOfBirth: '',
      address: {
        homeAddress: '',
        city: '',
        province: '',
        country: 'Pakistan',
      },
      payDate: '',
      paidMethod: undefined,
      paymentProofText: '',
      studentNote: '',
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = form

  // Pre-fill email when user logs in
  useEffect(() => {
    if (user?.email) {
      setValue('email', user.email)
    }
  }, [user, setValue])

  // Fetch courses and departments
  useEffect(() => {
    getCourses()
      .then(setCourses)
      .catch(() =>
        toast({
          title: 'Error',
          description: 'Failed to load courses.',
          variant: 'destructive',
        }),
      )
      .finally(() => setIsLoadingCourses(false))

    getDepartments()
      .then(setDepartments)
      .catch(() =>
        toast({
          title: 'Error',
          description: 'Failed to load departments.',
          variant: 'destructive',
        }),
      )
      .finally(() => setIsLoadingDepartments(false))
  }, [toast])

  // Step field groups for validation
  const stepFields: (keyof AdmissionFormData)[][] = [
    ['fullName', 'fatherName', 'email', 'phoneNumber', 'gender', 'education'],
    ['address'],
    ['department', 'course', 'preferredMedium'],
    ['totalFeePackage', 'remainingInstallments', 'firstPaymentAmount', 'payDate', 'paidMethod'],
  ]

  const nextStep = useCallback(async () => {
    const fields = stepFields[currentStep]
    if (fields && fields.length > 0) {
      const valid = await trigger(fields)
      if (!valid) return
    }
    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1))
  }, [currentStep, trigger])

  const prevStep = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 0))
  }, [])

  // Reset course when department changes
  const selectedDepartment = watch('department')
  useEffect(() => {
    if (selectedDepartment) {
      setValue('course', undefined as unknown as number)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDepartment])

  // File upload handler
  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload an image smaller than 5MB.',
          variant: 'destructive',
        })
        return
      }

      setUploadingFile(true)
      try {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/media', {
          method: 'POST',
          body: formData,
        })

        if (!res.ok) throw new Error('Upload failed')

        const data = await res.json()
        setValue('paymentProofImage', data.doc.id)
        toast({
          title: 'Uploaded',
          description: 'Payment screenshot uploaded successfully.',
          variant: 'success',
        })
      } catch {
        toast({
          title: 'Upload Failed',
          description: 'Could not upload the file. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setUploadingFile(false)
      }
    },
    [setValue, toast],
  )

  // Submit
  const onSubmit = useCallback(
    async (data: AdmissionFormData) => {
      try {
        const res = await fetch('/api/admission-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })

        const result = await res.json()

        if (!res.ok) {
          toast({
            title: 'Submission Failed',
            description: result.error || 'Please try again.',
            variant: 'destructive',
          })
          return
        }

        setShowSuccess(true)
      } catch {
        toast({
          title: 'Error',
          description: 'Something went wrong. Please try again.',
          variant: 'destructive',
        })
      }
    },
    [toast],
  )

  // Google login redirect
  const handleGoogleLogin = useCallback(() => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      redirect_uri: `${process.env.NEXT_PUBLIC_SERVER_URL}/oauth/callback/google`,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
      state: '/forms/admission', // redirect back after login
    })
    redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    )
  }, [])

  // ===== NOT LOGGED IN: Show Google Login Gate =====
  if (!user) {
    return (
      <div className="max-w-lg mx-4 md:mx-auto mt-16 mb-20">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-2">
            <h1 className="text-2xl font-bold">Admission Form</h1>
            <p className="text-muted-foreground mt-2">
              Please sign in with Google to continue. This verifies your email
              and creates your account automatically.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 pt-4">
            <Button
              size="lg"
              variant="outline"
              className="w-full max-w-xs gap-2"
              onClick={handleGoogleLogin}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="20px"
                height="20px"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              Sign in with Google
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              An account will be created automatically if one does not already exist.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ===== LOGGED IN: Show Multi-Step Form =====
  const selectedCourse = watch('course')
  const proofImageId = watch('paymentProofImage')

  // Filter courses by selected department
  const filteredCourses = selectedDepartment
    ? courses.filter((c) => c.department === selectedDepartment)
    : []

  return (
    <div className="max-w-3xl mx-4 md:mx-auto mt-10 mb-20">
      <Card className="shadow-xl border-0">
        <CardHeader className="text-center pb-4">
          <h1 className="text-2xl font-bold">Admission Form</h1>
          <p className="text-muted-foreground text-sm">
            Fill out your details to submit your admission application
          </p>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-1 mt-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <React.Fragment key={i}>
                  <div
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                      i === currentStep
                        ? 'bg-primary text-primary-foreground'
                        : i < currentStep
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {i < currentStep ? (
                      <Check size={14} />
                    ) : (
                      <Icon size={14} />
                    )}
                    <span className="hidden sm:inline">{step.title}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`w-6 h-0.5 ${i < currentStep ? 'bg-green-400' : 'bg-muted'}`}
                    />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* ===== STEP 1: Personal Details ===== */}
                {currentStep === 0 && (
                  <>
                    {/* Row 1: Full Name*, Email* */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="fullName">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="fullName"
                          placeholder="e.g. Ali Ahmed"
                          {...register('fullName')}
                        />
                        {errors.fullName && (
                          <p className="text-xs text-red-500">
                            {errors.fullName.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          readOnly
                          className="bg-muted"
                          {...register('email')}
                        />
                      </div>
                    </div>

                    {/* Row 2: Father Name*, Phone Number* */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="fatherName">
                          Father Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="fatherName"
                          placeholder="e.g. Ahmed Khan"
                          {...register('fatherName')}
                        />
                        {errors.fatherName && (
                          <p className="text-xs text-red-500">
                            {errors.fatherName.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="phoneNumber">
                          Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="phoneNumber"
                          placeholder="03001234567"
                          {...register('phoneNumber')}
                          onInput={(e) => {
                            const target = e.target as HTMLInputElement
                            target.value = target.value.replace(/\D/g, '')
                          }}
                        />
                        {errors.phoneNumber && (
                          <p className="text-xs text-red-500">
                            {errors.phoneNumber.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Row 3: Gender*, Highest Education* */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>
                          Gender <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          onValueChange={(v) =>
                            setValue('gender', v as 'male' | 'female', {
                              shouldValidate: true,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.gender && (
                          <p className="text-xs text-red-500">
                            {errors.gender.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="education">
                          Highest Education <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="education"
                          placeholder="e.g. BS Computer Science"
                          {...register('education')}
                        />
                        {errors.education && (
                          <p className="text-xs text-red-500">
                            {errors.education.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Row 4: Date of Birth (optional), Guardian Phone (optional), CNIC (optional) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          {...register('dateOfBirth')}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="guardianPhone">Guardian Phone</Label>
                        <Input
                          id="guardianPhone"
                          placeholder="Optional"
                          {...register('guardianPhone')}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="cnic">CNIC</Label>
                        <Input
                          id="cnic"
                          placeholder="3520212345678"
                          {...register('cnic')}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* ===== STEP 2: Address ===== */}
                {currentStep === 1 && (
                  <>
                    <div className="space-y-1.5">
                      <Label htmlFor="homeAddress">
                        Home Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="homeAddress"
                        placeholder="House #, Street, Area"
                        {...register('address.homeAddress')}
                      />
                      {errors.address?.homeAddress && (
                        <p className="text-xs text-red-500">
                          {errors.address.homeAddress.message}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="city">
                          City <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="city"
                          placeholder="e.g. Lahore"
                          {...register('address.city')}
                        />
                        {errors.address?.city && (
                          <p className="text-xs text-red-500">
                            {errors.address.city.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="province">
                          Province <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="province"
                          placeholder="e.g. Punjab"
                          {...register('address.province')}
                        />
                        {errors.address?.province && (
                          <p className="text-xs text-red-500">
                            {errors.address.province.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="country">
                        Country <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="country"
                        {...register('address.country')}
                      />
                      {errors.address?.country && (
                        <p className="text-xs text-red-500">
                          {errors.address.country.message}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* ===== STEP 3: Course Selection ===== */}
                {currentStep === 2 && (
                  <>
                    {isLoadingCourses || isLoadingDepartments ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="animate-spin mr-2" size={20} />
                        Loading...
                      </div>
                    ) : (
                      <>
                        <div className="space-y-1.5">
                          <Label>
                            Department <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={selectedDepartment?.toString() || ''}
                            onValueChange={(v) =>
                              setValue('department', parseInt(v, 10), {
                                shouldValidate: true,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map((d) => (
                                <SelectItem
                                  key={d.id}
                                  value={d.id.toString()}
                                >
                                  {d.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.department && (
                            <p className="text-xs text-red-500">
                              {errors.department.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <Label>
                            Course <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={selectedCourse?.toString() || ''}
                            onValueChange={(v) =>
                              setValue('course', parseInt(v, 10), {
                                shouldValidate: true,
                              })
                            }
                            disabled={!selectedDepartment}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={selectedDepartment ? "Select a course" : "Select a department first"} />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredCourses.map((c) => (
                                <SelectItem
                                  key={c.id}
                                  value={c.id.toString()}
                                >
                                  {c.title}
                                  {c.price ? ` — Rs. ${c.price.toLocaleString()}` : ''}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.course && (
                            <p className="text-xs text-red-500">
                              {errors.course.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <Label>
                            Preferred Medium <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            onValueChange={(v) =>
                              setValue(
                                'preferredMedium',
                                v as 'ONLINE' | 'PHYSICAL' | 'HYBRID',
                                { shouldValidate: true },
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select medium" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PHYSICAL">
                                Physical (On-site)
                              </SelectItem>
                              <SelectItem value="ONLINE">Online</SelectItem>
                              <SelectItem value="HYBRID">Hybrid</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.preferredMedium && (
                            <p className="text-xs text-red-500">
                              {errors.preferredMedium.message}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* ===== STEP 4: Payment Details ===== */}
                {currentStep === 3 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="totalFeePackage">
                          Total Fee Package (Rs.) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="totalFeePackage"
                          type="number"
                          min={1}
                          step={500}
                          placeholder="e.g. 25000"
                          onChange={(e) =>
                            setValue(
                              'totalFeePackage',
                              e.target.value
                                ? parseInt(e.target.value, 10)
                                : (undefined as unknown as number),
                              { shouldValidate: true },
                            )
                          }
                        />
                        {errors.totalFeePackage && (
                          <p className="text-xs text-red-500">
                            {errors.totalFeePackage.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="remainingInstallments">
                          Payable in how many installments <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="remainingInstallments"
                          type="number"
                          min={1}
                          max={24}
                          step={1}
                          placeholder="e.g. 1 (one-time), 2, 3"
                          onChange={(e) =>
                            setValue(
                              'remainingInstallments',
                              e.target.value
                                ? parseInt(e.target.value, 10)
                                : (undefined as unknown as number),
                              { shouldValidate: true },
                            )
                          }
                        />
                        {errors.remainingInstallments && (
                          <p className="text-xs text-red-500">
                            {errors.remainingInstallments.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="firstPaymentAmount">
                          First Payment Amount (Rs.) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="firstPaymentAmount"
                          type="number"
                          min={0}
                          step={100}
                          placeholder="e.g. 5000"
                          onChange={(e) =>
                            setValue(
                              'firstPaymentAmount',
                              e.target.value
                                ? parseInt(e.target.value, 10)
                                : (undefined as unknown as number),
                              { shouldValidate: true },
                            )
                          }
                        />
                        {errors.firstPaymentAmount && (
                          <p className="text-xs text-red-500">
                            {errors.firstPaymentAmount.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="payDate">
                          Pay Date <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="payDate"
                          type="date"
                          {...register('payDate')}
                        />
                        {errors.payDate && (
                          <p className="text-xs text-red-500">
                            {errors.payDate.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label>
                        Payment Method <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        onValueChange={(v) =>
                          setValue(
                            'paidMethod',
                            v as 'BANK' | 'CASH' | 'JAZZCASH' | 'EASYPAISA',
                            { shouldValidate: true },
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BANK">Bank Transfer</SelectItem>
                          <SelectItem value="JAZZCASH">JazzCash</SelectItem>
                          <SelectItem value="EASYPAISA">
                            Easypaisa
                          </SelectItem>
                          <SelectItem value="CASH">Cash</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.paidMethod && (
                        <p className="text-xs text-red-500">
                          {errors.paidMethod.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label>Payment Screenshot</Label>
                      <div className="border-2 border-dashed rounded-lg p-4 text-center">
                        {proofImageId ? (
                          <div className="flex items-center justify-center gap-2 text-green-600">
                            <Check size={20} />
                            <span>Screenshot uploaded</span>
                          </div>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center gap-2">
                            {uploadingFile ? (
                              <Loader2
                                className="animate-spin text-muted-foreground"
                                size={24}
                              />
                            ) : (
                              <Upload
                                className="text-muted-foreground"
                                size={24}
                              />
                            )}
                            <span className="text-sm text-muted-foreground">
                              {uploadingFile
                                ? 'Uploading...'
                                : 'Click to upload payment screenshot'}
                            </span>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleFileUpload}
                              disabled={uploadingFile}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="paymentProofText">
                        Transaction ID / Reference (Optional)
                      </Label>
                      <Input
                        id="paymentProofText"
                        placeholder="e.g. TRX-123456"
                        maxLength={50}
                        {...register('paymentProofText')}
                      />
                      <div className="flex justify-between">
                        {errors.paymentProofText ? (
                          <p className="text-xs text-red-500">
                            {errors.paymentProofText.message}
                          </p>
                        ) : <span />}
                        <p className="text-xs text-muted-foreground">
                          {watch('paymentProofText')?.length || 0}/50
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="studentNote">
                        Any message for us?
                      </Label>
                      <textarea
                        id="studentNote"
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        rows={3}
                        maxLength={500}
                        placeholder="Optional notes..."
                        {...register('studentNote')}
                      />
                      <div className="flex justify-between">
                        {errors.studentNote ? (
                          <p className="text-xs text-red-500">
                            {errors.studentNote.message}
                          </p>
                        ) : <span />}
                        <p className="text-xs text-muted-foreground">
                          {watch('studentNote')?.length || 0}/500
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="gap-1"
              >
                <ChevronLeft size={16} />
                Back
              </Button>

              {currentStep < STEPS.length - 1 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="gap-1"
                >
                  Next
                  <ChevronRight size={16} />
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={isSubmitting}
                  className="gap-1"
                  onClick={handleSubmit(onSubmit)}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <Check size={16} />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </form>
      </Card>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={() => setShowSuccess(false)}>
        <DialogContent className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="h-8 w-8 text-white" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-center text-green-600">
              Application Submitted!
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-center max-w-sm">
            Thank you! We have received your admission application. Our team
            will review your payment and contact you soon.
          </p>
          <Button onClick={() => (window.location.href = '/forms')}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
