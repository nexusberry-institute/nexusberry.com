import React from 'react'
import { Calendar, ArrowRight, Phone, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

const DemoBookingSuccess = () => {
    return (
        <div className="flex container max-lg:flex-col mx-auto pt-28 max-sm:pt-16 text-background">
            <div className="flex flex-col items-center justify-center w-full space-y-6 py-12">
                {/* Success Icon */}
                <div className="relative flex items-center justify-center w-32 h-32">
                    {/* Main icon container - Solid circle */}
                    <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-2xl shadow-green-500/50 animate-bounce">
                        {/* Spreading glow effect from center - appears with bounce */}
                        <div className="absolute -inset-8 rounded-full bg-green-500/30 blur-2xl animate-ping" />
                        <div className="absolute -inset-6 rounded-full bg-green-500/40 blur-xl animate-pulse" />

                        {/* Inner subtle glow */}
                        <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse" />

                        {/* Check/Tick mark using Lucide */}
                        <Check
                            className="relative z-10 w-14 h-14 text-white stroke-[4] animate-in zoom-in-50 duration-500 ease-out"
                        />
                    </div>

                    {/* Sparkle effects */}
                    <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-yellow-400 animate-ping" />
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-yellow-300 animate-pulse" />
                </div>

                {/* Success Message */}
                <div className="text-center space-y-3 max-w-2xl">
                    <h3 className="text-4xl font-bold max-lg:text-3xl max-lg:font-semibold max-sm:text-xl">
                        Registration Successful!
                    </h3>
                    <p className="text-xl max-sm:text-base text-muted-foreground">
                        Thank you for registering for our free demo session. We're excited to have you join us!
                    </p>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mt-8">
                    <Card className="border-2">
                        <CardContent className="flex items-start gap-4 p-6">
                            <div className="bg-primary/10 p-3 rounded-lg">
                                <Phone className="w-6 h-6 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-semibold text-lg">We'll Contact You</h4>
                                <p className="text-sm text-muted-foreground">
                                    Our team will reach out to you shortly with more details about the demo session.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-2">
                        <CardContent className="flex items-start gap-4 p-6">
                            <div className="bg-primary/10 p-3 rounded-lg">
                                <Calendar className="w-6 h-6 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-semibold text-lg">Join Our Events</h4>
                                <p className="text-sm text-muted-foreground">
                                    Discover our upcoming workshops, orientations, and hands-on training events.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Call to Action */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Button asChild size="lg" className="group">
                        <Link href="/events">
                            Discover Events
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link href="/courses">
                            Discover Courses
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default DemoBookingSuccess