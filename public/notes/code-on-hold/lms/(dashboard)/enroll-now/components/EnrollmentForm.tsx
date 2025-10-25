'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'

import Stepper from './Stepper'
import CoursesForm from './CoursesForm'
import PaymentPlanSelection from './PaymentPlanSelection'
import PaymentConfirmation from './PaymentConfirmation'

import { Batch } from '../serverActions/getTransformedBatches'
import { LoaderCircle } from 'lucide-react'
import { createEnrollment } from '../serverActions/uploadFormData'
import { useToast } from '@/hooks/use-toast'
import { DiscountCode, PaymentPlan, User } from '@/payload-types'
import { getPaymentPlans } from '../serverActions/getPaymentPlans'

const formSchema = z.object({
  // Step 1: Courses Information
  batchId: z.number().min(1, 'Select a batch to proceed'),
  // Step 2: Payment Plan
  paymentPlanId: z.string().min(1, 'Select a payment plan to proceed'),
  discountCode: z.string().optional(),
  medium: z.enum(['ONLINE', 'PHYSICAL'], {
    required_error: 'Select your preferred medium for this enrollment',
  }),
  // Step 3: Payment Confirmation
  paidMethod: z.enum(['BANK', 'JAZZCASH', 'EASYPAISA', 'CASH'], {
    required_error: 'Select your preferred payment method',
  }),
}).and(
  //For optional validation for payment proof
  z.discriminatedUnion('proofType', [
    z.object({
      proofType: z.literal('image'),
      proofImage: z.instanceof(File, {
        message: 'Please upload your payment proof',
      }).refine(file => file.size > 0, 'Payment proof is required'),
      proofText: z.string().optional(),
    }),
    z.object({
      proofType: z.literal('text'),
      proofText: z.string().min(1, 'Please provide a description of the payment proof'),
      proofImage: z.instanceof(File).optional(),
    }),
  ])
)

export default function EnrollmentPage({ batches, user, student }: {
  user: User,
  student: {
    id: number,
    fullName?: string | null,
  },
  batches: (Batch | null)[]
}) {

  const [currentStep, setCurrentStep] = useState(1)
  const [isLoadingPlans, setIsLoadingPlans] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null)
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([])
  const [paymentPlanCache, setPaymentPlanCache] = useState<Record<number, PaymentPlan[]>>({})
  const [discountData, setDiscountData] = useState<DiscountCode | null>(null)

  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      proofType: 'image',
      paymentPlanId: '',
      discountCode: '',
      paidMethod: 'BANK',
      proofImage: undefined,
      proofText: '',
    }
  })

  const { batchId, paymentPlanId } = form.watch()

  useEffect(() => {
    const fetchData = async () => {

      const batch = batches.find(batch => batch?.id === batchId) || null
      setSelectedBatch(batch)

      // If we already have this batch's payment plans in cache, use them
      if (paymentPlanCache[batchId]) {
        setPaymentPlans(paymentPlanCache[batchId])
        return
      }
      setIsLoadingPlans(true)

      try {
        if (batch && batch.paymentPlans?.length) {
          const { docs } = await getPaymentPlans(batch.paymentPlans)
          setPaymentPlans(docs)
          // Cache the results
          setPaymentPlanCache(prev => ({
            ...prev,
            [batchId]: docs
          }))
        }
        else setPaymentPlans([])
      } catch (error) {
        console.error(error)
        setPaymentPlans([])
        toast({
          title: "Error Getting Payment Plans",
          description: "fetching failed"
        })
      } finally {
        setIsLoadingPlans(false)
      }
    }

    if (batchId) {
      fetchData()
    }
  }, [batchId])

  const handleNext = async () => {
    // Validate current step before proceeding
    let isValid = false

    if (currentStep === 1) {
      isValid = await form.trigger(['batchId'])
    } else if (currentStep === 2) {
      isValid = await form.trigger(['paymentPlanId', 'medium'])
    }

    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 3))
      scrollTo(0, 0)
    }
  }

  const handlePrevious = () => {
    const newStep = Math.max(currentStep - 1, 1);
    setCurrentStep(newStep);

    // If going back to step 1, reset the form
    if (newStep === 1) {
      form.reset({
        proofType: 'image',
        paymentPlanId: '',
        discountCode: '',
        paidMethod: 'BANK',
        proofImage: undefined,
        proofText: '',
        batchId: undefined,
        medium: undefined
      });
      setSelectedBatch(null);
      setPaymentPlans([]);
      setDiscountData(null);
    }
  }

  const onSubmit = form.handleSubmit(async (data) => {
    try {

      if (!selectedBatch || selectedBatch.id !== data.batchId) {
        toast({
          title: 'Invalid Batch Selection',
          description: 'The batch you selected is no longer available. Please select another batch to continue.',
          variant: 'destructive'
        })
        return;
      }

      const selectedPlan = paymentPlans?.find(plan => plan.id.toString() === data.paymentPlanId)

      if (!selectedPlan || !selectedPlan.installments.length) {
        toast({
          title: 'Payment Plan Issue',
          description: 'The selected payment plan is not available or has been modified. Please select a different payment plan.',
          variant: 'destructive'
        })
        return;
      }

      const { success, message } = await createEnrollment({
        ...data,
        userId: user.id,
        studentId: student.id,
        studentName: student.fullName || '',
        courseId: selectedBatch.CId,
        courseSlug: selectedBatch.CSlug,
        paymentPlan: selectedPlan,
        discountData: discountData
      })

      if (!success) {
        toast({
          title: 'Enrollment Submission Failed',
          description: message,
          variant: 'destructive'
        })
        return;
      }

      toast({
        title: 'Enrollment Successful!',
        description: 'Your enrollment has been submitted successfully. You will receive a confirmation email shortly.',
        variant: 'success'
      })

      router.push("/lms/courses")
    } catch (error) {
      console.error('Error submitting form:', error)
      toast({
        title: 'Enrollment Submission Failed',
        description: 'We encountered an issue while processing your enrollment. This could be due to network issues or server load. Please try again in a few moments.',
        variant: 'destructive'
      })
    }
  })

  return (
    <div className="*:mx-auto *:max-w-7xl *:w-full py-8 px-4 max-xs:px-2" >

      {/* Stepper */}
      <div className="mb-6" >
        <Stepper currentStep={currentStep} />
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit}>
          <Card className='border-none'>
            <CardHeader>
              <CardTitle>
                {currentStep === 1 ? 'Available Courses' :
                  currentStep === 2 ? 'Select Payment Plan' :
                    'Payment Confirmation'}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 ? 'Please select your preferred courses with desired timings' :
                  currentStep === 2 ? 'Choose your preferred payment option' :
                    'Upload payment proof to complete enrollment'}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {currentStep === 1 && <CoursesForm
                batches={batches}
                handleNext={handleNext}
              />}
              {currentStep === 2 && <PaymentPlanSelection
                selectedBatch={selectedBatch}
                paymentPlans={paymentPlans}
                isLoadingPlans={isLoadingPlans}
                discountData={discountData}
                setDiscountData={setDiscountData}
              />}
              {currentStep === 3 && <PaymentConfirmation
                selectedBatch={selectedBatch}
                selectedPlan={paymentPlans?.find(plan => plan.id.toString() === paymentPlanId)}
                discountData={discountData}
              />}
            </CardContent>

            {currentStep > 1 && (
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  className="border-secondary-500 text-secondary-500 hover:bg-secondary-50 hover:text-secondary-600 rounded-lg"
                  onClick={handlePrevious}
                  disabled={form.formState.isSubmitting || currentStep === 1}
                >
                  Previous
                </Button>
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    className="rounded-lg bg-primary-400"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!form.formState.isValid}
                    className="rounded-lg bg-primary-400"
                  >
                    {form.formState.isSubmitting ? <LoaderCircle className='animate-spin' /> : "Complete Enrollment"}
                  </Button>
                )}
              </CardFooter>
            )}
          </Card>
          {form.formState.isSubmitting && (
            <div className='loadingBlock'>
              <div className='loadingSpinner' />
            </div>
          )}
        </form>
      </Form>
    </div >
  )
}