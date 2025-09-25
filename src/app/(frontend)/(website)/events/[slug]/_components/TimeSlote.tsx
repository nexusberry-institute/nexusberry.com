import { Calendar, Clock } from 'lucide-react'
import { formatEventTimeRange, formatPakistanTime } from '../../../_lib/utils/date'
import EventCountDown from './EventCountDown'

export default function TimeSlote({ startDateTime, endTime }: { startDateTime: string, endTime?: string | null }) {

  return (
    <div className='lg:space-y-8 space-y-4 '>
      <div className='flex font-bold gap-5 p-4 ring-1 bg-background text-foreground ring-foreground lg:w-fit max-sm:w-[100%] w-[30rem] rounded-full  shadow-[5px_5px_0px_rgba(181,20,36,0.9)] hover:shadow-none duration-300 max-lg:mx-auto max-lg:flex-col max-lg:rounded-lg  '>
        <div className="flex  items-center gap-2 max-lg:justify-center">
          <Calendar size={18} className="inline" />
          <span>{formatPakistanTime(startDateTime, 'MMMM dd, yyyy')}</span>
        </div>
        <div className='font-light h-[2px] bg-primary-100 w-full lg:hidden'></div>
        <span className='text-primary-100 font-extralight text-4xl max-lg:hidden'>|</span>
        <div className="flex  items-center gap-2 max-lg:justify-center">
          <Clock size={18} className="inline" />
          <span>{formatEventTimeRange(startDateTime, endTime)}</span>
        </div>
      </div>
      <EventCountDown startDateTime={startDateTime} />
    </div>
  )
}
