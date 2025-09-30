import Link from "next/link"
import { CalendarDays, Clock, Award, Users2, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import EventCountdown from "./EventCountdown"
import { formatEventTimeRange, formatPakistanTime } from "@/app/(frontend)/(website)/_lib/utils/date"

type EventCardProps = {
    label: string // e.g., "Orientation"
    title: string // e.g., "MERN Stack Course Free Demo"
    startDateTime: string // ISO or Date
    endTime: string
    registeredCount: number
    certificateIncluded: boolean
    detailHref: string // link to event detail page for registration
}

export function EventCard({
    label = "Event",
    title,
    startDateTime,
    endTime,
    registeredCount = 0,
    certificateIncluded = false,
    detailHref,
}: EventCardProps) {

    const dateLabel = formatPakistanTime(startDateTime, 'MMMM dd, yyyy')
    const timeLabel = formatEventTimeRange(startDateTime, endTime)

    return (
        <Card className="w-full bg-primary-600 border-none py-16 shadow-none">
            <CardContent className="p-6 md:p-8">
                {/* Top: Orientation label + Title */}
                <div className="flex flex-col items-center text-center gap-3">
                    <Badge variant="secondary" className="text-white rounded-full px-3 py-1 text-xs font-medium">
                        {label}
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-semibold text-white text-pretty">{title}</h2>
                </div>

                {/* Pill: Date + Time */}
                <div className="mt-6 flex w-full items-center justify-center">
                    <div className="flex flex-wrap items-center justify-center gap-4 rounded-full border bg-background text-foreground px-4 py-3 shadow-sm">
                        <div className="flex items-center gap-2">
                            <span
                                aria-hidden="true"
                                className="inline-flex items-center justify-center rounded-full bg-secondary text-white size-8"
                            >
                                <CalendarDays className="size-4" />
                            </span>
                            <span className="text-sm font-medium">{dateLabel}</span>
                        </div>
                        <div className="h-5 w-px bg-border" />
                        <div className="flex items-center gap-2">
                            <span
                                aria-hidden="true"
                                className="inline-flex items-center justify-center rounded-full bg-secondary text-white size-8"
                            >
                                <Clock className="size-4" />
                            </span>
                            <span className="text-sm font-medium">{timeLabel}</span>
                        </div>
                    </div>
                </div>

                {/* Countdown + CTA */}
                <div className="mt-8 flex flex-col items-center gap-6">
                    <EventCountdown startDateTime={startDateTime} />
                    <Button asChild size="lg" className="min-w-40 group rounded-lg">
                        <Link href={detailHref} aria-label={`Register for ${title}`}>
                            Register Now
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </div>

                {/* Badges / Meta */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-white">
                    {certificateIncluded && (
                        <div className="inline-flex items-center gap-2 text-sm">
                            <Award className="size-4 opacity-80" aria-hidden="true" />
                            <span className="opacity-90">Certificate Included</span>
                        </div>
                    )}
                    <div className="inline-flex items-center gap-2 text-sm">
                        <Users2 className="size-4 opacity-80" aria-hidden="true" />
                        <span className="opacity-90">{registeredCount} already registered</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default EventCard
