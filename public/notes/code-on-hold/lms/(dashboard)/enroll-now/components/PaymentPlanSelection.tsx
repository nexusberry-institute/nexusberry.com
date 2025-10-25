'use client'

import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Batch } from '../serverActions/getTransformedBatches'
import SelectedCourseCard from './SelectedCourseCard'
import { DiscountCode, PaymentPlan } from '@/payload-types'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { getDiscount } from '../serverActions/getDiscount'
import PaymentPlanCard from './PaymentPlanCard'
import { LoaderCircle } from 'lucide-react'

interface PaymentPlanSelectionProps {
  selectedBatch: Batch | null,
  paymentPlans: PaymentPlan[],
  isLoadingPlans: boolean,
  discountData: DiscountCode | null,
  setDiscountData: Dispatch<SetStateAction<DiscountCode | null>>
}


const PaymentPlanSelection: React.FC<PaymentPlanSelectionProps> = ({
  selectedBatch, paymentPlans, isLoadingPlans, discountData, setDiscountData
}) => {

  const [isLoadingDiscount, setLoadingDiscount] = useState<boolean>(false)
  const { watch, control, setValue } = useFormContext()
  const formData = watch()
  const { toast } = useToast()

  useEffect(() => {
    if (selectedBatch && selectedBatch.medium !== "HYBRID") {
      setValue('medium', selectedBatch.medium);
    }

    if (formData.paymentPlanId != discountData?.paymentPlan) {
      setDiscountData(null)
    }

  }, [selectedBatch, setValue, formData.medium, formData.paymentPlanId]);

  const handleDiscount = async () => {
    const discountCode = formData.discountCode;

    if (!discountCode || discountCode.trim() === '') {
      // Handle empty discount code
      alert('Please enter a discount code');
      return;
    }

    try {
      setLoadingDiscount(true)
      const { success, message, discountPlan } = await getDiscount(discountCode, selectedBatch?.CId, formData.paymentPlanId)

      if (!success) {
        toast({
          title: "Discount Not Applied",
          variant: "warning",
          description: message
        })
      } else {
        setDiscountData(discountPlan)
        toast({
          title: "Discount Verified",
          variant: "success",
          description: message
        })
      }

    } catch (error) {
      console.error('Error validating discount code:', error);
      toast({
        title: "Error Getting Discount",
        variant: "destructive",
        description: "We couldnot get discount now, try agian after some time"
      })
    } finally {
      setLoadingDiscount(false)
    }
  }

  if (!selectedBatch) {
    return (
      <div className="p-4 bg-yellow-900 border border-yellow-700 rounded-lg">
        <p>Their is an issue with selecting your course. Go back and Select course again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <SelectedCourseCard batch={selectedBatch} />

      <FormField
        name="medium"
        control={control}
        render={({ field }) => (
          <FormItem className="space-y-2 flex items-center gap-4 flex-wrap">
            <FormLabel className='required'>Preferred Medium</FormLabel>
            <FormControl>
              <RadioGroup
                className="flex space-x-4"
                disabled={selectedBatch.medium !== "HYBRID"}
                onValueChange={field.onChange}
                value={field.value}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ONLINE" id="ONLINE" className='sr-only' />
                  <Label htmlFor="ONLINE"
                    className={`p-2 rounded-full border transition-colors
                      ${selectedBatch.medium !== "HYBRID" ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:bg-primary-500'}
                      ${formData.medium === "ONLINE" ? 'bg-blue-900/40 border-blue-500 ring-1 ring-blue-500' : 'border-white'}`}
                  >Online</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PHYSICAL" id="PHYSICAL" className='sr-only' />
                  <Label htmlFor="PHYSICAL"
                    className={`p-2 rounded-full border transition-colors
                      ${selectedBatch.medium !== "HYBRID" ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:bg-primary-500'}
                      ${formData.medium === "PHYSICAL" ? 'bg-blue-900/40 border-blue-500 ring-1 ring-blue-500' : 'border-white'}`}
                  >Physical</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )
        }
      />

      < FormField
        name="paymentPlanId"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel className='required'>Select Payment Plan</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {isLoadingPlans
                    ? <PaymentPlanSkeleton
                      items={Array.isArray(selectedBatch.paymentPlans) ? selectedBatch.paymentPlans : [1, 2]}
                    />
                    : paymentPlans?.map(plan => (
                      <PaymentPlanCard
                        key={plan.id}
                        plan={plan}
                        formData={formData}
                        selectedBatch={selectedBatch}
                        discountData={discountData}
                      />
                    ))}
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Discount Code Section - Only show when a payment plan is selected */}
      {formData.paymentPlanId && (
        <div className="space-y-2 mt-6 p-4 border border-green-400 rounded-lg bg-gray-800">
          {!discountData ? (
            // Show discount code input when no discount is applied
            <FormField
              name="discountCode"
              control={control}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-lg font-medium">Discount Code (if any)</FormLabel>
                  <p className="text-sm text-gray-500">Have a promotional code? Enter it below for additional savings.</p>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Enter Discount Code"
                        className='max-xs:text-[12px] focus-visible:ring-green-300 focus-visible:border-green-500'
                        {...field}
                      />
                      <Button
                        className="bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        onClick={handleDiscount}
                        disabled={isLoadingDiscount}
                      >
                        {isLoadingDiscount ? <LoaderCircle className='animate-spin' /> : "Apply"}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            // Show applied discount information when a discount is applied
            <div className="mt-2">
              <p className="text-sm text-green-400 font-medium">
                Discount applied: {discountData.code}
                {discountData.discountType === 'percentage'
                  ? ` (${discountData.discountValue}% off)`
                  : ` (Rs ${discountData.discountValue} off)`}
              </p>
              <p className="text-xs text-gray-300 mt-1">
                This discount applies to the highlighted payment plan
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-400">
                  Used: {discountData.timesUsed}/{discountData.usageLimit || '∞'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  onClick={() => setDiscountData(null)}
                >
                  Remove
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

    </div >
  )
}
export default PaymentPlanSelection


function PaymentPlanSkeleton({ items }: { items: number[] }) {
  return (
    <>
      {items.map((item, i) => (
        <div key={item} className="border rounded-lg p-4 relative animate-pulse">
          {/* Random popular tag for some cards */}
          {i === 1 && (
            <div className="absolute -top-3 -right-3 bg-gray-700 w-16 h-6 rounded-full"></div>
          )}

          {/* Plan name */}
          <Skeleton className="h-6 w-3/4 bg-gray-700 mb-3" />

          {/* Price */}
          <Skeleton className="h-8 w-1/2 bg-gray-700 mb-3" />

          {/* Description */}
          <Skeleton className="h-4 w-full bg-gray-700 mb-2" />

          {/* Installment details */}
          <div className="mt-4 space-y-2">
            <Skeleton className="h-3 w-1/3 bg-gray-700" />
            <Skeleton className="h-3 w-2/3 bg-gray-700" />
            <Skeleton className="h-3 w-1/2 bg-gray-700" />
            <Skeleton className="h-4 w-1/3 bg-gray-700 mt-3" />
          </div>
        </div>
      ))}
    </>
  )
}