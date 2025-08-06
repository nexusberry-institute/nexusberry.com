// "use client"
// import React from 'react';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Clock, MapPin, AlertTriangle, BookOpen, CreditCard } from 'lucide-react';
// import Link from 'next/link';
// import { cn } from '@/lib/utils';

// import getUserEnrolledCourses from '../getUserEnrolledCourses';
// import { getDurationText } from '@/utilities/getDurationText';

// type CourseType = Awaited<ReturnType<typeof getUserEnrolledCourses>>[number]

// const CourseCard: React.FC<{ course: CourseType }> = ({ course }) => {
//   const { title, isSuspended, batchEnrollments, relatedFeeReciepts } = course;

//   // Check if there are any pending fee receipts
//   const hasPendingFees = relatedFeeReciepts?.find(receipt => receipt?.status === "PENDING");
//   // we are only getting recieved status where verified is false by query
//   const hasNotVerifiedFees = relatedFeeReciepts?.find(receipt => receipt?.status === "RECEIVED");

//   const isDatePassed = (timestamp: string | number | Date): boolean => {
//     const dueDate = new Date(timestamp);
//     const today = new Date();

//     // Set hours, minutes, seconds to 0 for accurate date comparison
//     today.setHours(0, 0, 0, 0);
//     dueDate.setHours(0, 0, 0, 0);

//     return dueDate < today;
//   };

//   const concessionTimeRemaining = (timestamp?: string | number | Date): string => {
//     if (!timestamp) return ""
//     const dueDate = new Date(timestamp);
//     const today = new Date();
//     const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds
//     const twoDaysFromToday = new Date(today.getTime() + twoDaysInMilliseconds);
//     const timeRemaining = dueDate.getTime() - twoDaysFromToday.getTime();
//     const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
//     if (daysRemaining <= 0) {
//       return "expired";
//     }
//     if (daysRemaining <= 1) {
//       return "today";
//     }
//     return `in ${daysRemaining} days`;
//   }

//   return batchEnrollments?.map(batchEnrollment => batchEnrollment && (
//     <Card key={batchEnrollment.id} className="h-full overflow-hidden transition-all hover:shadow-md border-l-4 border-l-primary" >
//       <CardHeader className="pb-2">
//         <div className="flex justify-between items-start">
//           <div>
//             <CardTitle className="text-xl font-bold">{title}</CardTitle>
//             <CardDescription className="text-sm mt-1">
//               {batchEnrollment.batch?.slug}
//             </CardDescription>
//           </div>

//           <div className="flex flex-col items-end gap-2">
//             {isSuspended && (
//               <Badge variant="destructive" className="ml-2">
//                 <AlertTriangle className="h-3 w-3 mr-1" />
//                 Suspended
//               </Badge>
//             )}

//             <Badge
//               className={cn(
//                 "uppercase text-xs",
//                 batchEnrollment?.mode === "ONLINE"
//                   ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
//                   : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
//               )}
//             >
//               {batchEnrollment?.mode}
//             </Badge>
//           </div>
//         </div>
//       </CardHeader>

//       <CardContent>
//         <div className="space-y-3">
//           {batchEnrollment && (
//             <>
//               {batchEnrollment.batch?.duration &&
//                 <div className="flex items-center text-sm">
//                   <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
//                   <span>Duration: {getDurationText(batchEnrollment.batch?.duration)}</span>
//                 </div>
//               }

//               <div className="flex items-center text-sm">
//                 <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
//                 <span>Modules: {batchEnrollment?.modules?.length}</span>
//               </div>

//               <div className="flex items-center text-sm">
//                 <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
//                 <span>{batchEnrollment.mode === "ONLINE" ? "Online Classes" : "In-Person Classes"}</span>
//               </div>
//             </>
//           )}

//           {
//             hasNotVerifiedFees ? (
//               <div className="space-y-2">
//                 <div className={`flex items-center text-sm ${isDatePassed(hasNotVerifiedFees.dueDate) ? "text-red-400" : "text-amber-400"}`}>
//                   <CreditCard className="h-4 w-4 mr-2" />
//                   <span>Payment due: {new Date(hasNotVerifiedFees.dueDate).toLocaleDateString("en-IN", {
//                     year: 'numeric',
//                     month: '2-digit',
//                     day: '2-digit'
//                   })}</span>
//                 </div>

//                 {isDatePassed(hasNotVerifiedFees.dueDate) && (
//                   <div className="bg-red-900/30 border border-red-800 rounded p-2 text-xs text-red-300">
//                     <AlertTriangle className="h-3 w-3 inline-block mr-1" />
//                     Your payment is not verified yet. You will be informed once it is verified.
//                   </div>
//                 )}
//               </div>
//             ) : (
//               hasPendingFees && (
//                 <div className="space-y-2">
//                   <div className={`flex items-center text-sm ${isDatePassed(hasPendingFees.dueDate) ? "text-red-400" : "text-amber-400"}`}>
//                     <CreditCard className="h-4 w-4 mr-2" />
//                     <span>Payment due: {new Date(hasPendingFees.dueDate).toLocaleDateString("en-IN", {
//                       year: 'numeric',
//                       month: '2-digit',
//                       day: '2-digit'
//                     })}</span>
//                   </div>

//                   {isDatePassed(hasPendingFees.dueDate) && (
//                     <div className="bg-red-900/30 border border-red-800 rounded p-2 text-xs text-red-300">
//                       <AlertTriangle className="h-3 w-3 inline-block mr-1" />
//                       {
//                         concessionTimeRemaining(hasPendingFees.dueDate) === "expired" ?
//                           "Your course access is blocked. Please pay your fees to resume your course."
//                           : `Warning: Your course access will be blocked if you don't pay your fees ${concessionTimeRemaining(hasPendingFees.dueDate)}.`
//                       }
//                     </div>
//                   )}
//                 </div>
//               ))
//           }
//         </div>
//       </CardContent>

//       <CardFooter className="pt-2 flex justify-between">
//         {/* Disable link if suspended */}
//         {isSuspended || concessionTimeRemaining(hasNotVerifiedFees?.dueDate) === "expired" ? (
//           <Button variant={"destructive"} disabled className="flex-1 mr-2">
//             {isSuspended ? "You are suspended" : "Course Access Blocked"}
//           </Button>
//         ) : (
//           // change the text with batch active status
//           <Link href={`/lms/courses/${course.enrollmentId}`} className="flex-1 mr-2">
//             <Button variant="default" className="w-full" >
//               {batchEnrollment.batch?.active ? "Continue Learning" : "View Course"}
//             </Button>
//           </Link>
//         )}

//         {/* Show Pay Fees button if there are pending fees */}
//         {hasPendingFees && (
//           <Link href="/lms/payments" className="flex-1 ml-2">
//             <Button variant="outline" className="w-full">
//               Pay Fees
//             </Button>
//           </Link>
//         )}
//       </CardFooter>
//     </Card>
//   ))

// }

// export default CourseCard;

"use client"
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, AlertTriangle, BookOpen, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

import getUserEnrolledCourses from '../getUserEnrolledCourses';
import { getDurationText } from '@/utilities/getDurationText';

type CourseType = Awaited<ReturnType<typeof getUserEnrolledCourses>>[number]

const CourseCard: React.FC<{ course: CourseType }> = ({ course }) => {
  const { title, isSuspended, batchEnrollments, relatedFeeReciepts, enrollmentId } = course;

  // Check if there are any pending fee receipts
  const hasPendingFees = relatedFeeReciepts?.find(receipt => receipt?.status === "PENDING");
  // we are only getting recieved status where verified is false by query
  const hasNotVerifiedFees = relatedFeeReciepts?.find(receipt => receipt?.status === "RECEIVED");

  const isDatePassed = (timestamp: string | number | Date): boolean => {
    const dueDate = new Date(timestamp);
    const today = new Date();

    // Set hours, minutes, seconds to 0 for accurate date comparison
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
  };

  const concessionTimeRemaining = (timestamp?: string | number | Date): string => {
    if (!timestamp) return ""
    const dueDate = new Date(timestamp);
    const today = new Date();

    const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000;
    // Add two days to the due date
    dueDate.setTime(dueDate.getTime() + twoDaysInMilliseconds);
    // Calculate days remaining directly
    const timeRemaining = dueDate.getTime() - today.getTime();
    const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

    if (daysRemaining < 0) {
      return "expired";
    }
    if (daysRemaining <= 2) {
      return daysRemaining === 0 ? "today" : "tomorrow";
    }
    return `in ${daysRemaining} days`;
  }

  return batchEnrollments?.map(batchEnrollment => batchEnrollment && (
    <Card key={batchEnrollment.id} className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md border-l-4 border-l-primary" >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
            <CardDescription className="text-sm mt-1">
              {batchEnrollment.batch?.slug}
            </CardDescription>
          </div>

          <div className="flex flex-col items-end gap-2">
            {isSuspended && (
              <Badge variant="destructive" className="ml-2">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Suspended
              </Badge>
            )}

            <Badge
              className={cn(
                "uppercase text-xs",
                batchEnrollment?.mode === "ONLINE"
                  ? " bg-blue-900 text-blue-300"
                  : " bg-green-900 text-green-300"
              )}
            >
              {batchEnrollment?.mode}
            </Badge>

            <Badge
              className={cn(
                "uppercase text-xs",
                batchEnrollment?.batch?.active
                  ? " bg-blue-900/50 text-blue-300"
                  : " bg-purple-900/50 text-purple-300"
              )}
            >
              {batchEnrollment.batch?.active ? "In Progress" : "Completed"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="space-y-3">
          {batchEnrollment && (
            <>
              {batchEnrollment.batch?.duration &&
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Duration: {getDurationText(batchEnrollment.batch?.duration)}</span>
                </div>
              }

              <div className="flex items-center text-sm">
                <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Modules: {batchEnrollment?.modules?.length}</span>
              </div>

              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{batchEnrollment.mode === "ONLINE" ? "Online Classes" : "In-Person Classes"}</span>
              </div>
            </>
          )}
        </div>

        {/* Payment alert section - always reserve space */}
        <div className="mt-4 min-h-[60px]">
          {/* First check suspended if not then check not verified fees and then check pending fees */}
          {
            isSuspended ? (
              <div className="bg-red-900/30 border border-red-800 rounded p-2 text-xs text-red-300">
                <AlertTriangle className="h-3 w-3 inline-block mr-1" />
                You are suspended from this course. Please contact the admin to resolve this issue.
              </div>
            ) : (hasNotVerifiedFees ? (
              <div className="space-y-2">
                <div className={`flex items-center text-sm ${isDatePassed(hasNotVerifiedFees.dueDate) ? "text-red-400" : "text-amber-400"}`}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  <span>Payment due: {new Date(hasNotVerifiedFees.dueDate).toLocaleDateString("en-IN", {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })}</span>
                </div>

                {isDatePassed(hasNotVerifiedFees.dueDate) && (
                  <div className="bg-red-900/30 border border-red-800 rounded p-2 text-xs text-red-300">
                    <AlertTriangle className="h-3 w-3 inline-block mr-1" />
                    {
                      concessionTimeRemaining(hasNotVerifiedFees.dueDate) === "expired" ?
                        "Your course access is blocked due to not verified payment after two days of due date. Contact administrator for further assistance."
                        : `Your payment is not verified yet. You will be informed once it is verified. If not verified ${concessionTimeRemaining(hasNotVerifiedFees.dueDate)}, please contact us.`
                    }
                  </div>
                )}
              </div>
            ) : (
              hasPendingFees && (
                <div className="space-y-2">
                  <div className={`flex items-center text-sm ${isDatePassed(hasPendingFees.dueDate) ? "text-red-400" : "text-amber-400"}`}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    <span>Payment due: {new Date(hasPendingFees.dueDate).toLocaleDateString("en-IN", {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })}</span>
                  </div>

                  {isDatePassed(hasPendingFees.dueDate) && (
                    <div className="bg-red-900/30 border border-red-800 rounded p-2 text-xs text-red-300">
                      <AlertTriangle className="h-3 w-3 inline-block mr-1" />
                      {
                        concessionTimeRemaining(hasPendingFees.dueDate) === "expired" ?
                          "Your course access is blocked. Please pay your fees to resume your course."
                          : `Warning: Your course access will be blocked if you don't pay your fees ${concessionTimeRemaining(hasPendingFees.dueDate)}.`
                      }
                    </div>
                  )}
                </div>
              )))
          }
        </div>
      </CardContent >

      <CardFooter className="pt-2 mt-auto">
        <div className="w-full flex justify-between">
          {/* Disable link if suspended */}
          {isSuspended || concessionTimeRemaining(hasNotVerifiedFees?.dueDate) === "expired" ? (
            <Button variant={"destructive"} disabled className="flex-1 mr-2">
              {isSuspended ? "You are suspended" : "Course Access Blocked"}
            </Button>
          ) : (
            // change the text with batch active status
            // <Link href={`/lms/courses/${enrollmentId}`} className="flex-1 mr-2">
            <Link href={`/lms/courses`} className="flex-1 mr-2">
              <Button variant="default" className="w-full" >
                {batchEnrollment.batch?.active ? "Continue Learning" : "View Course"}
              </Button>
            </Link>
          )}

          {/* Show Pay Fees button if there are pending fees */}
          {hasPendingFees && (
            <Link href="/lms/payments" className="flex-1 ml-2">
              <Button
                variant={isDatePassed(hasPendingFees.dueDate) ? "destructive" : "outline"}
                className="w-full"
              >
                Pay Fees {isDatePassed(hasPendingFees.dueDate) && "Immediately"}
              </Button>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card >
  ))
};

export default CourseCard;
