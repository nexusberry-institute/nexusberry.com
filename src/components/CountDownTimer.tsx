import { useState, useEffect } from 'react'

interface TimeLeft {
  days: string
  hours: string
  minutes: string
  seconds: string
}

interface CountdownTimerProps {
  date: string,
}

export const CountdownTimer = ({ date }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  })

  useEffect(() => {
    const now = new Date() // Current UTC time

    const interval = setInterval(() => {
      const eventDate = new Date(date) // Event UTC time from database
      const distance = eventDate.getTime() - now.getTime()

      if (distance < 0) {
        setTimeLeft({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00'
        })
        clearInterval(interval)
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft({
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [date])

  return timeLeft
}
