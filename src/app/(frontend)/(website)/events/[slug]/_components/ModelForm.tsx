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

const ModelForm = ({ eventId, slug, redirect }: { eventId: number; slug: string | undefined | null, redirect: boolean }) => {
  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    shouldFocusError: false,
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
    },
  })

  async function upload(data: z.infer<typeof FormSchema>) {

    const uploadData = {
      name: data.name,
      email: data.email.toLowerCase(),
      phoneNumber: data.phoneNumber,
      events: eventId,
    }

    try {
      const { success, message, error } = await CreateEventRegistration(uploadData)
      if (success) {

        localStorage.setItem(`${slug}-registration`, JSON.stringify({
          name: data.name, email: data.email,
          phoneNumber: data.phoneNumber, eventSlug: slug
        }))

        toast({
          variant: 'success',
          title: 'Registered Successfully',
          description: message,
        })

        if (redirect) {
          router.push(`/events/${slug}/registration-success`)
        } else {
          window.location.reload()
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
  }

  return (
    <div className="grow">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(upload)} className="space-y-6 pb-6 pl-6 max-sm:pl-0 ">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg max-sm:text-base">Name</FormLabel>
                <FormControl className="text-muted-foreground h-12 max-sm:h-12 text-lg">
                  <Input placeholder="" {...field} />
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
                <FormLabel className="text-lg max-sm:text-base">Phone Number</FormLabel>
                <FormControl className="text-muted-foreground h-12 flex items-center bg-background max-sm:h-12 text-lg">
                  <div className='focus-within:ring-4 rounded-lg'>
                    <PhoneInput
                      {...field}
                      placeholder=""
                      country="pk"
                      enableSearch
                      countryCodeEditable={false}
                      disableCountryGuess={true}
                      inputStyle={{
                        width: '100%',
                        height: '50px',
                        backgroundColor: '#f5f5f5',
                        fontSize: '1rem',
                        paddingLeft: '50px',
                      }}
                      buttonStyle={{
                        backgroundColor: 'transparent',
                        outline: 'none',
                        borderRadius: '4px',
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
                <FormLabel className="text-lg max-sm:text-base">Email</FormLabel>
                <FormControl className="text-muted-foreground h-12 max-sm:h-12 text-lg">
                  <Input type={'email'} placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            className="bg-primary flex justify-center hover:bg-primary-400 text-background w-full text-xl max-sm:text-base max-sm:py-3 py-2 rounded-xl"
          >
            {!form.formState.isSubmitting ? (
              'Continue'
            ) : (
              <svg
                className="animate-spin mr-3 border-2 border-r-green-500 border-indigo-100 h-6 w-6 rounded-full"
                viewBox="0 0 12 12"
              ></svg>
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default ModelForm
