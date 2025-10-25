import { Clock, Monitor, Percent, Tag } from "lucide-react";
import { Batch } from "../serverActions/getTransformedBatches";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { getDurationText } from "@/utilities/getDurationText";
import { DiscountCode, PaymentPlan } from "@/payload-types";

export default function SelectedCourseCard({ batch, paymentPlan, discountData }: {
  batch: Batch,
  paymentPlan?: PaymentPlan
  discountData?: DiscountCode | null
}) {

  function getDueDates(plan: PaymentPlan) {
    // Use current date as the starting point
    const currentDate = new Date();
    const nextDueDate = new Date(currentDate);

    return plan.installments.map((installment, i) => {
      if (i === 0) {
        // First payment is due now
        return {
          amount: installment.amount,
          dueDate: currentDate.toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        };
      }

      // Add days to the previous due date
      nextDueDate.setDate(nextDueDate.getDate() + (installment?.due_after_days ?? 0));

      return {
        amount: installment.amount,
        dueDate: new Date(nextDueDate).toLocaleDateString("en-US", {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };
    });
  }


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

  const isDiscounted = paymentPlan && discountData && discountData.paymentPlan === paymentPlan.id;

  return (
    <div className="p-6 bg-[#1a202c] rounded-lg borderborder-gray-700 relative">
      <h3 className="text-lg font-medium text-white">Selected Course</h3>

      {/* discount Badge */}
      {isDiscounted && (
        <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full flex items-center gap-1 border border-green-600">
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

      <div className="mt-4 space-y-3">
        <h4 className="text-xl font-semibold capitalize text-white">{batch.CTitle}</h4>

        {/* Course details */}
        <div className="flex justify-between gap-4 mt-2 flex-wrap">
          {/* Batch ID/Slug */}
          <div className="flex items-center text-sm text-gray-300">
            <Tag className="h-4 w-4 mr-2 text-primary-300" />
            <span>Batch: {batch.slug}</span>
          </div>

          {/* Duration */}
          {batch.duration && (
            <div className="flex items-center text-sm text-gray-300">
              <Clock className="h-4 w-4 mr-2 text-primary-300" />
              <span>{getDurationText(batch.duration)}</span>
            </div>
          )}

          {/* Medium (Online/Offline) */}
          {batch.medium && (
            <div className="flex items-center text-sm text-gray-300">
              <Monitor className="h-4 w-4 mr-2 text-primary-300" />
              <span>{batch.medium === 'ONLINE' ? 'Online' : batch.medium === "HYBRID" ? 'Online & In-Person' : 'In-Person'} Course</span>
            </div>
          )}
        </div>

        {paymentPlan ? (
          <>
            <h3 className="text-lg font-medium text-white">Selected Payment Plan</h3>
            <div className="mt-4 px-2 space-y-2">
              <div className="flex justify-between">
                <span>Payment Plan:</span>
                <span className="font-medium">{paymentPlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount to Pay Now:</span>
                {isDiscounted ? (
                  <span className="font-medium">
                    <span className="line-through text-gray-500 mr-2">Rs {paymentPlan.installments[0]?.amount}</span>
                    <span className="text-green-400">Rs {Math.round(getDiscountedPrice(paymentPlan, 0) || 0)}</span>
                  </span>
                ) : (
                  <span className="font-medium">
                    Rs {paymentPlan.installments[0]?.amount}
                  </span>
                )}
              </div>
              {paymentPlan.installments.length > 1 && (
                <>
                  <div className="flex justify-between">
                    <span>Installment:</span>
                    <span className="font-medium">1 of {paymentPlan.installments.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Course Fee:</span>
                    {isDiscounted ? (
                      <span className="font-medium">
                        <span className="line-through text-gray-500 mr-2">
                          Rs {paymentPlan.installments.reduce((sum, { amount }) => sum + amount, 0)}
                        </span>
                        <span className="text-green-400">
                          Rs {Math.round(getTotalDiscountedPrice(paymentPlan) || 0)}
                        </span>
                      </span>
                    ) : (
                      <span className="font-medium">
                        Rs {paymentPlan.installments.reduce((sum, { amount }) => sum + amount, 0)}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Remaining Installments Accordion */}
            {paymentPlan.installments.length > 1 && (
              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="remaining-installments">
                  <AccordionTrigger className="text-sm font-medium text-green-400 hover:text-green-300">
                    View Remaining Installments
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm">
                      {getDueDates(paymentPlan).map(({ amount, dueDate }, index) => {

                        if (index === 0) return null

                        const discountedAmount = isDiscounted ? getDiscountedPrice(paymentPlan, index) : null;

                        return (
                          <div key={index} className="flex justify-between py-1 border-b border-gray-100">
                            <div>
                              <span className="font-medium">Installment {index + 2}:</span>
                              <span className="text-gray-500 ml-2">Due {dueDate}</span>
                            </div>
                            {isDiscounted && discountedAmount !== null ? (
                              <div>
                                <span className="line-through text-gray-500 mr-2">Rs {amount}</span>
                                <span className="text-green-400">Rs {Math.round(discountedAmount)}</span>
                              </div>
                            ) : (
                              <span>Rs {amount}</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      Note: You will receive reminders for future installments. Payment dates are approximate.
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </>
        ) : (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-300">Course Full Fee:</span>
              <p className="text-2xl font-bold text-white">Rs {batch.CFullPrice.toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>


  );
}