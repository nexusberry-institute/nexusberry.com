"use client";

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const RegistrationButton = ({ slug, startDateTime }: { slug: string, startDateTime: string }) => {
    const [registeredUser, setRegisteredUser] = useState(null);

    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined' && slug) {
            const userDetails = localStorage.getItem(`${slug}-registration`)
            setRegisteredUser(userDetails as any)
        }
    }, [slug])

    if (registeredUser) {
        return (

            <Button
                onClick={() => {
                    if (slug) {
                        router.push(`/events/${slug}/live-stream`)
                    }
                }}
                className="bg-primary-400 w-fit max-lg:mx-auto hover:bg-primary-400 font-bold py-6 rounded-xl hover:shadow-[4px_3px_0px_rgba(181,20,36,0.9)] duration-300"
            >
                Visit Live Stream
            </Button>
        )
    }

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <Button
            onClick={() => {
                scrollToTop(); // Scroll to top on click
            }}
            disabled={startDateTime < new Date().toISOString()}
            className="bg-primary-400 w-fit max-lg:mx-auto hover:bg-primary-400 font-bold py-6 rounded-xl hover:shadow-[4px_3px_0px_rgba(181,20,36,0.9)] duration-300"
        >
            {
                startDateTime < new Date().toISOString()
                    ? 'Registrations Closed'
                    : 'Register for free!!'
            }
        </Button >
    )
}

export default RegistrationButton;