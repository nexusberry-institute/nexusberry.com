"use client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
export default function NotAuthorized() {
  return (
    <div className="max-w-md mx-auto my-8">
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertTitle>Authentication Required</AlertTitle>
        <AlertDescription>
          You need to be logged in to view your profile. Please log in and try again.
        </AlertDescription>
      </Alert>
      <Button onClick={() => window.location.replace("/login")} className="w-full">
        Go to Login
      </Button>
    </div>
  );
}