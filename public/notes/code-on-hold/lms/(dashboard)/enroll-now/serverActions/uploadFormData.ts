"use server"

import { getPayload } from "payload"
import config from "@payload-config"
import { DiscountCode, PaymentPlan } from "@/payload-types";

interface Data {
  batchId: number;
  medium: "ONLINE" | "PHYSICAL";
  paidMethod: "BANK" | "JAZZCASH" | "EASYPAISA" | "CASH";
  proofImage?: File | undefined;
  couponCode?: string | undefined;
  proofText?: string | undefined;
  userId: number,
  studentId: number,
  studentName: string,
  courseId: number;
  courseSlug: string;
  paymentPlan: PaymentPlan
  discountData: DiscountCode | null
}

const getDiscountedPrice = (plan: PaymentPlan, installmentIndex: number = 0, discountData: DiscountCode) => {

  const originalPrice = plan.installments[installmentIndex]?.amount ?? 0;

  if (discountData.discountType === 'fixed') {
    // Apply the full fixed discount to each installment
    return Math.max(0, originalPrice - discountData.discountValue);
  } else {
    // Apply the same percentage to each installment
    const discountAmount = (originalPrice * discountData.discountValue) / 100;
    return Math.max(0, originalPrice - discountAmount);
  }
}

function getDueDates(plan: PaymentPlan) {
  // Use current date as the starting point
  const currentDate = new Date();
  const nextDueDate = new Date(currentDate);

  return plan.installments.map((installment, i) => {
    if (i === 0) {
      // First payment is due now
      return {
        amount: installment.amount,
        dueDate: currentDate.toLocaleDateString("en-US", {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };
    }

    // Add days to the previous due date
    nextDueDate.setDate(nextDueDate.getDate() + (installment?.due_after_days ?? 0));

    return {
      amount: installment.amount,
      dueDate: new Date(nextDueDate).toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  });
}

export const createEnrollment = async (data: Data) => {
  try {
    const payload = await getPayload({ config })

    const checkEnrollment = await payload.find({
      collection: "enrollments",
      where: {
        student: { equals: data.studentId },
        "training-course": { equals: data.courseId },
        "batchEnrollments.batch": { equals: data.batchId }
      },
      limit: 1,
      depth: 0,
      select: {
        slug: true
      }
    })

    if (checkEnrollment.docs.length) {
      return {
        success: false,
        message: "You are already enrolled in this course"
      }
    }

    const enrollment = await payload.create({
      collection: "enrollments",
      data: {
        student: data.studentId,
        "training-course": data.courseId,
        slug: `${data.studentId}-${data.studentName.split(" ").join("-")}-${data.courseSlug}`,
        batchEnrollments: [
          {
            batch: data.batchId,
            mode: data.medium
          }
        ],
        discountCode: data.discountData?.id,
        selectedPaymentPlan: data.paymentPlan.id
      }
    })

    let uploadedImage = null
    if (data.proofImage) {
      const bufferImage = Buffer.from(await data.proofImage.arrayBuffer())
      uploadedImage = await payload.create({
        collection: "media",
        data: {
          alt: `Proof of payment for ${data.studentName.replace(/[^a-zA-Z0-9_.-]/g, '_')}`,
          mimeType: data.proofImage.type,
          filename: data.proofImage.name.replace(/[^a-zA-Z0-9_.-]/g, '_'),
          filesize: data.proofImage.size,
        },
        file: {
          data: bufferImage,
          size: data.proofImage.size,
          name: data.proofImage.name.replace(/[^a-zA-Z0-9_.-]/g, '_'),
          mimetype: data.proofImage.type,
        },
      });
    }

    await Promise.all(getDueDates(data.paymentPlan).map(({ amount, dueDate }, i) => {

      return payload.create({
        collection: "fee-receipts",
        data: {
          student: data.studentId,
          enrollment: enrollment.id,
          amount: data.discountData ? getDiscountedPrice(data.paymentPlan, i, data.discountData) : amount,
          paidMethod: i == 0 ? data.paidMethod : null,
          proofText: i == 0 ? data.proofText : null,
          dueDate,
          payDate: i == 0 ? new Date().toISOString() : null,
          proofImage: i == 0 ? uploadedImage : null,
          status: i == 0 ? "RECEIVED" : "PENDING",
        }
      })
    }))

    return {
      success: true,
      message: "Enrollment created successfully",
    }

  } catch (error) {
    console.error("Error creating enrollment:", error)
    return {
      success: false,
      message: "An error occurred while creating the enrollment",
    }
  }
}