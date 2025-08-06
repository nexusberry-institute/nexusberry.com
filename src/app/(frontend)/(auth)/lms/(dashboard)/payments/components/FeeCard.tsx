import { TBatchEnrollment, TEnrollment } from "../serverActions/getStudentEnrollments";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Tag, Receipt, CreditCard } from "lucide-react";
import { cn } from "@/utilities/ui";
import FeeReceiptsTable from "./FeeReceiptsTable";

// Format time to readable format
const formatDate = (dateString?: string | null) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString();
};


export default function FeeCard({ enrollment, batchEnrollment }: {
  enrollment: TEnrollment,
  batchEnrollment: TBatchEnrollment
}) {

  return (
    <Card className="group relative w-full overflow-hidden transition-all duration-300 hover:shadow-xl border-0 bg-[#1a202c] mt-4 p-6">
      {/* Status ribbon */}
      <div className={cn(
        "absolute top-0 right-0 z-10 py-1 px-4 text-xs font-semibold text-white shadow-md",
        enrollment.completionState === 'CONTINUE' ? "bg-[#38a169]" : "bg-[#718096]"
      )}>
        {enrollment.completionState}
      </div>

      {/* Medium badge */}
      <div className="absolute top-8 right-0 z-10">
        <Badge className={cn(
          "py-1 px-3 text-xs font-medium shadow-sm",
          batchEnrollment.mode === 'HYBRID' ? "bg-[#2d3748] text-[#63b3ed]"
            : batchEnrollment.mode === 'ONLINE' ? "bg-[#2a4365] text-[#90cdf4]"
              : "bg-[#744210] text-[#fbd38d] hover:bg-[#975a16]"
        )}>
          {batchEnrollment.mode} Mode
        </Badge>
      </div>

      {/* Discount badge - new addition */}
      {enrollment.discountCode && (
        <div className="absolute top-16 right-0 z-10">
          <Badge className="py-1 px-3 text-xs font-medium shadow-sm bg-[#234e52] text-[#81e6d9] flex items-center gap-1">
            <Tag className="h-3 w-3" />
            Discounted Fee
          </Badge>
        </div>
      )}

      {/* Batch info */}
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-[#e2e8f0] group-hover:text-[#63b3ed] transition-colors">
          Batch Details
        </h3>
        <div className="flex items-center mt-2 text-xs text-[#a0aec0]">
          <Tag className="h-3 w-3 mr-1" />
          <span>Batch: {batchEnrollment.batch?.slug}</span>
        </div>
      </div>

      {/* Enrollment info */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center bg-[#2d3748] rounded-full px-4 py-2 w-fit">
          <Calendar className="h-4 w-4 text-[#63b3ed] mr-2" />
          <span className="text-sm font-medium text-[#e2e8f0]">
            Enrolled: {formatDate(enrollment.admissionDate)}
          </span>
        </div>

        <div className="flex items-center bg-[#2d3748] rounded-full px-4 py-2 w-fit">
          <Clock className="h-4 w-4 text-[#63b3ed] mr-2" />
          <span className="text-sm font-medium text-[#e2e8f0]">
            Certificate: {enrollment.certificateStatus}
          </span>
        </div>
      </div>

      {/* Payment receipts */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Receipt className="h-4 w-4 text-[#63b3ed]" />
          <span className="text-sm font-semibold text-[#e2e8f0]">Payment Schedule</span>
        </div>

        {/* Fee receipt table */}
        <div className="overflow-x-auto">
          <FeeReceiptsTable enrollment={enrollment} />
        </div>
      </div>

      {/* Total paid */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <CreditCard className="h-5 w-5 text-[#63b3ed] mr-2" />
          <div>
            <div className="text-sm text-[#a0aec0]">Total Paid</div>
            <div className="text-xl font-bold text-[#e2e8f0]">
              Rs {enrollment.relatedFeeReciepts?.docs
                .filter((receipt) => receipt.status === 'RECEIVED')
                .reduce((sum, receipt) => sum + receipt.amount, 0)
                .toLocaleString()}
            </div>
          </div>
        </div>
        <div>
          <div className="text-sm text-[#a0aec0]">Pending</div>
          <div className="text-xl font-bold text-[#e2e8f0]">
            Rs {enrollment.relatedFeeReciepts?.docs
              .filter((receipt) => receipt.status === 'PENDING')
              .reduce((sum, receipt) => sum + receipt.amount, 0)
              .toLocaleString()}
          </div>
        </div>
      </div>
    </Card>
  );
}