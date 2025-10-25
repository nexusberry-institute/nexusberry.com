import { CheckCircle2, Percent, Tag } from 'lucide-react'
import { DiscountCode, PaymentPlan } from "@/payload-types";
import { RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Batch } from '../serverActions/getTransformedBatches';
import { FieldValues } from 'react-hook-form';

export default function PaymentPlanCard({ plan, discountData, selectedBatch, formData }: {
  plan: PaymentPlan, discountData: DiscountCode | null, selectedBatch: Batch, formData: FieldValues
}) {


  // Calculate discounted price for a plan installment
  const getDiscountedPrice = (plan: PaymentPlan, installmentIndex: number = 0) => {
    if (!discountData || discountData.paymentPlan !== plan.id) {
      return null;
    }

    const originalPrice = plan.installments[installmentIndex]?.amount ?? 0;

    if (discountData.discountType === 'fixed') {
      // Apply the full fixed discount to each installment
      return Math.max(0, originalPrice - discountData.discountValue);
    } else if (discountData.discountType === 'percentage') {
      // Apply the same percentage to each installment
      const discountAmount = (originalPrice * discountData.discountValue) / 100;
      return Math.max(0, originalPrice - discountAmount);
    }

    return null;
  }

  // Calculate total discounted price for all installments
  const getTotalDiscountedPrice = (plan: PaymentPlan) => {
    if (!discountData || discountData.paymentPlan !== plan.id) {
      return null;
    }

    // Sum up the discounted prices of all installments
    return plan.installments.reduce((sum, { amount }, index) => {
      const discountedAmount = getDiscountedPrice(plan, index) || amount;
      return sum + discountedAmount;
    }, 0);
  }


  const isDiscounted = discountData && discountData.paymentPlan === plan.id;
  const discountedFirstInstallment = isDiscounted ? getDiscountedPrice(plan, 0) : null;
  const discountedTotal = isDiscounted ? getTotalDiscountedPrice(plan) : null;

  return (
    <div className={`border rounded-lg p-4 cursor-pointer transition-all relative  hover:border-blue-400
      ${formData.paymentPlanId === plan.id.toString() ? 'ring-2 ring-blue-500 bg-blue-900/20 border-transparent' : 'border-gray-700'}
      ${plan.is_popular ? 'border-dashed border-secondary-300' : ''}
      ${isDiscounted ? 'ring-green-500 bg-green-900/10' : ''}
    `}>

      {plan.is_popular && (
        <div className="absolute -top-3 -right-3 bg-secondary-500 text-white text-xs px-2 py-1 rounded-full">
          Popular
        </div>
      )}

      {isDiscounted && (
        <div className="absolute -top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          {discountData.discountType === 'percentage' ? (
            <>
              <Percent className="h-3 w-3" />
              {discountData.discountValue}% Off
            </>
          ) : (
            <>
              <Tag className="h-3 w-3" />
              Rs {discountData.discountValue} Off
            </>
          )}
        </div>
      )}

      {formData.paymentPlanId === plan.id.toString() && <CheckCircle2 className={`absolute top-3 right-3 w-5 h-5 ${discountData ? "fill-green-500" : "fill-blue-500"}`} />}

      <RadioGroupItem value={plan.id.toString()} id={plan.id.toString()} className="sr-only" />
      <Label htmlFor={plan.id.toString()} className="cursor-pointer block h-full">
        <div className="font-medium">{plan.name}</div>

        <div className="text-xl font-bold mt-2">
          {isDiscounted && discountedFirstInstallment !== null ? (
            <>
              <span className="line-through text-gray-500 text-lg mr-2">
                Rs {plan.installments[0]?.amount ?? selectedBatch.CFullPrice}
              </span>
              <span className="text-green-400">
                Rs {discountedFirstInstallment}
              </span>
            </>
          ) : (
            <>Rs {plan.installments[0]?.amount ?? selectedBatch.CFullPrice}</>
          )}

          {plan.installments.length > 1 && (
            <span className="text-sm font-normal text-gray-400 ml-1">(first installment)</span>
          )}
        </div>

        <div className="text-sm text-gray-400 mt-1">{plan.description}</div>

        {plan.installments.length > 1 && (
          <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-400">Installment plan:</p>
            {plan.installments.map(({ amount }, index) => (
              <div key={index} className="text-xs text-gray-500">
                {index === 0 ? 'First' : index === 1 ? 'Second' : index === 2 ? 'Third' : `${index + 1}th`} payment:
                {isDiscounted ? (
                  <>
                    <span className="line-through ml-1">Rs {amount}</span>
                    <span className="text-green-400 ml-1">Rs {Math.round(getDiscountedPrice(plan, index) || amount)}</span>
                  </>
                ) : (
                  <span className="ml-1">Rs {amount}</span>
                )}
              </div>
            ))}
            <div className="text-xs font-medium text-gray-600 mt-1">
              Total:
              {isDiscounted && discountedTotal !== null ? (
                <>
                  <span className="line-through ml-1">
                    Rs {plan.installments.reduce((sum, { amount }) => sum + amount, 0)}
                  </span>
                  <span className="text-green-400 ml-1">Rs {Math.round(discountedTotal)}</span>
                </>
              ) : (
                <span className="ml-1">
                  Rs {plan.installments.reduce((sum, { amount }) => sum + amount, 0)}
                </span>
              )}
            </div>
          </div>
        )}
      </Label>
    </div>
  )
}