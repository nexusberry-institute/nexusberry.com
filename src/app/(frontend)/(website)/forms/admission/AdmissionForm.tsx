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
import { useAuth } from '@/app/(frontend)/(auth)/_providers/Auth'

import { admissionSchema, type AdmissionFormData } from './schema'
import { getCourses } from './actions'

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
}

export default function AdmissionForm() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [courses, setCourses] = useState<CourseOption[]>([])
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)

  const form = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
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
      paidMethod: 'BANK',
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

  // Fetch courses
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
  }, [toast])

  // Step field groups for validation
  const stepFields: (keyof AdmissionFormData)[][] = [
    ['fullName', 'email', 'phoneNumber'],
    ['address'],
    ['course'],
    [],
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
              Already have an account?{' '}
              <a href="/login?redirect=/forms/admission" className="text-primary underline">
                Login here
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ===== LOGGED IN: Show Multi-Step Form =====
  const selectedCourse = watch('course')
  const proofImageId = watch('paymentProofImage')

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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="phoneNumber">
                          Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="phoneNumber"
                          placeholder="03001234567"
                          {...register('phoneNumber')}
                        />
                        {errors.phoneNumber && (
                          <p className="text-xs text-red-500">
                            {errors.phoneNumber.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="guardianPhone">Guardian Phone</Label>
                        <Input
                          id="guardianPhone"
                          placeholder="Optional"
                          {...register('guardianPhone')}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="cnic">CNIC</Label>
                        <Input
                          id="cnic"
                          placeholder="3520212345678"
                          {...register('cnic')}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Gender</Label>
                        <Select
                          onValueChange={(v) =>
                            setValue('gender', v as 'male' | 'female')
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
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="education">Highest Education</Label>
                        <Input
                          id="education"
                          placeholder="e.g. BS Computer Science"
                          {...register('education')}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          {...register('dateOfBirth')}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* ===== STEP 2: Address ===== */}
                {currentStep === 1 && (
                  <>
                    <div className="space-y-1.5">
                      <Label htmlFor="homeAddress">Home Address</Label>
                      <Input
                        id="homeAddress"
                        placeholder="House #, Street, Area"
                        {...register('address.homeAddress')}
                      />
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
                        <Label htmlFor="province">Province</Label>
                        <Input
                          id="province"
                          placeholder="e.g. Punjab"
                          {...register('address.province')}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        {...register('address.country')}
                      />
                    </div>
                  </>
                )}

                {/* ===== STEP 3: Course Selection ===== */}
                {currentStep === 2 && (
                  <>
                    {isLoadingCourses ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="animate-spin mr-2" size={20} />
                        Loading courses...
                      </div>
                    ) : (
                      <>
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
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a course" />
                            </SelectTrigger>
                            <SelectContent>
                              {courses.map((c) => (
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
                          <Label>Preferred Medium</Label>
                          <Select
                            onValueChange={(v) =>
                              setValue(
                                'preferredMedium',
                                v as 'ONLINE' | 'PHYSICAL' | 'HYBRID',
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
                        <Label htmlFor="firstPaymentAmount">
                          First Payment Amount (Rs.)
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
                                : undefined,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Payment Method</Label>
                        <Select
                          defaultValue="BANK"
                          onValueChange={(v) =>
                            setValue(
                              'paidMethod',
                              v as 'BANK' | 'CASH' | 'JAZZCASH' | 'EASYPAISA',
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BANK">Bank Transfer</SelectItem>
                            <SelectItem value="CASH">Cash</SelectItem>
                            <SelectItem value="JAZZCASH">JazzCash</SelectItem>
                            <SelectItem value="EASYPAISA">
                              Easypaisa
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
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
                        Transaction ID / Reference
                      </Label>
                      <Input
                        id="paymentProofText"
                        placeholder="e.g. TRX-123456"
                        {...register('paymentProofText')}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="studentNote">
                        Any message for us?
                      </Label>
                      <textarea
                        id="studentNote"
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        rows={3}
                        placeholder="Optional notes..."
                        {...register('studentNote')}
                      />
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
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-1"
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
