"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function AuthError({ title, desc }: { title?: string, desc?: string }) {
  return (
    <div className="max-w-md mx-auto my-8">
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertTitle>{title || "Something Wrong Happend!!"}</AlertTitle>
        <AlertDescription>{desc || "There was a problem processing your profile data. Please contact support if this issue persists."}</AlertDescription>
      </Alert>
      <Button onClick={() => window.location.reload()} className="w-full">
        Try Again
      </Button>
    </div>
  );
}