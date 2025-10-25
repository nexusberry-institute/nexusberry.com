import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Tag, ArrowRight } from "lucide-react";
import { cn } from "@/utilities/ui";
import { Batch } from "../serverActions/getTransformedBatches";
import { getDurationText } from "@/utilities/getDurationText";

export default function CourseCard({ batch, handleEnroll }: {
  batch: Batch,
  handleEnroll: (batchId: number) => void
}) {
  // Calculate the lowest installment plan price if available
  // const lowestInstallmentPrice = batch.paymentPlans && batch.paymentPlans.length > 0
  //   ? Math.min(...batch.paymentPlans.flatMap(plan =>
  //     plan.installmentPrices ? plan.installmentPrices : [Infinity]
  //   ))
  //   : null;

  // Format time to readable format
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get day color based on day name
  const getDayColor = (day: string) => {
    const colors: Record<string, string> = {
      'MONDAY': 'bg-[#1a365d] text-[#90cdf4] border-[#2c5282]',
      'TUESDAY': 'bg-[#322659] text-[#d6bcfa] border-[#553c9a]',
      'WEDNESDAY': 'bg-[#1c4532] text-[#9ae6b4] border-[#2f855a]',
      'THURSDAY': 'bg-[#744210] text-[#fbd38d] border-[#975a16]',
      'FRIDAY': 'bg-[#742a2a] text-[#feb2b2] border-[#9b2c2c]',
      'SATURDAY': 'bg-[#3c366b] text-[#c3dafe] border-[#5a67d8]',
      'SUNDAY': 'bg-[#702459] text-[#fbb6ce] border-[#97266d]',
    };
    return colors[day] || 'bg-[#2d3748] text-[#e2e8f0] border-[#4a5568]';
  };

  return (
    <Card className="group relative w-full overflow-hidden transition-all duration-300 hover:shadow-xl border-0 bg-[#1a202c]">
      {/* Status ribbon */}
      <div className={cn(
        "absolute top-0 right-0 z-10 py-1 px-4 text-xs font-semibold text-white shadow-md",
        batch.CStatus === 'active' ? "bg-[#38a169]" : "bg-[#718096]"
      )}>
        {batch.CStatus === 'active' ? 'Open for Enrollment' : 'Coming Soon'}
      </div>

      {/* Medium badge */}
      <div className="absolute top-8 right-0 z-10">
        <Badge className={cn(
          "py-1 px-3 text-xs font-medium shadow-sm",
          batch.medium === 'HYBRID' ? "bg-[#2d3748] text-[#63b3ed] hover:bg-[#2c5282]"
            : batch.medium === 'ONLINE' ? "bg-[#2a4365] text-[#90cdf4] hover:bg-[#2c5282]"
              : "bg-[#744210] text-[#fbd38d] hover:bg-[#975a16]"
        )}>
          {batch.medium === 'ONLINE' ? 'Online' : batch.medium === "HYBRID" ? 'Online & In-Person' : 'In-Person'} Course
        </Badge>
      </div>

      <div className="p-6">
        {/* Course title and batch ID */}
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-[#e2e8f0] group-hover:text-[#63b3ed] transition-colors">
            {batch.CTitle}
          </h3>
          <div className="flex items-center mt-2 text-xs text-[#a0aec0]">
            <Tag className="h-3 w-3 mr-1" />
            <span>Batch: {batch.slug}</span>
          </div>
        </div>

        {/* <div className="flex justify-between flex-wrap gap-2"> */}

        {/* Description */}
        {batch.CDescription && (
          <p className="text-sm text-[#a0aec0] mb-4 line-clamp-2">{batch.CDescription}</p>
        )}

        {/* Duration */}
        <div className="flex items-center mb-4 bg-[#2d3748] rounded-full px-4 py-2 w-fit">
          <Clock className="h-4 w-4 text-[#63b3ed] mr-2" />
          <span className="text-sm font-medium text-[#e2e8f0]">
            {getDurationText(batch.duration)}
          </span>
        </div>

        {/* </div> */}

        {/* Time Table */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-[#63b3ed]" />
            <span className="text-sm font-semibold text-[#e2e8f0]">Class Schedule</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {batch.batchTimeTable && batch.batchTimeTable.length > 0 ? (
              batch.batchTimeTable.map((session) => (
                <div
                  key={session.id}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm border",
                    getDayColor(session.day)
                  )}
                >
                  <span className="font-semibold">{session.day}</span>
                  <span className="ml-2">
                    {formatTime(session.startTime)} - {formatTime(session.endTime)}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-sm text-[#a0aec0]">Schedule not available</span>
            )}
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-[#4a5568]">
          <div className="mb-4 sm:mb-0">
            <div className="text-2xl font-bold text-[#e2e8f0]">
              Rs {batch.CFullPrice.toLocaleString()}
            </div>
            {/* {lowestInstallmentPrice && lowestInstallmentPrice !== Infinity ? (
              <div className="text-sm text-[#63b3ed] font-medium">
                Plans from Rs {lowestInstallmentPrice.toLocaleString()}
              </div>
            ) : null} */}
          </div>
          <Button
            className="group relative overflow-hidden bg-[#3182ce] hover:bg-[#2b6cb0] text-white"
            onClick={() => handleEnroll(batch.id)}
          >
            Enroll Now
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
