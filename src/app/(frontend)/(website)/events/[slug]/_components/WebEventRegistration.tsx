import React from 'react'
import EventRegistrationForm from './EventRegistrationForm'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const WebEventRegistration = ({
    registeredUser,
    eventId,
    slug,
    startDateTime,
    endTime
}: {
    registeredUser: any,
    eventId: number,
    slug: string | null,
    startDateTime: string,
    endTime: string | null
}) => {

    if (registeredUser) {
        return <RegisteredSuccessfully registeredUser={registeredUser} slug={slug} />
    };

    if (startDateTime && startDateTime < new Date().toISOString()) {
        return <RegistrationClosed />;
    }

    return (
        <>
            <EventRegistrationForm
                eventId={eventId}
                slug={slug}
                redirect={true}
                showLeftGraphic={false}
                showSuccessState={true}
                startDateTime={startDateTime}
                endTime={endTime}
            />
        </>
    )
}

const RegisteredSuccessfully = ({ registeredUser, slug }: { registeredUser: any, slug: string | null }) => {
    const router = useRouter();

    return (
        <div className="mt-5 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-8 text-center space-y-6">
            {/* Success Animation/Graphic */}
            <div className="flex justify-center">
                <div className="relative">
                    {/* Outer circle with pulse animation */}
                    <div className="absolute inset-0 rounded-full bg-green-200 animate-ping opacity-30"></div>
                    <div className="absolute inset-2 rounded-full bg-green-300 animate-pulse opacity-40"></div>

                    {/* Main success circle */}
                    <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                        {/* Checkmark */}
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-2xl font-bold text-white-700">
                    Registration Confirmed
                </h3>
                <p className="text-lg text-white-600 font-medium">Welcome, {registeredUser.name}!</p>
                <p className="text-gray-600">You have successfully registered for this event.</p>
            </div>

            <Button
                onClick={() => {
                    if (slug) {
                        router.push(`/events/${slug}/live-stream`)
                    }
                }}
                // className="bg-primary hover:bg-primary-400 text-white w-full  rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                className="bg-primary hover:bg-primary-400 text-white w-full h-12 text-base font-semibold rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105"
            >
                Visit Live Stream
            </Button>
        </div>
    )
}


const RegistrationClosed = () => {
    return (
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 text-center space-y-4">
            <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-700">Registration Closed</h3>
                <p className="text-gray-600">This event has already started or ended.</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-100">
                <p className="text-sm text-gray-500">
                    Stay tuned for future events and opportunities!
                </p>
            </div>
        </div>
    )
};

export default WebEventRegistration