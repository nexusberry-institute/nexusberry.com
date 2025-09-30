"use client"

import { CountdownTimer } from "@/components/CountDownTimer";

export default function EventCountdown({ startDateTime }: { startDateTime: string }) {
    const timeLeft = CountdownTimer({ date: startDateTime })

    const Item = ({ value, label }: { value: string; label: string }) => (
        <div className="flex flex-col items-center justify-center rounded-lg bg-secondary text-white px-4 py-3 min-w-20">
            <div className="text-3xl font-semibold tabular-nums leading-none">{value}</div>
            <div className="text-xs mt-1 opacity-80">{label}</div>
        </div>
    )

    return (
        <div className="grid grid-cols-4 gap-3">
            <Item value={timeLeft.days} label="Days" />
            <Item value={timeLeft.hours} label="Hours" />
            <Item value={timeLeft.minutes} label="Minutes" />
            <Item value={timeLeft.seconds} label="seconds" />
        </div>
    )
}
