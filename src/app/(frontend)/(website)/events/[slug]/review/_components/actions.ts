
"use server"

import { getPayload } from 'payload'
import configPromise from "@payload-config";
import { EventFeedback } from '@/payload-types';


export const queryExistingMumber = async (userInputNumber: number, eventSlug: string) => {

    try {
        const payload = await getPayload({ config: configPromise })
        const user = await payload.find({
            collection: 'leads',
            limit: 4,
            depth: 3,
            pagination: false,
            where: {
                mobile: {
                    equals: userInputNumber
                },
                'eventAttendance.event.slug': {
                    equals: eventSlug
                }
            }
        })

        return {
            success: true,
            result: user.docs[0],
        }

    } catch (error) {

        return {
            success: false,
            result: undefined,
            error: error instanceof Error ? error.message : "An unexpected error occurred. Please try again later."
        }

    }

}


interface formData {
    lead: number,
    event: number,
    rating: number;
    reason?: "topic-interest" | "mentor-preference" | "mentorship-program-interest" | "field-specific-interest" | "others" | null;
    otherReason?: string | null;
    mentorship?: "yes" | "no" | null;
}

export const createFeedbacks = async (data: formData, eventSlug: string) => {


    try {
        const payload = await getPayload({ config: configPromise })
        const duplicate = await payload.find({
            collection: "event-feedbacks",
            depth: 2,
            pagination: false,
            where: {
                lead: {
                    equals: data.lead
                },
                'event.slug': {
                    equals: eventSlug
                }
            }
        })

        if (duplicate.docs.length) {
            return {
                success: true,
                message: "You've already provided feedback for this event. You can download your certificate from the certificate page.",
                error: "",
            }
        }

        await payload.create({
            collection: "event-feedbacks",
            data
        })
        return {
            success: true,
            message: "Feedback submitted successfully",
            error: null,
        }

    } catch (error) {
        return {
            success: false,
            message: "",
            error: error instanceof Error ? error.message : error,
        }
    }
}
