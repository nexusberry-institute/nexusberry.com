import React from 'react'
import { Event } from '@/payload-types'
// import EventsFilters from './EventsFilters'
import EventCard from './EventCard'
import { getPayload } from 'payload'
import config from "@/payload.config";

const getEventsList = async ({
  selectedDepartment = 'all',
  page = 1,
  limit = 100
}: {
  selectedDepartment?: string;
  page?: number;
  limit?: number;
}) => {
  const payload = await getPayload({ config });

  // Build the where clause conditionally
  const whereClause: any = {
    startDateTime: {
      greater_than_equal: new Date().toISOString(),
    },
    showInUI: {
      equals: true,
    },
  };

  // Add department filter if not 'all'
  // if (selectedDepartment !== 'all') {
  //     whereClause.department = {
  //         equals: selectedDepartment,
  //     };
  // }

  const events = await payload.find({
    collection: 'events',
    limit,
    // page,
    pagination: false,
    where: whereClause,
    sort: 'startDateTime', // Sort by start date
    select: {
      eventLeads: false
    }
  });

  return events;
};

export default async function EventCart() {
  const events = await getEventsList({});

  // // Error state
  // if (status === 'error') {
  //   return <Error message={error?.message} />;
  // }

  // No events state
  if (!events.docs.length) {
    return <NoUpcomingEvents />;
  }

  return (
    <>
      {/* <EventsFilters
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        // departments
      /> */}
      {/* <div className="container mx-auto flex  gap-2 px-4 flex-wrap  lg:px-10 mb-10 max-sm:mb-5">
        <Button
          onClick={() => setFilteredEventsByDepartment('all')}
          className={`${filteredEventsByDepartment === 'all' ? 'bg-primary text-card' : 'bg-card text-foreground'} 
          w-fit rounded-xl  border-2 border-foreground  hover:shadow-[2px_2px_0px_rgba(0,0,0,0.9)] duration-2000 hover:bg-primary hover:text-background`}
        >
          All Classes
        </Button>

        {!eventCategories.length
          ? ''
          : eventCategories.map((event, index) => (
            event && <Button
              key={index}
              onClick={() => setFilteredEventsByDepartment(event)}
              className={`${filteredEventsByDepartment === event ? 'bg-primary text-card' : 'bg-card text-foreground'}
               w-fit rounded-xl border-2 border-foreground hover:shadow-[2px_2px_0px_rgba(0,0,0,0.9)] duration-2000 hover:bg-primary hover:text-background`}
            >
              {event}{" "}({filteredArray.filter((str) => str === event).length})
            </Button>
          ))}
      </div> */}

      {/* <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 px-4 lg:px-10 gap-8">
        {allEvents.map((event) => (
          <EventCard event={event} />
        ))}
      </div> */}

      {/* Events Grid */}
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 px-4 lg:px-10 gap-8 mb-8">
        {events.docs.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      {/* <PayloadPagination
        meta={events}
        baseUrl='/events'
        searchParams={{ page }}
      /> */}
    </>
  )
}

const Error = ({ message }: { message: string | undefined }) => {
  return (
    <>
      <div className="container mx-auto py-12">
        <div className="text-center bg-red-50 p-8 rounded-lg border border-red-200">
          <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Events</h3>
          <p className="text-red-600">{message || 'Something went wrong'}</p>
        </div>
      </div>
    </>
  )
};

const NoUpcomingEvents = () => {
  return (
    <div className="container mx-auto py-12">
      <div className="text-center bg-card p-8 rounded-lg border border-border shadow-md">
        <div className="flex items-center justify-center gap-4">
          <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-primary-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-1 uppercase tracking-wide">No Upcoming Events</h3>
            <p className="text-muted-foreground">Stay tuned for exciting updates! We&#39;re working on new events.</p>
          </div>
        </div>
      </div>
    </div>
  );
}