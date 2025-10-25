'use client'

import React, { useState, useRef } from 'react'
import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Trash2, UploadIcon } from 'lucide-react'
import { Batch } from '../serverActions/getTransformedBatches'
import SelectedCourseCard from './SelectedCourseCard'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DiscountCode, PaymentPlan } from '@/payload-types'

const PaymentConfirmation: React.FC<{
  selectedBatch: Batch | null, selectedPlan: PaymentPlan | undefined, discountData: DiscountCode | null
}> = ({ selectedBatch, selectedPlan, discountData }) => {

  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [proofMethod, setProofMethod] = useState<'screenshot' | 'note'>('screenshot')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    setValue,
    control,
  } = useFormContext()

  if (!selectedBatch) {
    return (
      <div className="p-4 bg-yellow-900 border border-yellow-700 rounded-lg">
        <p>There is an issue with selecting your course. Go back and Select course again.</p>
      </div>
    );
  }

  if (!selectedPlan) {
    return (
      <div className="p-4 bg-yellow-900 border border-yellow-700 rounded-lg">
        <p>Their is an issue with selecting your payment plan. Go back and Select payment plan again.</p>
      </div>
    );
  }

  // Calculate payment details based on selected plan
  const paymentDetails = {
    accountName: 'NexusBerry Institute',
    accountNumber: 'XXXX-XXXX-XXXX-1234',
    bankName: 'Example Bank',
    ifscCode: 'EXBK0001234'
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Store the file in the form data
      setValue('proofImage', file, { shouldValidate: true })

      // Clear text proof when image is selected
      if (proofMethod === 'note') {
        setProofMethod('screenshot')
      }

      // Create a preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setFilePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearFileInput = () => {
    setValue('proofImage', undefined, { shouldValidate: true })
    setFilePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleTabChange = (value: string) => {
    setProofMethod(value as 'screenshot' | 'note')

    // Clear the other proof method when switching tabs
    if (value === 'screenshot') {
      setValue('proofText', '', { shouldValidate: true })
    } else {
      setValue('proofImage', undefined, { shouldValidate: true })
      setFilePreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="space-y-6">

      <SelectedCourseCard batch={selectedBatch} paymentPlan={selectedPlan} discountData={discountData} />

      <Alert className="bg-blue-900/20 border-blue-800">
        <AlertDescription>
          <p className="font-medium mb-2">Please transfer the payment to the following account:</p>
          <div className="space-y-1 text-sm">
            <p><span className="inline-block w-32">Account Name:</span> {paymentDetails.accountName}</p>
            <p><span className="inline-block w-32">Account Number:</span> {paymentDetails.accountNumber}</p>
            <p><span className="inline-block w-32">Bank Name:</span> {paymentDetails.bankName}</p>
            <p><span className="inline-block w-32">IFSC Code:</span> {paymentDetails.ifscCode}</p>
          </div>
        </AlertDescription>
      </Alert>

      <FormField
        name="paidMethod"
        control={control}
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className='required'>Payment Method</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className='bg-black'>
                <SelectItem value="BANK">Bank Transfer</SelectItem>
                <SelectItem value="JAZZCASH">JazzCash</SelectItem>
                <SelectItem value="EASYPAISA">EasyPaisa</SelectItem>
                <SelectItem value="CASH">Cash</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-medium required">Payment Proof</h3>
        <p className="text-sm text-gray-500">
          Please upload either a screenshot of your payment receipt or the payment confirmation SMS/text message you received.
        </p>
      </div>

      <Tabs value={proofMethod} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="screenshot"
            className="data-[state=active]:bg-blue-900/40 data-[state=active]:text-white"
            onClick={() => setValue("proofType", "image")}
          >
            Upload Screenshot
          </TabsTrigger>
          <TabsTrigger value="note"
            className="data-[state=active]:bg-blue-900/40 data-[state=active]:text-white"
            onClick={() => setValue("proofType", "text")}
          >
            Payment Note
          </TabsTrigger>
        </TabsList>

        <TabsContent value="screenshot" className="mt-4">
          <FormField
            name="proofImage"
            control={control}
            render={() => (
              <FormItem className="space-y-2">
                <FormControl>
                  <Input
                    type="file"
                    accept='image/*,.pdf'
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className={`hidden`}
                  />
                </FormControl>
                <div className="border rounded-lg overflow-hidden relative">
                  {filePreview ? (filePreview.startsWith('data:image') ? (
                    <>
                      <Image
                        src={filePreview}
                        alt="Payment proof"
                        width={500}
                        height={300}
                        className="max-h-64 mx-auto cursor-pointer object-contain"
                        onClick={() => fileInputRef.current?.click()}
                      />
                      <Trash2 stroke='red'
                        onClick={clearFileInput}
                        className='absolute top-2 right-2 cursor-pointer z-100'
                      />
                    </>
                  ) : (
                    <div className="p-4 text-center">
                      <p>File uploaded successfully</p>
                      <Trash2 stroke='red'
                        onClick={clearFileInput}
                        className='mx-auto mt-2 cursor-pointer'
                      />
                    </div>
                  )) : (
                    <div className="flex flex-col items-center justify-center p-8 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <UploadIcon className='w-16 h-16 mb-4 text-gray-400' />
                      <p className="text-center text-gray-400">Click to upload a screenshot or PDF of your payment receipt</p>
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>

        <TabsContent value="note" className="mt-4">
          <FormField
            name="proofText"
            control={control}
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormControl>
                  <Textarea
                    placeholder="Paste the Confirmation Message from your Bank or Payment App here"
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>
      </Tabs>

      <div className="pt-4 border-t">
        <p className="text-sm text-gray-500">
          After you upload your payment proof, our team will review and verify it before confirming your enrollment.
          You will receive a confirmation email once your enrollment is approved.
        </p>
      </div>
    </div>
  )
}

export default PaymentConfirmation
