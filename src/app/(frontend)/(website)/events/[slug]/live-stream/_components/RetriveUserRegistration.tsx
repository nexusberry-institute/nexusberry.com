"use client"

import { useState, useEffect } from "react";
import { Event } from "@/payload-types";
import ParticipantVerificationForm from "./ParticipantVerificationForm";
import StreamPage from "./StreamPage";

export default function RetriveUserRegistration({ event, slug, }: {
  event: Partial<Event>,
  slug: string,
}) {

  const [isRegistered, setIsRegistered] = useState(false);
  const [applicant, setApplicant] = useState<any>(undefined);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(`${slug}-registration`);
      setApplicant(storedData ? JSON.parse(storedData) : undefined);
      setIsRegistered(storedData !== null);
    } catch (error) {
      console.error("Error parsing registration data:", error);
      setApplicant(undefined);
    }
  }, [slug]);

  // If already registered, render the live stream component
  if (isRegistered) {
    return (
      <StreamPage
        event={event}
        applicant={applicant}
        changeRegistration={() => setIsRegistered(false)}
      />
    )
  }

  // Otherwise, show the phone verification form
  return (
    <ParticipantVerificationForm
      slug={slug}
      eventId={event.id as number}
      setIsRegistered={setIsRegistered}
      setApplicant={setApplicant}
    />
  );
}
