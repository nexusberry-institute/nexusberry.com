"use client"

import { Check } from 'lucide-react'
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'

export default function Success({ slug, eventId }: { slug: string, eventId: number }) {
  const [applicant, setApplicant] = React.useState<{ name: string }>({ name: "Participant" });
  const searchParams = useSearchParams();

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(`${slug}-registration`);
      const name = searchParams.get("name")
      setApplicant(storedData ? JSON.parse(storedData) : { name: searchParams.get("name") || "Participant" })
      if (!storedData && name) {
        localStorage.setItem(`${slug}-registration`, JSON.stringify({ name, eventId }));
      };
    } catch (error) {
      console.error("Error parsing registration data:", error);
    }
  }, [slug])

  return (
    <div
      className="flex text-card flex-col pt-16 items-center mx-auto h-[25rem] space-y-6 p-4"
      style={{
        background: `url(https://www.wscubetech.com/images/master-class/master-banner-checks.svg) no-repeat 50%, url(https://www.wscubetech.com/images/categories/noise.png) repeat, linear-gradient(256.99deg, #002ccd 19.72%, #003238ff 97.05%), linear-gradient(180deg, #0834d8, rgba(25, 76, 255, 0))`,
        backgroundBlendMode: 'color-dodge',
      }}
    >
      <div className="bg-green-500 rounded-full h-fit animate-ping w-fit p-4">
        <Check strokeWidth={4} size={30} className="stroke-card" />
      </div>
      <h1 className="text-2xl font-bold">Hello , {applicant.name}</h1>
      <p className="max-sm:text-center">Your registration has been done successfully.</p>
    </div>
  )
}
