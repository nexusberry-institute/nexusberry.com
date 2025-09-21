// "use client";

// import { Event } from '@/payload-types'
// import React, { useEffect, useState } from 'react'
// import Hero from './Hero'
// import CourseInfo from './CourseInfo'
// import UpcomingClasses from './UpcomingClasses'
// import RegistrationFooter from './RegistrationFooter'

// const EventDetailTemplate = ({ event, participantCount }: { event: Event, participantCount: number }) => {
//     const [registeredUser, setRegisteredUser] = useState(null);

//     useEffect(() => {
//         if (typeof window !== 'undefined' && event.slug) {
//             const userDetails = localStorage.getItem(`${event.slug}-registration`)
//             console.log('Fetched userDetails from localStorage for slug:', event.slug, userDetails)
//             setRegisteredUser(userDetails as any)
//         }
//     }, [event.slug]);

//     return (
//         <>
//             <Hero
//                 event={event}
//                 attendee={participantCount}
//                 registeredUser={registeredUser}
//             />
//             {/* {event.learningOutcomes && (
//             <CourseDetail
//               learningOutcomes={event.learningOutcomes}
//               image={typeof event.image === 'object' ? event.image : undefined}
//               instructor={typeof event.instructor === 'object' ? event.instructor : undefined}
//             />
//           )} */}
//             {/* <JoinUs
//             instructor={typeof event.instructor === 'object' ? event.instructor : undefined}
//             title={event.title}
//             startDateTime={event.startDateTime}
//             eventId={event.id}
//             slug={event.slug}
//             whatsappLink={event.whatsappLink}
//             whatsappQrCode={event.whatsappQrCode}
//           /> */}
//             {/* <Review title={event.title} slug={slug} /> */}
//             <CourseInfo
//                 eventId={event.id}
//                 slug={event.slug}
//                 startDateTime={event.startDateTime}
//                 eventLabel={event.label}
//             />
//             <UpcomingClasses
//                 slug={event.slug as string}
//                 eventLabel={event.label}
//             />
//             <RegistrationFooter
//                 startDateTime={event.startDateTime}
//                 endTime={event.endTime}
//                 eventId={event.id}
//                 slug={event.slug}
//             />
//             {/* Spacer to prevent footer overlap */}
//             <div id="show_footer"></div>
//         </>

//     )
// }

// export default EventDetailTemplate