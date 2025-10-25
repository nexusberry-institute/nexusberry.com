import { Loader2 } from "lucide-react";

export default function AuthLoading({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">{message || "Loading your profile information..."}</p>
    </div>
  );
}