import { FormProvider, useFormContext } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import {
  Phone,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function PhoneVerificationField() {

  const [phoneVerified, setPhoneVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const form = useFormContext()

  const { toast } = useToast()


  const verifyPhone = async () => {
    const isValid = await form.trigger("phoneNumber");
    if (!isValid) {
      return;
    }


    setShowOtpModal(true);
    toast({
      title: "Verification Code Sent",
      variant: "success",
      description: "A verification code has been sent to your phone number.",
    });
  }

  const verifyOTP = () => {
    setShowOtpModal(false);
    setPhoneVerified(true);
    toast({
      title: "Phone Verified",
      variant: "success",
      description: "Your phone number has been successfully verified.",
    });
  };

  return (
    <FormProvider {...form}>
      <FormField
        name="phoneNumber"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-300 required">
              <Phone className="inline mr-2 h-4 w-4" />
              Phone Number
            </FormLabel>
            <div className="flex space-x-2">
              <FormControl>
                <Input {...field} className="bg-gray-800 border-gray-700" />
              </FormControl>
              <Button
                type="button"
                variant={phoneVerified ? "outline" : "default"}
                onClick={verifyPhone}
                disabled={phoneVerified}
                className={phoneVerified ? "bg-green-900/20 text-green-400 hover:bg-green-900/30" : ""}
              >
                {phoneVerified ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Verified
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
            </div>
            <FormDescription className="text-gray-500 flex items-center">
              {phoneVerified ? (
                <>
                  <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">Phone number verified</span>
                </>
              ) : (
                <>
                  <AlertCircle className="mr-1 h-3 w-3 text-yellow-500" />
                  <span className="text-yellow-500">Phone number not verified</span>
                </>
              )}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* OTP Model */}
      {showOtpModal && (
        <AlertDialog open={showOtpModal} onOpenChange={setShowOtpModal}>
          <AlertDialogContent className="bg-gray-900 border-gray-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Verify Phone Number</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Enter the verification code sent to your phone number.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4 mx-auto">
              <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-primary hover:bg-primary/90"
                onClick={verifyOTP}
              >
                Verify
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

    </FormProvider>
  );
}