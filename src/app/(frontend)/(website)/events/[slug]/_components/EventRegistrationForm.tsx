'use client'

import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@payloadcms/ui'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useRouter, useSearchParams } from 'next/navigation'
import CreateEventRegistration from './ServerActions'
import { Star } from 'lucide-react'
import React, { useState, useTransition } from 'react'
import clsx from 'clsx'


const FormSchema = z.object({
  name: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  country: z.string().optional(),
  phoneNumber: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }),
})

const EventRegistrationForm = ({
  eventId,
  slug,
  redirect,
  showLeftGraphic = true,
  showSuccessState = false,
  startDateTime,
  endTime
}: {
  eventId: number;
  slug: string | undefined | null;
  redirect: boolean;
  showLeftGraphic?: boolean;
  showSuccessState?: boolean;
  startDateTime?: string;
  endTime?: string | null;
}) => {
  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm({
    shouldFocusError: false,
    resolver: zodResolver(FormSchema),
    reValidateMode: "onSubmit",
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
    },
  })
  const { control, formState: { isSubmitting }, handleSubmit, setError } = form;

  const upload = async (data: z.infer<typeof FormSchema>) => {
    const baseData = {
      name: data.name,
      email: data.email.toLowerCase(),
      phoneNumber: data.phoneNumber,
      eventId,
    };

    startTransition(async () => {
      try {
        const { error } = await CreateEventRegistration({
          ...baseData,
          campaignId: Number(searchParams.get("camp")) || null
        })

        if (error?.type === "validation") {
          if (error.email) setError("email", { type: "manual", message: error.email })
          if (error.phoneNumber) setError("phoneNumber", { type: "manual", message: error.phoneNumber })
          return;
        };

        if (error?.type === "api") {
          toast({
            variant: 'destructive',
            title: 'Something Went Wrong',
            description: error.message + " " + "Please Try Again.",
          })
          return;
        };

        localStorage.setItem(`${eventId}-registration`, JSON.stringify(baseData));
        router.push(`/events/${slug}/success`)
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Something Went Wrong',
          description: error instanceof Error ? error.message : String(error) + "Please Try Again.",
        })
      }
    });
  }

  const isLoading = isSubmitting || isPending;

  return (
    <div className={`${showLeftGraphic ? 'grow' : 'bg-white rounded-xl p-6 shadow-lg border border-gray-100'}`}>
      {!showLeftGraphic && !showSuccessState && (
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Join the Event
            <Star className="h-5 w-5 text-yellow-500" />
          </h3>
          <p className="text-gray-600 text-sm">Secure your spot now!</p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={handleSubmit(upload)} className={`space-y-6 ${showLeftGraphic ? 'pb-6 pl-6 max-sm:pl-0' : ''}`}>
          <div className={clsx('space-y-6')}>
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={`${showLeftGraphic ? 'text-lg max-sm:text-base' : 'text-base font-medium text-gray-700'}`}>
                    {showLeftGraphic ? 'Name' : 'Full Name'}
                  </FormLabel>
                  <FormControl
                    className={clsx(
                      "h-12 text-base border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 "
                    )}
                  >
                    <Input
                      placeholder={showLeftGraphic ? "" : "Enter your full name"}
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage aria-live='polite' />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={`${showLeftGraphic ? 'text-lg max-sm:text-base' : 'text-base font-medium text-gray-700'}`}>Phone Number</FormLabel>
                  <FormControl className={`${showLeftGraphic ? 'text-muted-foreground h-12 flex items-center bg-background max-sm:h-12 text-lg' : 'h-12 text-base'}`}>
                    <div className={`${showLeftGraphic ? 'focus-within:ring-4 rounded-lg' : 'focus-within:ring-2 focus-within:ring-primary/20 rounded-lg'}`}>
                      <PhoneInput
                        disabled={isLoading}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={showLeftGraphic ? "" : "Enter phone number"}
                        enableSearch
                        country={"pk"}
                        preferredCountries={["pk"]}
                        countryCodeEditable={false}
                        disableCountryGuess={true}
                        key={`phone-${slug}`}
                        inputStyle={{
                          width: '100%',
                          height: showLeftGraphic ? '50px' : '48px',
                          backgroundColor: showLeftGraphic ? '#f5f5f5' : 'white',
                          fontSize: '1rem',
                          paddingLeft: '50px',
                          border: showLeftGraphic ? 'none' : '1px solid #e5e7eb',
                          borderRadius: '8px',
                        }}
                        buttonStyle={{
                          backgroundColor: 'transparent',
                          outline: 'none',
                          borderRadius: showLeftGraphic ? '4px' : '8px 0 0 8px',
                          border: showLeftGraphic ? 'none' : '1px solid #e5e7eb',
                          borderRight: showLeftGraphic ? 'none' : 'none',
                        }}
                        containerStyle={{
                          display: 'flex'
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage aria-live='polite' />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={`${showLeftGraphic ? 'text-lg max-sm:text-base' : 'text-base font-medium text-gray-700'}`}>Email</FormLabel>
                  <FormControl
                    className={clsx(
                      "h-12 text-base border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20")}
                  >
                    <Input
                      type={'email'}
                      placeholder={showLeftGraphic ? "" : "Enter your email"}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage aria-live='polite' />
                </FormItem>
              )}
            />

            <Button
              disabled={isLoading}
              type="submit"
              className={`${showLeftGraphic
                ? 'bg-primary flex justify-center hover:bg-primary-400 text-background w-full text-xl max-sm:text-base max-sm:py-3 py-2 rounded-xl'
                : 'bg-primary hover:bg-primary-400 text-white w-full h-12 text-base font-semibold rounded-xl transition-all duration-300 hover:shadow-lg'
                }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className={`animate-spin mr-3 border-2 ${showLeftGraphic ? 'border-r-green-500 border-indigo-100' : 'border-r-white border-white/30'} h-6 w-6 rounded-full`}
                    viewBox="0 0 12 12"
                  />
                  {showLeftGraphic ? '' : 'Registering...'}
                </div>
              ) : (
                showLeftGraphic ? 'Continue' : 'Register for Free'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default EventRegistrationForm