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
import { useRouter } from 'next/navigation'
import CreateEventRegistration from './ServerActions'
import { CheckCircle, Star } from 'lucide-react'
import React, { useState, useEffect } from 'react'


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

const ModelForm = ({ 
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
  const router = useRouter()
  const [isRegistered, setIsRegistered] = useState(false)
  const [userDetails, setUserDetails] = useState<any>(null)
  const [phoneValue, setPhoneValue] = useState('')

  const form = useForm<z.infer<typeof FormSchema>>({
    shouldFocusError: false,
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
    },
  })

  useEffect(() => {
    if (typeof window !== 'undefined' && slug) {
      const details = localStorage.getItem(`${slug}-registration`)
      if (details) {
        const parsedDetails = JSON.parse(details)
        setUserDetails(parsedDetails)
        setIsRegistered(true)
      } else {
        // Reset states when no registration found
        setIsRegistered(false)
        setUserDetails(null)
        setPhoneValue('')
        form.reset({
          name: '',
          email: '',
          phoneNumber: '',
        })
      }
    }
  }, [slug, form])

  async function upload(data: z.infer<typeof FormSchema>) {

    // extract utm parameters from current URL and include if present
    let utmParams: any = {}
    try {
      const params = new URLSearchParams(window.location.search)
      
      // Extract all UTM parameters
      const utm_source = params.get('utm_source')
      const utm_campaign = params.get('utm_campaign') 
      const utm_medium = params.get('utm_medium')
      const utm_content = params.get('utm_content')
      const utm = params.get('utm') // Legacy UTM field
      
      // Only include UTM params that are present
      if (utm_source) utmParams.utm_source = utm_source
      if (utm_campaign) utmParams.utm_campaign = utm_campaign
      if (utm_medium) utmParams.utm_medium = utm_medium
      if (utm_content) utmParams.utm_content = utm_content
      if (utm) utmParams.utm = utm
      
    } catch (e) {
      // ignore in non-browser environments
      utmParams = {}
    }

    const uploadData: any = {
      name: data.name,
      email: data.email.toLowerCase(),
      phoneNumber: data.phoneNumber,
      events: eventId,
      ...utmParams // Spread UTM parameters
    }

    try {
      const { success, message, error, redirectTo } = await CreateEventRegistration(uploadData)
      if (success) {

        const registrationData = {
          name: data.name, 
          email: data.email,
          phoneNumber: data.phoneNumber, 
          eventSlug: slug,
          eventId: eventId
        }
        
        localStorage.setItem(`${slug}-registration`, JSON.stringify(registrationData))
        setUserDetails(registrationData)
        setIsRegistered(true)

        toast({
          variant: 'success',
          title: 'Registered Successfully',
          description: message,
        })

        // Always redirect to success page when registration is successful
        if (redirect) {
          const redirectUrl = redirectTo ? `/events/${slug}${redirectTo}` : `/events/${slug}/registration-success`
          router.push(redirectUrl)
        }

      } else {
        toast({
          variant: 'destructive',
          title: 'Registration Failed',
          description: error instanceof Error ? error.message : String(error),
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Something Went Wrong',
        description: error instanceof Error ? error.message : String(error) + "Please Try Again.",
      })
    }
    form.reset()
    setPhoneValue('')
  }

  // Success state when user is registered and showSuccessState is true
  if (isRegistered && userDetails && showSuccessState) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-8 text-center space-y-6">
        {/* Success Animation/Graphic */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Outer circle with pulse animation */}
            <div className="absolute inset-0 rounded-full bg-green-200 animate-ping opacity-30"></div>
            <div className="absolute inset-2 rounded-full bg-green-300 animate-pulse opacity-40"></div>
            
            {/* Main success circle */}
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              {/* Checkmark */}
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-white-700">
            Registration Confirmed
          </h3>
          <p className="text-lg text-white-600 font-medium">Welcome, {userDetails.name}!</p>
          <p className="text-gray-600">You have successfully registered for this event.</p>
        </div>

        <Button
          onClick={() => {
            if (slug) {
              router.push(`/events/${slug}/live-stream`)
            }
          }}
          className="bg-primary hover:bg-primary-400 text-white w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105"
        >
          Visit Live Stream
        </Button>
      </div>
    )
  }

  // Check if registration is closed
  const isRegistrationClosed = startDateTime && startDateTime < new Date().toISOString()

  if (isRegistrationClosed && showSuccessState) {
    return (
      <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 text-center space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-700">Registration Closed</h3>
          <p className="text-gray-600">This event has already started or ended.</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <p className="text-sm text-gray-500">
            Stay tuned for future events and opportunities!
          </p>
        </div>
      </div>
    )
  }

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
        <form onSubmit={form.handleSubmit(upload)} className={`space-y-6 ${showLeftGraphic ? 'pb-6 pl-6 max-sm:pl-0' : ''}`}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={`${showLeftGraphic ? 'text-lg max-sm:text-base' : 'text-base font-medium text-gray-700'}`}>
                  {showLeftGraphic ? 'Name' : 'Full Name'}
                </FormLabel>
                <FormControl className={`${showLeftGraphic ? 'text-muted-foreground h-12 max-sm:h-12 text-lg' : 'h-12 text-base border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20'}`}>
                  <Input placeholder={showLeftGraphic ? "" : "Enter your full name"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={`${showLeftGraphic ? 'text-lg max-sm:text-base' : 'text-base font-medium text-gray-700'}`}>Phone Number</FormLabel>
                <FormControl className={`${showLeftGraphic ? 'text-muted-foreground h-12 flex items-center bg-background max-sm:h-12 text-lg' : 'h-12 text-base'}`}>
                  <div className={`${showLeftGraphic ? 'focus-within:ring-4 rounded-lg' : 'focus-within:ring-2 focus-within:ring-primary/20 rounded-lg'}`}>
                    <PhoneInput
                      value={phoneValue || field.value}
                      onChange={(value) => {
                        setPhoneValue(value)
                        field.onChange(value)
                      }}
                      placeholder={showLeftGraphic ? "" : "Enter phone number"}
                      country="pk"
                      enableSearch
                      countryCodeEditable={false}
                      disableCountryGuess={true}
                      key={`phone-${isRegistered}-${slug}`}
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={`${showLeftGraphic ? 'text-lg max-sm:text-base' : 'text-base font-medium text-gray-700'}`}>Email</FormLabel>
                <FormControl className={`${showLeftGraphic ? 'text-muted-foreground h-12 max-sm:h-12 text-lg' : 'h-12 text-base border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20'}`}>
                  <Input type={'email'} placeholder={showLeftGraphic ? "" : "Enter your email"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            className={`${
              showLeftGraphic 
                ? 'bg-primary flex justify-center hover:bg-primary-400 text-background w-full text-xl max-sm:text-base max-sm:py-3 py-2 rounded-xl'
                : 'bg-primary hover:bg-primary-400 text-white w-full h-12 text-base font-semibold rounded-xl transition-all duration-300 hover:shadow-lg'
            }`}
          >
            {form.formState.isSubmitting ? (
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
        </form>
      </Form>
    </div>
  )
}

export default ModelForm