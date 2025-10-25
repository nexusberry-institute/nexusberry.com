'use client'

import React, { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Loader, Trash2, UploadIcon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const paymentUpdateFormSchema = z.object({
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

interface PaymentUpdateFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const PaymentUpdateForm: React.FC<PaymentUpdateFormProps> = ({
  onSubmit,
  onCancel
}) => {

  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [proofMethod, setProofMethod] = useState<'screenshot' | 'note'>('screenshot')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const methods = useForm<z.infer<typeof paymentUpdateFormSchema>>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    resolver: zodResolver(paymentUpdateFormSchema),
    defaultValues: {
      proofType: 'image',
      paidMethod: 'BANK',
      proofImage: undefined,
      proofText: '',
    }
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Store the file in the form data
      methods.setValue('proofImage', file, { shouldValidate: true })

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
    methods.setValue('proofImage', undefined, { shouldValidate: true })
    setFilePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleTabChange = (value: string) => {
    setProofMethod(value as 'screenshot' | 'note')

    // Clear the other proof method when switching tabs
    if (value === 'screenshot') {
      methods.setValue('proofText', '', { shouldValidate: true })
    } else {
      methods.setValue('proofImage', undefined, { shouldValidate: true })
      setFilePreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
      <Form {...methods}>
        <FormField
          name="paidMethod"
          control={methods.control}
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

        <div className="space-y-2">
          <h3 className="text-lg font-medium required">Payment Proof</h3>
          <p className="text-sm text-gray-500">
            Please upload either a screenshot of your payment receipt or the payment confirmation SMS/text message you received.
          </p>
        </div>

        <Tabs value={proofMethod} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#2d3748]">
            <TabsTrigger value="screenshot"
              className="data-[state=active]:bg-blue-900/40 data-[state=active]:text-white"
              onClick={() => methods.setValue("proofType", "image")}
            >
              Upload Screenshot
            </TabsTrigger>
            <TabsTrigger value="note"
              className="data-[state=active]:bg-blue-900/40 data-[state=active]:text-white"
              onClick={() => methods.setValue("proofType", "text")}
            >
              Payment Note
            </TabsTrigger>
          </TabsList>

          <TabsContent value="screenshot" className="mt-4">
            <FormField
              name="proofImage"
              control={methods.control}
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
                          className="max-h-40 mx-auto cursor-pointer object-contain"
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
              control={methods.control}
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

        <p className="text-sm text-gray-500">
          After you upload your payment proof, our team will review and verify it before confirming your enrollment.
        </p>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={methods.formState.isSubmitting}
            className="border-[#4a5568] text-[#e2e8f0] hover:bg-[#2d3748] hover:text-[#e2e8f0]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!methods.formState.isValid || methods.formState.isSubmitting}
            className="bg-[#3182ce] hover:bg-[#2b6cb0] text-white"
          >
            {methods.formState.isSubmitting ? <Loader className='animate-spin' /> : "Submit Payment"}
          </Button>
        </div>
      </Form>
    </form>
  )
}

export default PaymentUpdateForm
