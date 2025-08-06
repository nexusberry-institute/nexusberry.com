"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

const FormSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    phone: z.string().min(10, {
        message: "Phone number must be at least 10 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    occupation: z.string().optional(),
    message: z
        .string()
        .min(10, {
            message: "Bio must be at least 10 characters.",
        })
        .max(160, {
            message: "Bio must not be longer than 30 characters.",
        }),
})

export default function ContactUsForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            phone: "",
            email: "",
            occupation: "",
            message: "",
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md p-4">
                    your data
                </pre>
            ),
        })
    }

    return (
        <div className='bg-card padding-x lg:px-10 space-y-10 max-md:space-y-6 max-sm:space-y-4 padding-y shadow-[10px_20px_10px] shadow-foreground/30 border-2 border-dashed border-primary-400 rounded-2xl'>
            <Toaster />
            <h1 className="text-2xl max-sm:text-xl text-center font-bold mx-auto">Contact Our Education Experts Now!</h1>
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 max-md:grid-cols-1 lg:gap-4 max-lg:gap-2">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem className="text-primary-400">
                                    <FormLabel className="text-lg max-sm:text-base">Name *</FormLabel>
                                    <FormControl className="rounded-xl py-8 bg-card pl-6 max-sm:pl-3 text-foreground border-2 focus:shadow-inner">
                                        <Input placeholder="Your name" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem className="text-primary-400">
                                    <FormLabel className="text-lg max-sm:text-base">Phone *</FormLabel>
                                    <FormControl className="rounded-xl py-8 pl-6 max-sm:pl-3 bg-card text-foreground border-2 focus:shadow-inner">
                                        <Input placeholder="Your contact number" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display number.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="text-primary-400">
                                    <FormLabel className="text-lg max-sm:text-base">Email *</FormLabel>
                                    <FormControl className="rounded-xl py-8 bg-card pl-6 max-sm:pl-3 text-foreground border-2 focus:shadow-inner">
                                        <Input placeholder="Your email" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display email.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="occupation"
                            render={({ field }) => (
                                <FormItem className="text-primary-400">
                                    <FormLabel className="text-lg max-sm:text-base">Occupation</FormLabel>
                                    <FormControl className="rounded-xl py-8 bg-card pl-6 max-sm:pl-3 text-foreground border-2 focus:shadow-inner">
                                        <Input placeholder="Your current occupation" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2 text-primary-400"  >
                                    <FormLabel className="text-lg max-sm:text-base">Message *</FormLabel>
                                    <FormControl className="rounded-xl pl-6 max-sm:pl-3 bg-card text-foreground border-2 focus:shadow-inner">
                                        <Textarea
                                            placeholder="Tell us a little bit about yourself"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="flex md:col-span-2 mt-8 max-lg:mt-6 max-sm:mt-3 self-center mx-auto rounded-full text-lg bg-primary hover:bg-primary-400 py-8 px-16 max-lg:py-7 max-lg:px-12 max-sm:px-8 max-sm:py-5 max-sm:text-base">Send Your Questions</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
