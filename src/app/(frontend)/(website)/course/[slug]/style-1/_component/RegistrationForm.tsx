'use client';

import React, { useTransition } from 'react'
import CreateCourseDemoBooking from './ServerActions'
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
import { useRouter } from 'next/navigation';

const FormSchema = z.object({
    fullName: z.string().min(6, {
        message: "Name must be at least 6 characters.",
    }),
    mobile: z.string().min(11, {
        message: "Please enter a valid mobile number",
    }).regex(/^\d+$/, {
        message: "Mobile number should contain only digits"
    }),
    email: z.string().email({
        message: "Please enter a valid email address."
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
    courseId,
    slug,
}: {
    courseId: number
    slug: string
}) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            fullName: "",
            mobile: "",
            email: "",
            occupation: "",
            education: "",
            policy: true,
            whatsapp: true
        },
    })

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        startTransition(async () => {
            try {
                const response = await CreateCourseDemoBooking({
                    name: data.fullName,
                    mobile: data.mobile,
                    email: data.email,
                    extraInfo: `Education: ${data.education}, Occupation: ${data.occupation}, Policy: ${data.policy}, Whatsapp: ${data.whatsapp}`,
                    courseSlug: slug,
                    courseId
                });

                if (!response.success) {
                    toast({
                        title: 'Submission failed',
                        description: response.error || 'An Unknown Error Occured, Please Try Again.',
                        variant: 'destructive',
                    });
                    return
                }

                router.push(`/course/${slug}/success`);
            } catch (err) {
                console.error('Form submission error:', err);
                toast({
                    title: 'Submission failed',
                    description: 'Please try again later.',
                    variant: 'destructive',
                });
            }
        });
    }

    const isLoading = form.formState.isSubmitting || isPending;

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
                            <FormControl className='rounded-lg placeholder:text-white h-16 max-sm:h-12 text-lg'>
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
                            <FormControl className='rounded-lg placeholder:text-white h-16 max-sm:h-12 text-lg'>
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
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-lg max-sm:text-base'>Email Address*</FormLabel>
                            <FormControl className='rounded-lg placeholder:text-white h-16 max-sm:h-12 text-lg'>
                                <Input
                                    placeholder="Enter your email address"
                                    type="email"
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
                                <FormControl className='bg-muted-foreground h-16 max-sm:h-12 text-lg'>
                                    <SelectTrigger aria-label="Select occupation">
                                        <SelectValue placeholder="Select occupation" />
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
                                <FormControl className='bg-muted-foreground h-16 max-sm:h-12 text-lg'>
                                    <SelectTrigger aria-label="Select education">
                                        <SelectValue placeholder="Select education level" />
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
                    disabled={isLoading}
                    type="submit"
                    className="bg-secondary hover:bg-secondary-400 text-background w-full text-xl max-sm:text-base max-sm:py-3 py-5 rounded-xl flex justify-center"
                >
                    {!isLoading ? (
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