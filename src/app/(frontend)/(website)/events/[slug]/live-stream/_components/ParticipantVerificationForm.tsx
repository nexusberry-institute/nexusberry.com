"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { queryExistingMumber } from "../../review/_components/actions";
import { EventModel } from "../../_components/EventModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Dispatch, useState } from "react";

const PhoneFormSchema = z.object({
  phoneNumber: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }),
});

export default function ParticipantVerificationForm({ slug, eventId, setIsRegistered, setApplicant }: {
  slug: string, eventId: number,
  setIsRegistered: Dispatch<React.SetStateAction<boolean>>,
  setApplicant: Dispatch<React.SetStateAction<any>>,
}) {

  const [isOPenModel, setIsOpenModel] = useState(false)

  const form = useForm<z.infer<typeof PhoneFormSchema>>({
    resolver: zodResolver(PhoneFormSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });

  const verifyPhoneNumber = async ({ phoneNumber }: z.infer<typeof PhoneFormSchema>) => {
    try {
      const { result, error } = await queryExistingMumber(parseInt(phoneNumber), slug);

      if (result) {
        // Store the registration data in localStorage
        const registeredData = {
          name: result.name,
          email: result.email,
          phoneNumber,
          eventSlug: slug,
        };

        localStorage.setItem(`${slug}-registration`, JSON.stringify(registeredData));

        setApplicant(registeredData);
        setIsRegistered(true);

        toast({
          variant: 'success',
          title: 'Verification Successful',
          description: 'Your registration has been verified.',
        });

      } else {
        setIsOpenModel(true)
        toast({
          variant: 'destructive',
          title: 'Verification Failed',
          description: error || 'No registration found for this phone number. Please register for this event.',
        });
      }

    } catch (error) {
      console.error("Error verifying phone number:", error);
      toast({
        variant: 'destructive',
        title: 'Verification Error',
        description: 'An error occurred while verifying your phone number. Please try again.',
      });
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto my-10 bg-white rounded-xl shadow-md overflow-hidden border border-primary-100 p-6">
        <div className="bg-primary h-2 -mt-6 -mx-6 mb-6"></div>
        <h2 className="text-xl font-bold text-primary-700 mb-4">Verify Your Registration</h2>
        <p className="text-slate-600 mb-6">
          Please enter the phone number you used to register for this event.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(verifyPhoneNumber)} className="space-y-6">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg max-sm:text-base">Phone Number</FormLabel>
                  <FormControl className="text-muted-foreground h-12 flex items-center bg-background max-sm:h-12 text-lg">
                    <div className='focus-within:ring-4 rounded-lg'>
                      <PhoneInput
                        onEnterKeyPress={(e) => { form.handleSubmit(verifyPhoneNumber)() }}
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
                          display: 'flex',
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full justify-center py-6 text-base bg-primary hover:bg-primary-600 text-card"
              >
                {form.formState.isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </div>
                ) : (
                  'Verify Registration'
                )}
              </Button>

              <Button
                type="button"
                onClick={() => setIsOpenModel(true)}
                variant="outline"
                className="w-full justify-center py-6 text-base border-primary-200 text-primary-700 hover:bg-primary-50"
              >
                Register for This Event
              </Button>
            </div>
          </form>
        </Form>
      </div>
      {isOPenModel && <EventModel setIsOpenModel={setIsOpenModel} eventId={eventId} slug={slug} redirect={false} />}
    </>
  )
}