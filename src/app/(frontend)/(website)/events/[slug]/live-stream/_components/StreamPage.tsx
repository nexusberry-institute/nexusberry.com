'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ExternalLinkIcon,
  CalendarIcon,
  ClockIcon,
  VideoIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Event } from '@/payload-types';
import RichText from '@/components/RichText';
import { markParticipantAttendance } from './markParticipantAttendance';
import { toast } from '@/hooks/use-toast';

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function StreamPage({ event, applicant, changeRegistration }: { event: Partial<Event>, applicant: any, changeRegistration: () => void }) {

  const [streamStatus, setStreamStatus] = useState<'upcoming' | 'live' | 'ended'>('upcoming');
  const [isProcessing, setIsProcessing] = useState(false); //for debouncing

  useEffect(() => {
    // Function to check stream status
    const checkStreamStatus = () => {
      const now = new Date();
      const startDateTime = new Date(event.startDateTime || '');
      const endTime = new Date(event.endTime || '');

      if (now < startDateTime) {
        setStreamStatus('upcoming');
      } else if (now > endTime) {
        setStreamStatus('ended');
      } else {
        setStreamStatus('live');
      }
    };

    // Run immediately on component mount
    checkStreamStatus();

    // Set up interval to run every 5 minutes (300000 milliseconds)
    const intervalId = setInterval(checkStreamStatus, 300000);

    // Clean up the interval when component unmounts
    return () => clearInterval(intervalId);
  }, [event.startDateTime, event.endTime]); // Depend on the actual data used in the effect


  const openGoogleMeet = async () => {
    try {

      if (isProcessing || !event?.liveStreamLink) return;

      setIsProcessing(true);

      const { success, refresh } = await markParticipantAttendance(event.id as number, applicant);
      if (success) {
        window.open(event.liveStreamLink, '_blank');
        return;
      }
      if (refresh) {
        changeRegistration();
        toast({
          title: "Verification Failed",
          description: "Please Verify to Proceed",
          variant: "destructive",
        })
      }
    } catch (_) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to join the meeting. Please Check Your Network and Try Again.",
      });
      setTimeout(() => {
        window.location.reload()
      }, 1000);
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
      }, 2000); // 2 seconds debounce time
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-primary-50">
      <div className="container mx-auto py-12 px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{event?.title}</h1>
            <Badge
              className={`px-3 py-1 text-sm font-medium ${streamStatus === 'live'
                ? 'bg-green-100 text-green-800 border-green-200'
                : streamStatus === 'upcoming'
                  ? 'bg-primary-100 text-primary-800 border-primary-200'
                  : 'bg-gray-100 text-gray-800 border-gray-200'
                }`}
            >
              {streamStatus === 'live' ? 'LIVE NOW' : streamStatus === 'upcoming' ? 'UPCOMING' : 'ENDED'}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-4 text-slate-600">
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4 text-primary-500" />
              <span>{event?.startDateTime ? formatDate(event.startDateTime) : 'Date not available'}</span>
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4 text-primary-500" />
              <span>
                {event?.startDateTime && event?.endTime
                  ? `${new Date(event.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                   ${new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : 'Time will be updated soon'}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >

            {/* Google Meet Card */}
            <div className="rounded-xl overflow-hidden shadow-lg bg-white border border-primary-100">
              <div className="p-6 flex flex-col items-center text-center mb-8">
                <div className="bg-primary-100 p-4 rounded-full mb-4">
                  <VideoIcon className="h-10 w-10 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-primary-700 mb-2">Join the Live Session</h2>
                <p className="text-slate-600 max-w-md mb-6">
                  {streamStatus === 'live'
                    ? 'This session is currently live. Click the button below to join the Google Meet session.'
                    : streamStatus === 'upcoming'
                      ? 'This session will be live soon. You can join the Google Meet session at the scheduled time.'
                      : 'This session has ended. A recording may be available soon.'}
                </p>

                {event?.liveStreamLink && (
                  <Button
                    onClick={openGoogleMeet}
                    className={`flex items-center gap-2 px-6 py-6 text-lg ${streamStatus === 'live'
                      ? 'bg-primary hover:bg-primary-600 text-card animate-pulse'
                      : 'bg-primary-200 hover:bg-primary-300 text-primary-800'
                      }`}
                    disabled={streamStatus === 'ended'}
                  >
                    {streamStatus === 'live' ? 'Join Live Session Now' : 'Visit Session Link'}
                    <ExternalLinkIcon className="h-5 w-5" />
                  </Button>
                )}
              </div>

              {
                event.learningOutcomes && (
                  <div className="p-6 border-t border-slate-200">
                    {/* <h2 className="text-xl font-bold mb-4 text-primary-700">What You&#39;ll Learn</h2> */}
                    <div
                      className="prose prose-slate max-w-none prose-li:text-slate-700"
                    />
                    <RichText data={event?.learningOutcomes} />
                  </div>
                )
              }
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            {/* instructor Card */}
            {event?.instructor && typeof event.instructor === 'object' && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-primary-100">
                <div className="bg-primary-400 h-2"></div>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-4 text-primary-700">Meet Your Instructor</h3>
                  <div className="flex items-center gap-4">
                    {event.instructor && (
                      <>
                        <img
                          src={typeof event.instructor.profileImage === 'object' ? event.instructor.profileImage.url || '/placeholderImg.jpg' : '/placeholderImg.jpg'}
                          alt={event.instructor.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-primary-200"
                        />
                        <div>
                          <h4 className="font-semibold">{event.instructor.name}</h4>
                          <p className="text-slate-600 text-sm">{event.instructor.expertise}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Registration Details Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-primary-100">
              <div className="bg-primary-400 h-2"></div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4 text-primary-700">Your Registration</h3>

                {applicant ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-500">Name</p>
                      <p className="font-medium">{applicant.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="font-medium">{applicant.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Phone</p>
                      <p className="font-medium">{applicant.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Registered Event</p>
                      <p className="font-medium">{event.title}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-600">No registration information found.</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full justify-center py-6 text-base font-medium border-primary text-primary-700 hover:bg-primary-100 transition-colors duration-200 rounded-[8px] shadow-sm"
                onClick={changeRegistration}
              >
                Register as Different User
              </Button>
              <Button
                variant="outline"
                className="w-full justify-center py-6 text-base font-medium border-primary text-primary-700 hover:bg-primary-100 transition-colors duration-200 rounded-[8px] shadow-sm"
                onClick={() => window.history.back()}
              >
                Back to Event Details
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}