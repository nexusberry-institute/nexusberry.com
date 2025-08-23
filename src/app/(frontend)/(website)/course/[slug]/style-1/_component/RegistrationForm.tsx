'use client'
import React from 'react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { occupationOptions } from '@/app/(frontend)/(website)/_constants/data'
import { educationOptions } from '@/app/(frontend)/(website)/_constants/data'
import { useRouter } from 'next/navigation'

const FormSchema = z.object({
    fullName: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    mobile: z.string().min(10, {
        message: "Mobile number must be at least 10 digits",
    }).regex(/^\d+$/, {
        message: "Mobile number should contain only digits"
    }),
    occupation: z.string().min(1, {
        message: "Please select an occupation"
    }),
    education: z.string().min(1, {
        message: "Please select education level"
    }),
    policy: z.boolean().refine(val => val === true, {
        message: "You must agree to the privacy policy and terms"
    }),
    whatsapp: z.boolean().default(true).optional(),
})

const RegistrationForm = ({
    slug,
    redirect
}: {

    slug: string | undefined | null;

    redirect: boolean
}) => {
    const router = useRouter()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            fullName: "",
            mobile: "",
            occupation: "",
            education: "",
            policy: true,
            whatsapp: true
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        // console.log('Form submission started with data:', data)

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: data.fullName,
                    mobile: data.mobile,
                    education: data.education,
                    job_info: data.occupation,
                    notes: `Agreed to policy: ${data.policy}, Whatsapp updates: ${data.whatsapp}`
                })
            })

            // console.log('API response status:', res.status)

            if (!res.ok) {
                const errorData = await res.text()
                console.error('API Error:', errorData)
                throw new Error(`API Error: ${res.status}`)
            }

            const response = await res.json()
            // console.log('API Response:', response)

            toast({
                title: 'Thank you for registering!',
                description: 'Your information has been received successfully.',
                variant: 'success',
                duration: 1000,
            })

            // Clear form first
            form.reset()

            if (redirect && slug) {
                // Success page redirect k bajay query param use karein
                router.push(`/course/${slug}/success-book-free-demo`);
            }

        } catch (err) {
            console.error('Form submission error:', err)
            toast({
                title: 'Submission failed',
                description: 'Please try again later.',
                variant: 'destructive',
            })
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 pb-6 pl-6 max-sm:pl-0 w-full">

                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-lg max-sm:text-base'>Your name*</FormLabel>
                            <FormControl className='text-white h-16 max-sm:h-12 text-lg'>
                                <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-lg max-sm:text-base'>Mobile Number*</FormLabel>
                            <FormControl className='text-white h-16 max-sm:h-12 text-lg'>
                                <Input
                                    placeholder="Enter your mobile number"
                                    type="tel"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="occupation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-lg max-sm:text-base'>Occupation*</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl className='text-muted-foreground h-16 max-sm:h-12 text-lg'>
                                    <SelectTrigger aria-label="Select Occupation">
                                        <SelectValue placeholder="Select Occupation" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {occupationOptions.map((occupation) => (
                                        <SelectItem key={occupation} value={occupation}>
                                            {occupation}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-lg max-sm:text-base'>Highest Education*</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl className='text-muted-foreground h-16 max-sm:h-12 text-lg'>
                                    <SelectTrigger aria-label="Select Education">
                                        <SelectValue placeholder="Select Education Level" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {educationOptions.map((education) => (
                                        <SelectItem key={education} value={education}>
                                            {education}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="policy"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                            <FormControl className='size-6 bg-background mt-1'>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    id="policy"
                                    aria-label="Agree to Terms & Conditions"
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel className='text-lg max-sm:text-base cursor-pointer' htmlFor="policy">
                                    I agree to the NexusBerry Privacy Policy and Terms & Conditions.*
                                </FormLabel>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="whatsapp"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                            <FormControl className='size-6 bg-background mt-1'>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    id="whatsapp"
                                    aria-label="Agree to Updates on Whatsapp"
                                />
                            </FormControl>
                            <FormLabel className='text-lg max-sm:text-base cursor-pointer' htmlFor="whatsapp">
                                Keep me updated on WhatsApp.
                            </FormLabel>
                        </FormItem>
                    )}
                />



                <Button
                    disabled={form.formState.isSubmitting}
                    type="submit"
                    className="bg-secondary hover:bg-secondary-400 text-background w-full text-xl max-sm:text-base max-sm:py-3 py-5 rounded-xl flex justify-center"
                >
                    {!form.formState.isSubmitting ? (
                        'Book Free Demo'
                    ) : (
                        <svg
                            className="animate-spin mx-auto border-2 border-r-green-500 border-indigo-100 h-6 w-6 rounded-full"
                            viewBox="0 0 12 12"
                        ></svg>
                    )}
                </Button>
            </form>
        </Form>
    )
}

export default RegistrationForm