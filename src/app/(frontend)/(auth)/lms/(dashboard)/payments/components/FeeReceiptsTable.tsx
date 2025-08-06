"use client"

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowRight, Check, CheckCircle, XCircle } from "lucide-react";
import { TEnrollment, TFeeReceipt } from "../serverActions/getStudentEnrollments";
import { cn } from "@/utilities/cn";
import { useState } from "react";
import PaymentUpdateForm from "./PaymentUpdateForm";
import { toast } from "@/hooks/use-toast";
import { updateFeeReceipt } from "../serverActions/updateFeeReceipt";


// Get status color based on payment status
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'RECEIVED': 'bg-[#1c4532] text-[#9ae6b4] border-[#2f855a]',
    'PENDING': 'bg-[#744210] text-[#fbd38d] border-[#975a16]',
    'REJECTED': 'bg-[#742a2a] text-[#feb2b2] border-[#9b2c2c]',
  };
  return colors[status] || 'bg-[#2d3748] text-[#e2e8f0] border-[#4a5568]';
};

// Format time to readable format
const formatDate = (dateString?: string | null) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export default function FeeReceiptsTable({ enrollment }: { enrollment: TEnrollment }) {

  const [selectedReceipt, setSelectedReceipt] = useState<TFeeReceipt | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUpdateClick = (receipt: any) => {
    setSelectedReceipt(receipt);
    setIsDialogOpen(true);
  };

  const handleConfirmUpdate = async (formData: {
    paidMethod: "BANK" | "JAZZCASH" | "EASYPAISA" | "CASH";
    proofImage?: File | null;
    proofText?: string;
  }) => {
    try {

      if (!selectedReceipt) {
        toast({
          title: "Missing Information",
          description: "Please provide all required payment details before submitting.",
          variant: "destructive"
        })
        return;
      };

      const data = {
        receiptId: selectedReceipt.id,
        paidMethod: formData.paidMethod,
        proofImage: formData.proofImage,
        proofText: formData.proofText,
      }
      const { success, message } = await updateFeeReceipt(data);
      toast({
        title: success ? "Payment Recorded" : "Payment Update Failed",
        description: message,
        variant: success ? "success" : "destructive"
      })
      setIsDialogOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating payment:", error);
      toast({
        title: "Payment Update Failed",
        description: "We couldn't process your payment information. Please check your details and try again.",
        variant: "destructive"
      })
    }
  };

  const firstPendingReceipt = enrollment.relatedFeeReciepts?.docs.find((receipt) => receipt.status === "PENDING")?.id ?? 0;

  return (
    <>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[#4a5568]">
            <th className="p-2 text-left font-medium text-[#a0aec0]">Receipt ID</th>
            <th className="p-2 text-left font-medium text-[#a0aec0]">Amount</th>
            <th className="p-2 text-left font-medium text-[#a0aec0]">Due Date</th>
            <th className="p-2 text-left font-medium text-[#a0aec0]">Pay Date</th>
            <th className="p-2 text-left font-medium text-[#a0aec0]">Payment Method</th>
            <th className="p-2 text-left font-medium text-[#a0aec0]">Status</th>
            <th className="p-2 text-left font-medium text-[#a0aec0]">Verified</th>
            <th className="p-2 text-left font-medium text-[#a0aec0]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {enrollment.relatedFeeReciepts?.docs.map((receipt) => (
            <tr key={receipt.id} className="group/button border-b border-[#4a5568] hover:bg-[#2d3748]">
              <td className="p-2 text-[#e2e8f0]">{receipt.id}</td>
              <td className="p-2 text-[#e2e8f0]">Rs {receipt.amount.toLocaleString()}</td>
              <td className="p-2 text-[#e2e8f0]">{formatDate(receipt.dueDate)}</td>
              <td className="p-2 text-[#e2e8f0]">{formatDate(receipt.payDate)}</td>
              <td className="p-2 text-[#e2e8f0]">{receipt.paidMethod || "—"}</td>
              <td className="p-2">
                <div className={cn(
                  "px-3 py-1 rounded-lg text-xs border inline-block",
                  getStatusColor(receipt.status)
                )}>
                  {receipt.status}
                </div>
              </td>
              <td className="p-2">
                <div className="flex items-center">
                  {receipt.verified ? (
                    <div className="flex items-center text-[#38a169]">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">Verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-[#e53e3e]">
                      <XCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">Not Verified</span>
                    </div>
                  )}
                </div>
              </td>
              <td className="p-2">
                <Button
                  className={`relative overflow-hidden ${receipt.status === "RECEIVED" ? "bg-green-500" : "bg-[#3182ce]"} hover:bg-[#2b6cb0] text-white text-xs px-3 py-1 h-auto`}
                  disabled={firstPendingReceipt !== receipt.id}
                  onClick={() => handleUpdateClick(receipt)}
                >
                  {receipt.status === "RECEIVED" ? "PAID" : "Update"}
                  {receipt.status === "RECEIVED"
                    ? <Check className="h-3 w-3 ml-1 transition-transform group-hover/button:translate-x-1" />
                    : <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover/button:translate-x-1" />}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="bg-[#1a202c] border border-[#2d3748] text-[#e2e8f0] max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#63b3ed]">Submit Payment Proof</AlertDialogTitle>
            <AlertDialogDescription className="text-[#a0aec0]">
              Update your payment information for this installment.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {selectedReceipt && (
            <div className="py-4 max-h-[80vh] overflow-y-auto scrollbar-none">
              <div className="mb-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#a0aec0]">Course:</span>
                  <span className="font-medium">{enrollment["training-course"].title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a0aec0]">Amount Due:</span>
                  <span className="font-medium">Rs {selectedReceipt.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a0aec0]">Due Date:</span>
                  <span className="font-medium">{formatDate(selectedReceipt.dueDate)}</span>
                </div>
              </div>

              <PaymentUpdateForm
                onSubmit={handleConfirmUpdate}
                onCancel={() => setIsDialogOpen(false)}
              />
            </div>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}