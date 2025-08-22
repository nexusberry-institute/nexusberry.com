'use client'

import { useState, useEffect } from 'react'
import { Event } from '@/payload-types'
import ParticipantVerificationForm from './ParticipantVerificationForm'
import StreamPage from './StreamPage'

export default function RetriveUserRegistration({
  event,
  slug,
}: {
  event: Partial<Event>
  slug: string
}) {
  // Start with undefined so we know when the check is complete
  const [isRegistered, setIsRegistered] = useState<boolean | undefined>(undefined)
  const [applicant, setApplicant] = useState<any>(undefined)

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(`${slug}-registration`)
      setApplicant(storedData ? JSON.parse(storedData) : undefined)
      setIsRegistered(storedData !== null)
    } catch (error) {
      console.error('Error parsing registration data:', error)
      setApplicant(undefined)
      setIsRegistered(false)
    }
  }, [slug])

  // Wait for registration check before rendering
  if (isRegistered === undefined) {
    return (
      <div
        style={{
          height: '100vh',
          minHeight: '80dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <style>{`
.spinner {
  position: absolute;
  width: 9px;
  height: 9px;
}

.spinner div {
  position: absolute;
  width: 50%;
  height: 150%;
  background: #000000;
  transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1%));
  animation: spinner-fzua35 1s calc(var(--delay) * 1s) infinite ease;
}

.spinner div:nth-child(1) {
  --delay: 0.1;
  --rotation: 36;
  --translation: 150;
}

.spinner div:nth-child(2) {
  --delay: 0.2;
  --rotation: 72;
  --translation: 150;
}

.spinner div:nth-child(3) {
  --delay: 0.3;
  --rotation: 108;
  --translation: 150;
}

.spinner div:nth-child(4) {
  --delay: 0.4;
  --rotation: 144;
  --translation: 150;
}

.spinner div:nth-child(5) {
  --delay: 0.5;
  --rotation: 180;
  --translation: 150;
}

.spinner div:nth-child(6) {
  --delay: 0.6;
  --rotation: 216;
  --translation: 150;
}

.spinner div:nth-child(7) {
  --delay: 0.7;
  --rotation: 252;
  --translation: 150;
}

.spinner div:nth-child(8) {
  --delay: 0.8;
  --rotation: 288;
  --translation: 150;
}

.spinner div:nth-child(9) {
  --delay: 0.9;
  --rotation: 324;
  --translation: 150;
}

.spinner div:nth-child(10) {
  --delay: 1;
  --rotation: 360;
  --translation: 150;
}

@keyframes spinner-fzua35 {
  0%, 10%, 20%, 30%, 50%, 60%, 70%, 80%, 90%, 100% {
    transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1%));
  }

  50% {
    transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1.5%));
  }
}
        `}</style>
        <div className="spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    )
  }

  if (isRegistered) {
    return (
      <StreamPage
        event={event}
        applicant={applicant}
        changeRegistration={() => setIsRegistered(false)}
      />
    )
  }

  return (
    <ParticipantVerificationForm
      slug={slug}
      eventId={event.id as number}
      setIsRegistered={setIsRegistered as React.Dispatch<React.SetStateAction<boolean>>}
      setApplicant={setApplicant}
    />
  )
}
