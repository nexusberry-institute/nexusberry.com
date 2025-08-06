"use client"
import { useFormFields } from '@payloadcms/ui'
import { useMemo } from 'react'

export default function SumOfInstallments() {
  // Get the installments array
  const installments = useFormFields(([fields]) => fields.installments?.value || 0) as number
  const totalPrice = useFormFields(([fields]) => fields.totalPrice?.value || 0) as number
  //use hooks cannot be used in functions or loops, so this one is the last possible technique
  const installment1 = useFormFields(([fields]) => fields["installments.0.amount"]?.value ?? 0) as number
  const installment2 = useFormFields(([fields]) => fields["installments.1.amount"]?.value ?? 0) as number
  const installment3 = useFormFields(([fields]) => fields["installments.2.amount"]?.value ?? 0) as number
  const installment4 = useFormFields(([fields]) => fields["installments.3.amount"]?.value ?? 0) as number
  const installment5 = useFormFields(([fields]) => fields["installments.4.amount"]?.value ?? 0) as number
  const installment6 = useFormFields(([fields]) => fields["installments.5.amount"]?.value ?? 0) as number

  const allAmounts = useMemo(() => {
    return [installment1, installment2, installment3, installment4, installment5, installment6]
  }, [installment1, installment2, installment3, installment4, installment5, installment6])

  const totalAmount = useMemo(() => {
    if (!installments) return 0

    return allAmounts
      .slice(0, installments)
      .reduce((sum, amount) => sum + amount, 0)
  }, [installments, allAmounts])

  // Calculate remaining amount
  const remainingAmount = useMemo(() => {
    return totalPrice - totalAmount
  }, [totalPrice, totalAmount])

  return (
    <div className="p-4 rounded-lg border border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-100">
        Installments Summary
      </h3>

      {allAmounts.slice(0, installments).length > 0 ? (
        <>
          <div className="space-y-3 my-4">
            {allAmounts.map((amount, ind) => amount && ind < installments ? (
              <div
                key={ind}
                className="flex justify-between items-center px-2"
              >
                <span className="font-medium text-gray-300">
                  Installment {ind + 1}
                </span>
                <span className="font-semibold text-white">
                  Rs {amount.toLocaleString('en-IN')}
                </span>
              </div>
            ) : null)}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-600">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-200">
                Total Amount:
              </span>
              <span className={`text-xl font-bold ${!remainingAmount ? "text-emerald-400" : "text-red-400"}`}>
                Rs {totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-end items-center space-x-1">
              <span className="text-xs text-gray-200">
                Remaining:
              </span>
              <span className={`text-xs font-bold ${remainingAmount > 0 ? "text-yellow-400" : remainingAmount == 0 ? "text-emerald-400" : "text-red-400"}`}>
                {remainingAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="py-6 text-center text-gray-400">
          No installments added yet.
        </div>
      )
      }
    </div >
  )
}