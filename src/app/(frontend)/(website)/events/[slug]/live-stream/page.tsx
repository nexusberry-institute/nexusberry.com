import { getPayload } from "payload"
import configPromise from "@/payload.config"
import ErrorCard from "../../../_components/ErrorCard"
import Link from "next/link"
import RetriveUserRegistration from "./_components/RetriveUserRegistration"

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const events = await payload.find({
    collection: 'events',
    limit: 100,
    depth: 2,
    select: {
      slug: true,
    },
  })
  const params = events.docs.map(({ slug }) => {
    return { slug }
  })
  return params
}

export default async function Page({ params }: {
  params: Promise<{ slug: string }>
}) {
  try {
    const { slug = '' } = await params

    const payload = await getPayload({ config: configPromise })
    const response = await payload.find({
      collection: 'events',
      depth: 2,
      limit: 1,
      pagination: false,
      where: {
        slug: {
          equals: slug,
        },
      },
      select: {
        title: true,
        slug: true,
        liveStreamLink: true,
        startDateTime: true,
        endTime: true,
        image: true,
        instructor: true,
        learningOutcomes: true
      }
    })

    const event = response.docs[0]

    if (!event) {
      return (
        <div className="container mx-auto py-16 px-4">
          <div className="bg-card rounded-xl border border-border shadow-md p-8 max-w-2xl mx-auto text-center space-y-6">
            <div className="flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
              Event Not Found
            </h1>
            <p className="text-muted-foreground">
              We couldn&#39;t find the event &#34;{slug}&#34; you&#39;re looking for. It may have been removed or the URL might be incorrect.
            </p>
            <div className="pt-4">
              <Link
                href="/events"
                className="rounded-md bg-primary px-6 py-3 text-card font-medium shadow-sm hover:bg-primary/90 transition-colors"
              >
                Browse All Events
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return (
      <RetriveUserRegistration event={event} slug={slug} />
    )
  } catch (error) {
    return <ErrorCard error={error} />
  }
}

// 'use client';

// import { useEffect, useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { InfoIcon, AlertTriangleIcon, ExternalLinkIcon } from 'lucide-react';
// import Link from 'next/link';

// interface EventData {
//   id: number;
//   slug: string;
//   liveStreamLink: string | null;
//   title?: string; // Additional field that would be useful
//   startTime?: string; // Additional field that would be useful
//   endTime?: string; // Additional field that would be useful
//   description?: string; // Additional field that would be useful
// }

// interface UserRegistration {
//   name: string;
//   email: string;
//   phoneNumber: string;
//   eventSlug: string;
// }

// export default function LiveStreamPage({ params }: { params: { slug: string } }) {
//   const [eventData, setEventData] = useState<EventData | null>(null);
//   const [userRegistration, setUserRegistration] = useState<UserRegistration | null>(null);
//   const [isRegisteredForThisEvent, setIsRegisteredForThisEvent] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Set active route
//     localStorage.setItem('activeRoute', '/events/[slug]/live-stream');

//     // Fetch event data (mock data for now)
//     // In a real implementation, you would fetch this from your API
//     setEventData({
//       id: 4,
//       slug: 'app-development-with-react-native',
//       liveStreamLink: null,
//       title: 'App Development with React Native', // Additional field
//       startTime: '2023-12-15T10:00:00Z', // Additional field
//       endTime: '2023-12-15T12:00:00Z', // Additional field
//       description: 'Learn how to build cross-platform mobile apps with React Native.' // Additional field
//     });

//     // Get user registration from localStorage
//     try {
//       // Try to get from eventRegistrations first
//       const allRegistrations = JSON.parse(localStorage.getItem('eventRegistrations') || '{}');
//       const currentEventRegistrations = allRegistrations[params.slug] || [];

//       if (currentEventRegistrations.length > 0) {
//         const latestRegistration = currentEventRegistrations[currentEventRegistrations.length - 1];
//         setUserRegistration({
//           name: latestRegistration.name,
//           email: latestRegistration.email,
//           phoneNumber: latestRegistration.phoneNumber,
//           eventSlug: params.slug
//         });
//         setIsRegisteredForThisEvent(true);
//       } else {
//         // Fall back to registrationSuccess
//         const registrationData = JSON.parse(localStorage.getItem('registrationSuccess') || 'null');
//         if (registrationData) {
//           setUserRegistration(registrationData);
//           setIsRegisteredForThisEvent(registrationData.eventSlug === params.slug);
//         }
//       }
//     } catch (error) {
//       console.error('Error retrieving registration data:', error);
//     }

//     setLoading(false);
//   }, [params.slug]);

//   if (loading) {
//     return (
//       <div className="container min-h-screen mx-auto py-16 px-4 flex justify-center items-center">
//         <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="container min-h-screen mx-auto py-16 px-4">
//       <Card className="max-w-4xl mx-auto">
//         <CardHeader>
//           <CardTitle className="text-2xl md:text-3xl">{eventData?.title || 'Event Live Stream'}</CardTitle>
//           <CardDescription>
//             {new Date(eventData?.startTime || '').toLocaleString()} - {new Date(eventData?.endTime || '').toLocaleString()}
//           </CardDescription>
//         </CardHeader>

//         <CardContent className="space-y-6">
//           {!isRegisteredForThisEvent && (
//             <Alert variant="destructive">
//               <AlertTriangleIcon className="h-4 w-4" />
//               <AlertTitle>Not Registered</AlertTitle>
//               <AlertDescription>
//                 You are not registered for this event. The registration you have is for "{userRegistration?.eventSlug}".
//                 <div className="mt-2">
//                   <Link href={`/events/${eventData?.slug}`}>
//                     <Button variant="outline" size="sm">Register for this event</Button>
//                   </Link>
//                 </div>
//               </AlertDescription>
//             </Alert>
//           )}

//           {isRegisteredForThisEvent && !eventData?.liveStreamLink && (
//             <Alert>
//               <InfoIcon className="h-4 w-4" />
//               <AlertTitle>Live Stream Not Available Yet</AlertTitle>
//               <AlertDescription>
//                 The live stream for this event has not started yet. Please check back later.
//               </AlertDescription>
//             </Alert>
//           )}

//           {isRegisteredForThisEvent && eventData?.liveStreamLink && (
//             <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
//               <iframe
//                 src={eventData.liveStreamLink}
//                 className="w-full h-full"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen
//               ></iframe>
//             </div>
//           )}

//           <div className="bg-slate-50 p-4 rounded-lg">
//             <h3 className="font-semibold text-lg mb-2">Your Registration Details</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <p className="text-sm text-slate-500">Name</p>
//                 <p>{userRegistration?.name || 'Not available'}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-slate-500">Email</p>
//                 <p>{userRegistration?.email || 'Not available'}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-slate-500">Phone Number</p>
//                 <p>{userRegistration?.phoneNumber || 'Not available'}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-slate-500">Registered Event</p>
//                 <p>{userRegistration?.eventSlug || 'Not available'}</p>
//               </div>
//             </div>
//           </div>

//           {eventData?.description && (
//             <div>
//               <h3 className="font-semibold text-lg mb-2">About This Event</h3>
//               <p>{eventData.description}</p>
//             </div>
//           )}
//         </CardContent>

//         <CardFooter className="flex justify-between">
//           <Button variant="outline" onClick={() => window.history.back()}>
//             Back
//           </Button>
//           {isRegisteredForThisEvent && eventData?.liveStreamLink && (
//             <Button className="flex items-center gap-2">
//               Open in Full Screen <ExternalLinkIcon className="h-4 w-4" />
//             </Button>
//           )}
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }


// 'use client';

// import { useEffect, useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { InfoIcon, AlertTriangleIcon, ExternalLinkIcon, CalendarIcon, ClockIcon, UserIcon } from 'lucide-react';
// import Link from 'next/link';
// import { motion } from 'framer-motion';

// interface EventData {
//   id: number;
//   slug: string;
//   liveStreamLink: string | null;
//   title?: string;
//   startTime?: string;
//   endTime?: string;
//   learningOutcomes?: string; // Rich text content
//   speaker?: {
//     name: string;
//     role: string;
//     avatar?: string;
//   };
// }

// interface UserRegistration {
//   name: string;
//   email: string;
//   phoneNumber: string;
//   eventSlug: string;
// }

// export default function LiveStreamPage({ params }: { params: { slug: string } }) {
//   const [eventData, setEventData] = useState<EventData | null>(null);
//   const [userRegistration, setUserRegistration] = useState<UserRegistration | null>(null);
//   const [isRegisteredForThisEvent, setIsRegisteredForThisEvent] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [streamStatus, setStreamStatus] = useState<'upcoming' | 'live' | 'ended'>('upcoming');

//   useEffect(() => {
//     localStorage.setItem('activeRoute', '/events/[slug]/live-stream');

//     // Mock data - replace with actual API call
//     setEventData({
//       id: 4,
//       slug: 'app-development-with-react-native',
//       liveStreamLink: "https://meet.google.com/yjz-zqxq-vqx",
//       title: 'App Development with React Native',
//       startTime: '2023-12-15T10:00:00Z',
//       endTime: '2023-12-15T12:00:00Z',
//       learningOutcomes: `<ul>
//         <li>Build cross-platform mobile applications using React Native</li>
//         <li>Understand the fundamentals of mobile UI/UX design</li>
//         <li>Implement navigation and state management in React Native apps</li>
//         <li>Connect to APIs and handle data in mobile applications</li>
//         <li>Deploy applications to app stores</li>
//       </ul>`,
//       speaker: {
//         name: "Sarah Johnson",
//         role: "Senior Mobile Developer",
//         avatar: "https://randomuser.me/api/portraits/women/44.jpg"
//       }
//     });

//     // Determine stream status based on current time and event times
//     const now = new Date();
//     const startTime = new Date(eventData?.startTime || '');
//     const endTime = new Date(eventData?.endTime || '');

//     if (now < startTime) {
//       setStreamStatus('upcoming');
//     } else if (now > endTime) {
//       setStreamStatus('ended');
//     } else {
//       setStreamStatus('live');
//     }

//     // Get user registration from localStorage
//     try {
//       const allRegistrations = JSON.parse(localStorage.getItem('eventRegistrations') || '{}');
//       const currentEventRegistrations = allRegistrations[params.slug] || [];

//       if (currentEventRegistrations.length > 0) {
//         const latestRegistration = currentEventRegistrations[currentEventRegistrations.length - 1];
//         setUserRegistration({
//           name: latestRegistration.name,
//           email: latestRegistration.email,
//           phoneNumber: latestRegistration.phoneNumber,
//           eventSlug: params.slug
//         });
//         setIsRegisteredForThisEvent(true);
//       } else {
//         const registrationData = JSON.parse(localStorage.getItem('registrationSuccess') || 'null');
//         if (registrationData) {
//           setUserRegistration(registrationData);
//           setIsRegisteredForThisEvent(registrationData.eventSlug === params.slug);
//         }
//       }
//     } catch (error) {
//       console.error('Error retrieving registration data:', error);
//     }

//     setLoading(false);
//   }, [params.slug]);

//   if (loading) {
//     return (
//       <div className="container min-h-screen mx-auto py-16 px-4 flex justify-center items-center">
//         <div className="flex flex-col items-center gap-4">
//           <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
//           <p className="text-primary animate-pulse">Loading event details...</p>
//         </div>
//       </div>
//     );
//   }

//   const formatDate = (dateString: string) => {
//     const options: Intl.DateTimeFormatOptions = {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
//       <div className="container mx-auto py-12 px-4">
//         {/* Header Section */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="mb-8"
//         >
//           <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
//             <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{eventData?.title}</h1>
//             <Badge
//               className={`px-3 py-1 text-sm font-medium ${streamStatus === 'live'
//                 ? 'bg-green-100 text-green-800 border-green-200'
//                 : streamStatus === 'upcoming'
//                   ? 'bg-blue-100 text-blue-800 border-blue-200'
//                   : 'bg-gray-100 text-gray-800 border-gray-200'
//                 }`}
//             >
//               {streamStatus === 'live' ? 'LIVE NOW' : streamStatus === 'upcoming' ? 'UPCOMING' : 'ENDED'}
//             </Badge>
//           </div>

//           <div className="flex flex-wrap gap-4 text-slate-600">
//             <div className="flex items-center gap-1">
//               <CalendarIcon className="h-4 w-4" />
//               <span>{eventData?.startTime ? formatDate(eventData.startTime) : 'Date not available'}</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <ClockIcon className="h-4 w-4" />
//               <span>
//                 {eventData?.startTime && eventData?.endTime
//                   ? `${new Date(eventData.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
//                      ${new Date(eventData.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
//                   : 'Time not available'}
//               </span>
//             </div>
//           </div>
//         </motion.div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Content */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             className="lg:col-span-2 space-y-8"
//           >
//             {/* Registration Alert */}
//             {!isRegisteredForThisEvent && (
//               <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm">
//                 <div className="flex gap-4 items-start">
//                   <div className="bg-amber-100 p-3 rounded-full">
//                     <AlertTriangleIcon className="h-6 w-6 text-amber-600" />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-amber-800 mb-2">Not Registered for This Event</h3>
//                     <p className="text-amber-700 mb-4">
//                       You are currently registered for "{userRegistration?.eventSlug}" but not for this event.
//                     </p>
//                     <Link href={`/events/${eventData?.slug}`}>
//                       <Button className="bg-amber-600 hover:bg-amber-700 text-white">
//                         Register for This Event
//                       </Button>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Live Stream Player */}
//             <div className="rounded-xl overflow-hidden shadow-lg bg-white border border-slate-200">
//               {isRegisteredForThisEvent && eventData?.liveStreamLink ? (
//                 <div className="aspect-video">
//                   <iframe
//                     src={eventData.liveStreamLink}
//                     className="w-full h-full"
//                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                     allowFullScreen
//                   ></iframe>
//                 </div>
//               ) : (
//                 <div className="aspect-video bg-slate-800 flex items-center justify-center">
//                   <div className="text-center p-8">
//                     {isRegisteredForThisEvent ? (
//                       <>
//                         <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-slate-700 mb-4">
//                           <ClockIcon className="h-8 w-8 text-slate-300" />
//                         </div>
//                         <h3 className="text-xl font-bold text-white mb-2">Stream Not Available Yet</h3>
//                         <p className="text-slate-300">
//                           {streamStatus === 'upcoming'
//                             ? 'The live stream will begin soon. Please check back at the scheduled time.'
//                             : 'This stream has ended. A recording may be available soon.'}
//                         </p>
//                       </>
//                     ) : (
//                       <>
//                         <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-slate-700 mb-4">
//                           <UserIcon className="h-8 w-8 text-slate-300" />
//                         </div>
//                         <h3 className="text-xl font-bold text-white mb-2">Registration Required</h3>
//                         <p className="text-slate-300">Please register for this event to access the live stream.</p>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               )}

//               <div className="p-6">
//                 <h2 className="text-xl font-bold mb-4">What You'll Learn</h2>
//                 <div
//                   className="prose prose-slate max-w-none"
//                   dangerouslySetInnerHTML={{ __html: eventData?.learningOutcomes || '' }}
//                 />
//               </div>
//             </div>
//           </motion.div>

//           {/* Sidebar */}
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5, delay: 0.4 }}
//             className="space-y-6"
//           >
//             {/* Speaker Card */}
//             {eventData?.speaker && (
//               <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
//                 <div className="p-6">
//                   <h3 className="text-lg font-bold mb-4">Meet Your Instructor</h3>
//                   <div className="flex items-center gap-4">
//                     {eventData.speaker.avatar && (
//                       <img
//                         src={eventData.speaker.avatar}
//                         alt={eventData.speaker.name}
//                         className="w-16 h-16 rounded-full object-cover"
//                       />
//                     )}
//                     <div>
//                       <h4 className="font-semibold">{eventData.speaker.name}</h4>
//                       <p className="text-slate-600 text-sm">{eventData.speaker.role}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Registration Details Card */}
//             <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
//               <div className="p-6">
//                 <h3 className="text-lg font-bold mb-4">Your Registration</h3>

//                 {userRegistration ? (
//                   <div className="space-y-4">
//                     <div>
//                       <p className="text-sm text-slate-500">Name</p>
//                       <p className="font-medium">{userRegistration.name}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-slate-500">Email</p>
//                       <p className="font-medium">{userRegistration.email}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-slate-500">Phone</p>
//                       <p className="font-medium">{userRegistration.phoneNumber}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-slate-500">Registered Event</p>
//                       <p className="font-medium">{userRegistration.eventSlug}</p>
//                     </div>
//                   </div>
//                 ) : (
//                   <p className="text-slate-600">No registration information found.</p>
//                 )}
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col gap-3">
//               <Button
//                 variant="outline"
//                 className="w-full justify-center py-6 text-base"
//                 onClick={() => window.history.back()}
//               >
//                 Back to Event Details
//               </Button>

//               {isRegisteredForThisEvent && eventData?.liveStreamLink && (
//                 <Button className="w-full justify-center py-6 text-base bg-primary hover:bg-primary-600 flex items-center gap-2">
//                   Open in Full Screen <ExternalLinkIcon className="h-4 w-4" />
//                 </Button>
//               )}
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// }