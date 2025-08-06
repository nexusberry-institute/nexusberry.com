import type { Metadata } from "next";
import { DM_Sans } from 'next/font/google';
import { Toaster } from "sonner";
import { Suspense } from "react";
import "./lms.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LMSAuthProvider } from "./lmsAuth";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Your LMS Dashboard",
  description: "Welcome to your personalized LMS dashboard",
};

export default function LMSLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LMSAuthProvider>
      <section className={`${dmSans.className}`}>
        <SidebarProvider>
          <Suspense fallback={null}>
            <div className="root-layout">{children}</div>
          </Suspense>
          {/* <Toaster invert theme="dark" richColors closeButton /> */}
        </SidebarProvider>
      </section>
    </LMSAuthProvider>
  );
}

